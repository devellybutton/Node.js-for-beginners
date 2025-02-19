# 파일 경로 주의사항 
```
프로젝트 구조:
/project
  /src
    /utils
      reader.js
  data.txt
```
- 이런 구조에서:
    ```
    // /project/src/utils/reader.js
    const fs = require('fs');

    // ❌ 잘못된 방법
    fs.readFile('./data.txt', (err, data) => {
    // 실패! 
    // /project/src/utils/data.txt를 찾으려고 함
    });

    // ✅ 올바른 방법
    fs.readFile('../../data.txt', (err, data) => {
    // 성공!
    // 상위 디렉토리로 올라가서 /project/data.txt를 찾음
    });
    ```
- 실행 위치에 따른 차이:
    ```
    # 1. /project 디렉토리에서 실행할 경우
    $ node src/utils/reader.js
    # => 이때는 ./data.txt로 접근 가능

    # 2. /project/src/utils 디렉토리에서 실행할 경우
    $ node reader.js
    # => 이때는 ../../data.txt로 접근해야 함
    ```

- 따라서 실행 위치에 관계없이 안정적으로 파일을 읽으려면:
1. 절대 경로 사용
2. `path` 모듈 사용
    ```
    const path = require('path');

    fs.readFile(path.join(__dirname, '../../data.txt'), (err, data) => {
    // __dirname: 현재 실행 중인 파일의 디렉토리 경로
    // 실행 위치와 관계없이 항상 올바른 경로 참조
    });
    ```