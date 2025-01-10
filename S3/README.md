# 섹션3. 노드 기본 기능 익히기

1. [REPL과 js 파일 실행하기](#repl과-js-파일-실행하기)
2. [CommonJS 모듈 시스템](#commonjs-모듈-시스템)
3. [exports, this, require, 순환참조](#exports-this-require-순환참조)
4. [ECMAScript 모듈, 다이나믹 임포트, top level await](#ecmascript-모듈-다이나믹-임포트-top-level-await)
5. [global, console, 타이머](#global-console-타이머)
6. [process](#process)
7. [os와 path](#os와-path)
8. [url, dns, searchParams](#url-dns-searchparams)
9. [crypto와 util](#crypto와-util)
10. [worker_threads](#worker_threads)
11. [child_process](#child_process)
12. [파일 시스템 사용하기](#파일-시스템-사용하기)
13. [버퍼와 스트림 이해하기](#버퍼와-스트림-이해하기)
14. [pipe와 스트림 메모리 효율 확인](#pipe와-스트림-메모리-효율-확인)
15. [스레드풀과 커스텀 이벤트](#스레드풀과-커스텀-이벤트)
16. [에러 처리하기](#에러-처리하기)

----

## REPL과 js 파일 실행하기

### JavaScript의 REPL
- 자바스크립트는 스크립트 언어라서 즉석에서 코드를 실행할 수 있음.
    - 스크립트 언어는 인터프리터 방식으로 실행됨.
    - 즉, 코드가 작성된 후 컴파일(번역) 과정 없이 즉시 실행됨.
    - 스크립트 언어의 특징
        - <b>즉시 실행</b> : 코드 실행 전 컴파일 불필요
        - <b>인터프리터 방식</b> : 코드가 한 줄씩 순차적으로 실행
        - <b>동적 타입</b> : 실행 중에 타입을 동적으로 결정하여 실행
- REPL : `Read-Eval-Print-Loop`
    - R (Read) : 입력된 코드를 읽어드림
    - E (Evaluate) : 코드를 실행하여 결과를 평가
    - P (Print) : 실행 결과를 출력
    - L (Loop) : 이 과정을 반복하여 계속 코드 입력을 받음
- REPL 실행 방법
    - 크롬 개발자 도구 Console 탭 입력 화면
    - 터미널 node 명령어
        - 윈도에서는 명령 프롬프트, 맥이나 리눅스에서는 터미널에 node 입력
        - 터미널에 `node`입력하면 `>`와 함께 프롬프트로 바뀜 <br>
        ![image](https://github.com/user-attachments/assets/2223f6c6-801b-4644-8d9d-b928caff2be5)

#### 1) REPL에서 한 줄짜리 코드 입력 후 실행
![image](https://github.com/user-attachments/assets/a5dca062-0bb9-4536-b548-934afef6d589)
- console.log()에 대한 결과물도 `undefined`임
    - 출력되는 내용
    - undefined

#### 2) REPL에서 특정 경로의 js 파일 실행

```
C:\Users\airyt\제로초교과서>cd "C:\Users\airyt\제로초교과서\"
C:\Users\airyt\제로초교과서>node helloWorld.js
```
![image](https://github.com/user-attachments/assets/8bd04a5c-6b4f-4f02-9eb7-c5f161ec5786)

![image](https://github.com/user-attachments/assets/3ab98e9c-0772-4521-90b9-20ada4f2bb80)


### REPL 모드 단축키
- 나가기 :
    - 나가기 해야 메모리 초기화 됨.
    - `ctrl + d`
    - `ctrl + c` => `ctrl + c` 또는 `ctrl + d` 또는 `.exit`
    - `.exit`
- 현재까지 내용 실행 : `enter`
- 줄바꿈 : `shift + enter`
- 화면 초기화 : `ctrl + l`
    - 출력된 내용만 지워주고 현재 입력한 명령은 그대로 두는 기능
    - 마우스 스크롤을 위로 올리면 히스토리를 그대로 볼 수 있음.
- 터미널 명령어 사용 팁 :
    - `cd + 디렉토리` (파일명까지 넣으면 인식이 안 됨)
    - `cd + 디렉토리 일부 입력 + tap` 누르면 자동완성 됨.
    - 한번 입력했던 명령어는 최신순으로 `방향키 위아래`로 불러올 수 있음.

### VsCode 터미널에서 js 파일 실행
- <kbd>Ctrl</kbd> + <kbd>`</kbd>로 터미널 열기
- 파워셀보다는 cmd가 나아서 `cmd`로 실행하면 좋음.
- 해당 경로에서 `node + 파일명` 입력
![ezgif-5-bb447cd7bc](https://github.com/user-attachments/assets/76135f47-3d27-41f3-be11-b8c4918bdad8)

---

## CommonJS 모듈 시스템

### 모듈
- 특정한 기능을 하는 함수나 변수들의 집합
    - 하나의 프로그램이면서 다른 프로그램의 부품으로도 사용할 수 있음.
    - 모듈로 만들어두면 여러 프로그램에서 해당 모듈을 재사용할 수 있음.

- 브라우저에서는 모듈을 사용하지 않는 경우가 많고, 모듈을 썼다면 `웹팩(Webpack)`이나 `걸프(Gulp)` 같은 도구로 변환해서 사용
- Node.js는 기본적으로 모듈을 지원하며, `CommonJS` 또는 `ES6` 모듈 방식을 사용
- 코드가 길어지면 유지보수를 위해 기능별로 파일을 분리하는 것이 좋고, 100줄 이상이면 파일을 나누는 것이 더 효율적임.

### CommonJS 모듈
- 표준이 아니지만 표준이 나오기 전부터 널리 쓰였음.
- 노드 생태계에서 가장 널리 쓰이는 모듈
- [모듈 사용 예시](./module-example/README.md)

### 파일 시스템 상대 경로
- `./` : 현재 폴더
- `../` : 부모 폴더
- `../../` : 조부모 폴더

---

## exports, this, require, 순환참조

### exports와 module.exports

- [exports와 module.exports 사용 예시](./exports-example/README.md)

- Node.js에서 모든 파일은 모듈로 취급된다.
- 모듈이 로딩될 때, 각 파일에는 기본적으로 `module.exports`에 빈 객체 {}가 할당되고, `exports`는 `module.exports`를 참조하는 객체로 설정된다.
- 이 객체에 할당된 값이 해당 파일을 require로 가져올 때 반환되는 값이다.

<br>

- `module.exports`와 `exports`는 기본적으로 동일한 객체를 가리킨다. 
- 하지만 `module.exports`를 새로 할당하면 `exports`와 `module.exports` 간의 관계가 끊어진다.
- <b>하나의 값 (함수나 객체)</b>을 내보낼 때는 `module.exports`를 사용하고, <b>여러 값</b>을 내보낼 때는 `exports`에 속성을 추가하거나 `module.exports`에 객체를 할당하는 방식으로 사용한다.
- 따라서 `module.exports`와 `exports`를 <b>혼용해서 사용하지 않도록</b> 주의해야 한다.

#### 예시 1: exports와 module.exports의 참조 관계 유지
```
const odd = "홀수입니다.";
const even = "짝수입니다.";

module.exports = {
  odd,
  even,
};

console.log("module", module);
console.log("exports", exports);
console.log("module.exports", module.exports);
```

![image](https://github.com/user-attachments/assets/28b830c9-516e-440d-81bc-0c1358ed307c)

#### 예시 2: module.exports와 exports 혼용 시 참조 관계 끊어짐
```
const odd = "홀수입니다.";
const even = "짝수입니다.";

exports.hello = "hello";

module.exports = {
  odd,
  even,
};

console.log("module", module);
console.log("exports", exports);
console.log("module.exports", module.exports);
```
![image](https://github.com/user-attachments/assets/fb49c958-8a90-48d1-aa80-ed7b5016e897)

#### 예시 3: 다른 파일에서 해당 모듈 불러올 때 module.exports로 내보낸 것만 불러와짐 
```
const importedModule = require("./var");

console.log("importedModule", importedModule);

function checkOddOrEven(num) {
  if (num % 2) { 
    return odd;
  }
  return even;
}

module.exports = checkOddOrEven;
```
![image](https://github.com/user-attachments/assets/8137b021-9890-4a6a-bb88-04f67e6b6d6e)


### this

### require

### 순환참조

---

## ECMAScript 모듈, 다이나믹 임포트, top level await

---

## global, console, 타이머

---

## process

---

## os와 path

---

## url, dns, searchParams

---

## crypto와 util

---

## worker_threads

---

## child_process

---

## 파일 시스템 사용하기

---

## 버퍼와 스트림 이해하기

---

## pipe와 스트림 메모리 효율 확인

---

## 스레드풀과 커스텀 이벤트

---

## 에러 처리하기

