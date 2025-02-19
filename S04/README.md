# 섹션4. http 모듈로 서버 만들기

1. [HTTP 서버 만들기](#http-서버-만들기)
2. [FS로 HTML 파일 읽어 제공하기](#fs로-html파일-읽어-제공하기)
3. [REST API 서버 만들기](#rest-api-서버-만들기)
4. [POST, PUT, DELETE 요청 보내기](#post-put-delete-요청-보내기)
5. [쿠키 이해하기](#쿠키-이해하기)
6. [세션 사용하기](#세션-사용하기)
7. [https, http2](#https-http2)
8. [Cluster](#cluster)

---

## HTTP 서버 만들기

### HTTP 요청과 포트

- 서버는 <b>프로그램</b>이므로 노드가 서버를 실행할 때 <b>프로세스</b>로 올림
- 프로세스로 올릴 때 <b>포트</b>를 하나 할당받아서 동작함.
- 포트는 서버가 클라이언트의 요청을 받을 수 있도록 구분하는 번호
- `listen()` 메서드를 호출하면, 서버는 특정 포트에서 클라이언트의 요청을 기다림. 이때, 터미널을 하나 잡아서 서버가 실행중인 상태가 됨.

### 포트 번호와 HTTP 프로토콜

- 각 서버는 고유의 포트 번호를 가지고 있으며, 이를 통해 클라이언트가 어떤 서비스에 접속할지를 결정함.
  - `HTTP` : 기본적으로 `80`번 포트 사용
  - `HTTPS` : 기본적으로 `443`번 포트 사용
- 이 포트 번호는 URL에서 생략할 수 있음.
- `https://www.naver.com/443` => 네이버로 접속됨.
- 포트 번호는 0번부터 65535번까지 존재
- `0번 ~ 1023번`은 잘 알려진 포트(Well-known ports)
- 하나의 도메인에 여러 프로그램을 띄울 수 있다는 말은 포트 번호만 다르게 설정하면 <b>같은 도메인에서 여러 서비스를 운영할 수 있다</b>는 뜻임.
  - 예시: 하나의 도메인`(example.com)`에서 `443`번 포트로는 웹사이트를 제공하고, `444`번 포트에서는 다른 애플리케이션을 실행

### 서버 재시작 필요성

- <b>프로그램</b> : 디스크(하드디스크, SSD 등)에 저장된 서버 코드
- <b>프로세스</b> : 메모리(RAM)에서 실행중인 서버 코드
- 서버가 실행되면 코드가 메모리에 로드가 되는데, 이때 메모리 상의 코드는 변경되지 않아서, <b>파일을 수정해도 실행 중인 프로세스</b>에는 반영되지 않음.

<details>
<summary><i>server1.js - 서버 실행 결과</i></summary>

| 터미널에서 실행                                                                           | 실행 결과                                                                                 |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![image](https://github.com/user-attachments/assets/0252d461-c141-44b8-9768-b330e022af0b) | ![image](https://github.com/user-attachments/assets/786d411f-1197-49d7-aba0-461def2cf07c) |

</details>
<details>
<summary><i>server1.js - 서버에서 강제 에러 발생 시키기</i></summary>

![image](https://github.com/user-attachments/assets/94a571bd-0003-43b7-9612-92539897406b)

</details>

---

## fs로 HTML파일 읽어 제공하기

### HTTP 모듈과 Express의 응답 처리 차이

- `res.write()` : 클라이언트에게 데이터를 전송하는 메서드
  - `res.write('<h1>Hello Node!</h1>')`
  - 사파리 같은 브라우저는 이게 문자열인지 html코드인지 구별을 못함
- `res.writeHead()` : 응답의 상태코드와 헤더를 설정
  - `res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });`
  - http 모듈에서는 응답의 상태 코드와 헤더를 명시적으로 설정해줘야함.
  - express는 자동으로 처리해 주기 때문에 writeHead가 필요 없지만, http 모듈에서는 반드시 설정해야함.
    - res.send('Hello')를 사용하면 상태코드와 헤더를 알아서 설정함.
      - 상태 코드: 200 OK (성공)
      - Content-Type: text/html; charset=utf-8 (HTML 콘텐츠)
- `res.end()` : 호출하지 않으면 pending 상태로 끝나게 됨.

### 서버 두 개를 동시에 실행하기

- 하지만 서버 두 개를 동시에 돌릴 필요는 없음.
- 단일 프로세스에서도 동시에 여러 요청을 처리할 수 있기 때문임.

<details>
<summary><i>서버 두 개 만들어서 동시에 실행하기</i></summary>

```
const http = require("http");
const fs = requrie("fs");

const server = http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write("<h1>Hello Node!</h1>");
    res.write("<p>Hello server</p>");
    res.end("<p>Hello Zerocho</p>");
  })
  .listen(8080);
server.on("listening", () => {
  console.log(`8080번 포트에서 서버 대기 중입니다.`);
});
server.on("error", (error) => {
  console.error(error);
});

const server1 = http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write("<h1>Hello Node!</h1>");
    res.write("<p>Hello server</p>");
    res.end("<p>Hello Zerocho</p>");
  })
  .listen(8081);
server.on("listening", () => {
  console.log(`8081번 포트에서 서버 대기 중입니다.`);
});
```

![image](https://github.com/user-attachments/assets/55838522-c763-4ea0-9141-84d42758cd1b)

</details>

<details>
<summary><i>server1.js 실행 결과</i></summary>

![image](https://github.com/user-attachments/assets/4a5dff24-220b-42d0-8d1c-278736c89e5e)

</details>

---

## REST API 서버 만들기

### 1. REST란?

- REpresentational State Transfer의 약자
  서버의 자원을 정의하고 자원에 대한 주소를 지정하는 방법
- 명사로 구성된 주소 체계 사용 <i>(예: /user, /post)</i>

### 2. HTTP 메서드

| **메서드**  | **용도**       | **특징**                                                              |
| ----------- | -------------- | --------------------------------------------------------------------- |
| **GET**     | 자원 조회      | • 데이터는 쿼리스트링으로 전송 <br> • 요청 본문 없음 <br> • 캐싱 가능 |
| **POST**    | 자원 생성      | • 요청 본문에 새 데이터 포함                                          |
| **PUT**     | 자원 전체 수정 | • 요청 본문에 수정할 데이터 포함                                      |
| **PATCH**   | 자원 일부 수정 | • 요청 본문에 일부 수정할 데이터 포함                                 |
| **DELETE**  | 자원 삭제      | • 요청 본문 없음                                                      |
| **OPTIONS** | 통신 옵션 설명 | • 주로 CORS에서 사용                                                  |

### 3. RESTful API 설계 예시

| **HTTP 메서드** | **주소**  | **역할**         |
| --------------- | --------- | ---------------- |
| **GET**         | /         | 메인 페이지 제공 |
| **GET**         | /users    | 사용자 목록 제공 |
| **POST**        | /user     | 사용자 등록      |
| **PUT**         | /user/:id | 특정 사용자 수정 |
| **DELETE**      | /user/:id | 특정 사용자 삭제 |

### 4. 주요 특징

- 주소와 메서드만으로 요청 내용 파악 가능
- 서버-클라이언트 분리 가능
- 다양한 클라이언트(웹, 모바일 등)에서 동일한 방식으로 서버 이용
- HTTP 프로토콜 기반 통신

### 5. 구현 시 주의사항

- 요청/응답에는 헤더와 본문이 존재
- 응답은 반드시 보내야 함 (에러 시에도)
- REST 규칙을 완벽히 따르기는 현실적으로 어려움
- 모든 응답에 적절한 HTTP 상태 코드 포함 필요

---

## 쿠키와 세션 이해하기

### 1. 쿠키 (Cookie)
- 개념: 서버가 클라이언트에 정보를 저장하는 방법
- 형식: `name=value` 형태의 문자열
- 전송:
  - 서버 → 클라이언트: `Set-Cookie` 헤더
  - 클라이언트 → 서버: `Cookie` 헤더

### 쿠키 옵션
| **옵션**     | **설명**              |
| ------------ | --------------------- |
| **Expires**  | 쿠키 만료 기한 (날짜) |
| **Max-age**  | 쿠키 만료 기한 (초)   |
| **Domain**   | 쿠키가 전송될 도메인  |
| **Path**     | 쿠키가 전송될 URL     |
| **Secure**   | HTTPS에서만 전송      |
| **HttpOnly** | JS에서 접근 불가      |

### 2. 세션 (Session)
- 개념: 서버에 사용자 정보를 저장하고 클라이언트와는 세션 ID로만 통신
- 작동 방식:
  - 서버가 세션 ID 생성
  - 클라이언트에 세션 ID를 쿠키로 전달
  - 서버는 세션 ID에 해당하는 정보를 메모리/DB에 저장

#### 비교
| **구분**   | **쿠키**                       | **세션**                      |
|------------|--------------------------------|-------------------------------|
| **저장 위치** | 클라이언트                     | 서버                          |
| **보안**     | 취약 (노출, 조작 가능)          | 비교적 안전                   |
| **용량**     | 제한적                         | 서버 용량에 따라 유동적        |

### 3. 주의사항
- 쿠키에 민감한 정보 저장 금지
- 세션 데이터는 메모리가 아닌 Redis 등 DB에 저장 권장
- 실제 서비스는 검증된 세션 관리 미들웨어 사용 필요

---

## https, http2

![Image](https://github.com/user-attachments/assets/17542491-44cf-4b03-a122-74fb76356a6b)

### 1. HTTPS (HTTP + SSL)
#### 기본 개념
- HTTP에 데이터 암호화가 추가된 프로토콜
- 중간에 요청을 가로채도 내용을 확인할 수 없음
- 로그인, 결제 등 보안이 필요한 곳에서 필수

#### 구현 방법
```
const https = require('https');

https.createServer({
  cert: fs.readFileSync('인증서'),
  key: fs.readFileSync('비밀키'),
  ca: [fs.readFileSync('상위인증서')]
}, (req, res) => {
  // 서버 로직
})
```

#### 인증서
- 공인 인증 기관(CA)에서 발급
- Let's Encrypt 등에서 무료 발급 가능
- 인증서 파일: .pem, .crt, .key 등
- 기본 포트: 443

### 2. HTTP/2

#### 기본 개념
- HTTP/1.1의 개선 버전
- 요청 및 응답 방식이 더 효율적
- 웹 성능 향상

#### 주요 특징
- 멀티플렉싱: 하나의 연결로 여러 요청/응답 처리
- 헤더 압축
- 서버 푸시: 클라이언트 요청 전에 필요한 리소스 미리 전송
- 스트림 우선순위 지정

#### 구현 방법
````
const http2 = require('http2');

http2.createSecureServer({
  cert: fs.readFileSync('인증서'),
  key: fs.readFileSync('비밀키'),
  ca: [fs.readFileSync('상위인증서')]
}, (req, res) => {
  // 서버 로직
})
````

### 3. 비교
| **특징**          | **HTTP/1.1**             | **HTTP/2**               |
|-------------------|--------------------------|--------------------------|
| **연결 방식**     | 요청당 연결              | 하나의 연결로 다중 요청  |
| **헤더**          | 압축 없음                 | 압축 지원                |
| **속도**          | 상대적 느림               | 개선된 성능              |
| **보안**          | SSL 선택                  | SSL 필수                 |

### 4. 실무 활용
- 모든 보안이 필요한 서비스는 `HTTPS` 필수
- 대규모 서비스는 `HTTP/2` 권장
- 인증서는 주기적 갱신 필요
- 로드밸런서 사용 시 `SSL` 설정 주의

---

## cluster

![Image](https://github.com/user-attachments/assets/af2f8b36-7991-4b11-bec2-42c3a4d98be9)

### 1. Cluster 모듈 개요
- 싱글 프로세스 Node.js가 모든 CPU 코어를 사용할 수 있게 해주는 모듈
- 같은 포트를 공유하는 여러 프로세스 운영 가능
- 요청을 병렬로 처리하여 서버 부하 분산

| **구성**       | **마스터 프로세스**                                    | **워커 프로세스**                                     |
|----------------|-------------------------------------------------------|------------------------------------------------------|
| **역할**       | • CPU 개수만큼 워커 프로세스 생성                     | • 실제 서버 역할 수행                               |
|                | • 워커 프로세스 관리                                   | • 요청 처리                                          |
|                | • 요청 분배                                           | • 각 CPU 코어당 1개 할당                            |

### 2. 장단점
#### 장점
- CPU 코어 전체 활용
- 요청 분산 처리
- 일부 프로세스 오류 시에도 서비스 유지

#### 단점
- 메모리 공유 불가
- 세션 등 공유 데이터 관리 어려움
- 해결책: Redis 등 외부 서버 도입

### 3. 실무 적용
- 직접 구현보다 PM2 같은 모듈 사용 권장
- 예기치 못한 서버 종료 방지 가능
- 워커 프로세스 종료 시 새로운 워커 생성 가능

<details>
<summary><i>cluster.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/6dcd7936-1fa0-4f23-ab3f-609234c8d009)

</details>

### 실제 동작 순서
1. 8086 포트 접속
2. 1초 후 해당 요청을 처리한 워커 종료
3. 마스터 프로세스가 즉시 새로운 워커 생성
4. 서비스 계속 유지

- 이렇게 되는 이유는 클러스터의 주요 목적이 무중단 서비스이기 때문임. 
- 워커가 종료되더라도 마스터 프로세스가 새로운 워커를 바로 생성해 서비스가 중단되지 않도록 함.

### 서버를 완전히 종료하려면
- `process.exit()` 대신 `cluster.worker.destroy()`
- 마스터 프로세스의 `cluster.on('exit')` 에서 `cluster.fork()` 제거
또는 직접 터미널에서 프로세스 종료 (Ctrl + C)