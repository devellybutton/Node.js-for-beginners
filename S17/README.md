# 섹션17. 타입스크립트로 전환해보기

1. [타입스크립트 기본 문법 익히기](#타입스크립트-기본-문법-익히기)
2. [타입스크립트 추가 문법 + 노드 타이핑하기](#타입스크립트-추가-문법--노드-타이핑하기)
3. [커뮤니티 타입 정의 적용하기](#커뮤니티-타입-정의-적용하기)
4. [라이브러리 코드 타이핑하기](#라이브러리-코드-타이핑하기)
5. [내가 만든 파일 타입스크립트로 전환하기](#내가-만든-파일-타입스크립트로-전환하기)

---

## 타입스크립트 기본 문법 익히기

### 1. 타입스크립트 기본 개념 및 실행 환경
- 타입스크립트 코드는 tsc 컴파일러를 통해 자바스크립트로 변환됨.
- Node.js는 자바스크립트만 실행할 수 있어 타입스크립트를 변환해야 함.
- Deno는 타입스크립트를 직접 실행할 수 있는 런타임이지만, 대중적으로는 node.js와 타입스크립트 조합이 더 많이 사용됨.
- `typescript` 패키지 설치 시 tsc 컴파일러가 함께 설치됨.

### 2. 타입스크립트 프로젝트 설정 및 실행 순서
- 프로젝트 초기화
```
npm init -y
```
- 타입스크립트 설치
```
npm i typescript
```
- `tsconfig.json` 생성
```
npx tsc --init
```
- tsconfig.json 주요 설정
    - `target`: es2015
    - `module`: commonjs
    - `esModuleInterop`: true (TS의 ES 모듈과 Node.js의 CommonJS 호환을 위함)
    - `forConsistentCasingFileNames`: true (대소문자 구분 문제 방지)
    - `strict`: true
    - `skipLibCheck`: true (node_modules 검사 생략으로 성능 향상)

### 3. tsc 명령어와 기능
- `npx tsc` : 타입검사 + JS 변환 수행
- `npx tsc --noEmit` : 타입검사만 수행 (JS 파일 생성 안 함)
- tsc는 타입 오류 있어도 JS 변환은 진행함.

<details>
<summary><i>js에서는 올바른 코드, ts에서는 틀린 코드</i></summary>

![Image](https://github.com/user-attachments/assets/5de033de-a594-421d-8f4b-a652f20d1c62)

</details>

### 4. 타입스크립트 타입 지정 방법
- 변수, 매개변수, 반환값에 타입을 명시할 수 있음
- 타입 선언 예시:
```
// 기본 함수 타입 선언
const func = (x: number): string => x.toString()

// 타입 별도 선언
type Func = (x: number) => string
const func: Func = (x) => x.toString()
```

### 5. 타입스크립트 타입 특징
- 타입 지정 안하면 any 타입이 됨
- 상수는 더 구체적인 타입으로 추론됨 (const a = false는 boolean이 아닌 false 타입)
- `as const`를 사용하면 객체의 속성을 상수로 처리
- 타입스크립트는 간단한 경우 타입 추론을 잘하지만, 복잡한 경우 실패할 수 있음
- 모든 곳에 타입을 명시할 필요는 없음 (오히려 오타 위험 증가)
- 인터페이스는 같은 이름으로 여러 번 선언 시 합쳐짐

---

## 타입스크립트 추가 문법 + 노드 타이핑하기
- 윈도우 : vscode에서 `f12` 누르면 타입 정의 파일로 이동
- 노드 타입 설치 : `npm i -D @types/node`

### 제네릭 타입
- 출처 : `node_modules/typescript/lib/lib.es5.d.ts`
```
interface Promise<T> {
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2>;
    // 기타 메서드...
}
```
- `Promise<Buffer>`와 같은 형태는 제네릭 타입 매개변수 T에 Buffer 타입을 지정한 것
- Promise가 resolve 될 때 Buffer 타입의 값을 반환한다는 의미
    - fs.readFile을 Promise 방식으로 사용할 때 `Promise<Buffer>`를 반환하는 것
- 일반적으로 interface Promise<Buffer>와 같이 특정 타입에 대한 Promise 인터페이스를 직접 재정의하지는 않음. 
    - 대신 기존 Promise 인터페이스를 제네릭 타입 매개변수를 통해 사용함.

---

## 커뮤니티 타입 정의 적용하기

<details>
<summary><i>타입정의 파일이 없어서 에러나는 상황</i></summary>

![Image](https://github.com/user-attachments/assets/decc6f43-28f8-4136-b69c-85121ea4bf49)

</details>

```
npm install --save-dev @types/express @types/cookie-parser @types/morgan @types/express-session @types/nunjucks @types/passport
```

---

## 라이브러리 코드 타이핑하기

### npm 패키지
- `TS` : 패키지 안에 ts가 들어 있음.
- `DT` : 패키지 안에 ts가 없어서 사람들이 타입을 정의해놓음.
- 둘 다 없음 : 타입을 직접 만들어야 함.

---

## 내가 만든 파일 타입스크립트로 전환하기
