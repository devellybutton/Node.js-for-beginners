# 섹션4. http 모듈로 서버 만들기

1. [HTTP 서버 만들기](#http-서버-만들기)
2. [FS로 HTML 파일 읽어 제공하기](#fs로-html파일-읽어-제공하기)
3. [REST API 서버 만들기](#rest-api-서버-만들기)
4. [POST, PUT, DELETE 요청 보내기](#post-put-delete-요청-보내기)
5. [쿠키 이해하기](#쿠키-이해하기)
6. [세션 사용하기](#세션-사용하기)
7. [https, http2](#https-http2)
8. [Cluster](#cluster)

---

## HTTP 서버 만들기

### HTTP 요청과 포트
- 서버는 <b>프로그램</b>이므로 노드가 서버를 실행할 때 <b>프로세스</b>로 올림
- 프로세스로 올릴 때 <b>포트</b>를 하나 할당받아서 동작함. 
- 포트는 서버가 클라이언트의 요청을 받을 수 있도록 구분하는 번호
- `listen()` 메서드를 호출하면, 서버는 특정 포트에서 클라이언트의 요청을 기다림. 이때, 터미널을 하나 잡아서 서버가 실행중인 상태가 됨.

### 포트 번호와 HTTP 프로토콜
- 각 서버는 고유의 포트 번호를 가지고 있으며, 이를 통해 클라이언트가 어떤 서비스에 접속할지를 결정함.
    - `HTTP` : 기본적으로 `80`번 포트 사용
    - `HTTPS` : 기본적으로 `443`번 포트 사용
- 이 포트 번호는 URL에서 생략할 수 있음.
- `https://www.naver.com/443` => 네이버로 접속됨.
- 포트 번호는 0번부터 65535번까지 존재
- `0번 ~ 1023번`은 잘 알려진 포트(Well-known ports)
- 하나의 도메인에 여러 프로그램을 띄울 수 있다는 말은 포트 번호만 다르게 설정하면 <b>같은 도메인에서 여러 서비스를 운영할 수 있다</b>는 뜻임.
    - 예시: 하나의 도메인`(example.com)`에서 `443`번 포트로는 웹사이트를 제공하고, `444`번 포트에서는 다른 애플리케이션을 실행

###  서버 재시작 필요성

- <b>프로그램</b> : 디스크(하드디스크, SSD 등)에 저장된 서버 코드
- <b>프로세스</b> : 메모리(RAM)에서 실행중인 서버 코드
- 서버가 실행되면 코드가 메모리에 로드가 되는데, 이때 메모리 상의 코드는 변경되지 않아서, <b>파일을 수정해도 실행 중인 프로세스</b>에는 반영되지 않음.

<details>
<summary>server1.js - 서버 실행 결과</summary>

| 터미널에서 실행 | 실행 결과 |
|----------------|----------|
| ![image](https://github.com/user-attachments/assets/0252d461-c141-44b8-9768-b330e022af0b) | ![image](https://github.com/user-attachments/assets/786d411f-1197-49d7-aba0-461def2cf07c) |

</details>
<details>
<summary>server1.js - 서버에서 강제 에러 발생 시키기</summary>

![image](https://github.com/user-attachments/assets/94a571bd-0003-43b7-9612-92539897406b)

</details>

---

## fs로 HTML파일 읽어 제공하기

### HTTP 모듈과 Express의 응답 처리 차이
- `res.write()` : 클라이언트에게 데이터를 전송하는 메서드
    - `res.write('<h1>Hello Node!</h1>')`
    - 사파리 같은 브라우저는 이게 문자열인지 html코드인지 구별을 못함
- `res.writeHead()` : 응답의 상태코드와 헤더를 설정
    - `res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });`
    - http 모듈에서는 응답의 상태 코드와 헤더를 명시적으로 설정해줘야함.
    - express는 자동으로 처리해 주기 때문에 writeHead가 필요 없지만, http 모듈에서는 반드시 설정해야함.
        - res.send('Hello')를 사용하면 상태코드와 헤더를 알아서 설정함.
            - 상태 코드: 200 OK (성공)
            - Content-Type: text/html; charset=utf-8 (HTML 콘텐츠)
- `res.end()` : 호출하지 않으면 pending 상태로 끝나게 됨.

### 서버 두 개를 동시에 실행하기
- 하지만 서버 두 개를 동시에 돌릴 필요는 없음. 
- 단일 프로세스에서도 동시에 여러 요청을 처리할 수 있기 때문임.

<details>
<summary>서버 두 개 만들어서 동시에 실행하기</summary>

```
const http = require("http");
const fs = requrie("fs");

const server = http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write("<h1>Hello Node!</h1>");
    res.write("<p>Hello server</p>");
    res.end("<p>Hello Zerocho</p>");
  })
  .listen(8080);
server.on("listening", () => {
  console.log(`8080번 포트에서 서버 대기 중입니다.`);
});
server.on("error", (error) => {
  console.error(error);
});

const server1 = http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write("<h1>Hello Node!</h1>");
    res.write("<p>Hello server</p>");
    res.end("<p>Hello Zerocho</p>");
  })
  .listen(8081);
server.on("listening", () => {
  console.log(`8081번 포트에서 서버 대기 중입니다.`);
});
```

![image](https://github.com/user-attachments/assets/55838522-c763-4ea0-9141-84d42758cd1b)

</details>

<details>
<summary>server1.js 실행 결과</summary>

![image](https://github.com/user-attachments/assets/4a5dff24-220b-42d0-8d1c-278736c89e5e)

</details>

---

## REST API 서버 만들기

---

## POST, PUT, DELETE 요청 보내기

---

## 쿠키 이해하기

---

## 세션 사용하기

---

## https, http2

---

## cluster

