# this
- 자바스크립트에서 현재 실행 중인 코드의 컨텍스트를 참조하는 특별한 객체
- 자바스크립트에서 실행되는 코드가 여러 상황에 따라 다르게 동작할 수 있는데, this는 코드가 실행되는 문맥에 따라 어떤 객체를 참조할지 결정함.
    - <b>전역에서</b>: this는 전역 객체(브라우저에서는 window, Node.js에서는 global)
    - <b>일반 함수 호출</b>: this는 undefined (엄격 모드에서는) 또는 전역 객체
    - <b>객체 메서드 호출</b>: this는 그 메서드를 호출한 객체
    - <b>생성자 함수</b>: this는 새로 생성된 객체
    - <b>화살표 함수</b>: this는 상위 스코프의 this를 그대로 사용
```
// 전역에서
console.log(this); // window (브라우저 환경)

// 객체에서
const obj = {
  name: "Alice",
  greet: function() {
    console.log(this.name); // "Alice"
  }
};
obj.greet();

// 화살표 함수에서
const obj2 = {
  name: "Bob",
  greet: () => {
    console.log(this.name); // undefined, 상위 스코프의 this
  }
};
obj2.greet();
```