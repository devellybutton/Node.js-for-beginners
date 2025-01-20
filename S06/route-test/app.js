// next('route') 테스트

const express = require("express");
const path = require("path");
const app = express();

app.listen(3000, console.log(`3000번에서 실행중입니다.`));

app.get(
  "/",
  (req, res, next) => {
    res.sendFile(path.join(__dirname, "./index.html"));
    next("route");
  },
  (req, res) => {
    // next("route") 때문에 실행되지 않음.
    console.log("실행1");
    res.send("실행1");
  }
);

// 이 라우터가 있으면 실행됨.
// 없으면 Cannot Get / 오류뜸.
app.get("/", (req, res) => {
  res.send("실행2");
});

app.get("/apple", (req, res) => {
  res.send("실행3");
});

app.get("/banana", (req, res) => {
  res.send("실행4");
});
