# exports와 module.exports

## 1. module.exports vs exports
- `module.exports`와 `exports`는 기본적으로 같은 객체를 가리킴. <br> `module.exports === exports === {}`
- 하지만 `exports`는 `module.exports`의 <b참조</b>일 뿐이기 때문에 `exports`만 사용하다가 `module.exports`를 변경하면 `exports`와 `module.exports`가 달라질 수 있음.

## 2. exports와 module.exports가 동일할 때
```
// var.js
const odd = "홀수입니다.";
const even = "짝수입니다.";

exports.odd = odd; 
exports.even = even;
```
- 이 코드에서 `exports`는 `module.exports`와 같은 객체를 가리키고 있음.
- `exports.odd`와 `exports.even`을 사용하면 결국 `module.exports`에 `{ odd, even }` 객체를 추가하는 것과 동일함.
- 결과적으로 `module.exports === exports === { odd, even }` 가 되어, 이 파일을 require하는 곳에서 { odd, even }을 가져올 수 있게 됨.

## 3. module.exports를 직접 할당할 때
```
// var.js
const odd = "홀수입니다.";
const even = "짝수입니다.";

module.exports = {
  odd,
  even
};
```
- 이 코드에서 `module.exports`에 직접 { odd, even } 객체를 할당했기 때문에, `exports`는 여전히 {}로 남아있고, `module.exports`는 { odd, even }로 변경됨.
- 따라서 이 파일을 require하면 { odd, even }을 가져오게 되지만, 이 방식은 exports를 변경한 것이 아니라 <b>module.exports 자체</b>를 교체한 것임.

## 4. module.exports와 exports의 차이점 (함수 예시)
```
// var.js
const odd = "홀수입니다.";
const even = "짝수입니다.";

module.exports = {
  odd,
  even,
};
```
```
// func.js
const { odd, even } = require("./var");

function checkOddOrEven(num) {
  if (num % 2) { 
    return odd;
  }
  return even;
}

module.exports = checkOddOrEven;
```
여기서 `module.exports`는 함수 checkOddOrEven으로 변경됨.
- `exports`는 여전히 {}로 존재하지만, `module.exports`는 함수로 교체되어 결국 `module.exports !== exports` 상태가 됨.
- 함수나 객체와 같은 <b>하나의 값을 내보내려면</b> `module.exports`를 사용하고, <b>여러 개의 값을 내보낼 때는</b> `exports`로 속성을 추가하거나 `module.exports`에 객체를 할당하는 방식으로 내보낸다.

## 5. exports와 module.exports의 관계 끊기
```
const odd = "홀수입니다.";
const even = "짝수입니다.";

exports.odd = odd;
exports.even = even;

module.exports = {};  // 이 시점에서 exports와 module.exports의 관계가 끊어짐
```
- 처음에는 `exports === module.exports === { odd, even }`
- 그 다음에는 `exports`는 여전히 `{ odd, even }`을 참조하고 있고, `module.exports`는 이제 `빈 객체 {}`를 참조`


