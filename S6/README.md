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

----

## 미들웨어 사용하기

----

## 미들웨어 특성 이해하기

----

## next 활용법

----

## morgan, bodyParser, cookieParser

----

## static 미들웨어

----

## express-session 미들웨어

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
