jest.mock("../services/user");
const userService = require("../services/user");
const { follow } = require("./user");

describe("follow", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
  };
  const next = jest.fn();

  test("사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함", async () => {
    userService.follow.mockResolvedValue("ok");
    await follow(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });

  test("사용자를 못 찾으면 res.status(404),send(no user)를 호출함", async () => {
    userService.follow.mockResolvedValue("no user");
    await follow(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });

  test("DB에서 에러가 발생하면 next(error) 호출함", async () => {
    const message = "DB에러";
    userService.follow.mockRejectedValue(message);
    await follow(req, res, next);
    expect(next).toBeCalledWith(message);
  });
});
