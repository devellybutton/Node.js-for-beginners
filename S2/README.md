# 섹션2. 알아두어야 할 자바스크립트

> - [호출 스택](#호출-스택)
> - [이벤트 루프](#이벤트-루프)
> - [var, const, let](#var-const-let)
> - [템플릿 문자열, 객체 리터럴](#템플릿-문자열-객체-리터럴)
> - [화살표 함수](#화살표-함수)
> - [구조분해 할당](#구조분해-할당)
> - [클래스](#클래스)
> - [Promise, async/await](#promise-asyncawait)
> - [Map, Set, WeakMap, WeakSet](#map-set-weakmap-weakset)
> - [옵셔널 체이닝, 널 병합](#옵셔널-체이닝-널-병합)
> - [프론트엔드 자바스크립트](#프론트엔드-자바스크립트)

---

## 호출 스택

[호출 스택 바로가기](./call-stack/README.md)

---

## 이벤트 루프

[이벤트 루프 바로가기](./event-loop/README.md)

---

## var, const, let

- **ES2015 이전**에는 `var`로 변수 선언
- **ES2015부터**는 `const`와 `let`이 대세
- 가장 큰 차이점: **블록 스코프** (`var`은 함수 스코프)
- 레거시 코드 파악 시 `var`를 알아야 하지만, 새 코드에서는 `var`을 직접 쓸 필요는 없음.

### 1) var vs const, let

- `var`
  - 함수 스코프 또는 전역 스코프
    - function() {} 안에서 선언된 var은 해당 함수를 벗어나면 접근 불가능함.
    - if, while, for 등에서 선언된 var는 <b>그 블록을 벗어나도 접근할 수 있음</b>.
  - var 변수는 선언이 호이스팅되지만, 값은 할당되지 않아서 undefined로 초기화
- `const, let`
  - 블록 스코프
    - function() {} 안에서 선언된 var은 해당 함수를 벗어나면 접근 불가능함.
    - if, while, for 등의 블록 내에서 선언된 변수는 <b>그 블록 내에서만 접근 가능함</b>.
  - let과 const도 선언은 호이스팅되지만, 값이 할당되기 전까지 참조할 수 없는 상태 => TDZ(Temporal Dead Zone)로 ReferenceError 발생
- 호이스팅(Hoisting) : 변수 선언이 실제로 코드 실행 전에 상단으로 끌어올려지는 현상
- 예시1) 조건문 내부에서 선언된 변수 x

  ```
  if (true) {
      var x = 3;
  }
  console.log(x);  // 3
  ```

  - 'var'로 선언된 변수 x는 <b>함수 또는 전역 범위</b>에서 접근 가능
  - 'var'는 <b>함수 스코프 또는 전역 스코프</b>를 가지므로, if문 내부에서 선언된 x는 외부에서 접근 가능

- 예시2) 함수 내부에서 선언된 변수 y
  ```
  function a() {
      var y = 3;
  }
  console.log(y);  // ReferenceError: y is not defined
  ```
  - 'var'로 선언된 변수 y는 <b>함수 스코프</b>를 가짐
  - 'y'는 함수 a() 내부에서만 유효한 변수이기 때문에 외부에서 접근할 수 없음
- 예시 3) 호이스팅

  ```
  function testHoisting() {
      console.log(x);  // undefined
      var x = 5;  // `x`는 호이스팅되어 선언만 끌어올려짐, 값은 할당되지 않음.

      console.log(y);  // ReferenceError: Cannot access 'y' before initialization
      let y = 10;  // `y`는 호이스팅되지만 TDZ에 위치하여 할당되기 전까지 접근 불가.

      console.log(z);  // ReferenceError: Cannot access 'z' before initialization
      const z = 15;  // `z`도 호이스팅되지만 TDZ로 인해 할당되기 전까지 접근 불가.
  }
  testHoisting();
  ```

### 2) var의 특징

#### ① var는 블록스코프가 없다.

- var는 함수 스코프나 전역 스코프만 지원함.
- if, for, while 블록 내에서 선언되더라도 해당 블록을 벗어나서도 접근할 수 있음.
  ```
  for (var i = 0; i < 3; i++) {
      // do something
  }
  console.log(i);  // 3 (블록 밖에서도 접근 가능)
  ```

#### ② var은 변수의 중복 선언을 허용한다.

- 같은 이름으로 여러 번 선언 가능
  ```
  var user = "홍길동";
  var user = "김철수";  // 가능
  ```

#### ③ 선언하기 전에 var를 사용할 수 있다.

- 변수 선언이 호이스팅(hoisting) 되어 코드 상단으로 끌어올려지므로, 선언하기 전에 var를 사용할 수 있음. (하지만 값은 undefined로 초기화됨)
  ```
  console.log(x);  // undefined
  var x = 5;
  // 위 코드는 아래처럼 동작
  var x;           // 선언+초기화 호이스팅
  console.log(x);  // undefined
  x = 5;
  ```

### 3) const과 let 비교

- <b>const</b> : const로 선언된 변수는 <b>재할당이 불가능</b>
  - 참조 타입의 경우 객체나 배열의 내용은 변경할 수 있지만, 변수 자체의 참조는 변경할 수 없음
- <b>let</b> : let으로 선언된 변수는 <b>재할당이 가능</b>
- 둘 다 블록 스코프를 가짐.

  ```
  // const 예시
  const obj = { name: "Alice" };
  obj.name = "Bob";  // 객체의 내용은 변경 가능
  console.log(obj);  // { name: "Bob" }

  obj = {};  // 오류: const로 선언된 변수는 재할당 불가능

  // let 예시
  let age = 30;
  age = 31;  // let은 재할당 가능
  console.log(age);  // 31
  ```

### 요약

- var / const / let
  | 특성 | `var` | `const` | `let` |
  |------------------|----------------------------|----------------------------|----------------------------|
  | **스코프** | 함수 스코프 (Function Scope) | 블록 스코프 (Block Scope) | 블록 스코프 (Block Scope) |
  | **함수 스코프** | 가능 | 불가능 | 불가능 |
  | **블록 스코프** | 불가능 | 가능 | 가능 |
  | **재선언 가능** | 가능 | 불가능 | 불가능 |
  | **재할당 가능** | 가능 | 불가능 | 가능 |
  | **호이스팅** | 선언 + 초기화 | 선언만 호이스팅 (TDZ 발생) | 선언만 호이스팅 (TDZ 발생) |
  | **전역 객체 속성** | 예 (브라우저에서 `window` 객체 속성) | 아니오 | 아니오 |

---

## 템플릿 문자열, 객체 리터럴
### 1) 템플릿 문자열 (Template Literals)
- 백틱 (`)을 사용하여 문자열을 정의하고, ${}로 변수나 표현식을 문자열 안에 쉽게 삽입
    ```
    // 기존 방식 (띄어쓰기가 불편)
    var won = 1000;
    var result = '이 과자는' + won + '원입니다.';
    console.log(result);  // 출력: 이 과자는1000원입니다. (띄어쓰기 불편)

    // 템플릿 문자열 (백틱 사용)
    const result = `이 과자는 ${won}원입니다.`;
    console.log(result);  // 출력: 이 과자는 1000원입니다. (띄어쓰기가 자동으로 해결됨)
    ```
### 2) 객체 리터럴 (Object Literals)
- 함수 정의 간소화
    ```
    const calculator = {
        num1: 5,
        num2: 3,
        
        // 기존 방식: 함수 표현식
        add: function() {
            return this.num1 + this.num2;
        },
        
        // 축약된 방식: 함수 정의 간소화
        subtract() {
            return this.num1 - this.num2;
        }
    };

    console.log(calculator.add());       // 출력: 8
    console.log(calculator.subtract());  // 출력: 2
    ```
- 속성 이름 축약 (속성 이름이 변수 이름과 같을 때)
    ```
    const name = "Alice";
    const age = 25;

    // 속성 이름 축약 전
    const person1 = {
        name: name,
        age: age
    };
    console.log(person1);  // 출력: { name: 'Alice', age: 25 }

    // 속성 이름 축약 후
    const person2 = { name, age };
    console.log(person2);  // 출력: { name: 'Alice', age: 25 }
    ```

### 3) 태그드 템플릿 리터럴 (Tagged Template Literals)
-  템플릿 문자열에 함수를 태그로 사용하여, 템플릿 문자열을 다르게 처리할 수 있는 기능
    - 예시 1
        ```
        // 템플릿 문자열을 처리하는 함수
        function tag(strings, ...values) {
            console.log(strings);  // 템플릿 문자열의 고정된 부분 (배열로 받음)
            console.log(values);   // 템플릿 문자열 내에서 평가된 값 (배열로 받음)
            return "처리된 템플릿";
        }

        const name = "홍길동";
        const age = 29;

        // tag 함수로 템플릿 문자열을 전달
        const result = tag`이름은 ${name}이고, 나이는 ${age}입니다.`;
        console.log(result);  // 출력: 처리된 템플릿
        ```
    - 예시 2: HTML 생성하기
        ```
        function safeHTML(strings, ...values) {
            return strings.reduce((result, str, index) => {
                let value = values[index - 1];

                if (typeof value === 'string') {
                    // 특수 문자 이스케이프 처리 (XSS 방지)
                    value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }
                return result + str + (value || '');
            });
        }

        const name = "<script>alert('XSS')</script>";
        const message = "Hello, world!";

        // `safeHTML` 함수 사용
        const result = safeHTML`안녕하세요, ${name}님! ${message}`;
        console.log(result);  // 출력: 안녕하세요, &lt;script&gt;alert('XSS')&lt;/script&gt;님! Hello, world!
        ```

---

## 화살표 함수
- 화살표 함수는 function을 완벽하게 대체할 수 없음.

### 1) 화살표 함수 문법
- 기본형
    - 단일 표현식 반환할 때 return을 쓰지 않아도 됨.
    ```
    const add = (a, b) => a + b;
    ```
- 본문이 여러 줄일 경우
    -  중괄호 {}와 return 명시적 사용
    ```
    const calc = (a, b) => {
        const result = a + b;
        return result;
    };
    ```
- 객체 반환시 소괄호 필수
    - 안 써주면 객체인지 함수 body인지 자바스크립트가 헷갈림
    ```
    const makeObj = (x, y) => ({ x, y });  // 올바른 방법
    const makeObj2 = (x, y) => { x, y };   // 잘못된 방법 (undefined 반환)
    ```

### 2) 화살표 함수 vs 일반 함수
| 특징         | 화살표 함수 (Arrow Function)          | 일반 함수 (Function)               |
|--------------|--------------------------------------|-----------------------------------|
| **this**     | 부모 스코프의 `this`를 참조           | 호출 시 결정된 `this`를 참조      |
| **arguments**| 없음                                 | 있음                              |
| **constructor** | 사용할 수 없음                    | 사용할 수 있음 (생성자 함수)      |
| **prototype** | 없음                                 | 있음                              |
| **super**    | 사용할 수 없음                       | 사용할 수 있음 (클래스 상속 시)    |
| **new.target** | 없음                               | 사용할 수 있음                    |

---

## 구조분해 할당

### 1) 배열에서의 구조분해 할당
- 기존 문법 사용
    ```
    const example = { a: 123, b: { c: 135, d: 146 } };

    const a = example.a;
    const d = example.b.d;

    console.log(a); // 123
    console.log(d); // 146
    ```
- 구조 분해 할당 문법 사용
    - 객체에서의 순서와 무관하게 키 이름만 맞으면 값이 추출됨.
    ```
    const { a, b: { d } } = example;

    console.log(a); // 123
    console.log(d); // 146
    ```

### 2) 객체에서의 구조분해 할당
- 기존 문법 사용
    ```
    const arr = [1, 2, 3, 4, 5];

    // 기존 방법으로 값 추출
    const x = arr[0];
    const y = arr[1];
    const z = arr[4];

    console.log(x); // 1
    console.log(y); // 2
    console.log(z); // 5
    ```
- 구조분해 할당 사용
    ```
    const [x, y, , , z] = arr;

    console.log(x); // 1
    console.log(y); // 2
    console.log(z); // 5
    ```

### 요약

- 배열 구조 분해 할당은 순서가 중요
- 객체 구조 분해 할당은 키 이름만 일치하면 됨.
- this와 구조 분해 할당을 같이 사용할 때는 this가 의도한 대로 작동하는지 항상 확인해야 함.

---

## 클래스

- <b>클래스 문법</b>
    - 객체를 정의하기 위한 상태(멤버 변수)와 메서드(함수)로 구성됨.
    - 프로토타입 상속을 간결하게 만든 형태
    - class와 extends, super()를 사용하면 상속과 메소드 호출이 직관적임.
- <b>프로토타입(Prototype)</b>
    - 자바스크립트에서 객체 지향적인 상속을 구현하는 핵심 개념
    - 모든 자바스크립트 객체는 자신만의 프로토타입 객체를 가지고 있다는 특징을 가짐.
    - 이 프로토타입 객체를 통해 상속 및 메소드 호출을 할 수 있음.
    - `apply`, `Object.create()` 등으로 직접 구현해야 함.
- 프로토타입 → 클래스
    - `apply(this, arguments)`: 부모 생성자를 호출해 상속
    - `Object.create(Human.prototype)`: 상속받은 메소드들을 참조하도록 설정
    ```
    function Human(name, age) {
    this.name = name;
    this.age = age;
    }

    Human.prototype.sayHello = function() {
    console.log(`Hello, my name is ${this.name}.`);
    };

    function Zero(name, age, hobby) {
    Human.apply(this, arguments);
    this.hobby = hobby;
    }

    Zero.prototype = Object.create(Human.prototype);
    Zero.prototype.constructor = Zero;

    Zero.prototype.sayHobby = function() {
    console.log(`My hobby is ${this.hobby}.`);
    };
    ```
    - `super()`: 부모 클래스의 생성자 호출
    - `extends`: 상속을 간단히 구현
    ```
    class Human {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    sayHello() {
        console.log(`Hello, my name is ${this.name}.`);
    }
    }

    class Zero extends Human {
    constructor(name, age, hobby) {
        super(name, age); // 부모 클래스 생성자 호출
        this.hobby = hobby;
    }

    sayHobby() {
        console.log(`My hobby is ${this.hobby}.`);
    }
    }

    let zero = new Zero('Zero', 25, 'Reading');
    zero.sayHello(); // "Hello, my name is Zero."
    zero.sayHobby(); // "My hobby is Reading."
    ```et zero = new Zero('Zero', 25, 'Reading');
    zero.sayHello(); // "Hello, my name is Zero."
    zero.sayHobby(); // "My hobby is Reading."
    ```

<details> 
<summary> 함수 코드를 클래스 코드로 변환하는 문제 </summary>

![image](https://github.com/user-attachments/assets/4cd632a7-4189-4b45-a3aa-e2c40733d9f6)

#### 클래스 코드
```
class Clock {
  constructor({ template }) {
    this.template = template;
    this.timer = null;  
  }

  render() {
    let date = new Date();

    let hours = date.getHours();
    if (hours < 10) hours = '0' + hours;

    let mins = date.getMinutes();
    if (mins < 10) mins = '0' + mins;

    let secs = date.getSeconds();
    if (secs < 10) secs = '0' + secs;

    let output = this.template
      .replace('h', hours)
      .replace('m', mins)
      .replace('s', secs);

    console.log(output);
  }

  stop() {
    clearInterval(this.timer);
  }

  start() {
    this.render();
    this.timer = setInterval(() => this.render(), 1000);
  }
}

let clock = new Clock({ template: 'h:m:s' });
clock.start();
```

#### 함수 기반
```
function Clock({ template }) {
  let timer;

  function render() {
    let date = new Date();

    let hours = date.getHours();
    if (hours < 10) hours = '0' + hours;

    let mins = date.getMinutes();
    if (mins < 10) mins = '0' + mins;

    let secs = date.getSeconds();
    if (secs < 10) secs = '0' + secs;

    let output = template
      .replace('h', hours)
      .replace('m', mins)
      .replace('s', secs);

    console.log(output);
  }

  this.stop = function() {
    clearInterval(timer);
  };

  this.start = function() {
    render();
    timer = setInterval(render, 1000);
  };
}

let clock = new Clock({ template: 'h:m:s' });
clock.start();`
```

</details>

---

## Promise, async/await

### 1) Callback
- JavaScript에서 비동기 함수는 실행 순서를 보장할 수 없음.
- 따라서 비동기 함수 내에서 콜백 함수를 받아 순차적으로 실행하도록 구현함.
- 콜백 함수가 여러 번 중첩되면 <b>콜백 헬(callback hell)</b>에 빠져 코드의 가독성이 떨어지고, 유지보수가 어려워짐.
    ```
    processNumber(1, (index) => {
        processNumber(index, (index) => {
            processNumber(index, (index) => {
                processNumber(index, (index) => {
                    processNumber(index, (index) => {
                        console.log('index: ', index);
                        console.log('this is test !!!!!!!!!!!!');
                    });
                });
            });
        });
    });
    ```

### 2) Promise 
- Promise는 비동기 작업을 나타내는 객체로, 해당 작업이 <b>실행되었지만 아직 결과를 반환하지 않은 상태</b>를 의미함.
    - `resolve`: 비동기 작업이 <b>성공적으로</b> 끝났을 때 호출됨.
    - `reject`: 비동기 작업이 <b>실패했을 때</b> 호출됨.

### 3) Promise - then, catch
- `then`: 
    - Promise가 성공적으로 끝났을 때(resolve) 호출됨. 
    - 반환값을 사용해 후속 작업을 처리할 수 있음.
- `catch`:
    - Promise가 거부(reject)되었을 때 호출됨.
    - 에러를 처리함.
- <b>Promise의 세 가지 상태</b>
    - `pending`: 대기 상태, 아직 결과가 나오지 않음
    - `fulfilled`: 비동기 작업이 성공적으로 완료된 상태
    - `rejected`: 비동기 작업이 실패한 상태
- then 체이닝: 여러 개의 비동기 작업을 순차적으로 연결하여 처리할 수 있음.
    ```
    fetchData()
    .then(result => {
        console.log('First step: ', result);
        return process(result);
    })
    .then(processedResult => {
        console.log('Second step: ', processedResult);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    ```

### 4) Promise - async, await
- `async 함수`
    - async 함수는 항상 Promise를 반환함.
    - await를 사용할 수 있게 해줌.
- `await`
    - await는 Promise가 해결될 때까지 기다린 후 결과를 반환 
    - await는 async 함수 내에서만 사용할 수 있음.
- async/await의 장점
    - 비동기 코드가 동기 코드처럼 작성되어 가독성이 좋아짐.
    - Promise를 .then() 체이닝 없이 순차적으로 처리할 수 있음.
    ```
    // 기본적인 사용
    async function main() {
    const result = await promise;
    return result;
    }

    main().then((name) => {
    console.log(name);
    });

    // 에러 처리
    async function main() {
    try {
        const result = await promise;
        return result;
    } catch (error) {
        console.error(error);
    }
    }
    ```
#### top level await
![image](https://github.com/user-attachments/assets/96fe489d-798d-42d9-904b-e9613284e383)
- Top-level await는 ES2022에서 도입된 기능으로, 이전까지는 await를 사용하기 위해서는 반드시 async 함수 내부에서만 사용해야 했으나, 이제는 모듈 환경에서 async 함수 없이도 await를 직접 사용할 수 있게 됨.
- 초기화 코드를 IIFE(즉시 실행 함수)나 별도의 초기화 함수로 감싸야 했지만, Top-level await를 사용하면 더 깔끔하게 처리할 수 있게 됨.

- 브라우저
    ```
    // 반드시 모듈 환경이어야 함
    // HTML에서는 다음과 같이 사용
    <script type="module">
    const data = await fetch('/api/data');
    </script>

    // 또는 .mjs 파일에서 사용
    ```
    ```
    // 모듈에서 데이터를 가져올 때
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    export { data };

    // 동적으로 모듈을 불러올 때
    const module = await import('./module.js');
    ```
    ```
    // 이전 방식 (async 함수 필요)
    (async function() {
    const data = await fetchData();
    console.log(data);
    })();

    // Top-level await 사용
    const data = await fetchData();
    console.log(data);
    ```
- Node.js 환경
    ```
    // package.json에서 모듈 타입 설정
    {
    "type": "module"
    }

    // 또는 파일 확장자를 .mjs로 사용
    ```
    ```
    // 에러 처리 예시
    try {
    const connection = await database.connect();
    export default connection;
    } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
    }
    ```

### Promise 예시 
- 함수의 매개변수로 숫자를 받으면 3초 후에 입력한 숫자를 반환하는 promise 함수 만들기
    ```
    function getPromise(number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {resolve(number)}, 3000)
        });
    }
    ```
- .then()과 .catch() 사용
    ```
    getPromise(5).then(result => {
        console.log(result);  // 3초 후에 5가 출력
    }).catch(error => {
        console.error(error);
    });
    ```
- async/await 사용
    ```
    async function testPromise() {
        try {
            const result = await getPromise(5);
            console.log(result);  // 3초 후에 5가 출력
        } catch (error) {
            console.error(error);
        }
    }

    testPromise();
    ```
- 그냥 `console.log(getPromise(5))`출력하면 `Promise { <pending> }`으로 나옴.
    - Promise 객체가 아직 "완료되지 않은 상태(pending)"에 있기 때문

### Promise all / Promise.allSettled 예시
- 문제
    - 함수의 매개변수로 몇 밀리초(ms) 후에 실행될지를 입력받습니다.
    - 주어진 시간(ms)이 경과한 후, setTimeout을 사용하여 "${ms}ms work !!!" 메시지를 출력하고, 해당 ms 값을 반환하는 Promise 함수를 작성하세요.
    - 이 함수를 사용하여 1초, 3초, 5초 후에 실행되도록 각각 Promise를 생성하고, Promise.all()을 사용해 동시에 실행되도록 하세요.
    - Promise.all([promise1, promise2, promise3]) 형태로 실행하여 각 작업이 완료될 때의 결과를 출력하도록 합니다.
- <b>Promise.all</b>
    - 주어진 모든 Promise가 성공적으로 완료될 때만 결과를 반환하며, 하나라도 실패하면 즉시 catch로 이동
    ```
    function getPromise(time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`${time}ms work !!!`);
                resolve(time);  // time 값 반환
            }, time);
        });
    }

    Promise.all([getPromise(1000), getPromise(3000), getPromise(5000)])
        .then(results => {
            console.log(results);  // [1000, 3000, 5000] 출력
        })
        .catch(error => {
            console.error(error);
        });
    ```
- <b>Promise.allSettled</b>
    - 주어진 모든 Promise가 <b>완료(성공 또는 실패)</b>될 때까지 기다린 후, 각 Promise의 상태와 결과를 반환
    ```
    function getPromise(time, shouldReject = false) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldReject) {
                    reject(`Error after ${time}ms`);
                } else {
                    console.log(`${time}ms work !!!`);
                    resolve(time);
                }
            }, time);
        });
    }

    Promise.allSettled([
        getPromise(1000),            // 성공
        getPromise(3000, true),      // 실패
        getPromise(5000)             // 성공
    ])
    .then(results => {
        console.log('All promises settled:', results);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    ```

---

## Map, Set, WeakMap, WeakSet

### 1) Map

- key-value(키-값)을 저장하는 컬렉션으로, 일반 객체보다 더 유연한 키 타입을 제공함.
- 특징
  - 키로 객체를 포함한 모든 타입 사용 가능 (일반 객체는 문자열과 심볼만 가능)
  - 키는 참조형으로 동작
- 잘못된 사용법
  - 내용물은 똑같아도 두 객체는 서로 다른 객체이므로 참조가 다름.
    ![image](https://github.com/user-attachments/assets/99f46779-ac41-4634-8f18-e4e60a0d5c83)
- 올바른 사용법
  - 변수를 선언하여 해당 변수에 key를 할당하여 사용
    ![image](https://github.com/user-attachments/assets/0107da4d-8e51-4676-86ff-56fe0b646171)
- 예시

  ```
  // Map 생성
  const m = new Map();

  // 객체를 키로 사용 가능
  const obj = { a: 'b' };
  m.set(obj, { c: 'd' });

  // 객체를 키로 설정한 값 가져오기
  console.log(m.get(obj)); // { c: 'd' }

  // Map 크기 확인
  console.log(m.size); // 1

  // Map에 키가 있는지 확인
  console.log(m.has(obj)); // true

  // Map에서 키-값 삭제
  m.delete(obj);
  console.log(m.has(obj)); // false

  // Map 모든 항목 삭제
  m.clear();
  console.log(m.size); // 0
  ```

- map 생성자를 사용할 때 초기값에 배열을 넣을 수 있음.
  ![image](https://github.com/user-attachments/assets/b6afc1f6-7f26-415a-b50c-d6d8a002713c)

<details>
<summary>Map 순회</summary>

```
const map = new Map();
map.set('name', '홍길동');
map.set('age', 30);

// 1. for...of와 구조분해할당 사용 (가장 일반적)
for (const [key, value] of map) {
  console.log(key, value);
}

// 2. forEach 사용
map.forEach((value, key) => {
  console.log(key, value);
});

// 3. 키만 순회
for (const key of map.keys()) {
  console.log(key);
}

// 4. 값만 순회
for (const value of map.values()) {
  console.log(value);
}

// 5. 엔트리 순회
for (const entry of map.entries()) {
  console.log(entry[0], entry[1]); // 또는 구조분해: const [key, value] = entry
}
```

</details>

<details> 
<summary>일반 객체 순회</summary>

```
const obj = {
  name: '홍길동',
  age: 30
};

// 1. for...in (프로토타입 체인의 속성도 포함될 수 있음)
for (const key in obj) {
  if (obj.hasOwnProperty(key)) { // 프로토타입 체인 제외
    console.log(key, obj[key]);
  }
}

// 2. Object.keys() 사용
Object.keys(obj).forEach(key => {
  console.log(key, obj[key]);
});

// 3. Object.entries() 사용 (ES2017+)
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}

// 4. Object.values() 값만 순회 (ES2017+)
for (const value of Object.values(obj)) {
  console.log(value);
}
```

</details>

### 2) Set

- 중복을 허용하지 않는 값들의 컬렉션
- 주로 배열에서 중복을 제거할 때 사용
- 예시

  ```
  // Set 생성
  const s = new Set();

  // 값 추가
  s.add(1);
  s.add(2);
  s.add(2); // 중복된 값 추가해도 무시됨
  s.add('1');

  console.log(s); // Set { 1, 2, '1' }

  // Set을 배열로 변환
  const arr = Array.from(s);
  console.log(arr); // [ 1, 2, '1' ]

  // 중복 제거: 기존 배열에서 중복을 제거하고 싶을 때 유용
  const numbers = [1, 2, 2, 3, 4, 4];
  const uniqueNumbers = Array.from(new Set(numbers));
  console.log(uniqueNumbers); // [1, 2, 3, 4]
  ```

### 3) WeakMap

- Map과 유사하지만 <b>키가 반드시 객체</b>여야 하며, 가비지 컬렉션에 더 친화적
- 키가 더 이상 참조되지 않으면 자동으로 삭제됨.
- 주요 용도: 객체에 부가 정보를 안전하게 추가할 때 사용
- WeakMap의 <b>size</b>를 확인할 수 <b>없음</b>.
- 예시

  ```
  // 사용자가 가지고 있는 기본 정보 객체
  let user = { name: 'zerocho', age: 29 };

  // 새로운 WeakMap 생성
  const wm2 = new WeakMap();

  // user 객체에 'married' 정보를 부가적으로 저장
  wm2.set(user, { married: false });

  console.log(wm2.get(user)); // { married: false }

  // user 객체를 null로 설정하면
  user = null; // user 객체는 이제 가비지 컬렉션 대상으로 지정됨

  // user 객체가 더 이상 참조되지 않기 때문에, 'married: false' 정보도 자동으로 메모리에서 제거됨
  // 이 과정은 가비지 컬렉션에 의해 자동으로 처리됨.
  ```

### 4) WeakSet

- Set과 유사하지만 객체만 저장 가능하며, 가비지 컬렉션에 친화적
- 실무에서는 거의 사용되지 않음(?)
- 예시
  ```
  const weakSet = new WeakSet();
  weakSet.add({ data: 123 });
  ```

### 요약

---

## 옵셔널 체이닝, 널 병합

### 1) Nullish Coalescing Operator (??)

- <b>널 병합 연산자</b>
- 왼쪽 피연산자가 **null** 또는 **undefined**인 경우 오른쪽 피연산자를 반환함.
- 변수가 null 또는 undefined인 경우에만 기본값을 제공하고, 다른 falsy 값(**`0`**, **`''`**, **`false`** 또는 **`NaN`** )인 경우에는 유용하지 않음.
  ```
  const c = null;
  console.log(c ?? '기본값'); // '기본값' (c가 null이므로 기본값이 출력됨)
  ```
- `||` 연산자와 차이점

  - `||` : falsy 값을 잘못된 값으로 간주하고 그 뒤에 있는 기본값 반환
  - `??` : null과 undefined만 잘못된 값으로 간주하여 그 뒤에 있는 기본값 반환

  ```
  let userInput = 0; // 사용자 입력이 0일 경우

  // || 사용 시:
  let result = userInput || '기본값';
  console.log(result); // '기본값' (0은 falsy 값이므로 기본값이 반환됨)

  // ?? 사용 시:
  let resultWithNullish = userInput ?? '기본값';
  console.log(resultWithNullish); // 0 (0은 null이나 undefined가 아니므로 기본값을 사용하지 않음)
  ```

### 2) Optional Chaining Operator (?.)

- <b>옵셔널 체이닝 연산자</b>
- 왼쪽 피연산자가 null, undefined인 경우 **undefined**를 반환해줌.
- 중첩된 object 자료에서 자료뽑을 때 reference 에러없이 안전하게 뽑을 수 있음
- 체인의 각 참조가 유효한지 명시적으로 확인하지 않고도 연결된 개체 체인 내의 속성 값에 액세스할 수 있음.
- 체인의 참조가 'null' 또는 'undefined'인 경우 오류를 발생시키는 대신 **반환값**을 '**undefined**'으로 만들어서 런타임 오류 없이 코드가 안전하게 실행되도록 함.
- 객체 속성 접근

  ```
  const obj = {
  user: {
      name: "John",
      address: {
      city: "New York"
      }
  }
  };

  // 정상적인 객체 속성 접근
  console.log(obj.user?.name);       // "John"
  console.log(obj.user?.address?.city); // "New York"

  // 존재하지 않는 속성에 접근할 때
  console.log(obj.user?.phone?.number); // undefined (user나 phone이 존재하지 않으면 undefined)

  // 최상위 객체가 null 또는 undefined일 경우
  const nullObj = null;
  console.log(nullObj?.user?.name); // undefined (nullObj가 null이라서 오류가 발생하지 않고 undefined 반환)
  ```

- 배열 속성 접근

  ```
  const arr = [1, 2, 3];

  // 정상적인 배열 인덱스 접근
  console.log(arr?.[0]);  // 1
  console.log(arr?.[2]);  // 3

  // 존재하지 않는 인덱스에 접근할 때
  console.log(arr?.[5]);  // undefined (배열의 5번째 인덱스는 존재하지 않음)

  // 배열이 null일 때
  const nullArr = null;
  console.log(nullArr?.[0]);  // undefined (nullArr이 null이므로 오류 대신 undefined 반환)
  ```

### 3) 요약

- <b>옵셔널 체이닝 (?.)</b>은 객체나 배열이 null 또는 undefined일 때 속성이나 요소에 접근할 때 <b>오류를 방지</b>함.
- <b>널 병합 연산자 (??)</b>는 null이나 undefined일 경우 <b>기본값을 설정</b>하는 데 사용됨.
- `TypeError: cannot read property of null (reading 'd')`
  - null 값에서 속성에 접근하려고 할 때 발생하는 에러메시지
  - 예를 들어, c가 null이고 c.d를 호출하려고 할 때 발생함.
  - 주의할 점은 <b>c가 null</b>이라는 것임.
- 배열 인덱스에 옵셔널 체이닝을 적용할 때는 <b>대괄호에도 ?.\*\*</b>를 사용해야 하며, 이를 잘못 사용할 경우 문법 오류가 발생할 수 있음.
  - c가 null인 경우
  - `c?[0]`는 문법 오류 발생, `c?.[0]`는 undefined 반환
- `??`과 `?.`를 같이 사용하는 예시

  ```
  const users = [
  { name: "John", age: 25 },
  { name: "Alice", age: 30 },
  null
  ];

  // 옵셔널 체이닝과 널 병합 연산자 사용
  const firstUserName = users[0]?.name ?? "Guest";
  console.log(firstUserName); // "John" (첫 번째 배열 요소의 name 속성 접근)

  const thirdUserName = users[2]?.name ?? "Guest";
  console.log(thirdUserName); // "Guest" (세 번째 요소가 null이므로 기본값 "Guest" 반환)
  ```

---

## 프론트엔드 자바스크립트

> - AJAX (Asynchronous JavaScript and XML)
> - Axios 사용하기
> - formData
> - encodeURIComponent, decodeURIComponent
> - html에서 데이터 속성과 dataset

### 1. AJAX (Asynchronous Javascript and XML)

#### 1) AJAX란?

- 웹 페이지에서 비동기적으로 서버와 데이터를 주고 받는 기술
- 페이지 전체를 새로고침하지 않고도 서버에서 데이터를 받아와 화면의 일부분만을 업데이트할 수 있음.
- 효과: 사용자 경험 향상, 서버 부하 감소, 동적 콘텐츠 로딩 (무한 스크롤, 실시간 데이터 표시 등)
- 예시: 구글 검색 자동 완성, 쇼셜 미디어 피드, 채팅 애플리케이션, 지도 서비스

#### 2) 구현 방식

- XMLHttpRequest, Fetch API, Axios를 사용하여 서버와 비동기적으로 데이터를 주고 받음.
- JSON 형식으로 데이터를 주고받는 경우가 많음.

- <b>XMLHttpRequest</b>
  ![image](https://github.com/user-attachments/assets/f7eb9180-b8b7-4967-97c3-c82ac7cee571)
  `    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(JSON.parse(xhr.responseText));
        }
    };
    xhr.open('GET', 'https://api.example.com/data', true);
    xhr.send();
   `

- <b>Fetch API</b>

  ```
  fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  ```

- <b>Axios</b>
  ```
  axios.get('https://api.example.com/data')
      .then(response => console.log(response.data))
      .catch(error => console.error('Error:', error));
  ```

### 2. Axios 사용하기

#### 1) Fetch vs Axios 비교

| 기능                | Fetch                                       | Axios                                            |
| ------------------- | ------------------------------------------- | ------------------------------------------------ |
| **설치 필요 여부**  | 브라우저 내장 API, 설치 필요 없음           | 외부 라이브러리, 설치 필요 (`npm install axios`) |
| **기본 동작**       | 기본적으로 Promise 반환, 응답 파싱 필요     | 응답 자동 파싱 (JSON)                            |
| **요청 방식**       | `GET`, `POST`, `PUT`, `DELETE` 등 사용 가능 | `GET`, `POST`, `PUT`, `DELETE` 등 사용 가능      |
| **응답 파싱**       | `.json()`, `.text()` 메소드로 파싱 필요     | 응답 데이터는 자동으로 JSON으로 파싱             |
| **인터셉터**        | 수동으로 구현해야 함 (예: 요청/응답 수정)   | 내장된 인터셉터 기능 제공 (요청/응답 수정)       |
| **에러 처리**       | HTTP 오류 상태 코드에 대해 별도 처리 필요   | 자동으로 `catch` 블록에서 처리 가능              |
| **타임아웃 설정**   | 별도의 설정 없음                            | `timeout` 옵션으로 타임아웃 설정 가능            |
| **요청 취소 기능**  | 별도의 취소 기능 없음                       | `CancelToken`을 사용하여 요청 취소 가능          |
| **브라우저 호환성** | 최신 브라우저에서 기본적으로 지원           | 모든 브라우저 및 Node.js에서 동작                |
| **번들 사이즈**     | 가벼움 (내장 API 사용)                      | 상대적으로 큼 (라이브러리 크기 증가)             |

#### 2) Axios 사용 예시

![image](https://github.com/user-attachments/assets/9284aa5b-87a9-45d1-a823-3fbcbfc2ffcb)

- 브라우저 : html에 `<script src="https://unpkg.com/axios/dist/axios.min.js"></script>` 추가하기
- 노드 :
  - 터미널에서 `npm install axios` 입력
  - axios를 require해서 사용 `const axios = require('axios');`
- HTTP 메서드에 맞는 Axios 사용법
  - `axios.get(url)` → 데이터 조회
  - `axios.post(url, 데이터)` → 데이터 생성
  - `axios.delete(url)` → 데이터 삭제
  - `axios.put(url, 데이터)` → 데이터 전체 수정
  - `axios.patch(url, 데이터)` → 데이터 일부 수정
- GET 요청 예시
  ```
  axios.get('https://www.zerocho.com/api/get')
  .then((response) => {
      console.log(response.data); // 실제 데이터 출력
  })
  .catch((error) => {
      console.error(error);
  });
  ```
- POST 요청 예시
  ```
  axios.post('https://www.zerocho.com/api/post', {
  name: '제로초',
  age: 30
  })
  .then((response) => {
      console.log(response.data); // 응답 데이터 출력
  })
  .catch((error) => {
      console.error(error);
  });
  ```
- 비동기 처리 시 주의사항
  - 항상 에러 처리 (catch) 구문을 포함할 것
  - Promise 사용 시 반드시 catch 블록을 추가할 것

### 3. formData

- <b>FormData</b>
  - 주로 멀티파트 요청을 처리하기 위해 사용됨.
  - 특히, 이미지, 파일, 동영상과 같은 바이너리 데이터를 서버로 보내기 위한 방식
- **멀티파트 요청 (Multipart Request)**

  - HTTP 요청의 하나로, 여러 개의 데이터 조각을 하나의 요청으로 서버에 전송하는 방식

  ```
  const formData = new FormData();
  formData.append('image', file);  // file은 input[type="file"]에서 받은 파일
  formData.append('name', '제로초');

  axios.post('https://www.zerocho.com/api/upload', formData)
  .then((result) => {
      console.log(result.data);
  })
  .catch((error) => {
      console.error(error);
  });
  ```

### 4. encodeURIComponent, decodeURIComponent

#### 1) encodeURIComponent과 decodeURIComponent

- 원래 주소창에는 아스키 코드만 입력하는 것이 가장 안전함.
- 아스키 코드에는 한글이 포함되지 않으므로, 한글을 입력하면 오류가 발생하거나 무시될 수 있음.

  ```
  // 인코딩
  const encoded = encodeURIComponent('안녕하세요');
  console.log(encoded);  // '%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94'

  // 디코딩
  const decoded = decodeURIComponent('%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94');
  console.log(decoded);  // '안녕하세요'
  ```

#### 2) URL vs URI

- <b>URL(Uniform Resource Locator)</b>
  - 인터넷에서 웹 페이지, 이미지, 비디오 등 리소스의 위치를 가리키는 문자열
  - HTTP 맥락에서 URL은 "웹 주소" 또는 "링크"
  - 서버의 <b>파일 위치</b>를 나타냄
- <b>URI(Uniform Resource Identifier)</b>
  - 하나의 리소스를 가리키는 문자열
  - 서버의 <b>자원 위치</b>를 나타냄 <b>(현대에 더 많이 사용)</b>

### 5. html에서 데이터 속성과 dataset

- HTML 요소에 관련된 데이터를 저장하고(화면에 안 보임) 이를 동적으로 처리하거나 스타일링할 때 매우 유용함.
  - <b>HTML</b>: `data-` 속성을 사용해 추가적인 데이터를 HTML 태그에 저장함.
  - <b>JavaScript</b>: `dataset`을 사용해 데이터 속성에 접근하고 값을 읽거나 변경할 수 있음.
  - <b>CSS</b>: `attr() 함수`나 `속성 선택자`를 통해 데이터 속성 값을 스타일에 활용할 수 있음.
- 데이터 속성 사용 시 주의사항
  - 공개된 데이터만 저장해야 함
  - 누구나 접근 가능하므로 민감한 정보는 저장하지 말 것

#### 1) HTML에서 데이터 속성 정의하기

```
<article
  id="electric-cars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
  ...
</article>
```

#### 2) JavaScript에서 데이터 속성 접근하기

- 주의: `data-` 뒤의 속성명은 JavaScript에서 `camelCase 형태`로 변환됨. <i>(예: data-index-number → indexNumber)</i>

```
const article = document.querySelector("#electric-cars");

// dataset을 사용하여 데이터 속성에 접근
console.log(article.dataset.columns);        // "3"
console.log(article.dataset.indexNumber);   // "12314"
console.log(article.dataset.parent);         // "cars"

// 데이터 속성에 값을 설정
article.dataset.columns = "5";
```

#### 3) CSS에서 데이터 속성 사용하기

- attr() 함수로 데이터 속성 값 사용하기

  ```
  article::before {
  content: attr(data-parent);
  }
  ```

- 속성 선택자로 스타일 변경하기

  ```
  /* data-columns="3"인 경우 width를 400px로 설정 */
  article[data-columns="3"] {
  width: 400px;
  }

  /* data-columns="4"인 경우 width를 600px로 설정 */
  article[data-columns="4"] {
  width: 600px;
  }
  ```
