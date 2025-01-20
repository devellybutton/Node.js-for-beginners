# 호출 스택 실행 순서

```
function first() {
    second();
    console.log("첫 번째");
}
function second() {
    third();
    console.log("두 번째");
}
function third() {
    console.log("세 번째");
}
first();
```

## 초기화 단계

1. `전역 실행 컨텍스트(anonymous)`가 호출 스택의 맨 밑에 생성됨
2. `first` 함수가 메모리에 선언됨
3. `second` 함수가 메모리에 선언됨
4. `third` 함수가 메모리에 선언됨

## 실행 단계

1. `first()` 호출 → 호출 스택에 `first` 추가  
2. `first` 내부에서 `second()` 호출 → 호출 스택에 `second` 추가  
3. `second` 내부에서 `third()` 호출 → 호출 스택에 `third` 추가  
4. `third` 내부의 `console.log("세 번째")` 실행  
5. `third` 함수 종료 → 호출 스택에서 `third` 제거  
6. `second` 내부의 `console.log("두 번째")` 실행  
7. `second` 함수 종료 → 호출 스택에서 `second` 제거  
8. `first` 내부의 `console.log("첫 번째")` 실행  
9. `first` 함수 종료 → 호출 스택에서 `first` 제거  
10. 전역 실행 컨텍스트 종료

## 콘솔 출력 결과
```
세 번째
두 번째
첫 번째
```