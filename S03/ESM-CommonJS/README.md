# CommonJS vs ESM
- `ECMAScript 모듈`은 ES6 표준에 맞춘 모듈 시스템으로, import/export 문법, top level await, import.meta.url 등을 지원함. 하지만, 경로와 확장자 처리에 있어 더 엄격한 규격을 따름.
- `CommonJS`는 Node.js 환경에서 매우 유용하며, 확장자 생략, require()와 module.exports가 지원되는 등 유연성이 높음.

## 1. 모듈 불러오기 (Import)
### CommonJS (require)
- CommonJS
```
const { odd, even } = require('./var');
```
- ESM
```
import { odd, even } from './var.mjs';
```

## 2. 모듈 내보내기 (Export)
- module.exports와 export default는 1:1 대응 관계처럼 보일 수 있지만 실제로는 다름.

### CommonJS (module.exports)
- 하나의 객체, 함수 또는 값을 내보낼 때 사용함.
- module.exports로 내보냄. 

```
module.exports = { odd, even };
```

### ESM (export)
- <b>Named Export</b> : 여러 값을 이름을 지정해서 내보냄.
```
export const odd = '홀수입니다';
export const even = '짝수입니다';
```

- <b>Default Export</b> : 하나의 값을 기본값으로 내보냄.
```
export default checkOddOrEven;
```

## 3. 확장자 및 경로
- <b>CommonJS</b>
    - 확장자 생략 가능
    - 폴더 내 index.js 파일도 생략 가능
    ```
    require('./module'); // .js 생략 가능
    const myModule = require('./folder');  // index.js 파일을 자동으로 찾음
    ```
- <b>ESM</b>
    - 확장자 명시 필수
    - 폴더 내 index.js 파일도 생략 불가능
    ```
    import { something } from './module.js'; // .js 필수
    import { something } from './folder/index.mjs'; // index.mjs 파일을 명시해야 함
    ```

## 4. 다이내믹 임포트
- <b>CommonJS</b>
    - 즉시 실행 가능
    ```
    const a = require('./module');
    ```

- <b>ESM</b>
    - 다이내믹 임포트 (Promise 반환)
    ```
    import('./module.mjs').then(module => {
        console.log(module);
    });
    ```

## 5. Top Level Await 사용
- <b>CommonJS</b>
    - Top Level Await 불가능:
    ```
    const result = await someAsyncFunction(); // 에러 발생
    ```
- <b>ESM</b>
    - Top Level Await 가능:
    ```
    const result = await someAsyncFunction(); // 정상 실행
    ```

## 6. __filename, __dirname 사용
- <b>CommonJS</b>
    - __filename, __dirname 사용 가능:
    ```
    console.log(__filename); // 현재 파일의 절대 경로 출력
    ```

- <b>ESM</b>
    - import.meta.url 사용 (동일 기능):
    ```
    console.log(import.meta.url); // 현재 모듈의 URL 출력
    ```

## 7. 서로 간 호출 (CommonJS <-> ESM)
- <b>CommonJS -> ESM</b>
    - CommonJS 모듈을 ESM에서 가져올 때는 default로 가져와야 함:
    ```
    import checkOddOrEven from './func.cjs';  // .cjs 파일을 ESM에서 import
    ```
- <b>ESM -> CommonJS</b>
    - ESM 모듈을 CommonJS에서 가져올 때는 default가 아닌 require 사용:
    ```
    const { odd, even } = require('./var.mjs'); // ESM 모듈을 CommonJS에서 require
    ```