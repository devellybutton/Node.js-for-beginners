# 섹션9. 노드버드 SNS 만들기

1. [프로젝트 구조 갖추기](#프로젝트-구조-갖추기)
2. [데이터베이스 세팅하기](#데이터베이스-세팅하기)
3. [passport 세팅 및 회원가입 만들기](#passport-세팅-및-회원가입-만들기)
4. [passport로 이메일 로그인 만들기](#passport로-이메일-로그인-만들기)
5. [카카오 로그인하기](#카카오-로그인하기)
6. [게시글, 이미지 업로드하기](#게시글-이미지-업로드하기)
7. [팔로우, 해시태그 검색 기능 만들기](#팔로우-해시태그-검색-기능-만들기)

---

## 프로젝트 구조 갖추기

### 1. 필요한 패키지 설치

- 처음 버전을 올리면 내릴 수 없으므로 `0.0.1`부터 시작
- `sequelize-cli`는 전역 설치 없이 npx로 실행 가능

```
npm i sequelize mysql2 sequelize-cli
npx sequelize init

npm i express cookie-parser express-session morgan multer dotenv nunjucks
npm i -D nodemon
```

### 2. app.js 설정

- 필요한 패키지 불러오기
- 라우터 설정: pageRoute 내에 페이지들을 설정

### 3. 라우터 설정 (routes/page.js)

- 마지막 미들웨어는 컨트롤러로 분리하여 작성

```
router.get("/profile", renderProfile);
router.get("/join", renderJoin);
router.get("/", renderMain);
```

### 4. 로깅

- 로깅은 용량을 많이 차지하므로 운영 환경에서는 필요한 로그만 출력하도록 설정

### 5. Static 파일 제공

- public 폴더를 지정하여, 프론트엔드에서 백엔드의 특정 폴더에 접근할 수 있게 설정

### 6. 환경 변수 설정

- 주의 사항: 띄어쓰기, 세미콜론을 넣지 말고 설정

```
COOKIE_SECRET=hello
PORT=8001
```

### 7. 컨트롤러와 서비스의 차이

- 컨트롤러: 요청과 응답을 알고 처리
- 서비스: 요청, 응답을 알지 못하고 비즈니스 로직을 처리

### 8. 기타 주의사항

- multer 사용 시, 이미지 업로드는 항상 마지막에 넣어야 하며, `formData()`의 텍스트가 사라질 수 있음
- 미들웨어는 `next()`를 호출해야 다음 미들웨어로 넘어감.

---

## 데이터베이스 세팅하기

### 1. 모델 수정과 DB 수정
- 모델 수정은 DB에 자동으로 반영되지 않음.
- DB 수정은 시퀄라이즈 마이그레이션 또는 직접 SQL로 수정해야 함.
- 개발 환경에서는 테이블을 지우고 서버 재시작으로 자동 생성 가능하지만, 운영 환경에서는 테이블을 지우면 데이터가 사라지므로 주의.

### 2. initiate와 associate 메소드
- `initiate`: 테이블 설정을 담당
- `associate`: 모델 간 관계를 설정
- 순서: initiate 먼저, 그 후 associate

### 3. 경로 관리
- 자동화하면 `initiate`와 `associate`는 필요 없음.
- `process.cwd()` : 현재 폴더
- `path.basename(process.cwd())`
- path는 직접 쓰면 오타날 수 있으므로 `__dirname`이나 `path.join` 같은 걸로 활용해라. 

### 4. 비밀번호 100자로 제한하는 이유
```
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
```
- password를 STRING 100자로 제한하는 이유 : 비밀번호 해시화하면 길어지기 때문임.
- 소셜로그인을 고려하여 `null`을 허용

### 5. DB 테이블 관계 설정
- `belongsToMany` 예시:
```
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
```
- 자동 생성된 테이블에 바로 접근:
```
db.sequelize.models.PostHashtag
```

### 5. DB 생성 및 동기화
- DB 생성:
```
npx sequelize db:create
```
- `sequelize.sync()`: 코드와 DB 연결 
- `force: true` 옵션은 개발 환경에서만 사용. 운영 환경에서는 절대 사용하지 말 것.

### 6. DB 테이블 확인
- 테이블을 만들고 나면 <b>직접 DB에 접속</b>하여 확인할 것.
- 노드에서 확인하는 것보다 DB 클라이언트를 사용하는 것이 좋음.

---

## passport 세팅 및 회원가입 만들기

```
npm i passport passport-local passport-kakao
```

---

## passport로 이메일 로그인 만들기

---

## 카카오 로그인하기

---

## 게시글, 이미지 업로드하기

---

## 팔로우, 해시태그 검색 기능 만들기
