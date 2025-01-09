const http = require("http");

const server = http
  .createServer((req, res) => {
    res.write("<h1>Hello Node!</h1>");
    res.write("<p>Hello server</p>");
    res.end("<p>Hello Zerocho</p>");
  })
  .listen(8080);
server.on("listening", () => {
  console.log(`8080번 포트에서 서버 대기 중입니다.`);
});
// server.emit('error', new Error('강제로 발생시킨 에러'))
server.on('error', (error) => {
  console.error(error);
})
