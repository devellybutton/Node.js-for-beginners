# 태스크 큐의 두 종류

| 구분 | 매크로태스크 큐 | 마이크로태스크 큐 |
|-------|-------|-------|
| 다른 이름   | - 이벤트 큐 <br> - 콜백 큐   | 잡 큐   |
| 포함되는 작업  | - setTimeout<br>- setInterval<br>- setImmediate<br>- I/O 작업<br>- UI 렌더링<br> - addEventListener  | - Promise<br>- process.nextTick<br>- queueMicrotask<br>- MutationObserver   |
| 실행 우선 순위   | 2순위   | 1순위   |

### 실행 우선순위:
1. 마이크로태스크 큐가 먼저 실행
2. 마이크로태스크 큐가 비면 매크로태스크 큐 실행