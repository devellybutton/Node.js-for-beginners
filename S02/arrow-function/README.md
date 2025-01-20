# 화살표 함수(Arrow Function)와 일반 함수(Function) 간의 차이

> 1. [this: 부모 스코프의 this vs 자체 this](#1-this-부모-스코프의-this-vs-자체-this)
> 2. [arguments: 없음 vs 있음](#2-arguments-없음-vs-있음)
> 3. [constructor: 사용 불가 vs 사용 가능](#3-constructor-사용-불가-vs-사용-가능)
> 4. [prototype: 없음 vs 있음](#4-prototype-없음-vs-있음)
> 5. [super: 없음 vs 있음](#5-super-없음-vs-있음)
> 6. [new.target: 없음 vs 있음](#6-newtarget-없음-vs-있음)

---

## 1. this: 부모 스코프의 this vs 자체 this

- 화살표 함수는 자체적인 this를 가지지 않고, 부모 스코프의 this를 참조함. 즉, this의 값은 함수가 정의된 위치에 따라 결정됨.
- 일반 함수는 호출된 문맥에 따라 this가 달라지며, 객체에서 호출할 때 this는 그 객체를 가리킴.
- 예시: 이벤트 핸들러에서의 this 차이
    ```
    function Parent() {
    this.value = 42;

    // 일반 함수
    this.regularFunc = function() {
        setTimeout(function() {
        console.log(this.value);  // 'this'는 setTimeout의 컨텍스트를 참조 (전역 객체 또는 undefined)
        }, 1000);
    };
    }

    const obj = new Parent();
    obj.regularFunc();  // undefined 또는 전역 객체 (브라우저에서는 window 객체) 출력
    ```
    - setTimeout 안의 일반 함수에서 this는 setTimeout 함수의 컨텍스트를 가리킴. 
    - 이는 setTimeout이 전역 컨텍스트에서 실행되기 때문에, 그 안에서 this는 window 객체(브라우저 환경에서)나 undefined를 참조하는 것임.
    - 그래서 this.value가 undefined가 출력되거나, 브라우저에서는 window.value가 출력될 수 있음.

    ```
    function Parent() {
    this.value = 42;

    // 화살표 함수
    this.arrowFunc = function() {
        setTimeout(() => {
        console.log(this.value);  // 화살표 함수는 부모 스코프인 Parent의 'this'를 참조
        }, 1000);
    };
    }

    const obj = new Parent();
    obj.arrowFunc();  // 42 출력
    ```
    - setTimeout 안에서 화살표 함수를 사용하면, 화살표 함수는 부모 스코프인 Parent의 this를 그대로 참조함.
    - 즉, this.value는 Parent 객체의 value 값을 가리키게 되어, 42가 정상적으로 출력됨.

---

## 2. arguments: 없음 vs 있음
- 일반 함수는 arguments 객체가 제공되며, 함수 호출 시 전달된 인수들을 배열 형태로 받음.
- 화살표 함수는 arguments 객체를 사용할 수 없으며, 대신 부모 스코프의 arguments를 참조하려면 부모 함수 내에서 화살표 함수를 사용해야 함.
    ```
    function normalFunc() {
    console.log(arguments);  // arguments 객체 존재
    }

    const arrowFunc = () => {
    console.log(arguments);  // 에러: arguments 객체 없음
    };

    normalFunc(1, 2, 3);  // [1, 2, 3]
    arrowFunc(1, 2, 3);    // ReferenceError: arguments is not defined
    ```
---

## 3. constructor: 사용 불가 vs 사용 가능
- 화살표 함수는 생성자 함수로 사용될 수 없고, new 키워드를 사용할 수 없음.
- 일반 함수는 new 키워드를 사용하여 객체를 생성할 수 있음.
    ```
    const ArrowFunc = () => {};
    const obj = new ArrowFunc();  // TypeError: ArrowFunc is not a constructor
    ```
    ```
    function RegularFunc() {
    this.value = 42;
    }
    const obj = new RegularFunc();  // obj.value === 42
    ```
---

## 4. prototype: 없음 vs 있음

- 화살표 함수는 prototype을 가질 수 없으므로, 객체 지향적인 방법으로는 사용할 수 없음.
- 일반 함수는 prototype을 가지므로, 인스턴스 객체에 메서드를 추가할 수 있음.
    ```
    const arrowFunc = () => {};
    console.log(arrowFunc.prototype);  // undefined
    ```
    ```
    function regularFunc() {}
    console.log(regularFunc.prototype);  // {constructor: ƒ}
    ```
---

## 5. super: 없음 vs 있음
- 화살표 함수는 super를 사용할 수 없음.
- 일반 함수는 클래스에서 부모 클래스의 메서드를 호출할 때 super을 사용할 수 있음.
    ```
    class Parent {
    sayHello() {
        console.log('Hello from Parent');
    }
    }

    class Child extends Parent {
    constructor() {
        super();
    }
    // 화살표 함수는 super를 사용할 수 없음
    arrowFunc = () => {
        super.sayHello();  // Error: super is not defined
    };
    }

    const child = new Child();
    child.arrowFunc();
    ```
    ```
    class Parent {
    sayHello() {
        console.log('Hello from Parent');
    }
    }

    class Child extends Parent {
    constructor() {
        super();
    }
    regularFunc() {
        super.sayHello();  // 'Hello from Parent'
    }
    }

    const child = new Child();
    child.regularFunc();
    ```

---

## 6. new.target: 없음 vs 있음
- new.target은 함수가 new 키워드로 호출되었을 때, 그 함수가 생성자 함수인지를 확인하는 데 사용
- 화살표 함수는 new.target을 사용할 수 없음.
- 일반 함수는 생성자 함수로 호출될 때 new.target을 사용할 수 있음.
    ```
    const arrowFunc = () => {
    console.log(new.target);  // undefined
    };

    new arrowFunc();  // undefined
    ```
    ```
    function regularFunc() {
    console.log(new.target);  // function regularFunc
    }

    new regularFunc();  // function regularFunc
    ```