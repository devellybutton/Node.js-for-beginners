# 섹션6. 익스프레스 웹 서버 만들기

- [express 서버 사용해보기](#express-서버-사용해보기)
- [express로 HTML 서빙하기](#express로-html-서빙하기)
- [미들웨어 사용하기](#미들웨어-사용하기)
- [미들웨어 특성 이해하기](#미들웨어-특성-이해하기)
- [next 활용법](#next-활용법)
- [morgan, bodyParser, cookieParser](#morgan-bodyparser-cookieparser)
- [static 미들웨어](#static-미들웨어)
- [express-session 미들웨어](#express-session-미들웨어)
- [multer 사용하기](#multer-사용하기)
- [dotenv 사용하기](#dotenv-사용하기)
- [라우터 분리하기](#라우터-분리하기)
- [pug 템플릿 엔진](#pug-템플릿-엔진)
- [넌적스 템플릿 엔진](#넌적스-템플릿-엔진)

----

## express 서버 사용해보기

### 1. 웹 서버 프레임워크 개요
- 웹 서버를 http 모듈로 직접 만들 때는 코드가 간결하지 않으며, 확장성이나 유지 보수성이 떨어질 수 있음. <br>
=> 웹 서버 프레임워크를 사용하면 코드 관리가 용이하고, 편의성이 높아짐.

- `Express` : 가장 많이 사용되는 프레임워크, 빠르고 유연한 웹 서버 개발을 지원
- `Koa` : Express의 후속 프레임워크로, 더 많은 미들웨어와 비동기 처리를 지원함.
- `Hapi` : 더 구조적이고 기능이 많은 프레임워크로, REST API 개발에 유리함.
- `NestJS` : Angular에서 영감을 받은 구조적이고 확장성이 좋은 웹 애플리케이션 프레임워크
- `Strapi`: Headless CMS 프레임워크로, API 기반의 콘텐츠 관리 시스템을 쉽게 구축할 수 있음.
- `AdonisJS` : Laravel과 유사한 풀 스택 웹 프레임워크

### 2. 프레임워크 선택 기준
- 다운로드 수, 최근 업데이트 여부
    - <b>npm trend</b>: 다운로드 수가 많은 프레임워크는 안정성이 높고 커뮤니티 지원이 좋음.
    - <b>GitHub</b>: 최근 1년 이내에 커밋이 있었다면 활발히 유지보수되고 있는 프레임워크로, 1년 이상 커밋이 없다면 해당 프로젝트는 더 이상 적극적으로 관리되지 않을 수 있음.

### 3. 프론트엔드 프레임워크 발전

| 프레임워크 / 라이브러리 | 세대 | 특징 | 장점 | 단점 |
|-------------------------|------|------|------|------|
| Backbone.js             | 초기  | 구조적 접근, MVC 패턴 지원 | 초기 프론트엔드 프레임워크로 사용성 제공 | 복잡한 애플리케이션에 적합하지 않음, 유지보수 어려움 |
| AngularJS         | 초기  | 양방향 데이터 바인딩, MVC 패턴 | 강력한 기능, 대규모 애플리케이션에 적합 | 성능 문제, 복잡도 증가 |
| React   | 2세대 | 컴포넌트 기반 UI 라이브러리 | 직관적이고 효율적인 개발, 가상 DOM으로 성능 최적화 | JSX 문법의 진입 장벽, 전체 프레임워크가 아님 |
| Vue.js  | 2.5세대 | 가벼우면서도 강력한 프레임워크 | React와 Angular의 장점을 결합, 쉽게 배울 수 있음 | 대규모 애플리케이션에서 성능 문제 발생 가능 |
| Svelte | 3세대 | 컴파일 시 최적화된 코드로 변환 | 빠른 성능, 빌드 시점 최적화 | 커뮤니티와 생태계가 상대적으로 적음 |

### 4. 서버 실행 및 개발 도구
- `node app`: Node.js로 애플리케이션을 실행하는 명령어
- `nodemon app`: nodemon은 파일 변경 시 자동으로 서버를 재시작하는 도구로, 개발 중에 유용함. node_modules 디렉터리는 gitignore에 추가하고, 의존성을 관리하는 것이 좋음.
    - `restarting due to changes`: nodemon이 파일 변경을 감지하고 서버를 재시작할 때 출력되는 메시지

### 5. Express 예시
    ```
    // app.js
    const express = require('express');
    const app = express();

    // 서버 포트 설정
    app.set('port', process.env.PORT || 3000);

    // GET 요청에 대한 응답
    app.get('/', (req, res) => {
    res.send('Hello, Express');
    });

    // 서버 리스닝
    app.listen(app.get('port'), () => {
    console.log(`${app.get('port')} 번 포트에서 대기 중`);
    });
    ```

### 6. Express 주요 메서드
- `app.set(키, 값)`: 애플리케이션 설정을 저장 (예: 포트 번호 설정)
- `app.get(주소, 라우터)`: 특정 주소에 대해 `GET` 요청이 들어왔을 때 어떤 동작을 할지 정의하는 부분

    <details>
    <summary>app 객체 출력 결과</summary>

    ![image](https://github.com/user-attachments/assets/574d2aa8-ede2-4083-a753-470b54e2a79a)

    </details>

----

## express로 HTML 서빙하기

### 1. res.sendFile에서 파일 절대 경로 지정
- `path.join(__dirname, '파일명')`로 파일의 절대경로 생성할 수 있음.
- 올바른 예시
    ```
    app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
    });
    ```
- 틀린 예시
    ```
    app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
    });
    ```

<details>
<summary>res.sendFile에서 파일 절대경로로 지정해줘야함</summary>

![image](https://github.com/user-attachments/assets/1b81dcb2-136c-47ae-8c57-c115daabb602)

</details>

### 2. Nodemon에서 index.html 파일 감시 문제
- nodemon은 기본적으로 `.html` 파일을 감시하지 않아서 파일이 변경되어도 서버가 자동으로 재시작되지 않음.
- 만약 HTML 파일을 감시하고 싶다면 `nodemon.json` 설정 파일을 수정하거나, 명령어에서 `--ext` 옵션을 사용해 특정 파일 확장자를 지정해줄 수 있음.
- 예: `js`와 `html` 파일 모두 변경 시 서버를 재시작하도록 설정
    ```
    nodemon --ext js,html app.js
    ```

### 3. 패키지 버전 확인
- `npm ls`로 프로젝트에 설치된 특정 패키지의 버전을 확인
- `package.json` 파일에 너무 많은 패키지가 설치된 경우, npm ls 명령어를 통해 설치된 의존성을 쉽게 확인할 수 있음.

<details>
<summary>npm ls 출력 예시</summary>

![image](https://github.com/user-attachments/assets/848b3707-3676-40ee-8fda-217221744e96)

</details>

----

## 미들웨어 사용하기

### 1. 미들웨어와 `next()`
- 미들웨어 : express에서 <b>요청과 응답 사이에서 실행되는 함수</b>
    - `req` : 요청 객체(Request Object)
    - `res` : 응답 객체(Response Object)
    - `next()` : 다음 미들웨어나 라우트로 요청을 넘겨주는 함수
- 여러 미들웨어가 순차적으로 실행될 수 있음.
- `app.use()`는 미들웨어를 등록하는 <b>메서드</b>이고, `(req, res, next) 콜백함수`가 <b>미들웨어</b>임.
- `next()` : 다음 미들웨어로 요청이 넘어감. 호출하지 않으면 `pending`으로 남을 수 있음.
    ```
    app.use((req, res, next) => {
    console.log("모든 요청에 실행하고 싶어요!");
    next();  // 다음 미들웨어로 넘어감. response나 next가 없으면 pending 상태
    });
    ```
- 기본적으로 코드는 <b>위에서 아래로</b> 실행됨.
- 미들웨어는 요청 <b>경로에 맞는 라우트</b>가 있을 경우 실행됨. 경로가 일치하지 않으면 다음 미들웨어로 넘어감.

### 2. 라우팅과 라우트 파라미터
- 라우트 매개변수(Route parameter) : `:`로 시작하는 값을 사용. `req.params`로 접근함.
    ```
    app.get('/category/:name', (req, res) => {
    res.send(`hello ${req.params.name}`);
    });

    app.get('/category/javascript', (req, res) => {
    res.send(`hello world`);
    });
    ```
    - 브라우저에서 `/category/javascript`로 접근하면 라우트 파라미터가 처리되어 `req.params.name`은 javascript가 되어 `hello javascript`가 출력됨.`

### 3. 와일드카드(*)
- 와일드카드는 모든 경로를 처리하는 특성을 가지고 있기 때문에, <b>마지막에 배치</b>해야 다른 라우트들이 먼저 실행될 수 있음.
- 와일드카드나, 범위가 넓은 요청들은 무조건 밑에 넣어 줘야됨.
    ```
    // 와일드카드 라우트는 마지막에 위치
    app.get("*", (req, res) => {
    res.send("This is the wildcard route, handling all paths.");
    });
    ```

----

## 미들웨어 특성 이해하기

### 1. 라우팅 (Routing)
- 사용자가 웹 브라우저에서 특정 URL을 요청했을 때, 그 <b>요청을 적절한 컨트롤러로 전달</b>하는 방식
- 예: Express에서는 `app.get()`이나 `app.post()`와 같은 메서드를 사용하여 라우트를 정의

### 2. 에러 미들웨어
- Express는 기본적으로 에러가 발생하면 자동으로 처리하지만, 실무에서는 사용자 정의 에러 미들웨어를 작성함.
- 에러 미들웨어는 <b>반드시 4개의 매개변수 (err, req, res, next)</b>를 가져야 함.
    - 에러 미들웨어 (4개의 매개변수)
    ```
    app.use((err, req, res, next) => {
    console.error(err);  // 에러 로깅
    res.status(500).send('서버 에러 발생');  // 클라이언트에게 에러 응답
    });
    ```
    - 잘못된 에러 미들웨어 (3개의 매개변수)
    ```
    app.use((err, req, res) => {
    console.error(err);
    res.status(500).send('서버 에러 발생');  // 매개변수 4개가 아니므로 잘못된 처리
    });
    ```
### 3. HTTP 상태 코드
- <b>200번대</b>: 정상적인 응답 (예: 200 OK, 201 Created 등)
- <b>400번대</b>: 클라이언트 요청 오류 (예: 400 Bad Request, 404 Not Found 등)
    - 보안을 위해 404로 퉁치는 경우가 많음. 
    - 잘못된 경로를 숨기기 위해 해커가 요청한 URL을 보안상 처리함.
- <b>500번대</b>: 서버 오류 (예: 500 Internal Server Error 등).
    - 500번대 오류는 보안 위험이 없어야 함. 
    - 정보 노출을 최소화해야 함.

### 4. 응답 처리
- `res.send()`, `res.json()`, `res.sendFile()` 등으로 다양한 응답

    ![image](https://github.com/user-attachments/assets/a7af71b7-6b62-47dd-a853-afa368c5dc13)

    ```
    app.get('/', (req, res) => {
    res.send('안녕하세요.');  // 텍스트 응답
    });

    app.get('/json', (req, res) => {
    res.json({ hello: 'Zerocho' });  // JSON 응답
    });
    ```
- `Cannot set headers after they are sent to the client` 에러 : 이미 응답이 전송된 후에 헤더를 다시 설정하려고 시도할 때 발생

    ![image](https://github.com/user-attachments/assets/659cb795-e873-4672-b519-0356741de0ed)

- http 모듈에서는 res.writeHead()로 상태 코드와 헤더의 Content-Type을 직접 지정해야 함.
- Express에서는 res.send()로 응답을 보내면, 자동으로 Content-Type이 text/html로 설정됨.
    ```
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('안녕하세요.');
    ```
    ```
    res.send('안녕하세요.');  // 자동으로 'text/html' Content-Type, status 200 설정됨
    ```

----

## next 활용법

### 1. `res.json()` vs `return res.json()`
```
app.get('/test', (req, res) => {
  return res.json({ hello: 'zerocho' });
  console.log("안녕");  // 실행되지 않음
});
```
```
app.get('/test', (req, res) => {
  res.json({ hello: 'zerocho' });
  console.log("안녕");  // 실행됨.
});
```
- `res.json()`은 응답을 전송하고 종료하는 메서드
- `return`을 사용하여 응답을 보내면, 그 이후의 코드는 실행되지 않음.

### 2. 에러 처리 미들웨어
- `next(error)`: 에러가 발생하면 에러 처리 미들웨어로 이동
- 에러 처리 미들웨어는 <b>4개의 인자 (err, req, res, next)</b>를 받아야만 정상적으로 동작
- <b>next() 인수가 없으면</b>, 다음 미들웨어로 넘어감.
```
app.use(
  (req, res, next) => {
    console.log("모든 요청에 실행하고 싶어요!");
    throw new Error();  // 에러 발생
    next();  // 실행되지 않음, 에러가 발생하면 자동으로 다음 미들웨어로 넘어감
  },
  (req, res, next) => {
    try {
      console.log("에러어~~");
    } catch (error) {
      next(error);  // 에러가 발생하면 에러 처리 미들웨어로 넘어감
    }
  }
);

app.use((err, req, res, next) => {
  console.error(err);  // 에러 출력
  res.send("에러 났지롱. 근데 안 알려주지롱");
});
```

### 3. next()를 사용하는 이유
```
app.get('/', (req, res, next) => {
  // 라우터 내에서 직접적인 응답 없이,
  // 다음 라우터나 미들웨어로 넘어가기 위해 사용
  next();
});
```

### 4. next('route')
```
app.get('/', 
  (req, res, next) => {
    // 첫 번째 미들웨어
    next('route');
  }, 
  (req, res) => {
    // 이 미들웨어는 실행되지 않음
    console.log("실행되나요?");
  }
);
```
- `next('route')`는 현재 라우트의 나머지 미들웨어들을 건너뛰고 다음 라우트로 이동함.
- 따라서 `console.log("실행되나요?")`는 절대 실행되지 않음.
- 이런 구조가 필요한 이유는 <b>조건부 라우팅을 구현</b>할 때 유용하기 때문임.
    ```
    app.get('/user',
    (req, res, next) => {
        if (req.query.admin) {
        next('route'); // 관리자용 라우트로 이동
        } else {
        next(); // 일반 사용자용 계속 진행
        }
    },
    (req, res) => {
        // 일반 사용자용 처리
        res.send('일반 사용자 페이지');
    }
    );

    app.get('/user', (req, res) => {
    // 관리자용 처리
    res.send('관리자 페이지');
    });
    ```

----

## morgan, bodyParser, cookieParser

### 1. morgan
- 요청/응답 로깅을 담당
- `dev`는 간단한 로그, `combined`는 더 자세한 로그 제공
```
const morgan = require('morgan');

// 개발 환경
app.use(morgan('dev'));

// 배포 환경
app.use(morgan('combined'));
```

<details>
<summary>morgan 로깅 예시</summary>

- dev
    ![image](https://github.com/user-attachments/assets/51d696d5-d3b9-41ac-87d0-6e2118d8fbfb)

- combinded
    ![image](https://github.com/user-attachments/assets/299474d3-3af2-4343-9612-5295c7e457b7)


</details>

### 2. bodyParser
- 요청의 본문에 있는 데이터를 해석해서 `req.body` 객체로 만들어주는 미들웨어
- 보통 <b>폼 데이터</b>나 <b>AJAX 요청</b>의 데이터를 처리
- 멀티파트(이미지, 동영상, 파일) 데이터는 처리 불가 => `multer`
- 2014년 6월 19일부터 bodyParser() 생성자 사용 중단
- `urlencoded()`에서 `extended` 옵션의 기본값이 제거됨 → 명시적으로 지정 필요
- Express 4.16.0부터는 별도의 `body-parser` 패키지 설치 없이 `express.json()`과 `express.urlencoded()` 사용 가능

#### 1) 과거 방식 (2014년 6월 19일 이전) - 현재 deprecated
```
app.use(bodyParser());  // ❌ 더 이상 사용하지 않음
```

#### 2) 개별 메서드 호출 방식
```
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));  // extended 옵션 필수
app.use(bodyParser.json());
```

#### 3) Express 4.16.0 이후 현재 권장 방식
- body-parser가 Express에 내장됨
    ```
    app.use(express.json());  // JSON 파싱
    app.use(express.urlencoded({ extended: true }));  // Form 데이터 파싱
    ```
- `express.json()`: JSON 형식의 요청 본문 파싱
- `express.urlencoded()`: 폼 데이터 파싱
    - extended: true → <b>qs 모듈</b> 사용 (더 강력한 기능)
    - extended: false → <b>querystring</b> 모듈 사용

[stackoverflow - bodyParser is deprecated express 4](https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4)

![image](https://github.com/user-attachments/assets/ff45af24-1ce1-46de-8646-24657b6e6703)

#### 4) body-parser을 직접 호출해야하는 경우
- body-parser는 JSON과 URL-encoded 형식의 데이터 외에도 Raw, Text 형식의 데이터를 추가로 해석 가능
    - `Raw` : 요청의 본문이 버퍼 데이터일 때
    - `Text` : 요청의 본문이 텍스트 데이터일 때 해석하는 미들웨어
```
const bodyParser = require('body-parser');
app.use(bodyParser.raw());
app.use(bodyParser.text());
```

### 3. cookieParser
- 쿠키 파싱 담당 (key, value)
- `res.cookie(키, 값, 옵션)`형식으로 사용
- 서명된 쿠키는 `req.signedCookies`로 접근
    ```
    const cookieParser = require('cookie-parser');
    app.use(cookieParser('비밀키'));
    ```
- 쿠키를 지우려면, 키와 값 외에 옵션도 정확히 일치해야 됨. (단, `expires`나 `maxAge` 옵션은 일치할 필요가 없음.)
```
res.cookie('name', 'zerocho', { 
  expires: new Date(Date.now() + 900000),
  httpOnly: true, 
  secure: true,
});
res.clearCookie('name', 'zerocho', { httpOnly: true, secure: true, signed: true });
```

----

## static 미들웨어

### 1. 정적 파일 서빙 기본 설정
- 클라이언트가 `localhost:3000/zerocho.html`을 요청
- 서버는 `/public/zerocho.html`을 찾아 제공
- 관례적으로 `public` 폴더명을 사용하면 예측하기 쉬워서 변경하는게 좋음.
```
// 기본 문법
app.use('요청 경로', express.static('실제 경로'))

// 실제 사용 예시
app.use('/', express.static(__dirname + '/public'))
```

### 2. 미들웨어 실행 순서
- 기본적인 미들웨어 순서
```
app.use('/', express.static(__dirname + '/public'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
```
static 미들웨어의 특징
- 요청된 파일을 찾으면 `next()`를 실행하지 않고 즉시 응답을 종료
- 파일을 찾지 못한 경우에만 다음 미들웨어로 진행
```
// public 폴더에 about 페이지가 없는 경우에만 실행됨
app.get('/about', (req, res) => {
    res.send('About 페이지입니다.');
})
```

### 3. 성능과 보안을 고려한 미들웨어 구성
- 성능이 느려질 수 있는 구성
```
app.use(cookieParser())
app.use(express.json())
// 기타 미들웨어들...
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(__dirname + '/public'))
```
- 로그인한 사람들한테 정적파일 제공할 때 순서 이렇게 써줌.
```
app.use(morgan('dev'))
app.use(cookieParser('zerofo'))
app.use(express-session())
app.use('/', express.static(__dirname + '/public'))
```

----

## express-session 미들웨어

### 1. express-session 미들웨어 
- 각 사용자에게 고유한 세션을 만들어 데이터를 저장할 수 있게 해주는 미들웨어
- 주로 로그인 상태를 관리하거나 사용자별 데이터를 임시로 저장하는 데 사용
- `express-session` 1.5 버전 이전에는 `cookie-parser` 뒤에 위치해야 했지만, 1.5 버전 이후부터는 순서가 상관없음. 버전을 모를 경우 `cookie-parser` 뒤에 두는 것이 안전함.
    ```
    const express = require('express');
    const session = require('express-session');
    const dotenv = require('dotenv');

    dotenv.config(); // .env 파일을 읽어 환경 변수를 설정

    const app = express();

    app.use(session({
    resave: false,           // 세션이 수정되지 않았더라도 세션을 저장할지 설정
    saveUninitialized: false, // 세션에 값이 없어도 초기화할지 설정
    secret: process.env.COOKIE_SECRET, // 서명할 때 사용할 비밀 키
    cookie: {
        httpOnly: true,        // 클라이언트에서 쿠키 접근을 막음
        secure: false,         // HTTPS 환경에서만 사용할 때 true
    },
    name: 'session-cookie',  // 쿠키 이름 설정 (기본값: connect.sid)
    }));

    // 세션에 값 저장
    app.get('/set-session', (req, res) => {
    req.session.username = 'zerocho';
    res.send('세션에 사용자 이름 저장됨!');
    });

    // 세션에서 값 읽기
    app.get('/get-session', (req, res) => {
    res.send(`세션에 저장된 사용자 이름: ${req.session.username}`);
    });

    // 세션 삭제
    app.get('/destroy-session', (req, res) => {
    req.session.destroy(err => {
        if (err) {
        return res.send('세션 삭제 실패');
        }
        res.send('세션 삭제됨');
    });
    });

    app.listen(3000, () => {
    console.log('서버가 3000번 포트에서 실행 중입니다.');
    });
    ```

### 2. 미들웨어 간 데이터 공유 방법
- 좋은 예시
```
// 1. req 객체 사용 (요청 하나 동안만 유지)
app.use((req, res, next) => {
  req.data = '데이터';
  next();
}, (req, res, next) => {
  console.log(req.data);
  next();
});

// 2. res.locals 사용 (요청 하나 동안만 유지)
app.use((req, res, next) => {
  res.locals.data = '데이터';
  next();
}, (req, res, next) => {
  console.log(res.locals.data);
  next();
});
```

- 나쁜 예시
```
// ❌ 전역 변수 사용 - 보안 위험
let data;
app.use((req, res, next) => {
  data = '비밀번호';
});

// ❌ app.set 사용 - 서버 전체에서 공유됨
app.use((req, res, next) => {
  app.set('data', '비밀번호');
});
```

### 3. 미들웨어 확장하기 
- 미들웨어 안에 미들웨어를 넣어 조건부로 실행 가능
- CORS나 Passport 미들웨어를 추가할 때 사용
```
app.use('/', (req, res, next) => {
  if (req.session.id) {
    // 로그인된 경우에만 정적 파일 제공
    express.static(__dirname, 'public')(req, res, next);
  } else {
    next();
  }
});
```
### 4. `app.set` vs `req/res` 객체
- `app.set()`: 서버의 전역적인 설정이나 공유할 데이터를 설정하는 데 사용
- `req/res 객체` : 요청/응답 사이클 동안 데이터가 유지됨. 주로 개별 요청 간에 데이터를 전달할 때 사용됨.
```
// app.set 사용 예시
app.set('appName', 'My Express App');
app.get('/', (req, res) => {
  res.send(`앱 이름: ${app.get('appName')}`);
});

// req/res 객체 사용 예시
app.use((req, res, next) => {
  req.data = '요청 간 데이터';
  next();
});

app.get('/', (req, res) => {
  res.send(req.data); // "요청 간 데이터" 출력
});
```

----

## multer 사용하기

----

## dotenv 사용하기

----

## 라우터 분리하기

----

## pug 템플릿 엔진

----

## 넌적스 템플릿 엔진 
