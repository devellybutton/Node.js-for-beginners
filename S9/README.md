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

### 7. 참고

### 1) Sequelize 모델과 데이터베이스 동기화 문제 해결 방법: sequelize.sync() 활용
- `npx sequelize migration:db` 명령어로 마이그레이션을 실행해도, 서버에서 정의한 모델 객체와 실제 데이터베이스 테이블 간에 <b>동기화가 되지 않아</b> 에러가 발생

![Image](https://github.com/user-attachments/assets/414e3905-e6e8-4b77-a7cb-b23f477576cf)

- 모델과 데이터베이스의 동기화를 맞추기 위해 `models/index.js`에서 `sequelize.sync()`를 사용하여 테이블을 동기화하여 해결하였음.
```
// 데이터베이스와 모델을 동기화 (테이블 생성)
sequelize
  .sync({ force: false }) // force: false -> 기존 데이터 유지하면서 동기화
  .then(() => {
    console.log("Database synced!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
```

### 2) .env 파일을 통한 동적 설정: config.js 파일 사용
- 강의 소스코드에서는 `config.json`을 사용하지만, 대신 `config.js` 파일을 사용하여 환경 변수(.env)에서 설정을 동적으로 로드함.

---

## passport 세팅 및 회원가입 만들기

### 1. passport 세팅
#### 관련 라이브러리 설치
```
npm i passport passport-local passport-kakao
```

#### 미들웨어 구성
```
app.use(passport.initialize());  // passport 초기화
app.use(passport.session());      // 세션을 passport로 관리
```
- `passport.initialize()` : 요청에서 `req.user`, `req.login`, `req.isAuthenticated`, `req.logout` 등을 사용할 수 있게 해줌.
- `passport.session()` : `connect.sid`라는 이름으로 세션 쿠키를 브라우저로 전송하고 세션을 관리

#### express-session 설정
```
app.use(express.json());           // JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: false })); // URL-encoded 요청 본문 파싱
```
#### Passport 설정 (localStrategy)
```
const passport = require("passport");
const local = require("./localStrategy");  // 로그인 전략
const kakao = require("./kakaoStrategy");  // 카카오 로그인 전략 (필요한 경우)
const User = require("../models/users");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);  // 세션에 저장할 정보는 사용자 ID
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })  // 세션에 저장된 ID로 사용자 정보 불러오기
      .then((user) => done(null, user))
      .catch((err) => done(err));
  });

  local();  // 로컬 로그인 전략 실행
  kakao();  // 카카오 로그인 전략 실행 (필요한 경우)
};
```
#### auth.js 컨트롤러의 회원가입 구현
1. 사용자가 /join 라우터로 회원가입을 요청 <br>
2. 이메일 중복 체크 후 비밀번호를 해싱하여 사용자 정보를 DB에 저장 <br>
3. 성공하면 홈 화면(/)으로 리다이렉트 됨.
```
exports.join = async (req, res, next) => {
  const { nick, email, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/join?error=exist");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect("/");  // 회원가입 후 홈으로 리다이렉트
  } catch (error) {
    console.error(error);
    next(error);  // 에러 핸들링
  }
};
```

### 2. passport 사용 흐름
1. `/auth/login` 라우터 요청 <br>
2. `passport.authenticate()` 호출 <br>
3. 로그인 전략 (LocalStrategy) 수행 <br>
4. 로그인 성공 시 사용자 정보 객체와 함께 `req.login` 호출 <br>
5. `req.login` 메서드가 `passport.serializeUser` 호출 <br>
6. `req.session`에 사용자 아이디나 저장해서 세션 생성 <br>
7. `express-session`에 설정한 대로 브라우저에 `connect.sid` 세션 쿠키 전송 <br>
8. 로그인 완료

---

## passport로 이메일 로그인 만들기

### 1. 세션 Id만 저장하는 이유
- 세션 쿠키 : 유저id => 메모리에 저장됨.
- 세션 ID는 서버에서 사용자 정보를 참조하는 키 역할
- 실제 사용자 정보는 서버 메모리에서만 관리됨.

### 2. 로그인 이후의 과정
1. 요청이 들어옴 (어떤 요청이든 상관없음)
2. 라우터에 요청이 도달하기 전에 `passport.session` 미들웨어가 `passport.deserializeUser` 메서드 호출
3. `connect.sid` 세션 쿠키를 읽고 세션 객체를 찾아서 `req.session`으로 만듦.
4. `req.session`에 저장된 아이디로 데이터베이스에서 사용자 조회
5. 조회된 사용자 정보를 `req.user`에 저장
6. 라우터에서 `req.user` 객체 사용 가능

- `req.logout`을 하면 브라우저에 connect.sid가 남아있어도 세션을 없앰.

---

## 카카오 로그인하기

### 1. [카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- 로그인 인증과정을 카카오에게 맡기는 것
  - 사용자는 번거롭게 새로운 사이트에 회원가입 하지 않아도 되고, 서비스 제공자는 로그인 과정을 안심하고 검증된 SNS에 맡길 수 있음.
- SNS 로그인 특징은 <b>회원 가입 절차가 따로 없다는 것.</b> 
  - 처음 로그인할 때는 회원 가입 처리를 해야하고, 두 번째 로그인부터는 로그인 처리를 해야함. 
  - 따라서 SNS 로그인 전략은 로컬 로그인 전략보다 다소 복잡함.

### 2. 미들웨어 확장패턴
- 위랑 아래는 똑같은 코드임.
- `app.use((req, res, next) => passport.authenticate('kakao')(req, res, next));`
  - passport.authenticate('kakao')를 즉시 실행하는 함수로 감싼 형태
  - <b>req, res, next를 로직 안에 넣고 싶은 경우</b> 사용
- `app.use(passport.authenticate('kakao'))`
  -  그 자체로 미들웨어로 등록

### 3. 필요한 설정
- 카카오 developers 사이트 접속
- 앱 키 중 REST API 키 복사해서 dotenv 넣기
- Web 플랫폼 등록 - 사이트 도메인 
- redirect URI 등록
- 카카오 로그인 - 동의항목 설정

---

## 게시글, 이미지 업로드하기

---

## 팔로우, 해시태그 검색 기능 만들기
