# 섹션14. CLI 프로그램 만들기

1. [CLI 프로그램 만들기](#cli-프로그램-만들기)
2. [Commander, Inquirer 사용하기](#commander-inquirer-사용하기)
3. [스스로 해보기](#스스로-해보기)
4. [핵심정리](#핵심-정리)

---

## CLI 프로그램 만들기

### 1. CLI vs GUI

- <b>CLI</b>: 명령줄 인터페이스, 텍스트 기반으로 프로그램을 실행
  - 예: 리눅스 셸, 브라우저 콘솔, 명령 프롬프트
- <b>GUI</b>: 그래픽 사용자 인터페이스, 시각적 요소로 프로그램을 실행
  - 예: 윈도우, 맥OS, 웹 애플리케이션

### 2. 개발자가 CLI를 선호하는 이유

- GUI 개발에 많은 시간이 소요됨
- 명령어 기반으로 빠른 작업 가능
- 자동화하기 쉬움

### 3. Node.js에서의 CLI 명령어 종류

```
# 기본 노드 명령어
node app.js        # 노드 설치 시 사용 가능

# npm 명령어
npm install        # 노드 설치 시 사용 가능

# 추가 설치 명령어
nodemon app.js     # npm install -g nodemon 후 사용 가능
rimraf folder      # npm install -g rimraf 후 사용 가능
```

### 4. CLI 프로그램 만들기 기본 예제

- `#!/usr/bin/env node`: 유닉스 계열 시스템에서 node로 실행하라는 표시
- `process.argv`: command line 인자를 담고 있는 배열
  - [0]: node 실행 경로
  - [1]: 실행된 파일 경로
  - [2] 이후: 실제 입력한 인자들
- bin 필드: package.json에서 CLI 명령어 이름을 지정
- 전역 설치(-g): 시스템 어디서나 명령어로 사용 가능

#### 1) 간단한 cli 프로그램 만들기

1. index.js 작성

```
#!/usr/bin/env node
console.log("Hello CLI", process.argv);
```

2. package.json에 추가

```
    "bin": {
        "cli":"./index.js"
    }
```

3. `npm i - g` : cli 명령어를 전역으로 설치하는 명령어
   - `package.json`이 수정되면 `npm i -g`로 다시 설치해줘야됨.
   - `npm rm -g` : 삭제
4. `npx cli` : npx가 cli라는 이름의 실행 가능한 프로그램을 찾아서 index.js를 실행하는 것

<details>
<summary><i>실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/1f4cd029-b072-4fee-91ad-9294bce721df)

![Image](https://github.com/user-attachments/assets/61678bfe-7307-4ca1-a28d-c7774aeaf33c)

</details>

- `npx cli one two three four`와 `node index.js one two three four`
  - `npx cli` : `package.json`의 bin 필드에 설정된 명령어를 사용
  - `node index.js` : `Node.js`로 직접 파일을 실행
- 결과적으로는 동일한 방식으로 `process.argv`에 인자들이 전달됨

<details>
<summary><i>npx cli one two three four</i></summary>

![Image](https://github.com/user-attachments/assets/5bded7c5-5f36-4d01-a31e-6b8e386e04f1)

</details>

#### 2) readline으로 사용자 입력 받기

```
#!/usr/bin/env node
console.log("Hello CLI", process.argv);

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("예제가 재미있습니까? (y/n)", (answer) => {
  if (answer === "y") {
    console.log("감사합니다!");
  } else if (answer === "n") {
    console.log("죄송합니다.");
  } else {
    console.log("y 또는 n만 입력하세요.");
  }
  rl.close();
});
```

<details>
<summary><i>실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/77d158b5-b251-44ef-8608-07a3cc21a4e9)

</details>

### 5. CLI 프로그램으로 템플릿 만들기

<details>
<summary><i>template.js 실행 결과</i></summary>

![Image](https://github.com/user-attachments/assets/fed10117-e9b5-4c61-b3c6-96bf8f45d7cb)

</details>

#### 1) 윈도우에서는 `dir` 명령어로 `cli`가 보이지 않는게 정상임.

- 강의에서는 `cli` 입력시 아래와 같이 나옴.
  ![Image](https://github.com/user-attachments/assets/7b66e59d-0726-4cba-8797-dc7c81e2c30a)
- 내 컴퓨터(윈도우)에서는 아래와 같이 나옴.
  ![Image](https://github.com/user-attachments/assets/959de918-1ee2-41b0-8162-86f9aad17307)

#### 2) 윈도우와 유닉스/리눅스 차이

- <b>Unix/Linux의 경우</b>
  - CLI 명령어들이 `/usr/local/bin` 같은 실제 디렉토리에 심볼릭 링크로 설치됨
  - ls 명령어로 확인 가능
- <b>Windows의 경우</b>
  - CLI 명령어들이 `%AppData%\npm` 폴더에 설치됨
  - 실제로는 `.cmd` 파일로 만들어짐
  - dir로는 직접 보이지 않음

#### 3) Windows에서 CLI 명령어 확인하는 방법

- 전역 설치된 패키지 확인

  ```
  npm ls -g
  ```

    <details>
    <summary><i>실행 결과</i></summary>

  ![Image](https://github.com/user-attachments/assets/51a8ad2a-0ed3-4361-b3ab-abfa84bbf625)

    </details>

- AppData\Roaming\npm 폴더 확인

  ```
  dir %AppData%\npm

  # PowerShell에서는 $env:APPDATA 사용
  dir "$env:APPDATA\npm"
  ```

    <details>
    <summary><i>실행 결과</i></summary>

  ![Image](https://github.com/user-attachments/assets/74ee2e67-8f28-48a5-9fdf-bcd872ac3865)

    </details>

---

## Commander, Inquirer 사용하기

### npm 패키지

```
npm i commander@9 inquirer@8 chalk
```
#### 1) Commander
- CLI 명령어 인터페이스 구축 도구
- 옵션, 버전, 도움말 등 편리한 CLI 구축
- 예: `program.option('-n, --name <name>', '설명')`

#### 2) Inquirer
- 대화형(Interactive) CLI 인터페이스 도구
- 질문/답변 형식의 깔끔한 인터페이스 제공
- list, checkbox, input 등 다양한 입력 방식

#### 3) Chalk
- CLI 텍스트 스타일링 도구
- 색상, 굵기, 밑줄 등 꾸미기 가능
- 예: `chalk.red('에러!'), chalk.green('성공!')`

### 프로그램 흐름
1. 명령어 인자 확인
2. 인자 부족 시 대화형 모드 시작
3. 템플릿 타입 확인 (html/express-router)
4. 파일명 입력 받기
5. 저장 경로 설정 (선택)
6. 템플릿 파일 생성

## 스스로 해보기
- 파일을 복사하는 명령어 만들어 보기
- 경로를 지정하면 하위의 모든 폴더와 파일을 지우는 명령어 만들어보기 (rimraf 패키지 참조)
- 데이터베이스와 연동해 가계부 만들어보기 (시퀄라이즈를 세팅하고 나서 실행 파일 첫 부분
예: sequelize. sync로 데이터베이스를 연동한 후 명령어를 수행하면 됨.)

## 핵심 정리
- 노드는 단순히 서버가 아니라 자바스크립트를 실행하는 타입. 이 장 에서는 콘솔에서 동작하는 CLI 프로그램을 만들었음.
- npm에는 서버를 위한 패키지뿐만 아니라 다양한 프로그램을 위한 패키지도 준비되어 있으므로 적극 활용
- 다른 사람이 사용할 것을 감안해 명령어에 대한 설명을 자세히 적어두자! 이렇게 하면 명령어를 잊어버렸을 경우 스스로에게도 도움이 됨.
- 프로그래머의 소양 중 하나는 DRY(Don't Repeat Yourself)(중복 배제)로, 간단한 프로그램만으로도 의미 없이 반복되는 단순 작업을 줄일 수 있음.
- CI 프로그램을 만드는 방법을 배웠으니, 프로그래밍을 할 때 반복되는 작업을 최소화하는 프로그램을 제작해보자.