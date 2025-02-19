# 섹션3. 노드 기본 기능 익히기

1. [REPL과 js 파일 실행하기](#repl과-js-파일-실행하기)
2. [CommonJS 모듈 시스템](#commonjs-모듈-시스템)
3. [exports, this, require, 순환참조](#exports-this-require-순환참조)
4. [ECMAScript 모듈, 다이나믹 임포트, top level await](#ecmascript-모듈-다이나믹-임포트-top-level-await)
5. [global, console, 타이머](#global-console-타이머)
6. [process](#process)
7. [os와 path](#os와-path)
8. [url, dns, searchParams](#url-dns-searchparams)
9. [crypto](#crypto)
10. [util](#util)
11. [worker_threads](#worker_threads)
12. [child_process](#child_process)
13. [파일 시스템 사용하기](#파일-시스템-사용하기)
14. [버퍼와 스트림 이해하기](#버퍼와-스트림-이해하기)
15. [pipe와 스트림 메모리 효율 확인](#pipe와-스트림-메모리-효율-확인)
16. [스레드풀과 커스텀 이벤트](#스레드풀과-커스텀-이벤트)
17. [에러 처리하기](#에러-처리하기)

---

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

<details>
<summary><i>REPL 출력 예시</i></summary>

![image](https://github.com/user-attachments/assets/8bd04a5c-6b4f-4f02-9eb7-c5f161ec5786)

![image](https://github.com/user-attachments/assets/3ab98e9c-0772-4521-90b9-20ada4f2bb80)

</details>

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

### VSCode 터미널에서 js 파일 실행

- <kbd>Ctrl</kbd> + <kbd>`</kbd>로 터미널 열기
- 파워셀보다는 cmd가 나아서 `cmd`로 실행하면 좋음.
- 해당 경로에서 `node + 파일명` 입력
<details>
<summary><i>VSCode 터미널 출력 예시</i></summary>

![ezgif-5-bb447cd7bc](https://github.com/user-attachments/assets/76135f47-3d27-41f3-be11-b8c4918bdad8)

</details>

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

<details>
<summary>예시 1 - 실행 결과</summary>

![image](https://github.com/user-attachments/assets/28b830c9-516e-440d-81bc-0c1358ed307c)

</details>

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

<details>
<summary>예시 2 - 실행 결과</summary>

![image](https://github.com/user-attachments/assets/fb49c958-8a90-48d1-aa80-ed7b5016e897)

</details>

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

<details>
<summary>예시 3 - 실행 결과</summary>

![image](https://github.com/user-attachments/assets/8137b021-9890-4a6a-bb88-04f67e6b6d6e)

</details>

### 노드에서 this 사용시 주의할 점

- <b>전역 스코프</b>에서 this : `modules.exports`와 동일, `빈 객체 {}`로 설정되어 있음.
- <b>함수 내</b>에서 this : 전역 객체인 `global`을 가리킴. (브라우저에서는 window 객체)

  ```
  console.log(this)  // true

  console.log(this === module.exports)  // true

  function a() {
  console.log(this === global);  // true
  }

  a();
  ```

- 전역 스코프에서 this를 사용하여 값을 할당하면, `module.exports`에 값이 추가됨.
  - 이런 방식은 헷갈릴 수 있기 때문에 실제 코드에서는 잘 사용되지 않음.

```
const odd = '홀수입니다.';
const even = '짝수입니다.';

this.odd = odd;  // module.exports.odd = odd;
this.even = even;  // module.exports.even = even;

console.log(this);  // { odd: '홀수입니다.', even: '짝수입니다.' }
```

<details>
<summary>실행 결과</summary>

```
// 1. 전역 스코프의 this
console.log('1. 전역 this === module.exports:', this === module.exports);
// 출력: true (전역에서는 module.exports 객체가 this로 사용됨)


// 2. 동기 일반 함수의 this
function syncNormalFunction() {
    console.log('2. 동기 일반함수 this === global:', this === global);
}
syncNormalFunction();  // 출력: true (일반 함수에서의 this는 global 객체)

// 3. 동기 화살표 함수의 this
const syncArrowFunction = () => {
    console.log('3. 동기 화살표함수 this === module.exports:', this === module.exports);
}
syncArrowFunction();  // 출력: true (화살표 함수는 상위 스코프의 this를 참조, module.exports)


/*
 * 4. 비동기 일반 함수의 this (setTimeout)
 * 비동기 일반 함수에서의 this는 기본적으로 Timeout 객체를 참조
 */
setTimeout(function() {
    console.log('4. 비동기 일반함수 this === global:', this === global);
}, 0);  // 출력: true (setTimeout의 콜백에서의 this는 Timeout 객체)


/*
 * 5. 비동기 화살표 함수의 this (setTimeout)
 * 화살표 함수는 this를 상위 스코프에서 가져옴 (여기서는 module.exports)
 */
setTimeout(() => {
    console.log('5. 비동기 화살표함수 this === module.exports:', this === module.exports);
}, 0);  // 출력: true (화살표 함수에서 this는 상위 스코프의 this, 즉 module.exports)


/*
 * 6. 객체 메서드에서의 this
 * 메서드 내부에서의 this는 해당 객체를 참조
 */
const obj = {
    method() {
        console.log('6. 객체 메서드 this === obj:', this === obj);

        // setTimeout 내의 일반 함수
        setTimeout(function() {
            console.log('7. 객체 메서드 내 비동기 일반함수 this === global:', this === global);
        }, 0);

        // setTimeout 내의 화살표 함수
        setTimeout(() => {
            console.log('8. 객체 메서드 내 비동기 화살표함수 this === obj:', this === obj);
        }, 0);
    }
};
obj.method();
```

![image](https://github.com/user-attachments/assets/3a365014-e5ad-4bf3-b534-6ba7c4b622e9)

</details>

### require

- require를 사용하면 모듈을 가져와 실행할 수 있음,
- 실행만 원할 경우 변수에 대입하지 않고 그냥 `require('./파일경로')`만 해도 됨.

#### require.main과 require.cache

- `require.main`: 현재 실행된 메인 파일
  - 어떤 파일이 프로그램의 시작점으로 실행되었는지 알 수 있음.
- `require.cache`: 캐시된 모듈을 관리하는 객체
  - 모듈은 한 번 require 되면 메모리에 캐시되고, <b>두 번째 이후의 호출은 캐시에서</b> 불러오기 때문에 파일을 다시 읽지 않음.
  - 캐싱 : 하드디스크에 있는 걸 메모리로 옮겨옴.
    - 하드디스크에서 읽어오는 건 느리고, 메모리에서 불러오는 건 빠름.

#### require.cache 직접 비우기

- `require.cache` 객체에서 특정 모듈을 제거하면, 캐시를 비우고 다시 읽기할 수 있음.
- 이 작업은 효율적이지 않으며, 위험할 수 있기 때문에 일반적으로 사용하지 않음.

<details>
<summary><i>require 출력 결과</i></summary>

![image](https://github.com/user-attachments/assets/6da19917-665e-4712-9787-c291a8d90d35)

</details>

#### require과 import 비교

- `require` : 위치에 상관없이 사용할 수 있음
- `import` : 반드시 파일의 상단에 위치해야 함

```
// require 예시
const varModule = require('./var');

// import 예시 (ES6+)
import varModule from './var';
```

### 순환참조

- 두 개 이상의 모듈이 서로를 **require**하여 의존하는 상황
- 예를 들어, `dep1`이 `dep2`를 require하고, `dep2`가 다시 `dep1`을 require하는 경우

<details>
<summary>순환참조 예시 상황</summary>

![image](https://github.com/user-attachments/assets/32b47d63-09bd-43f6-832e-93d928cc9055)

- `dep1.js`가 `dep2.js`를 require하고, `dep2.js`는 `dep1.js`를 require하고 있기 때문에 순환 참조가 발생함.
- Node.js는 순환 참조를 처리하려고 하지만, 첫 번째 require에서 <b>모듈이 완전히 로드되지 않은 상태로 반환</b>됨.
- 이 때문에 `dep2.someValue`는 `undefined`로 출력됨.

</details>

---

## ECMAScript 모듈, 다이나믹 임포트, top level await

- [CommonJS vs ES Modules](./ESM-CommonJS/README.md)

| 항목                                                                       | CommonJS 모듈                                                                                                                    | ECMAScript 모듈 (ESM)                                                                                                               |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **문법**                                                                   | `require('./a');` <br> `module.exports = A;` <br> `exports.C = D;` <br> `exports.E = F;` <br> `const { C, E } = require('./b');` | `import './a.mjs';` <br> `export default A;` <br> `export const C = D;` <br> `export { E };` <br> `import { C, E } from './b.mjs';` |
| **확장자**                                                                 | .js, .cjs                                                                                                                        | .js (package.json에 `type: "module"` 필요), .mjs                                                                                    |
| **확장자 생략**                                                            | 가능                                                                                                                             | 불가능                                                                                                                              |
| **다이내믹 임포트**                                                        | 가능 <br>(예: `require('./module')`)                                                                                             | 불가능 <br>(정적 임포트만 가능)                                                                                                     |
| **인덱스(index) 생략**                                                     | 가능 <br>(예: `require('./folder')`)                                                                                             | 불가능 <br>(예: `import './folder/index.mjs'`)                                                                                      |
| **Top Level Await**                                                        | 불가능                                                                                                                           | 가능 <br>(최상위 레벨에서 `await` 사용 가능)                                                                                        |
| **`__filename`, `__dirname`, `require`, `module.exports`, `exports` 사용** | 사용 가능 <br>(Node.js에서 기본 제공)                                                                                            | 사용 불가능 <br>(`__filename` 대신 `import.meta.url` 사용)                                                                          |
| **서로 간 호출**                                                           | 가능 <br>(CommonJS와 ESM 간 호출 가능)                                                                                           | 불가능 <br>(호환성 제한, `import()`와 `require()` 간 호출 불가)                                                                     |

---

## global, console, 타이머

### 1. global 객체

- `global`은 node.js의 전역 객체로, 브라우저의 `window`와 비슷한 역할을 함.
- 모든 파일에서 접근 가능하며, `console`, `require` 등도 global의 속성임.
- global 속성에 값을 대입하는 것은 <b>관리하기 어려우므로</b>, 가능하면 모듈화하는 것이 좋음.

```
// globalA.js
module.exports = () => global.message;

// globalB.js
const A = require('./globalA');
global.message = '안녕하세요.';
console.log(A());  // '안녕하세요.'
```

### 2. console 객체

- `console.log()`: 일반적인 로그를 콘솔에 출력
- `console.error()`: 에러 메시지를 콘솔에 출력
- `console.table()`: 배열 또는 객체를 테이블 형식으로 출력
- `console.dir()`: 객체를 더 상세하게 출력합니다.
  - options: colors와 depth를 설정할 수 있습니다.
- `console.time()` / `console.timeEnd()`: 코드 실행 시간을 측정
- `console.trace()`: 호출 스택을 추적하여 에러 발생 위치를 확인

<details>
<summary><i>예시 코드와 출력 결과</i></summary>

```
console.log('이것은 일반 로그입니다');
console.error('이것은 에러 메시지입니다');
console.table([{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }]);
console.dir({ name: 'Alice', age: 28, address: { city: 'Seoul', country: 'Korea' } }, { depth: 2, colors: true });
console.time('타이머');
for (let i = 0; i < 1000000; i++) { /* 반복 */ }
console.timeEnd('타이머');
console.trace('호출 스택 추적');
```

![image](https://github.com/user-attachments/assets/a1c57a9a-672f-4255-92cf-67821251925a)

</details>

### 3. 타이머 함수

- `setTimeout(callback, delay)`: 지정된 시간 후에 callback을 실행
- `setInterval(callback, interval)`: 지정된 시간 간격으로 callback을 반복 실행
- `setImmediate(callback)`: 즉시 실행됩니다. 기본적으로 이벤트 루프의 다음 사이클에서 실행
- `clearTimeout(id)` / `clearInterval(id)` / `clearImmediate(id)`: 타이머를 취소

```
// setTimeout 예시
setTimeout(() => console.log('1초 후 실행'), 1000);

// setInterval 예시
const intervalId = setInterval(() => console.log('2초마다 실행'), 2000);

// setImmediate 예시
setImmediate(() => console.log('즉시 실행'));

// 타이머 취소
clearInterval(intervalId);
```

---

## process

- 현재 실행 중인 Node.js 프로세스에 대한 정보를 제공함.
- 주로 프로세스 상태나 환경을 확인할 때 사용됨.

### 주요 속성

- `process.version` : 현재 실행 중인 Node.js의 버전 정보 제공
- `process.arch` : 프로세스 아키텍처 정보를 제공 (예: x64 (64비트), arm, ia32 등)
- `process.platform` : 운영체제의 플랫폼 정보를 제공 (예: win32, linux, darwin 등)
- `process.pid`: 현재 Node.js 프로세스의 ID
- `process.uptime()` : Node.js 프로세스가 시작된 이후 흐른 시간을 초 단위로 반환
- `process.execPath` : Node.js 실행 파일의 경로를 반환
- `process.cwd()` : 현재 작업 중인 디렉터리 경로를 반환
  - node 명령어를 어디서 실행했는지 파악 가능
- `process.cpuUsage()` : 프로세스의 CPU 사용량을 반환
  - `{ user, system }` 형식으로 반환되며, 각각 사용자 모드와 시스템 모드에서 소비한 CPU 시간

<details>
<summary><i>process 속성 출력 결과</i></summary>

```
console.log('노드 버전:', process.version);
console.log('프로세서 아키텍처:', process.arch);
console.log('운영체제 플랫폼:', process.platform);
console.log('현재 프로세스 ID:', process.pid);
console.log('프로세스 시작 후 경과 시간 (초):', process.uptime());
console.log('노드 실행 파일 경로:', process.execPath);
console.log('현재 작업 디렉토리:', process.cwd());
console.log('현재 프로세스 CPU 사용량:', process.cpuUsage());
```

![image](https://github.com/user-attachments/assets/728cb22a-4498-4c69-bc13-7f67a406249c)

</details>

### 환경 변수 (process.env)

- node.js 실행 시 시스템에 설정된 환경 변수들을 객체 형태로 접근할 수 있음.
- 민감한 정보(비밀번호, API 키 등)는 `process.env`를 통해 환경 변수를 사용해 관리하는 것이 안전함.
- `NODE_OPTIONS` : 노드를 실행할 때의 옵션들을 입력받는 환경 변수
  - `NODE_OPTIONS=--max-old-space-size=8192` : 노드의 메모리를 8GB까지 사용
- `UV_THREADPOOL_SIZE` : 노드에서 기본적으로 사용하는 스레드 풀의 스레드 개수 조절
  - `UV_THREADPOOL_SIZE=8` : 스레드풀에서 스레드 8개까지 사용

### 프로세스 종료

- `process.exit(0)`: 정상 종료
- `process.exit(1)`: 비정상 종료

### 비동기 함수 실행 우선순위

1. `process.nextTick` -> 가장 먼저 실행
2. `Promise의 .then() 또는 catch()` -> process.nextTick 후, 이벤트 루프 사이클 내에서
3. `setImmediate()` -> 이벤트 루프의 현재 사이클이 끝난 후
4. `setTimeout()` -> 지정된 시간 후 실행되며, 실행 순서는 환경에 따라 달라짐

### 마이크로태스크의 재귀 호출

- `process.nextTick` 또는 `Promise`의 콜백이 재귀적으로 호출되면, 이벤트 루프는 다른 매크로태스크를 실행하지 않고 <b>계속해서 마이크로태스크만 처리</b>할 수 있음.
- 이로 인해 콜백이 무한히 실행될 수 있으며, 다른 이벤트 루프의 콜백들이 실행되지 않게 될 위험이 있음.
- 따라서 마이크로태스크의 재귀 호출은 주의해서 사용해야 함.

---

## os와 path

### OS 모듈

- 운영체제 관련 정보를 가져오는 내장 모듈
- 서버 환경을 다룰 때 유용하며, 시스템의 상태나 자원에 관한 정보를 확인

#### 주요 메서드

- `os.arch()`: 운영체제의 아키텍처 정보를 반환합니다. (예: x64 (64비트), arm 등)
- `os.platform()`: 운영체제의 플랫폼 정보를 반환합니다. 예: win32 (Windows), linux, darwin (macOS) 등.
- `os.type()`: 운영체제의 종류를 반환합니다. 예: Windows_NT, Linux, Darwin 등.
- `os.uptime()`: 시스템이 부팅된 후 경과한 시간을 초 단위로 반환합니다.
- `os.hostname()`: 컴퓨터의 호스트명을 반환
- `os.release()`: 운영체제의 버전 정보를 반환
- `os.homedir()`: 사용자의 홈 디렉터리 경로를 반환
- `os.tmpdir()`: 임시 파일이 저장될 디렉터리 경로를 반환
- `os.cpus()`: 시스템의 CPU 코어 정보와 각 코어의 세부 정보를 포함한 배열을 반환
- `os.cpus().length`: 시스템의 CPU 코어 개수를 반환
- `os.freemem()`: 사용 가능한 메모리 용량을 바이트 단위로 반환
- `os.totalmem()`: 시스템의 총 메모리 용량을 바이트 단위로 반환

### path 모듈

- 경로를 처리하고, 플랫폼에 맞는 경로 구분자를 제공하는 내장 모듈

#### 주요 메서드

- `path.join()`: 여러 경로를 결합하여 하나의 경로로 제작
  - 예: `path.join(__dirname, 'var.js')`는 현재 디렉터리와 var.js를 결합
  - Windows에서 \, POSIX (Linux/macOS)에서는 /를 사용하여 경로를 결합
- `path.resolve()`: 절대 경로를 반환
  - 예: `path.resolve(__dirname, '..', '/var.js')`는 절대 경로로 /var.js를 반환
- `path.normalize()`: 경로 내의 불필요한 . 또는 .. 등을 제거하고, 플랫폼에 맞는 경로 구분자를 자동으로 정리
- `path.relative()`: 두 경로 간의 상대 경로를 계산

---

## url, dns, searchParams

### 1. url과 searchParams

#### 1) WHATWG 방식 (현재 표준)

![image](https://github.com/user-attachments/assets/eebc33fe-a9b0-44a2-a170-f2b26cbd6d4c)

```
const myURL = new URL('http://example.com/path?search=test#hash');
```

- 브라우저와 호환되는 웹 표준 방식
- 노드 v7부터 추가됨
- searchParams 객체 제공
- URL은 노드 내장 객체 (require 불필요)

#### 2) 레거시 Node.js 방식 (구방식)

```
const url = require('url');
const parsedUrl = url.parse('http://example.com/path?search=test#hash');
```

- Node.js 초기부터 사용된 방식
- 현재는 사용을 권장하지 않음

#### 2) WHATWG URL 객체의 속성들

- `#hash`는 브라우저만 인식함. 서버는 인식 못 함.

```
const myURL = new URL('http://www.example.com/book/list.aspx?category=nodejs#anchor');

console.log(myURL);
// URL {
//   href: 전체 URL 문자열,
//   origin: 프로토콜 + 호스트명,
//   protocol: 프로토콜(http:, https:),
//   username: 사용자이름,
//   password: 비밀번호,
//   host: 호스트명 + 포트,
//   hostname: 호스트명,
//   port: 포트번호,
//   pathname: 경로,
//   search: 쿼리스트링,
//   searchParams: 쿼리스트링 객체,
//   hash: 해시태그
// }
```

<details>
<summary><i>출력 결과</i></summary>

![Image](https://github.com/user-attachments/assets/640c13ee-8e81-41ff-b914-e8b8aeaa494e)

</details>

#### 3) searchParams 객체의 주요 메서드

```
const myURL = new URL('http://example.com?category=nodejs&category=javascript&page=1');

// 값 조회
myURL.searchParams.getAll('category');  // ['nodejs', 'javascript'] (모든 값)
myURL.searchParams.get('page');         // '1' (단일 값)
myURL.searchParams.has('page');         // true (존재 여부)

// 키와 값 순회
myURL.searchParams.keys();    // Iterator로 모든 키 조회
myURL.searchParams.values();  // Iterator로 모든 값 조회

// 값 추가/수정
myURL.searchParams.append('filter', 'es3');  // 기존 값 유지하고 추가
myURL.searchParams.append('filter', 'es5');  // 값 추가
myURL.searchParams.set('filter', 'es6');     // 기존 값 전체 삭제 후 새로 설정

// 값 삭제
myURL.searchParams.delete('filter');

// 문자열로 변환
console.log(myURL.searchParams.toString());  // 'category=nodejs&category=javascript&page=1'
myURL.search = myURL.searchParams.toString();  // URL 객체에 변경사항 적용
```

<details>
<summary><i>출력 결과</i></summary>

![Image](https://github.com/user-attachments/assets/cd937530-dafb-4c00-ae5b-788710c19218)

</details>

#### 4) 특수한 경우 처리

- 경로만 있는 URL 처리

```
// host 부분 없이 pathname만 있는 경우 두 번째 인수로 기본 URL 제공
const pathURL = new URL('/book/list', 'http://example.com');
```

- URL 포맷팅

```
const url = require('url');
// URL 객체를 문자열로 변환
console.log(url.format(myURL));
```

### 2. dns

#### 1) DNS 모듈 기본 사용

- 최신 Node.js에서는 Promise 기반의 `dns/promises` 사용을 권장함.

```
import dns from 'dns/promises';  // Promise 기반 DNS API 사용
```

#### 2) 주요 메서드

- `dns.lookup(domain)`
  - 도메인의 IP 주소를 조회
  - 운영체제의 hosts 파일 등을 포함한 시스템 설정 사용

```
const ip = await dns.lookup('example.com');
```

- `dns.resolve(domain, recordType)`
  - DNS 서버에 직접 조회
  - 다양한 레코드 타입 조회 가능:
    - `A`: IPv4 주소
    - `AAAA`: IPv6 주소
    - `MX`: 메일 서버 정보
    - `CNAME`: 별칭 도메인
    - `TXT`: 텍스트 정보
    - `ANY`: 모든 레코드 (일부 DNS에서 지원 안 할 수 있음)

```
// IPv4 주소 조회
const aRecords = await dns.resolve('example.com', 'A');

// 메일 서버 정보 조회
const mxRecords = await dns.resolve('example.com', 'MX');

// 별칭 도메인 조회
const cnameRecords = await dns.resolve('www.example.com', 'CNAME');
```

<details>
<summary><i>출력 결과</i></summary>

![Image](https://github.com/user-attachments/assets/1fe6c596-9c9a-46f0-85d6-d9ad7662f880)

</details>

---

## crypto

### 1. 암호화 vs 복호화

#### 1) 꼭 기억할 것

- 비밀번호는 "암호화한다" (X)
- 비밀번호는 "해시화한다" (O)

#### 2) 차이점

![Image](https://github.com/user-attachments/assets/ec45035d-cfec-4b16-b396-2c0c320138b4)

| 구분          | 해시 (Hash)                                    | 암호화 (Encryption)                             |
| ------------- | ---------------------------------------------- | ----------------------------------------------- |
| **특징**      | 평문을 암호처럼 만들지만 <b>되돌릴 수 없음</b> | 평문을 암호로 만들고 <b>다시 되돌릴 수 있음</b> |
| **안전성**    | 알고리즘만 잘 선택하면 매우 안전               | 키 관리가 매우 중요                             |
| **주요 용도** | 주로 비밀번호 저장에 사용                      | 민감 데이터 저장에 사용                         |
| **성능**      | CPU 부하가 크므로 멀티스레드로 처리 필요       | 키 관리 및 암호화/복호화 과정에서 부하가 있음   |

<details>
<summary><i>hash.js 출력 결과</i></summary>

![Image](https://github.com/user-attachments/assets/06113972-6b13-4911-8377-fbea664941d4)

</details>

### 2. 해시화 구현

#### 1) 기본 해시 예제

```
import crypto from 'crypto';

// 해시화 (SHA512 사용)
const hash = crypto.createHash('sha512')
                  .update('비밀번호')
                  .digest('base64');
```

#### 2) 현대적인 해시 방식 (PBKDF2)

```
const crypto = require('crypto');

// salt 생성 (랜덤값)
const salt = crypto.randomBytes(64).toString('base64');

// CPU 집약적 작업이므로 자동으로 멀티스레드로 처리됨
crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => {
    const hashedPassword = key.toString('base64');
    // DB에 hashedPassword와 salt 저장
});
```

<details>
<summary><i>pbkdf2.js 출력 결과</i></summary>

![Image](https://github.com/user-attachments/assets/3188ae6b-dcd3-4b10-bfbe-22b7cd1664ec)

</details>

### 3. 암호화 구현

- 양방향 암호화 예제

```
const crypto = require('crypto');

// 암호화 설정
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);  // 32바이트 키
const iv = crypto.randomBytes(16);   // 16바이트 초기화벡터

// 암호화
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

// 복호화
function decrypt(encrypted) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
```

<details>
<summary><i>cipher.js 출력 결과</i></summary>

![Image](https://github.com/user-attachments/assets/02c0e4c2-8cee-4b55-bf5d-ae67a529edf1)

</details>

### 4. 성능과 보안 고려사항

#### 1) 멀티스레드 처리

- 해시화는 CPU를 많이 사용
- Node.js는 자동으로 스레드풀 사용
- 성능 저하 없이 안전한 해시 가능

```
// 이 작업은 자동으로 멀티스레드로 처리됨
crypto.pbkdf2('비밀번호', salt, 100000, 64, 'sha512', (err, key) => {
    // 작업 완료 후 콜백
});
```

#### 2) 안전한 알고리즘 선택

- 👍 권장하는 알고리즘

  - 해시: SHA512, PBKDF2, bcrypt, scrypt
  - 암호화: AES-256-CBC, AES-256-GCM

- 👎 사용하면 안 되는 알고리즘
  - MD5
  - SHA1
  - DES

### 5. 실무 보안 팁

#### 1) 해시화 베스트 프랙티스

- 항상 salt 사용하기
- 충분한 반복횟수 설정 (최소 100,000회)
- 안전한 알고리즘 선택
- salt와 해시 모두 저장

#### 2) 암호화 베스트 프랙티스

- 키를 안전하게 보관 (환경변수 또는 키 관리 서비스)
- IV(초기화 벡터) 랜덤하게 생성
- 주기적인 키 순환
- 암호화된 데이터와 키는 별도로 보관

```
// 환경변수 사용 예제
const key = process.env.ENCRYPTION_KEY;
const iv = process.env.ENCRYPTION_IV;
```

#### 3) 일반적인 보안 주의사항

- 로그에 민감정보 출력 금지
- 키를 코드에 하드코딩 금지
- 에러 메시지에 민감한 정보 포함 금지
- 정기적인 보안 감사 실시

---

## util

### 1. deprecated - 함수 지원 중단 알림

```
const util = require('util');

// deprecated 사용 예시
const oldFunction = util.deprecate((x, y) => {
  return x + y;
}, '이 함수는 곧 사라질 예정입니다. newFunction을 사용하세요.');

// 사용할 때마다 경고 메시지 출력
oldFunction(1, 2); // 경고: 이 함수는 곧 사라질 예정입니다. newFunction을 사용하세요.
```

### deprecated란?

- '더 이상 사용되지 않음'을 의미
- 기존 기능보다 더 나은 새로운 기능이 나왔을 때 사용
- 당장 제거하지는 않지만 앞으로 사라질 예정임을 알림
- 하위 호환성을 위해 존재

### 2. promisify - 콜백을 프로미스로 변환

```
const util = require('util');
const fs = require('fs');

// 기존 콜백 스타일
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// promisify로 변환
const readFilePromise = util.promisify(fs.readFile);

// 프로미스 스타일로 사용
readFilePromise('file.txt')
  .then(data => console.log(data))
  .catch(err => console.error(err));

// async/await 사용
async function readFile() {
  try {
    const data = await readFilePromise('file.txt');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

#### promisify 사용 조건

- 콜백 함수가 (error, data) => {} 형식이어야 함
- 첫 번째 매개변수: 에러 객체
- 두 번째 매개변수: 결과 데이터

#### 장점

- 콜백 지옥 방지
- async/await 사용 가능
- 코드 가독성 향상
- 에러 처리가 더 쉬워짐

<details>
<summary><i>utils.js 출력 결과</i></summary>

![Image](https://github.com/user-attachments/assets/26905557-99fa-4672-82b7-83a270ff556e)

</details>

---

## worker_threads

### 1. 개념

#### Node.js 특징

- 기본적으로 단일 스레드, 단일 프로세스로 동작
- 이벤트 루프를 통한 비동기 처리
- 하나의 코어만 사용

#### 멀티 스레딩

- `worker_threads`로 멀티 스레딩 가능
- 메인 스레드가 워커 스레드들 관리
- 각 워커는 독립적으로 작업 수행
- 결과는 메인 스레드에서 취합

### 2. 한 개의 워커스레드 사용

#### 작동 방식

1. 메인 스레드가 워커 스레드 생성
2. 워커 스레드에 작업 분배
3. 워커 스레드가 작업 완료
4. 결과를 메인 스레드로 전송
5. 메인 스레드가 최종 결과 취합

#### 사용 예시

```
const { worker, isMainThread, parentPort } = require("worker_threads");

if (isMainThread) {
  // 메인 스레드
  const worker = new Worker(__filename);
  worker.on("message", (value) => console.log("워커로부터", value));
  worker.on("exit", () => console.log("워커 끝~"));
  worker.postMessage("ping");
} else {
  // 워커 스레드
  parentPort.on("message", (value) => {
    console.log("부모로부터", value);
    parentPort.portMessage("pong");
    parentPort.close(); // 종료
  });
}
```

- `new Worker(__filename)` : 현재 실행 중인 파일을 워커 스레드의 실행 파일로 사용하겠다는 의미. 이를 통해 메인 스레드와 워커 스레드가 동일한 코드를 실행함.

<details>
<summary><i>worker-threads.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/623bbfcc-7adf-4572-9dac-1f9a979b6e01)

</details>

### 3. 두 개 이상의 워커스레드 사용

- 각 Worker의 실행순서는 보장되지 않음. 코드의 순서와 관계없이 비동기적으로 실행됨.
  - Worker 스레드는 <b>병렬로 실행</b>됨
  - 각 스레드는 독립적으로 동작
  - 시스템 리소스, CPU 스케줄링에 따라 실행 순서가 달라짐
  - 코드의 순서는 <b>단지 워커 생성 순서만 나타낼 뿐</b>
- 따라서 워커 간의 순서가 중요한 경우에는 별도의 동기화 메커니즘을 구현함.

![Image](https://github.com/user-attachments/assets/b11308ff-27e9-4e38-ac76-f1d79c2d6c9c)

<details>
<summary><i>worker-data.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/c2644660-e4cf-49dd-95e1-ca278d6add36)

</details>

#### 소수 찾기 (싱글스레드)

- prime.js 코드는 12초가 걸린다.
- 싱글 스레드 서버는 12초 동안 다른 작업을 하지 못한다.
<details>
<summary><i>prime.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/39c8cbee-d5d7-49c1-b14c-2b419b6bebd4)

</details>

#### 소수 찾기 (멀티스레드)

1. Worker Threads의 특성
- 스레드 수 증가 ≠ 선형적 성능 향상
- 각 CPU 코어와 작업 특성에 맞는 최적의 스레드 수 존재
- 오버헤드 고려 필요 (스레드 생성, 통신, 관리 비용)

2. 작업 분배와 결과 취합
    ```
    if (isMainThread) {
        // 1. 작업 분배
        const max = 10000000;
        const threadCount = 8;
        const range = Math.ceil((max - min) / threadCount);

        // 2. 워커 생성 및 작업 할당
        for (let i = 0; i < threadCount; i++) {
            const startNum = min + (range * i);
            threads.add(new Worker(__filename, {
                workerData: { start: startNum, range }
            }));
        }

        // 3. 결과 취합
        for (let worker of threads) {
            worker.on('message', (msg) => {
                primes = primes.concat(msg);  // 결과 합치기
            });
        }
    }
    ```

3. 에러 처리와 복구 로직
    ```
    if (isMainThread) {
        for (let worker of threads) {
            // 에러 처리
            worker.on('error', (err) => {
                console.error('Worker 에러:', err);
                // 에러 발생한 작업 재시도 로직
                retryWork(worker.workerData);
            });

            // 워커 종료 처리
            worker.on('exit', (code) => {
                if (code !== 0) {
                    console.error('Worker 비정상 종료');
                    // 복구 로직
                    handleWorkerFailure();
                }
                // 정상 종료 처리
                handleWorkerSuccess();
            });
        }
    }

    function retryWork(data) {
        // 실패한 작업 재시도 로직
        const newWorker = new Worker(__filename, { workerData: data });
        threads.add(newWorker);
    }
    ```

4. 성능 최적화 팁
- 균등한 작업 분배
- 메모리 사용량 고려
- 스레드 간 통신 최소화
    ```
    // 다양한 스레드 수로 테스트 실행
    const testThreadCounts = [2, 4, 6, 8, 12, 16];

    for (const count of testThreadCounts) {
        console.time(`Test with ${count} threads`);
        // 테스트 실행
        console.timeEnd(`Test with ${count} threads`);
    }
    ```

5. 실무 적용 시 체크리스트
- 성능 체크
- 메모리 관리
- 완료 핸들링

6. 주의 사항
- 모든 작업에 Worker Threads가 필요한 것은 아님
- I/O 작업은 기본 비동기 처리 사용이 더 효율적
- 메모리 공유 시 동기화 문제 주의
- 디버깅이 어려울 수 있음
- 멀티스레딩이 필요하면 `node.js` 말고 다른 언어로 실시하는게 좋음.

<details>
<summary><i>prime-worker.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/5557b439-c98e-48ad-a677-a6d587227158)

</details>

---

## child_process

### 1. child_process란?
- node.js에서 다른 프로그램이나 명령어를 실행할 때 사용하는 모듈
- 현재 Node 프로세스 외에 새로운 프로세스를 생성하여 작업 수행
- 다른 언어(Python, C++ 등)로 작성된 프로그램도 실행 가능

### 2. exec
- <b>셸</b>을 통해 명령어 실행
- 결과를 버퍼에 저장했다가 한 번에 반환
- 한글 사용 시: `cmd /c chcp 65001>nul && dir`

### 3. spawn
- 새 프로세스를 생성하여 스트림 형태로 데이터 처리
- 셸을 사용하지 않음 (옵션으로 사용 가능: `{ shell: true }`)
- 대용량 데이터 처리에 적합

### 4. exec vs spawn의 차이점
- `exec`: 셸 실행 → 명령어 수행 → 결과를 버퍼에 저장
- `spawn`: 새 프로세스 생성 → 명령어 실행 → 스트림으로 데이터 전달
- `spawn`이 메모리 관리면에서 더 효율적

<details>
<summary><i>node exec 출력 결과</i></summary>

![Image](https://github.com/user-attachments/assets/1b30854e-32b5-4ebc-a350-71d575955100)

</details>

<details>
<summary><i>node spawn 출력 결과</i></summary>

![Image](https://github.com/user-attachments/assets/3864230b-03e9-4716-b315-2bf9c2c64295)

</details>

### 5. 주의사항
- 외부 프로그램 실행 시 해당 프로그램이 설치되어 있어야 함
- 보안을 위해 사용자 입력을 직접 실행하지 않도록 주의
- 에러 처리 구현 필요
- Windows와 Linux/Mac 명령어 차이 고려 (예: dir vs ls)

---

## 파일 시스템 사용하기

### 1. fs 모듈 기본 개념
- 파일 시스템에 접근하여 파일/폴더의 생성, 삭제, 읽기, 쓰기 수행
- 기본적으로 콜백 기반이지만, Promise 기반으로도 사용 가능

<details>
<summary><i>readFile.js, writeFile.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/760c548d-aa74-4e1b-99cc-13bc0e822823)

![Image](https://github.com/user-attachments/assets/4fc22e98-c15b-4d28-9daa-f1f310afb076)

</details>

### 2. 동기와 비동기 메서드 특징
- [블로킹/논블로킹, 동기/비동기 이해하기](blocking-nonblocking/README.md)

#### 1) 비동기(Async) 메서드
- 메서드 이름: readFile, writeFile 등
- 백그라운드에 작업을 요청하고 즉시 다음 작업으로 넘어감
- 작업 완료 시 콜백 함수 실행
- 성능이 좋고 실무에서 권장됨
- 여러 요청을 동시에 처리 가능

#### 2) 동기(Sync) 메서드
- 메서드 이름 끝에 Sync 붙음 (예: readFileSync)
- 파일 작업이 완료될 때까지 다음 코드로 넘어가지 않음
- 작업 결과를 반환값으로 받음
- 성능 문제로 초기화 용도로만 사용 권장
- 요청이 많을 경우 병목 현상 발생

### 3. 중요한 특징:
```
// 비동기는 순서 보장이 안됨
fs.readFile('file1'); // 1
fs.readFile('file2'); // 2
fs.readFile('file3'); // 3
// 실행 순서가 1,2,3이 아닐 수 있음
```

### 4. 비동기 순서 보장 방법
- 콜백 중첩 (콜백 지옥 발생 가능)
- Promise 체이닝
- async/await 사용


<details>
<summary><i>async.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/f0edae2b-7908-4eb2-9788-45d3730bc59b)

</details>

<details>
<summary><i>sync.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/b520dad9-e3ba-4494-ac69-96fa1922d0bd)

</details>

<details>
<summary><i>asyncOrder.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/ddd2e5dd-982c-45e6-952d-5b70511afe33)

</details>

## 5. 파일 경로 주의사항
- [파일 경로 주의사항](file_path_instructions/README.md)
- 파일 경로는 실행 디렉터리 기준
- 상대 경로 사용 시 node 명령어 실행 위치 기준

## 6. 데이터 처리
- 파일 읽기 결과는 `Buffer` 형식으로 제공
- 문자열로 변환하려면 `toString()` 메서드 사용 필요

---

## 버퍼와 스트림 이해하기

| 버퍼 | 스트림  |
|---------|---------|
| ![Image](https://github.com/user-attachments/assets/c21c7ce1-2945-4fea-991e-bb243a940107) | ![Image](https://github.com/user-attachments/assets/368287ff-4586-4ac5-9968-301c56807142) |

### 1. 버퍼 (Buffer)
- 개념: 일정한 크기로 모아두는 데이터
- 메모리에 파일 크기만큼 공간을 할당하여 저장
- 메모리 효율성이 낮음 (100MB 파일 = 100MB 메모리 사용)

#### 버퍼의 한계
- 대용량 파일 처리 시 메모리 문제 (100MB 파일 10개 = 1GB 메모리)
- 서버 환경에서 동시 접속자 수에 따른 메모리 부하
- 전체 데이터를 버퍼에 쓴 후에만 다음 작업 가능

#### 주요 Buffer 메서드
- `Buffer.from()`: 문자열을 버퍼로 변환
- `Buffer.toString()`: 버퍼를 문자열로 변환
- `Buffer.concat()`: 버퍼들을 하나로 합침
- `Buffer.alloc()`: 빈 버퍼 생성

<details>
<summary><i>buffer.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/755a3385-6b7c-4f28-a3ae-de36b8659327)

</details>

### 2. 스트림 (Stream)

- 개념: 데이터를 조각내어 여러 번에 걸쳐 전송
- 메모리 효율적 (1MB 버퍼로 100MB 파일 전송 가능)
- 버퍼의 메모리 한계 극복
- 예: 100MB 파일을 1MB 크기로 100번 나눠 전송

#### 주요 스트림 메서드
- `createReadStream()`: 읽기 스트림 생성
- `createWriteStream()`: 쓰기 스트림 생성

<details>
<summary><i>createReadStream.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/c70e5701-4f90-44b9-bb41-259b1e6b892a)

</details>

<details>
<summary><i>createWriteStream.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/9a66f5bb-d617-40a9-9d0c-da1fd276b060)

</details>

---

## pipe와 스트림 메모리 효율 확인

### 1. 파이프 (Pipe)
- 개념: 스트림 사이를 연결하는 방식
- 읽기 스트림 → 쓰기 스트림으로 데이터 전달
- 여러 개의 스트림을 파이프로 연결 가능
- 용도: 파일 복사, 압축, 파일 스트리밍 등

### 2. 메모리 사용 비교
- 버퍼 방식: 1GB 파일 복사 시 1GB 메모리 사용
- 스트림 방식: 1GB 파일 복사 시 64MB 정도만 사용
  - 파일을 작은 조각으로 나누어 처리
  - 메모리 효율성 크게 향상

<details>
<summary><i>pipe.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/fdcc20a4-5908-48ea-9c04-bc8b23b51778)

</details>

<details>
<summary><i>gzip.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/4d156238-d056-4024-b7fb-ccdb2eb87687)

</details>

<details>
<summary><i>실습 중단</i></summary>

- 대용량파일 관련 코드는 실행할 때마다 vsCode가 중단되므로 실습하지 않음.

![Image](https://github.com/user-attachments/assets/ca9b7327-7d6b-4547-b652-2cf33ad91346)

</details>

### 3. fs 모듈의 주요 메서드 파일 처리

- `access()`: 파일 접근 권한 체크
- `mkdir()`: 폴더 생성
- `open()`: 파일 열기
- `rename()`: 파일명 변경
- `unlink()`: 파일 삭제
- `rmdir()`: 폴더 삭제
- `copyFile()`: 파일 복사
- `watch()`: 파일 변경 감시

<details>
<summary><i>fsCreate.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/61aa01d3-49d6-4d56-85a8-61c99d2dec1b)

</details>

<details>
<summary><i>fsDelete.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/9d73c852-5ea0-46f1-9fae-68e3a61b1fd2)

</details>

<details>
<summary><i>copyFile.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/8b654594-c79d-4718-9a3a-244660b82d22)

</details>

<details>
<summary><i>watch.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/038414ca-cd65-4130-9537-e24126ec9eba)

</details>

---

## 스레드풀과 커스텀 이벤트

---

## 에러 처리하기
