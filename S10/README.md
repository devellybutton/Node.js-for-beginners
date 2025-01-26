# 섹션10. API 서버 만들기(JWT, CORS)

1. [프로젝트 구조 갖추기](#프로젝트-구조-갖추기)
2. [JWT 토큰 발급하기](#jwt-토큰-발급하기)
3. [다른 서비스에서 호출하기](#다른-서비스에서-호출하기)
4. [SNS API 서버 만들기](#sns-api-서버-만들기)
5. [API 사용량 제한하기](#api-사용량-제한하기)
6. [CORS 에러 해결하기](#cors-에러-해결하기)
7. [스스로 해보기](#스스로-해보기)
8. [핵심 정리](#핵심-정리)

---

## 프로젝트 구조 갖추기

### API (Application Programming Interface)
- 다른 애플리케이션에서 현재 프로그램의 기능을 사용할 수 있게 허용하는 접점
- <b>웹 API</b> : 다른 웹 서비스의 기능을 사용하거나 자원을 가져올 수 있는 창구
- 흔히 API를 '열었다' 또는 '만들었다'고 표현하는데 이는 다른 프로그램에서 현재 기능을 사용할 수 있게 허용했음을 뜻함. 
    - 다른 사람에게 정보를 제공하고 싶은 부분만 API를 열어 놓고, 제공하고 싶지 않은 부분은 API를 만들지 않는 것. 
    - 또한 API를 열어놓았다 하더라도 모든 사람이 정보를 가져갈 수 있는게 아니라 인증된 사람만 일정 횟수 내에서 가져가게 제한을 둘 수도 있음. 
- <b>웹 API 서버</b>: 위와 같은 서버에 API를 올려서 URL을 통해 접근할 수 있게 만든 것

### 크롤링(crawling)
- 웹 사이트가 자체적으로 제공하는 API가 없거나 API 이용에 제한이 있을 때 사용하는 방법
- 표면적으로 보이는 <b>웹 사이트의 정보를 일정 주기로 수집해 자체적으로 가공</b>하는 기술
    - 웹 사이트에서 직접 제공하는 API가 아니므로 원하는 정보를 얻지 못할 가능성이 있음.
    - 웹 사이트에서 제공하길 원치 않는 정보를 수집한다면 법적인 문제가 발생할 수 있음. 
- 웹 사이트가 어떤 페이지의 크롤링을 허용하는지 확인하려면 `도메인/robots.txt`에 접속하면 됨.

![Image](https://github.com/user-attachments/assets/7af1ffd3-6994-4229-b2a2-407e3c52e6ba) <br>
네이버의 경우

### 순서
1. 새로운 서버 구성 및 API 폴더 생성
2. `npm init -y` 명령어
- 기본 값으로 `package.json` 파일을 자동 생성
3. 기존 프로젝트에서 필요한 파일 복사
- 기존 node_bird에서 `config`, `middlewares`, `models`, `passport`, `controllers (auth.js)`, `routes (auth.js)`, `.dotenv` 복사해서 넣기
- views에서 `error.html`, `login.html`

### 참고
- 사용자마다 다른 값을 관리할 때 uuid 사용
- `deserialize` 안하면 매번 `include`에서 그때 그때 가져오면 됨.
- findOne에서 where 안에는 undefined가 안 됨.
```
id: req.user?.id || null
```

---

## JWT 토큰 발급하기

### 1. jwt 토큰의 구조
| 구성 요소     | 설명                                                                                   |
|--------------|----------------------------------------------------------------------------------------|
| **헤더 (Header)**   | 토큰 종류와 사용된 해시 알고리즘 정보 (예: `HS256`)                                    |
| **페이로드 (Payload)** | 토큰의 내용물이 인코딩된 부분. 누구나 디코딩하여 확인할 수 있지만, 변경할 수 없음.   |
| **시그니처 (Signature)** | 비밀 키를 사용해 헤더와 페이로드를 합친 후 해시값을 생성하여 만든 서명<br> 일련의 문자열로, 토큰이 <b>위변조되었는지 여부</b>를 확인할 수 있도록 검증하는 부분.       |

- 비밀 키를 알고 있는 사람만 시그니처를 생성하고 검증할 수 있음.
- 비밀 키가 유출되면 토큰을 위조할 수 있으므로 반드시 안전하게 보관해야 함.

### 2. JWT 사용 이유
- <b>내용이 노출되지만 위조 방지가 가능</b> : JWT는 토큰의 내용이 외부에 노출될 수 있지만, 시그니처로 인해 내용의 변조를 방지할 수 있음. 이 덕분에 데이터베이스 조회 없이 사용자 정보를 빠르게 사용할 수 있음.
- <b>내용을 믿고 사용할 수 있음</b> : JWT는 내용물이 바뀌지 않으므로 사용자 정보(예: 사용자 이름, 권한)를 넣고 안전하게 사용할 수 있음. 그러나 민감한 정보는 넣지 않는 것이 좋음. (예: 비밀번호)

### 3. JWT의 단점
- <b>용량이 큼</b>: JWT는 내용이 포함되어 있어 랜덤 토큰보다 크기가 커지므로, 요청마다 전송되는 데이터의 크기가 증가함.
- <b>비용 대비 고려</b>: JWT를 사용하면 매번 데이터베이스 조회 없이 정보를 검증할 수 있지만, 그 대신 더 많은 데이터를 전송해야 하므로 비용을 비교해야 함.

---

## 다른 서비스에서 호출하기

- 문자열은 dotenv파일에 하나로 몰아서 써라.

### `axios.defaults.headers` 사용 이유
- axios의 기본 헤더 설정하는 방법. 한 번 설정하면 모든 `axios` 요청에 기본적으로 적용됨. 
- 코드 중복을 줄이고, 여러 API 호출에서 일관된 헤더를 자동으로 적용하려는 목적임.
    ```
    // 기본 헤더 설정
    axios.defaults.headers['Authorization'] = `Bearer ${process.env.API_KEY}`;

    // 이후 모든 요청에 기본 헤더가 적용됨
    axios.get(`${process.env.API_URL}/data`)
    .then(response => console.log(response.data))
    .catch(error => console.log(error));
    ```
- 이후 `Authorization` 헤더를 매번 요청마다 설정할 필요 없이, 모든 axios 요청에 자동으로 포함되게 됨.

---

## SNS API 서버 만들기
```
router.get('/posts/my', verifyToken, getMyPosts);
router.get('/posts/hashtag/:title', verifyToken, getPostsByHashTag);
```

---

## API 사용량 제한하기
- API 서버는 인증된 사용자에게만 접근을 허용할 수 있음.
- 그러나 인증된 사용자라도 지나치게 많은 요청을 보내면 서버에 부담을 줄 수 있음. 따라서 API 사용량 제한(Rate Limiting)을 통해 일정 시간 동안의 요청 횟수를 제한하고, 과도한 트래픽을 방지하는 것이 중요함. 예를 들어, 유료 사용자와 무료 사용자의 요청 횟수를 다르게 설정할 수 있음.

### 1. Rate Limiting 패키지 설치
```
npm install express-rate-limit
```

### 2. Rate Limiting 구현
- 미들웨어 2개 만들기
```
const rateLimit = require('express-rate-limit');

// 무료 사용자: 1분에 10번만 요청 가능
exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1분
  max: 10,              // 최대 10번 요청
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode,
      message: '1분에 10번만 요청할 수 있습니다.'
    });
  }
});

// 유료 사용자: 1분에 100번만 요청 가능
exports.premiumApiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1분
  max: 100,             // 최대 100번 요청
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode,
      message: '1분에 100번만 요청할 수 있습니다.'
    });
  }
});
```

- 미들웨어 확장 패턴을 통한 중복 코드 제거
```
const rateLimit = require('express-rate-limit');

exports.apiLimiter = async (req, res, next) => {
  // 예시: 사용자가 유료인지 무료인지 확인하는 로직
  const isPremiumUser = req.user && req.user.plan === 'premium';

  // 유료 사용자와 무료 사용자에 대한 요청 제한 설정
  const limiter = rateLimit({
    windowMs: 60 * 1000,  // 1분
    max: isPremiumUser ? 100 : 10,  // 유료: 100번, 무료: 10번
    handler(req, res) {
      res.status(this.statusCode).json({
        code: this.statusCode,
        message: isPremiumUser 
          ? '1분에 100번만 요청할 수 있습니다.'
          : '1분에 10번만 요청할 수 있습니다.'
      });
    }
  });

  // 미들웨어 실행
  limiter(req, res, next);
};
```

### 3. DDOS 공격 방지
- Rate Limiting가 DDOS 공격에는 효과가 없음.
- 요청을 받고 걸러진 것이기 때문에 DDOS 공격을 당한 것임.
- 실무는 서버 앞에 서버를 하나 더 두어서 공격을 방지함. (예: cloudflare 사이트, 서버 앞단에 방어 시스템 두기)

### 강의에서 쓰는 응답 코드 목록
- `200` : JSON 데이터입니다
- `401` : 유효하지 않은 토큰입니다
- `410` : 새로운 버전이 나왔습니다. 새로운 버전을 사용하세요
- `419` : 토큰이 만료되었습니다.
- `429` : 1분에 한 번만 요청할 수 있습니다.
- `500~` : 기타 서버 에러

### 환경별로 키를 구분해서 발급
- 다양한 환경의 비밀 키를 발급하는 카카오처럼 환경별로 키를 구분해서 발급하는 것이 바람직함.
- 카카오의 경우 REST API 키가 서버용 비밀 키이고, 자바스크립트 키가 클라이언트용 비밀 키

---

## CORS 에러 해결하기
### 프록시 서버
- CORS 문제를 해결하는 다른 방법으로는 프록시(대리인) 서버를 사용하는 것이 있음.
- 서버에서 서버로 요청을 보낼 때는 CORS 문제가 발생하지 않는다는 것을 이용하는 방법

![Image](https://github.com/user-attachments/assets/b6e96fe6-37cf-4788-9ca5-da4a52def412)


- 브라우저에서는 API 서버 대신 <b>프록시 서버</b>에 요청을 보냄.
- 그 후 프록시 서버에서 요청을 받아 다시 <b>API 서버</b>로 요청을 보냄. 서버-서버 간의 요청이므로 CORS 문제가 발생하지 않음.
- 프록시 서버는 직접 구현해도 되지만, npm 에서 `http-proxy-middleware` 같은 패키지를 사용하면 쉽게 익스프레스와 연동할 수 있음.

---

## 스스로 해보기
- 팔로워나 팔로잉 목록을 가져오는 API 만들기 (nodebird-api에 새로운 라우터 추가)
- 무료인 도메인과 프리미엄 도메인 간에 사용량 제한을 다르게 적용하기 (apiLimiter를 두 개 만들어서 도메인별로 다르게 적용, 9.3.1 절의 POST /auth/login 라우터 참조)
- 클라이언트용 비밀 키과 서버용 비밀 키를 구분하여 발급하기(Domain 모델 수정)
- 클라이언트를 위해 API 문서 작성하기 (swagger나 apidoc 사용)

---

## 핵심 정리
- API는 다른 애플리케이션의 기능을 사용할 수 있게 해주는 창구. 현재 NodeCat이 NodeBird의 API를 사용하고 있음.
- 모바일 서버를 구성할 때 서버를 REST API 방식으로 구현하면 됨.
- API 사용자가 API를 쉽게 사용할 수 있도록 사용 방법, 요청 형식, 응답 내용에 관한 문서를 준비해라.
- JWT 토큰의 내용은 공개되며 변조될 수 있다는 점을 기억하자. 단, 시그니처를 확인하면 변조되었는지 체크할 수 있음.
- 토큰을 사용해 API의 오남용을 막는다. 요청 헤더에 토큰이 있는지 항상 확인하는 것이 좋음.
- `app.use` 외에도 `router.use`를 활용해 라우터 간에 공통되는 로직을 처리할 수 있음.
- `cors`나 `passport.authenticate`처럼 미들웨어 내에서 미들웨어를 실행할 수 있음. 미들웨어를 선택적으로 적용하거나 커스터마이징할 때 이 기법을 사용함.
- 브라우저와 서버의 도메인이 다르면 요청이 거절된다는 특성(CORS)를 이해해라. 서버와 서버 간의 요청에서는 CORS 문제가 발생하지 않음.