# 섹션5. 패키지 매니저

- [package.json](#packagejson)
- [node_modules, npx, SemVer](#node_modules-npx-semver)
- [npm 명령어들 알아보기](#npm-명령어들-알아보기)
- [npm 배포하기](#npm-배포하기)

---

## package.json

### 1. Node Package Manager (NPM)
- [npm 공식 문서](https://docs.npmjs.com/)
- npm은 <b>다른 사람들이 만든 소스 코드를 모아둔 저장소</b>
- 이미 구현된 기능을 재사용하여 프로그래밍을 효율적으로 할 수 있음.
- NPM은 오픈 소스 생태계를 구성하며, 다른 사람들의 코드를 사용하고 공유할 수 있음.

### 2. 패키지와 의존성
- <b>패키지</b>: NPM에 업로드된 노드 모듈
- <b>모듈 의존성</b>: 모듈이 다른 모듈을 사용할 수 있듯, 패키지 역시 다른 패키지에 의존할 수 있음. 이를 <b>의존 관계</b>라고 함.

### 3. package.json

#### 1) package.json 파일
- 현재 프로젝트에 대한 정보와 사용 중인 패키지에 대한 정보를 담은 파일
- 같은 패키지라도 버전별로 기능이 다를 수 있으므로 버전을 기록해두어야 함.
- 동일한 버전을 설치하지 않으면 문제가 생길 수 있음.
- 프로젝트 시작 시 `package.json` 생성
    - 프로젝트 폴더로 이동한 후 `npm init` 실행 혹은 `package.json` 파일 직접 생성

#### 2) package.json 속성
- `name`: 패키지 이름
- `version`: 패키지 버전
- `description`: 패키지 설명
- `main`: 자바스크립트 실행 파일 진입점. 보통 마지막으로 module.exports 하는 파일을 저장 (예: index.js)
- `scripts`: 터미널 명령어를 별명처럼 사용할 수 있게 설정 (예: test, start)
- `repository`: Git 저장소 주소
- `keywords`: 검색 시 유용한 키워드
- `author`: 작성자
- `license`: 라이선스 정보 (예: MIT, ISC)

#### 3) scripts
- package.json 파일의 scripts 섹션에 명령어를 등록하여 별명처럼 사용
    ```
    "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
    }
    ```
- `npm start`
    - start 명령어는 npm run start와 동일하지만, run을 생략할 수 있음. (start, test 등) 
    - npm start는 기본적으로 node index.js를 실행하는 명령어
- `npm test`
    - test 명령어는 기본적으로 "test" 스크립트가 정의되어 있지 않으면 "Error: no test specified"와 함께 종료됨.

#### 4) 라이선스 종류
- <b>MIT, ISC, BSD</b>: 패키지 사용 시, 해당 라이선스만 밝히면 자유롭게 사용할 수 있음.
- <b>Apache</b>: 사용은 자유로우나 특허권에 대한 제한이 있을 수 있음.
- <b>GPL</b>: GPL 라이선스를 사용하는 패키지를 포함하는 경우, 자신도 GPL로 소스 코드를 공개해야 함.

### 4. npm vs yarn, pnpm
- `npm`: 기본적인 패키지 관리 도구, 프로젝트에서 패키지를 관리하고 설치하는 데 사용
- `yarn, pnpm`: npm보다 성능과 편리성이 개선된 패키지 관리 도구
    - `yarn`: 병렬 설치를 지원하고 캐시를 활용하여 성능을 개선
    - `pnpm`: 하드 링크를 사용하여 디스크 공간을 절약하고 더 빠른 설치를 제공

### 5. npm i vs npm ci
- [stackoverflow - npm i vs npm ci](https://stackoverflow.com/questions/52499617/what-is-the-difference-between-npm-install-and-npm-ci)

#### npm i
- `package.json`에 정의된 패키지를 설치
- 패키지의 최신 버전이나 버전 범위에 맞춰 설치
- 폐쇄망 환경에서는 인터넷에 연결되지 않기 때문에 npm i 명령어로 패키지를 설치할 수 없음.
    - 이 경우, node_modules 폴더를 직접 복사하거나 프록시 서버를 설정하여 패키지를 설치
#### npm ci
- CI(지속적 통합) 환경에서 안정적인 설치를 보장
- `package-lock.json` 파일을 사용하여 정확한 버전을 설치하며, 빠르고 예측 가능한 설치 환경을 제공
- npm ci는 설치 시 <b>`node_modules` 폴더를 완전히 지우고</b> 새로 설치함. 따라서 깨끗한 환경에서 설치가 이루어짐.
#### 결론
- `npm i` : 의존성 추가 및 업데이트, 개발 중에 사용
- `npm ci` : CI/CD, 자동화된 빌드 및 테스트 환경에서 사용

### 6. npm audit (취약점 검사)
- `npm audit`
- 패키지의 보안 취약점을 검사
    - 취약점이 발견되면 취약점 심각도와 함께 경고 메시지가 출력
    - `found 0 vulnerabilities`

### 7. peerDependencies와 dependencies
#### dependencies
- 배포 환경에서도 필요한 패키지를 명시
- 예: npm install <패키지 이름>으로 설치된 패키지
#### devDependencies
- 개발 환경에서만 필요한 패키지를 명시
- 예: nodemon, webpack, babel 등 개발 시 사용되는 도구들
#### PeerDependencies
- 다른 패키지가 특정 버전의 패키지를 요구할 때 사용됨.
- 예를 들어, 패키지 A는 jQuery 3을 요구하고, 패키지 B는 jQuery 2를 요구할 수 있음.
- 이 경우, 버전 충돌이 발생할 수 있으며, `npm i --force` 또는 `npm i --legacy-peer-deps`(peerDependencies를 무시하고 설치)로 해결할 수 있음.

### 8. npm에서 패키지 수정하기 (patch-package)
- <b>patch-package</b> : node_modules 내부의 패키지를 수정하고, 그 수정 사항을 영구적으로 반영하려면 patch-package를 사용함.
- 설치 및 설정
    ```
    npm install patch-package
    ```
    - 수정할 패키지를 수정한 후, `npx patch-package [패키지 이름]`을 실행하면 patches 폴더에 패치 파일이 생성됨.
    - `npm i` 후에도 수정 사항이 적용되도록 설정할 수 있음.
- 예시 (package.json 설정):
    ```
    "scripts": {
    "postinstall": "patch-package"
    }
    ```

---

## node_modules, npx, SemVer

### 1. node_modules

#### node_modules 디렉토리
- 프로젝트에서 사용하는 모든 패키지를 설치한 디렉토리
- 설치한 직접적인 패키지뿐만 아니라, <b>이 패키지들이 의존하는 연관된 패키지도</b> 모두 포함됨.
- 이 폴더는 용량이 크고, 많은 디스크 공간을 차지할 수 있기 때문에, <b>배포 시에는 보통 제외</b>하고, `package.json`과 `package-lock.json`파일만 배포함.

### 2. npx
- npx는 <b>Node Package Execute</b>의 약자로, npm 패키지를 실행할 때 사용됨.
- npx는 <b>전역(global) 설치 없이도</b> 로컬 패키지나 한 번만 실행할 패키지를 간편하게 실행할 수 있게 도와줌.
    - `npx rimraf node_modules` : 디렉토리와 파일을 삭제하는 명령어

#### 1) 글로벌 설치 vs 로컬 설치 
- <b>글로벌 설치 (npm i - g)</b>
    - 패키지를 <b>시스템 전체에서</b> 사용할 수 있게 설치하는 방법
    - 프로젝트별로 사용되는 패키지가 아니라 시스템 전체에 설치되므로, `package.json`에 기록되지 않아 의존성 관리가 어려움.
- <b>로컬 설치 (npm i -D)</b>
    - 프로젝트 내부에서만 사용하는 패키지를 설치
    - `package.json`의 `devDependencies`에 기록되어, 의존성 관리가 용이
        - `npm i -D`: 간단한 축약형
        - `npm i --save-dev`: 구식 옵션, npm 5.x 이후부터는 --save-dev 옵션이 기본적으로 활성화

#### 2) 글로벌 설치의 단점과 npx 사용 이유
- 패키지가 글로벌로 설치되면, 해당 패키지가 프로젝트의 의존성 목록에 포함되지 않아서 나중에 다른 개발자가 동일한 패키지를 사용하려면 다시 설치해야할 수 있음.<br> => `npx`를 사용

### 3. SemVer
- 노드의 패키지 버전은 <b>SemVer(Semantic Versioning 유의적 버저닝) 방식</b>을 따름.
- Major(주 버전), Minor(부 버전), Patch(수 버전)
- 버전을 배포한 후, 해당 버전의 내용을 수정할 수 없음. 
- 수정 사항이 있을 경우 적절한 버전 번호(Major, Minor, Patch)를 올려서 새로운 버전으로 배포해야 함.

#### 1) SemVer 규칙
- <b>Major (주 버전)</b>
    - 하위 버전과 호환되지 않는 수정 사항이 생겼을 때 버전 번호를 올림
    - 메이저 버전이 0이면 초기 개발 중, 1이면 정식버전
    - <i>예: 1.x.x → 2.0.0 (호환성 깨짐)</i>
- <b>Minor (부 버전)</b>
    - 하위 버전과 호환되지만 기능이 추가된 수정 사항이 있을 때 버전 번호를 올림
    - <i>예: 1.1.x → 1.2.0 (새로운 기능 추가)</i>
- <b>Patch (수 버전)</b>
    - 버그 수정과 같은 하위 호환되는 수정 사항이 있을 때 버전 번호를 올림
    - <i>예: 1.1.1 → 1.1.2 (버그 수정)</i>

    ![image](https://github.com/user-attachments/assets/d60d1ef8-b042-47ce-85c5-858275bf7416)
    - 출처 : [Node.js 교과서](https://thebook.io/080334/0246/)

#### 2) 버전 관리 기호

| 기호      | 설명                                  | 예시                                | 설치되는 버전 범위                     |
|-----------|---------------------------------------|-------------------------------------|---------------------------------------|
| `^`       | 마이너 버전까지 업데이트             | `npm install express@^1.1.1`        | 1.1.1 이상, 2.0.0 미만                |
| `~`       | 패치 버전까지 업데이트               | `npm install express@~1.1.1`        | 1.1.1 이상, 1.2.0 미만                |
| `>`       | 초과                                  | `npm install express@>1.1.1`        | 1.1.1보다 큰 버전                     |
| `<`       | 미만                                  | `npm install express@<1.1.1`        | 1.1.1보다 작은 버전                   |
| `>=`      | 이상                                  | `npm install express@>=1.1.1`       | 1.1.1 이상                            |
| `<=`      | 이하                                  | `npm install express@<=1.1.1`       | 1.1.1 이하                            |
| `=`       | 동일                                  | `npm install express@=1.1.1`        | 정확히 1.1.1 버전                     |
| `@latest` | 최신 안정 버전                       | `npm install express@latest`        | 최신 안정 버전                       |
| `@next`   | 가장 최근 배포판(알파, 베타, RC 포함) | `npm install express@next`          | 최신 알파, 베타, RC 버전 포함        |

---

## npm 명령어들 알아보기

| 명령어                            | 설명                                                                 |
|----------------------------------|----------------------------------------------------------------------|
| `npm update`                     | `package.json`에 맞춰 의존성 패키지를 업데이트                       |
| `npm version [버전 \| major \| minor \| patch]` | `package.json`의 버전을 업데이트 (예: `npm version major`는 major 버전 증가) <br>자동으로 Git 커밋과 태그 생성 |
| `npm deprecate [패키지 이름] [버전] [메시지]` | 패키지를 더 이상 사용하지 말라고 경고 메시지를 띄움                  |
| `npm ls`                         | 현재 프로젝트에서 설치된 패키지와 의존성 트리를 확인                |
| `npm outdated`                   | 설치된 패키지가 업데이트가 필요한지 확인 `Current`와 `Wanted` 버전 비교 |
| `npm update [패키지 이름]`       | 특정 패키지를 업데이트 <br>  업데이트 가능한 모든 패키지가 Wanted에 적힌 버전으로 업데이트                                               |
| `npm uninstall [패키지 이름]` 또는 `npm rm [패키지 이름]` | 패키지를 제거하고, `node_modules`와 `package.json`에서 삭제       |
| `npm search [검색어]`            | 패키지를 검색 (예: `npm search express`)                              |
| `npm info [패키지 이름]`         | 패키지의 세부 정보를 출력 (버전, 의존성 등)                          |
| `npm login`                      | npm에 로그인하여 패키지를 배포할 수 있는 상태로 만듦                  |
| `npm whoami`                     | 현재 로그인한 사용자를 확인                                         |
| `npm logout`                     | 로그인 상태를 로그아웃 처리                                           |
| `npm publish`                    | 자신이 만든 패키지를 npm에 배포                                       |
| `npm unpublish`                  | 배포한 패키지를 삭제 (24시간 이내에 배포한 패키지만 제거 가능)                          |

---

## npm 배포하기

### 1. npm publish (배포할 패키지 이름)
- 패키지를 NPM에 배포
- <b>403</b>: 이미 동일한 이름의 패키지가 존재함.

<details>
<summary><i>실행 결과 - 403</i></summary>

![image](https://github.com/user-attachments/assets/69651d78-be1c-414c-aac2-63ee4376df2c)

</details>
<details>
<summary><i>실행 결과 - 정상 배포</i></summary>

![image](https://github.com/user-attachments/assets/a513b688-4f09-45f8-be8f-a83bd4bffc83)

</details>

### 2. npm info (배포한 패키지 이름)
- 패키지 정보를 조회 (배포된 패키지 정보 확인)
- <b>404</b>: 해당 패키지가 NPM에 존재하지 않음.
- <b>400</b>: 요청이 잘못되었을 때 나타나는 오류

<details>
<summary><i>실행 결과</i></summary>

![image](https://github.com/user-attachments/assets/0cc8720f-52a6-43cb-8ddc-cfdfae1f3992)

</details>


### 3. npm unpublish --force (배포한 패키지 이름) 
- 배포된 패키지를 NPM에서 강제로 삭제

<details>
<summary><i>실행 결과</i></summary>

![image](https://github.com/user-attachments/assets/d23c9f73-0ea0-42a4-9c42-a9c00fdeae64)

</details>
