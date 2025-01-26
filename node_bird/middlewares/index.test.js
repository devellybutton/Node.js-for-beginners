const { isLoggedIn, isNotLoggedIn } = require("/");

describe("isLoggedIn", () => {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("로그인되어 있으면 isLoggedIn이 next를 호출해야 함", () => {
    const req = { isAuthenticated: jest.fn(() => true) };
    isLoggedIn(req, res, next);
  });
  test("로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 함", () => {});
});

describe("isNotLoggedIn", () => {
  test("로그인되어 있으면 isLoggedIn이 next를 호출해야 함", () => {});
  test("로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 함", () => {});
});
