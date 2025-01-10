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
<summary>VSCode 터미널 출력 예시</summary>

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
<summary>require 출력 결과</summary>

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

![image](https://github.com/user-attachments/assets/32b47d63-09bd-43f6-832e-93d928cc9055)
- `dep1.js`가 `dep2.js`를 require하고, `dep2.js`는 `dep1.js`를 require하고 있기 때문에 순환 참조가 발생함.
- Node.js는 순환 참조를 처리하려고 하지만, 첫 번째 require에서 <b>모듈이 완전히 로드되지 않은 상태로 반환</b>됨.
- 이 때문에 `dep2.someValue`는 `undefined`로 출력됨.

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

