
# 비동기 함수(setTimeout)와 호출 스택, 이벤트 루프 동작 과정
```
function run() {
    console.log("3초 후 실행")
}
console.log("시작")
setTimeout(run, 3000);
console.log("끝")
```

1. 전역 실행 컨텍스트(anonymous)가 호출 스택의 맨 밑에 생성됨  
2. `run` 함수가 메모리에 선언됨  
3. `console.log("시작")`이 호출 스택에 추가됨  
4. `"시작"`이 콘솔에 출력됨  
5. `console.log("시작")`이 호출 스택에서 제거됨  
6. `setTimeout(run, 3000)`이 호출 스택에 추가됨  
7. `setTimeout`이 비동기 함수이므로 타이머(run, 3초)가 백그라운드로 이동됨  
8. `setTimeout`이 호출 스택에서 제거됨  
9. `console.log("끝")`이 호출 스택에 추가됨 (이때 백그라운드에서는 타이머가 계속 동작 중)  
10. `"끝"`이 콘솔에 출력됨  
11. `console.log("끝")`이 호출 스택에서 제거됨  
12. 전역 실행 컨텍스트(anonymous)가 호출 스택에서 제거됨  
13. 3초가 지나면 백그라운드의 타이머가 완료되고, `run` 함수가 태스크 큐로 이동됨  
14. 이벤트 루프가 호출 스택이 비어있음을 확인  
15. 이벤트 루프가 태스크 큐의 `run` 함수를 호출 스택으로 이동시킴  
16. `run` 함수가 실행되면서 `console.log('3초 후 실행')`이 호출 스택에 추가됨  
17. `"3초 후 실행"`이 콘솔에 출력됨  
18. `console.log('3초 후 실행')`이 호출 스택에서 제거됨  
19. `run` 함수가 호출 스택에서 제거됨

## 콘솔 출력 결과
```
시작
끝
3초 후 실행
```

---

# Promise와 타이머가 포함된 비동기 실행 순서

```
function oneMore() {
    console.log('one more');
}
function run() {
    console.log('run run');
    setTimeout(() => {
        console.log('wow', 0)
    })
    new Promise((resolve) => {
        resolve('hi');
    })
    .then(console.log);
    oneMore();
}
setTimeout(run, 5000);
```

## 초기 설정 단계

1. 전역 실행 컨텍스트(anonymous)가 호출 스택에 생성  
2. `oneMore` 함수가 메모리에 선언  
3. `run` 함수가 메모리에 선언  
4. `setTimeout(run, 5000)`이 호출 스택에 추가  
5. `setTimeout`이 호출 스택에서 제거되며 백그라운드로 타이머(run, 5초) 이동  
6. 전역 실행 컨텍스트 종료  

## 5초 후 실행 단계

7. 백그라운드의 타이머(5초)가 완료되어 `run` 함수가 태스크 큐로 이동  
8. 이벤트 루프가 호출 스택이 비어있음을 확인하고 `run` 함수를 호출 스택으로 이동  
9. `console.log('run run')`이 호출 스택에 추가되고 실행  
10. `console.log('run run')`이 호출 스택에서 제거  
11. `setTimeout(익명함수, 0)`이 호출 스택에 추가  
12. `setTimeout`이 호출 스택에서 제거되며 백그라운드로 타이머(익명함수, 0초) 이동  
13. `new Promise` 실행이 호출 스택에 추가  
14. `Promise` 생성자 내부의 `resolve('hi')`가 즉시 실행 (동기적 실행)  
15. `then`을 만나는 순간 비동기 작업으로 전환되어 백그라운드로 이동  
16. `oneMore` 함수가 호출 스택에 추가  
17. `console.log('one more')`가 실행되고 출력  
18. `oneMore` 함수가 호출 스택에서 제거  
19. `run` 함수가 호출 스택에서 제거  

## 마이크로태스크와 태스크 큐 처리

20. 백그라운드의 타이머(0초)가 완료되어 익명함수를 태스크 큐로 이동  
21. `Promise`의 `then`이 마이크로태스크 큐로 이동  
22. 이벤트 루프가 마이크로태스크 큐의 `console.log('hi')`를 우선 처리  
23. `hi` 출력  
24. 이후 태스크 큐의 익명함수 처리  
25. `wow` 출력

## 콘솔 출력 결과
```
run run
one more
hi
wow
```

---

# 포인트

1. Promise의 then 우선순위
    - `Promise`의 `then`은 `setTimeout`보다 우선 실행된다.
    - `setTimeout(0)`이 있어도, Promise의 비동기 처리가 먼저 태스크 큐에 들어가 실행된다.

2. 태스크 큐의 실행 순서
    - 태스크 큐에 여러 작업이 있으면, 먼저 끝나는 작업이 먼저 실행된다.
    - `Promise`의 `then`이 `setTimeout`보다 먼저 실행된다.

3. setTimeout과 Promise의 처리 방식
    - `setTimeout`은 타이머로 백그라운드에서 동작하고, `Promise`는 비동기 처리로, Promise가 우선 실행된다.

4. 이벤트 루프와 태스크 큐
    - 이벤트 루프는 호출 스택이 비어있을 때, 태스크 큐에서 작업을 하나씩 꺼내 실행한다.
    - `Promise`의 `then`은 항상 `setTimeout`보다 먼저 처리된다.

5. Promise의 실행 과정
    - `Promise`의 실행은 동기적으로 시작되지만, `then`을 만나는 순간 비동기적으로 동작한다.
    - `resolve`가 호출되면 즉시 실행되지만 그 후의 then은 비동기적으로 실행된다.

- 예시:
    - `Promise`가 실행되면 먼저 `resolve('hi')`가 호출된다. 이때 <b>동기적으로</b> 실행된다.
    - `resolve('hi')`가 호출 스택에 쌓여 실행된다.
    - `resolve('hi')`가 호출 스택에서 제거된다.
    - 그 후 `then()`이 <b>비동기적으로</b> 처리되어 태스크 큐로 이동한다.

---

# 결론
- `Promise`의 `then()`은 `setTimeout`보다 우선순위가 높다
- `resolve()`는 <b>동기적</b>으로 실행되지만, `then()`은 <b>비동기적</b>으로 실행된다.
- 태스크 큐에서 먼저 끝나는 작업이 먼저 실행되지만, `Promise`는 <b>우선 처리</b>된다.