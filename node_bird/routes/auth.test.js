const app = require("../app");
const request = require("supertest");
const { sequelize } = require("../models");
const { describe } = require("../models/user");

beforeAll(async () => {
  await sequelize.sync();
});

describe("POST /join", () => {
  test("로그인 안 했으면 가입", (done) => {
    request(app)
      .post("/auth/join")
      .send({
        email: "ilikeyogurt@example.com",
        nick: "yogurt",
        password: "nodejsbook",
      })
      .expect("Location", "/")
      .expect(302, done);
  });
});

describe("POST /login", () => {
  test("로그인 수행", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        email: "ilikeyogurt@example.com",
        password: "nodejsbook",
      })
      .expect("Location", "/")
      .expect(302, done);
  });
});
