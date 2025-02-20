# 섹션11. 테스트 해보기(단위, 통합, 부하)

1. [단위 테스트 해보기](#단위-테스트-해보기)
2. [테스트 커버리지 살펴보기](#테스트-커버리지-살펴보기)
3. [통합 테스트 해보기](#통합-테스트-해보기)
4. [부하 테스트 해보기](#부하-테스트-해보기)

---

## 단위 테스트 해보기

- 테스트를 아무리 철저하게 하더라도 에러가 발생하는 것을 완전히 막을 수는 없음.
- 보통 에러는 개발자가 예상하지 못한 케이스에서 발생하므로, 예상하지 못한다면 그에 대한 테스트도 작성할 수 없음.

- 기존에 만들었던 nodebird 프로젝트에 테스트하기

```
npm i -D jest
```

![Image](https://github.com/user-attachments/assets/37087a84-729e-44a9-919c-700f03950ec8)

- 테스트 파일 : spec.js, test.js

### 1. 단위 테스트의 기본 구조

```
describe('테스트 그룹 설명', () => {
  test('개별 테스트 설명', () => {
    // 테스트 코드
  });
});
```

- `describe`: 연관된 테스트들을 논리적으로 그룹화
- 하나의 함수 = 하나의 테스트 단위
- 분기 처리(if문, try-catch 등)별로 테스트 케이스를 작성하는 것이 좋음

## 2. Jest의 모의(Mock) 함수

```
// ❌ 일반 함수 - Jest가 호출 추적 불가
const next = function() {};

// ✅ Jest 모의 함수 - 호출 추적 가능
const next = jest.fn();
```

## 3. 체이닝을 위한 모의 객체 생성

```
const res = {
  status: jest.fn(() => res), // 체이닝을 위해 res 반환
  send: jest.fn(),
  json: jest.fn(),
};

// 사용 예: res.status(404).send('Not Found')
```

### 4. Jest의 검증 함수들

```
// 함수 호출 여부 검증
expect(next).toBeCalledTimes(1);

// 특정 인자로 호출됐는지 검증
expect(res.status).toBeCalledWith(403);

// 반환값 검증
expect(result).toBe(expectedValue);
```

### 5. 모듈 모킹

```
// 모듈 전체를 모킹
jest.mock("../models/user");

// 특정 함수만 모킹
User.findOne.mockReturnValue({
  addFollowing(id) {
    return Promise.resolve(true);
  },
});
```

### 6. 계층별 로직 분리

- 컨트롤러 : req, res 객체 필요
- 서비스 : req, res 객체 불필요

### 7. 테스트 실행주기

```
describe('User API', () => {
  beforeAll(() => {
    // 테스트 시작 전 1회 실행
    // DB 연결 등
  });

  afterAll(() => {
    // 모든 테스트 완료 후 1회 실행
    // DB 연결 종료 등
  });

  beforeEach(() => {
    // 각 테스트 케이스 시작 전 실행
    // 테스트 데이터 초기화 등
  });

  afterEach(() => {
    // 각 테스트 케이스 완료 후 실행
    // 모의 함수 초기화 등
    jest.clearAllMocks();
  });
});
```

### 8. exports와 module.exports

[exports와 module.exports](./exports/README.md)

---

## 테스트 커버리지 살펴보기

- 테스트 커버리지는 코드가 테스트에 의해 얼마나 실행되었는지를 나타내는 지표

### 커버리지의 특징

- 전체 프로젝트가 아닌 작성한 코드 중 테스트된 비율을 보여줌
- 함수나 메서드를 단순히 호출만 해도 커버리지가 올라감
- 높은 커버리지가 반드시 좋은 테스트를 의미하지는 않음

### 👎 잘못된 커버리지 높이기 예시

- user.test.js

```
describe("User 모델", () => {
  test("static init 메서드 호출", () => {
    // init 메서드의 내부 로직은 테스트하지 않고
    // 단순히 호출만 해서 커버리지를 올림
    expect(User.initiate(sequelize)).toBe(undefined);
  });
});
```

### 👍 의미 있는 테스트 작성 방법

```
describe("User 모델", () => {
  test("static init 메서드가 올바른 모델을 초기화해야 함", () => {
    User.initiate(sequelize);

    // 실제로 모델이 올바르게 초기화되었는지 검증
    expect(User.rawAttributes.email.type instanceof Sequelize.STRING).toBe(true);
    expect(User.rawAttributes.email.unique).toBe(true);
    expect(User.rawAttributes.nick.allowNull).toBe(false);
    // ... 다른 중요한 속성들도 검증
  });
});
```

### 테스트 작성 시 주의사항

- 단순 호출이 아닌 결과 검증
- 경계값 및 예외 상황 테스트
- 의미 있는 테스트 시나리오
- 중요 비즈니스 로직 우선

<details>
<summary><i>테스트 커버리지 출력</i></summary>

![Image](https://github.com/user-attachments/assets/152fbff6-770a-4f8c-a8d8-23f2880eaca9)

</details>

---

## 통합 테스트 해보기

### 1. 통합 테스트의 개념

- 개별 단위 테스트와 달리 여러 컴포넌트를 함께 테스트
- 실제 서버 실행 없이 라우터, 컨트롤러, 서비스 레이어 등을 통합적으로 테스트

### 2. 서버 설정 분리

- `supertest`는 app 객체만 필요하므로 `listen` 부분 분리
- `package.json`의 시작 스크립트를 `server.js`로 수정

#### 전

```
// app.js
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
```

#### 후

```
// app.js
module.exports = app;

// server.js (새로 생성)
const app = require('./app');
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
```

### 3. 테스트 DB 설정

- 운영 DB와 테스트 DB를 분리
- 동일한 테이블 구조 유지
- config/config.json에서 test 환경 설정

```
npx sequelize db:create --env test
```

<details>
<summary><i>실행결과</i></summary>

![Image](https://github.com/user-attachments/assets/483abdfd-91fe-4d72-bf63-7a0e6ba924c3)

</details>

### 4. 트러블슈팅: 서비스 레이어 테스트

#### 문제 상황

- 함수 모킹을 잘못함. (User 모델을 직접 모킹)
- 컨트롤러 안에 있는 DB와 연결된 비즈니스 로직을 서비스 파일로 분리시켰으나, 테스트코드에 반영하지 않았음.
  ![Image](https://github.com/user-attachments/assets/e1ee3c0d-5c8e-4110-80ef-5aa8d77444f9)

#### 해결 방법

- `userService.follow`을 모킹한 후, 컨트롤러 테스트 코드 내용 수정함.
  ![Image](https://github.com/user-attachments/assets/4762d0ed-8304-4264-8332-b61cd09b52e9)

### 5. Promise 처리 방식 구분

- `mockResolvedValue`: 정상 응답 (예: null, "no user")
- `mockRejectedValue`: 실제 에러 상황
  ```
  // Promise reject: 예외 발생
  Promise.reject("에러")
    .catch(err => console.error(err)); // catch로 잡힘

  // Promise resolve(에러): 정상적인 응답
  Promise.resolve("에러")
    .then(result => console.log(result)); // then으로 처리됨
  ```

- DB 에러의 경우:
  - 실제 에러 상황(DB 연결 실패 등)은 `Promise.reject`
  - 데이터가 없는 경우(사용자를 못 찾음)는 `Promise.resolve(null)`
  ```
  // DB 에러 테스트
  userService.follow.mockRejectedValue("DB에러");

  // 사용자 못 찾음 테스트
  userService.follow.mockResolvedValue("no user");
  ```

### 6. 중요 포인트

#### 1) done 콜백 사용
```
test("로그인 테스트", (done) => {
  request(app)
    .post("/auth/login")
    .expect(302, done);  // done으로 비동기 작업 완료 알림
});
```

#### 2) 리다이렉트 테스트 코드로 옮기기
```
expect('Location', '/') // res.redirect('/') 테스트
```

#### 3) 세션 유지 테스트
```
const agent = request.agent(app);  // 쿠키/세션 유지
```

#### 4) DB 초기화
```
beforeAll(async () => {
  await sequelize.sync();  // 테스트 전 DB 동기화
});

afterAll(async () => {
  await sequelize.sync({ force: true });  // 테스트 후 DB 초기화
});
```

---

## 부하 테스트 해보기
