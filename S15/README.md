# 섹션15. AWS에 배포해보기

1. [배포 전 준비사항](#배포-전-준비사항)
2. [pm2 사용하기](#pm2-사용하기)
3. [winston 사용하기](#winston-사용하기)
4. [redis에 세션 저장하기](#redis에-세션-저장하기)
5. [AWS에 배포하기](#aws에-배포하기)

---

## 배포 전 준비사항

### 1. 배포를 해야하는 이유
- 서비스 개발 시에는 localhost로 결과를 바로 볼 수 있었음
    - 혼자만 볼 수 있기에 다른 사람에게 공개하는 과정이 필요
    - 9장 NodeBird 앱을 배포해볼 것임

- 배포를 위한 사전 작업 방법에 대해 알아봄
    - 서버 실행 관리, 에러 내역 관리, 보안 위협 대처
    - AWS와 GCP에 배포

### 2. 배포용 Node.js/Express 서버 설정

#### 1) 환경 변수 NODE_ENV 활용

```
// 배포/개발 환경에 따른 morgan 로거 설정
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined')); // 더 자세한 로그
} else {
    app.use(morgan('dev')); // 간단한 로그
}
```

#### 2) 보안 관련 설정
- HTTPS 사용 시: `cookie.secure = true`
- 프록시 서버 사용 시: `app.enable('trust proxy')`
- Helmet 미들웨어 사용: `contentSecurityPolicy: false` 설정 권장
- HPP 미들웨어 추가

#### 3) Express-session 배포 설정
```
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
};
if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = true;
    // HTTPS 사용 시: sessionOption.cookie.secure = true
}
```

### 4. Sequelize 설정
- config.js 파일로 변경하여 환경변수 사용
- 환경별(development/test/production) 설정 분리
- production 환경에서는 logging: false 설정

### 5. 환경변수 설정을 위한 cross-env 사용
#### cross-env를 사용하는 이유
- 운영체제간 환경변수 설정 방식 차이를 해결
- Windows와 UNIX 계열(Linux/Mac) 모두에서 동일하게 동작하도록 보장
- 프로젝트의 실행 환경을 명확하게 구분 가능
```
{
    "scripts": {
        "start": "NODE_ENV=production PORT=80 node server",
        "dev": "nodemon server"
    }
}
```

### 6. XSS와 CSRF 공격 방어를 위한 패키지 설정
- <b>XSS(Cross Site Scripting)</b> : 악의적인 사용자가 사이트에 스크립트를 삽입하는 공격
    - 악성 사용자가 게시글이나 댓글 등을 업로드할 때 자바스크립트가 포함된 태그
- <b>CSRF(Cross Site Request Forgery)</b> : 사용자가 의도치 않게 공격자가 의도한 행동을 하게 만드는 공격
    - 특정 페이지에 방문할 때 저절로 로그아웃되거나 게시글이 써지는 현상 유도
    - 은행과 같은 사이트에서는 다른 사람에게 송금하는 행동을 넣는 등

#### 1) sanitize-html (XSS 방어)
- 주요 특징:
    - 악의적인 스크립트가 포함된 태그를 제거
    - 옵션을 통해 허용할 태그나 속성을 커스터마이징 가능
    - 사용자 입력이 있는 모든 곳에 적용 권장
```
const sanitizeHtml = require('sanitize-html');

// 악성 스크립트가 포함된 HTML을 정화
const html = "<script>location.href = 'https://gilbut.co.kr'</script>";
console.log(sanitizeHtml(html)); // 결과: ''
```

#### 2) csurf (CSRF 방어)
- 주요 특징:
    - 미들웨어 형태로 동작
    - `cookie-parser`와 함께 사용 필요
    - form 제출 시 CSRF 토큰 검증
    - 사용자의 의도치 않은 작업 방지
```
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

// form 렌더링 시 CSRF 토큰 제공
app.get('/form', csrfProtection, (req, res) => {
  res.render('csrf', { csrfToken: req.csrfToken() });
});

// form 제출 처리 시 토큰 검증
app.post('/form', csrfProtection, (req, res) => {
  res.send('ok');
});
```

---

## pm2 사용하기

### 1. pm2란
#### 원활한 서버 운영을 위한 패키지
- 서버가 에러로 인해 꺼졌을 때 서버를 다시 켜 줌
- <b>멀티 프로레싱 지원</b>(노드 프로세스 수를 1개 이상으로 늘릴 수 있음)
- 요청을 프로세스들에 고르게 분배
- 단점: 프로세스간 서버의 메모리 같은 자원 공유 불가
    - 원래 멀티프로레싱할 때 불가능
    - 스레드를 써야됨.
    - 예) 서버가 여러 개 있으면 랜덤으로 요청이 가는데, 유저가 A 서버에 접속해서 로그인하면 C 서버에 로그인이 안 되어 있음.
- 극복: `memcached`나 `redis` 같은 메모리 DB 사용 (공유 메모리를 별도 DB에 저장)

#### PM2의 Graceful Reload 동작 방식
1. 현재 실행 중인 애플리케이션(v1)을 유지한 상태에서 새 버전(v2) 실행
2. 새로운 요청들을 v2로 전달
3. v1으로 처리 중이던 기존 요청들이 완료될 때까지 대기
4. 모든 요청이 v2로 전환되면 v1 프로세스 종료

### 2. pm2 사용하기

#### 실행순서
1. pm2 전역 설치 후, `package.json` 명령어 수정하기
    ```
    npm i -g pm2
    ```
    - 에러났다면
    ```
    npm i
    ```
    - 로그 분석
    ```
    pm2 logs server
    ```

2. `npx pm2 start server.js`로 서버 실행하기
- 만약 80번 포트 사용중이라 에러난다면 포트 번호 바꿔라.

    ![Image](https://github.com/user-attachments/assets/5163d85f-36ab-4a75-b03b-9237fb21a590)

3. 프로세스 목록 확인하기
- 참고로 윈도우에서 명령어 여러 개 실행할 때 `&&` 대신 `;`로 구분

    <details>
    <summary><i>윈도우에서 `&&` 쓰면 오류냠</i></summary>

    ![Image](https://github.com/user-attachments/assets/f0ea3f56-9f91-4a5a-b70e-6e2883897873)

    </details>

### pm2 명령어
- pm2가 노드 프로세스를 백그라운드로 돌리므로 콘솔에 다른 명령어 입력 가능

| 명령어 | 설명 |
|--------|------|
| `npx pm2 start server.js` | 애플리케이션 시작 |
| `npx pm2 list` | 실행 중인 프로세스 목록 확인 |
| `npx pm2 logs` | 로그 확인 |
| `npx pm2 logs --err` | 에러 로그만 확인 |
| `npx pm2 logs --lines 숫자` | 출력 줄 수 변경 |
| `npx pm2 kill` | 모든 PM2 프로세스 종료 |
| `npx pm2 reload all` | 모든 프로세스 재시작 (다운타임 최소화) |
| `npx pm2 monit` | 프로세스 모니터링 화면 실행 |
| `npx pm2 init` |   `ecosystem.config.js` 파일을 생성하여 PM2 설정을 커스터마이즈    |

### 클러스터 모드 (멀티프로세싱)
```
npx pm2 start server.js -i [프로세스 수]
```
- `-i 0`: CPU 코어 개수만큼 프로세스 생성
- `-i -1`: CPU 코어 개수보다 1개 적게 생성 (한 코어는 노드 외의 작업을 위해 남겨둠)

### 주의사항

1. 포트 사용 권한:
- 리눅스/맥에서 1024번 이하 포트 사용 시 관리자 권한 필요
- sudo 명령어 사용 필요
- 포트가 이미 사용 중이면 다른 포트로 변경

2. 재시작 횟수 확인:
- `pm2 list`에서 재시작 횟수(↺)가 0이 아니면 서버가 재부팅된 적이 있음
- 재시작 횟수가 많으면 에러가 발생하고 있다는 의미로, 로그 확인 필요

3. 클러스터 모드 고려사항:
- 프로세스 간 메모리 공유 불가능
- 세션 등 공유 데이터는 데이터베이스를 사용해야 함
- 서비스 규모가 클수록 코어를 효율적으로 사용하는 것이 비용 절약에 도움
- 최적의 프로세스 수는 부하 테스트를 통해 결정

### 주요 상태 정보
- `pid`: 프로세스 ID
- `status`: 프로세스 상태 (online, stopped 등)
- `↺`: 재시작 횟수
- `cpu`: CPU 사용량
- `mem`: 메모리 사용량
- `mode`: 실행 모드 (fork 또는 cluster)

---

## winston 사용하기

- 목적: 서버 로그 관리를 위한 모듈로, `console.log`와 `console.error`를 대체함.
- 주요 특징:
    - 로그를 파일이나 데이터베이스에 저장하여 서버가 종료되어도 로그가 유지됨.
    - 로그 심각도 레벨 지원: `error > warn > info > verbose > debug > silly`
    - 다양한 형식(format) 지원: json, label, timestamp, printf, simple, combine 등
    - 여러 저장 방식(transports) 지원: 파일, 콘솔 등
- `winston-daily-rotate-file` 패키지를 사용하면 날짜별로 로그 관리 가능

<details>
<summary><i> localhost:8001/abc 결과 로그 기록 생성</i></summary>

![Image](https://github.com/user-attachments/assets/71ecb019-e831-4d9d-bc44-851d7190ff7c)

</details>

---

## redis에 세션 저장하기

### Connect-Redis
- 목적: 멀티 프로세스 간 세션 공유를 위해 Redis와 Express를 연결하는 패키지
- 필요성:
    - 기본적으로 Express 세션은 메모리에 저장되어 서버 재시작 시 모든 로그인이 풀림
    - 메모리 누수(memory leak) 발생 및 단일 프로세스에서만 확장 가능한 한계 존재
- 장점:
    - 서버 재시작해도 로그인 유지
    - Redis의 빠른 성능으로 세션 관리 효율적
    - 서비스 업데이트 시에도 사용자 로그인 상태 유지

### pm2 사용 중에 npm 패키지 설치 실패 오류

- pm2로 실행 중인 node.js 애플리케이션이 node_modules 내의 파일들을 사용중임.
- `bindings.js` 파일이 pm2 프로세스에 의해 사용되고 있어서 npm이 해당 파일을 수정하거나 접근할 수 없음.
- 해결: `npx pm2 kill` 이후에 다시 설치하면 잘 됨.
<details>
<summary><i>pm2 사용 중에 npm 패키지 설치가 실패함</i></summary>

![Image](https://github.com/user-attachments/assets/c5ae6aff-3bc2-4be0-bacf-86e78a95c44e)

</details>

## NVM (Node Version Manager)
- 목적: Node.js 버전을 관리하는 도구
### Windows에서 설치:
- `https://github.com/coreybutler/nvm-windows/releases`에서 nvm-setup.zip 다운로드
압축 해제 후 설치 파일 실행
- 주요 명령어:
    - `nvm list`: 설치된 Node.js 버전 확인
    - `nvm install [버전]`: 특정 버전 설치 (예: nvm install 18.7.0)
    - `nvm install latest`: 최신 버전 설치
    - `nvm use [버전]`: 특정 버전 사용
- 기본 경로:
    - `Windows: C:\Users[사용자명]\AppData\Roaming\nvm`
- 특징:
    - 여러 Node.js 버전을 쉽게 전환하며 사용 가능
    - 프로젝트별로 다른 Node.js 버전 적용 가능
    - Mac/Linux에서는 n 패키지를 대신 사용 가능

---

## AWS에 배포하기

- [배포한 소스, 단계 정리](https://github.com/devellybutton/Node.js-for-beginners_ch15_nodebird?tab=readme-ov-file#nodebird-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-aws-lightsail%EB%A1%9C-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0)