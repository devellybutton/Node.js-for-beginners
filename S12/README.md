# 섹션12. 실시간 GIF 채팅방 만들기(웹소켓, Socket.IO)

1. [WS 모듈 사용하기](#ws-모듈-사용하기)
2. [Socket.IO 모듈 사용하기](#socketio-모듈-사용하기)
3. [실시간 채팅방 만들기](#실시간-채팅방-만들기)
4. [실시간으로 텍스트, GIF 보내기](#실시간으로-텍스트-gif-보내기)
5. [스스로 해보기](#스스로-해보기)
6. [핵심 정리](#핵심-정리)

---

## WS 모듈 사용하기

### 1. 웹 소켓

- HTML5에 새로 추가된 스펙으로 실시간 양방향 데이터 전송을 위한 기술
- HTTP와 다르게 WS라는 프로토콜을 사용함
- 브라우저와 서버가 WS 프로토콜을 지원하면 사용할 수 있음.
- 최신 브라우저는 대부분 웹 소켓을 지원하고, 노드에서는 ws나 Socket.IO 같은 패키지를 통해 웹 소켓을 사용할 수 있음.

### 2. 이전 기술: HTTP 폴링의 한계

#### 웹 소켓 이전에는 HTTP 기반 폴링(polling) 방식이 주로 사용되었음.

- 단방향 통신
- 주기적으로 서버에 새로운 업데이트 확인
- 비효율적이고 자원 소모적인 방식

#### 웹 소켓의 핵심 특징

- 브라우저와 웹 서버 간 지속적인 연결
  - Listener : ws.on('message')
  - Speaker : ws.send('message')
- 실시간 양방향 데이터 전송
- HTTP 프로토콜과 포트 공유
- 폴링에 비해 성능 대폭 개선

#### 연결 프로세스

- 초기 웹 소켓 연결 수립
- 이후 지속적인 연결 상태 유지
- 업데이트 발생 시 즉각적인 알림

#### 웹 소켓 구조도

![Image](https://github.com/user-attachments/assets/f2beeda8-5558-45fa-9a23-7bfd426ea028)

### 3. 서버센트 이벤트(Server Sent Events)(이하 SSE)

#### SSE의 특징

- Event Source 객체 사용
- 서버에서 클라이언트로의 단방향 통신
- 클라이언트에서 서버로 데이터 전송 불가

#### 웹 소켓 vs SSE

- 웹 소켓: 완전한 양방향 통신
- SSE: 제한된 단방향 통신
- 특정 사용 사례(주식 차트, SNS 업데이트)에서는 SSE로 충분

#### 폴링 vs SSE vs 웹 소켓

![Image](https://github.com/user-attachments/assets/74df207a-5496-49ec-a217-7bf58dd094fc)

### 4. Socket.IO

- 웹 소켓을 편리하게 사용할 수 있도록 도와주는 라이브러리
- 웹 소켓을 지원하지 않는 IE9과 같은 브라우저에서는 알아서 웹 소켓 대신 폴링 방식을 사용해 실시간 데이터 전송을 가능하게 함.
- 클라이언트 측에서 웹 소켓 연결이 끊겼다면 자동 재연결 기능
- 채팅 구현을 위한 편리한 메서드 제공

### 5. 프로젝트 세팅 - 서버

#### 1) 필요한 패키지 설치

```
npm i cookie-parser dotenv express express-session morgan nunjucks && npm i -D nodemon
```

```
npm i ws
```

#### 2) 웹소켓 8버전에서 변경된 사항

1. <b>IP 주소 접근 방식 변경</b>

- 웹소켓 7버전: `req.connection.remoteAddress`
- 웹소켓 8버전: `req.socket.remoteAddress`
- 웹소켓 8버전에서는 클라이언트의 IP 주소를 `req.socket.remoteAddress`로 접근해야 함.

2. <b>메시지 형식 변경</b>

- 웹소켓 7버전: 메시지가 <b>문자열 (string)</b>
- 웹소켓 8버전: 메시지가 <b>버퍼 (Buffer)</b>
- 웹소켓 8버전에서는 메시지가 Buffer로 오기 때문에, 이를 `toString()`으로 변환해 문자열로 처리해야 함.
  ```
  ws.on("message", (message) => {
  console.log(message.toString()) // Buffer를 문자열로 변환
  });
  ```

#### 3) 클라이언트 접속 해제 시 메모리 관리

- 웹소켓에서 클라이언트가 접속을 해제하면, `ws.interval` 같은 주기적인 작업이 남을 수 있음.
- 이럴 때 `clearInterval`로 해당 작업을 중단해야 메모리 누수를 방지할 수 있음.
  ```
  ws.on("close", () => {
  console.log("클라이언트 접속 해제", ip);
  clearInterval(ws.interval); // interval 작업 해제
  });
  ```

#### 4) 웹 소켓 객체(ws)에 이벤트 리스너 세 개 연결함.

- `message` : 클라이언트로부터 메시지가 왔을 때 발생
  - `on` : 받을 때
  - `send` : 보낼 때
- `error` : 웹 소켓 연결 중 문제가 생겼을 때 발생
- `close` : 클라이언트와 연결이 끊겼을 때 발생

#### 5) 웹 소켓의 네 가지 상태

- `CONNECTIING`(연결 중)
- `OPEN`(열림) : 에러 없이 메시지를 보낼 수 있는 상태
- `CLOSING`(닫는 중)
- `CLOSED`(닫힘)

### 6. 프로젝트 세팅 - 클라이언트

#### 1) 이벤트 리스너

- `new WebSocket(url)`: 웹 소켓 연결을 초기화
- `onopen`: 웹 소켓 연결이 성공했을 때 호출됨.
- `onmessage`: 서버로부터 메시지를 받았을 때 호출됨.
- `send(data)`: 서버로 메시지를 보냄.
- `onclose`: 웹 소켓 연결이 종료되었을 때 호출됨.
- `onerror`: 웹 소켓에서 오류가 발생했을 때 호출함.

#### 2) 시연

| 클라이언트 <br> (chrome)                                                                    | 서버 <br> (node.js)                                                                         |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| ![Image 1](https://github.com/user-attachments/assets/ceb71095-7a79-4c2e-9d26-8940e9fbc6f0) | ![Image 2](https://github.com/user-attachments/assets/5747bdd4-755a-40f1-956f-0f9ec3553cbe) |

---

## Socket.IO 모듈 사용하기

### 1. ws 모듈 vs socket.io

#### 1) 웹소켓 (ws 모듈)

- 용도: 간단한 실시간 웹소켓 프로젝트에 적합.
- 메시지 처리: send로 메시지 전송, onmessage로 메시지 수신.
- 복잡한 기능 구현: 기능을 하나하나 직접 구현해야 하므로 복잡한 프로젝트에는 적합하지 않음.

#### 2) Socket.io

- 용도: 채팅방 같은 복잡한 실시간 애플리케이션에 적합. 기본적인 채팅방 기능이 준비되어 있음.
- 연결: HTTP로 연결하고, path를 설정해야 함.
- 클라이언트 설정: 클라이언트에서 socket.io 스크립트를 추가해야 함.
- 전송 방식: 기본적으로 폴링 방식으로 연결을 시도하고, 브라우저에서 웹소켓을 지원하면 웹소켓으로 전환.
- 상태 코드: status 101은 HTTP에서 웹소켓 프로토콜로 전환되었다는 의미.

### 2. Socket.io 주요 특징

- 이벤트 기반:
  - emit('이벤트 이름', 데이터)로 데이터를 전송
  - on('이벤트 이름', (data) => {})로 이벤트를 수신
- 소켓 식별: socket.id로 특정 브라우저나 클라이언트에 데이터를 전송할 수 있음.
- 메시지 포맷:
  - 메시지는 배열 형식으로 전달됨.
  - 예: 42["reply","Hello Node.JS"]
  - 3, 2 같은 숫자는 소켓.io가 내부적으로 사용하는 체크용 값

### 3. 폴링 전환

- 폴링 방식으로 연결 후, 웹소켓을 지원하는 브라우저에서는 자동으로 웹소켓으로 전환됨.
- 만약 폴링을 사용하지 않으려면, 클라이언트에서 `transports: ['websocket']` 옵션을 설정하여 웹소켓만 사용하도록 할 수 있음.

### 4. 프로젝트 세팅

- 서버 패키지 설치

```
npm i socket.io
```

#### 1) 이벤트 이름 지정

- 이벤트 이름을 지정하여 클라이언트와 서버 간에 원하는 방식으로 데이터를 전송할 수 있음.

```
socket.emit('news', 'Hello Node.js');
socket.on('news', (data) => {
  console.log(data); // 'Hello Node.js'
});
```

#### 2) IP 주소

- `req.ip`는 소켓.io에서 undefined로 처리됨.
- 클라이언트 식별은 `socket.id`로 처리함. `socket.id`로 특정 브라우저에 데이터를 보낼 수 있음.

#### 3) 시연

| 클라이언트 <br> (chrome)                                                                  | 서버 <br> (node.js)                                                                       |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ![Image](https://github.com/user-attachments/assets/678d5dab-46e0-4b42-b748-7d986c1f84d5) | ![Image](https://github.com/user-attachments/assets/2d6665a7-dcc5-4d5f-97a3-5c07088f6b3d) |

---

## 실시간 채팅방 만들기

### 1. Socket.IO API 사용법:

- 특정인에게 메시지 보내기:

```
socket.to(소켓 아이디).emit(이벤트, 데이터);
```

- 나를 제외한 나머지에게 메시지 보내기:

```
socket.broadcast.emit(이벤트, 데이터);
socket.broadcast.to(방 아이디).emit(이벤트, 데이터);
```

### 2. HTTP 라우터 없이 웹소켓만으로 구현

- 클라이언트

```
// views/chat.html
document.querySelector('#chat-form').addEventListener('submit', function(e) {
  e.preventDefault();
  if (e.target.chat.value) {
    socket.emit('chat', {
      room: '{{room._id}}',  // 채팅방의 ObjectId
      user: '{{user}}',      // 세션 데이터로부터
      chat: e.target.chat.value
    });
    e.target.chat.value = '';
  }
});
```

- 서버

```
chat.on('connection', (socket) => {
  console.log('chat 네임스페이스 접속');
  socket.on('chat', (data) => {
    socket.to(data.room).emit(data);
  });
});
```

### 3. Color-Hash 활용

- 익명 채팅방에서 사용자를 구분하기 위해 사용
- 세션ID를 기반으로 고유한 색상을 생성

```
if (!req.session.color) {
  const colorHash = new ColorHash();
  req.session.color = colorHash.hex(req.sessionID);
}
```

---

## 스스로 해보기

- 채팅방에 현재 참여자 수나 목록 표시하기(join, exit 이벤트에 socket.adapter.rooms에 들어 있는 참여자 목록 정보를 같이 보내기
- 시스템 메시지까지 DB에 저장하기(입장, 퇴장 이벤트에서 DB와 웹 소켓 처리하기)
- 채팅방에서 한 사람에게 귓속말 보내기(화면을 만들고 socket.io(소켓 아이디) 메서드 사용하기)
- 방장 기능 구현하기(방에 방장 정보를 저장한 후 방장이 나갔을 때는 방장을 위임하는 기능 추가하기)
- 강퇴 기능 구현하기(프런트엔드와 서버에 강퇴 소켓 이벤트 추가하기)

---

## 핵심 정리

- 웹 소켓과 HTTP는 같은 포트를 사용할 수 있어서 별도 포트를 설정할 필요가 없음
- 웹 소켓은 양방향 통신이므로 서버뿐만 아니라 프런트엔드 쪽 스크립트도 사용해야 함
- Socket.IO를 사용하면 웹 소켓을 지원하지 않는 브라우저에서까지 실시간 통신을 구현할 수 있음
- Socket.IO 네임스페이스와 방 구분을 통해 실시간 데이터를 필요한 사용자에게만 보낼 수 있음
- `app.set('io', io)`로 소켓 객체를 익스프레스와 연결하고, `req.app.get('io')`로 라우터에서 소켓 객체를 가져오는 방식을 기억해둠
