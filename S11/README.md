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

---

## 통합 테스트 해보기

![Image](https://github.com/user-attachments/assets/483abdfd-91fe-4d72-bf63-7a0e6ba924c3)

---

## 부하 테스트 해보기