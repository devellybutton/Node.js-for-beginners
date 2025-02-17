# CommonJS 모듈 사용 예시
- module.exports로 값을 내보내고, require로 값을 가져와 사용함.

![image](https://github.com/user-attachments/assets/5d7d73b6-7808-483a-80ae-8cc973a57593)

## 1. 모듈 내보내기
### 객체로 내보내기
- 여러 값을 내보낼 때 객체 형태로 내보내는 것이 일반적
```
// var.js
const odd = "홀수입니다.";
const even = "짝수입니다.";

module.exports = { odd, even };
```
```
// func.js
const value = require("./var");
console.log(value);
// { odd: '홀수입니다.', even: '짝수입니다.' }
```
### 배열로 내보내기
- 배열로도 내보낼 수 있지만, 객체로 내보내는 게 더 일반적
```
// var.js
const odd = "홀수입니다.";
const even = "짝수입니다.";

module.exports = [odd, even];
```
```
// func.js
const value = require("./var");
console.log(value);
// [ '홀수입니다.', '짝수입니다.' ]
```

## 2. 구조 분해 할당
- 내보낸 값을 구조 분해 할당을 통해 쉽게 가져올 수 있음.
```
// var.js
const odd = "홀수입니다.";
const even = "짝수입니다.";

module.exports = { odd, even };
```
```
// func.js
const { odd, even } = require("./var");
console.log(odd, even);
// "홀수입니다.", "짝수입니다."
```

## 3. 함수와 값 내보내기
- 함수도 `module.exports'로 내보낼 수 있고, 여러 값을 내보낼 때는 객체를 활용함.
```
// var.js
const odd = "홀수입니다.";
const even = "짝수입니다.";

function checkOddOrEven(num) {
  if (num % 2) { 
    return odd;
  }
  return even;
}

module.exports = { checkOddOrEven, odd, even };
```
```
// func.js
const { odd, even, checkOddOrEven } = require("./var");

console.log(checkOddOrEven(10)); // "짝수입니다."
console.log(checkOddOrEven(15)); // "홀수입니다."
```
## 4. index.js (애플리케이션 진입점)
- 모듈을 불러올 때는 변수명은 자유롭게 지정할 수 있음.
- 구조 분해 할당을 사용하여 모듈에서 필요한 값만 쉽게 가져올 수 있음.
- 구조 분해 할당할 때는 모듈에서 <b>내보낸 속성명(객체의 프로퍼티명)</b>과 <b>변수명</b>이 같아야 함.
```
const { odd, even } = require('./var');
const checkNumber = require('./var'); 

function checkStringOddOrEven(str) {
  if (str.length % 2) { 
    return odd;
  }
  return even;
}

console.log(checkNumber(10));
console.log(checkStringOddOrEven('hello'));
```
## 5. 주의사항
- `module.exports`는 파일에서 한 번만 사용해야 함.
-  여러 번 사용하면 마지막에 할당된 값만 내보냄.
```
module.exports = { odd, even }; // 첫 번째 할당
module.exports = checkOddOrEven; // 두 번째 할당, 첫 번째 할당은 덮어짐
```