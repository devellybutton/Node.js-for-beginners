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
<details>
<summary>REPL 출력 예시 </summary>

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

| 항목                          | CommonJS 모듈                          | ECMAScript 모듈 (ESM)             |
|-----------------------------|--------------------------------------|----------------------------------|
| **문법**                     | `require('./a');` <br> `module.exports = A;` <br> `exports.C = D;` <br> `exports.E = F;` <br> `const { C, E } = require('./b');`  | `import './a.mjs';` <br> `export default A;` <br> `export const C = D;` <br> `export { E };` <br> `import { C, E } from './b.mjs';` |
| **확장자**                   | .js, .cjs                            | .js (package.json에 `type: "module"` 필요), .mjs   |
| **확장자 생략**               | 가능                                 | 불가능                           |
| **다이내믹 임포트**           | 가능 <br>(예: `require('./module')`)      | 불가능 <br>(정적 임포트만 가능)      |
| **인덱스(index) 생략**        | 가능 <br>(예: `require('./folder')`)      | 불가능 <br>(예: `import './folder/index.mjs'`) |
| **Top Level Await**          | 불가능                               | 가능 <br>(최상위 레벨에서 `await` 사용 가능)  |
| **`__filename`, `__dirname`, `require`, `module.exports`, `exports` 사용** | 사용 가능 <br>(Node.js에서 기본 제공) | 사용 불가능 <br>(`__filename` 대신 `import.meta.url` 사용) |
| **서로 간 호출**              | 가능 <br>(CommonJS와 ESM 간 호출 가능)    | 불가능 <br>(호환성 제한, `import()`와 `require()` 간 호출 불가) |


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

## crypto와 util

### 1. 암호화 vs 복호화

#### 1) 꼭 기억할 것
- 비밀번호는 "암호화한다" (X)
- 비밀번호는 "해시화한다" (O)

#### 2) 차이점

![Image](https://github.com/user-attachments/assets/ec45035d-cfec-4b16-b396-2c0c320138b4)

| 구분         | 해시 (Hash)                                      | 암호화 (Encryption)                                 |
|--------------|--------------------------------------------------|-----------------------------------------------------|
| **특징**     | 평문을 암호처럼 만들지만 <b>되돌릴 수 없음</b>        | 평문을 암호로 만들고 <b>다시 되돌릴 수 있음</b>          |
| **안전성**   | 알고리즘만 잘 선택하면 매우 안전               | 키 관리가 매우 중요                               |
| **주요 용도**| 주로 비밀번호 저장에 사용                       | 민감 데이터 저장에 사용                          |
| **성능**     | CPU 부하가 크므로 멀티스레드로 처리 필요       | 키 관리 및 암호화/복호화 과정에서 부하가 있음     |

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

