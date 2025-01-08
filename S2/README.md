# 섹션2. 알아두어야 할 자바스크립트

> - [호출 스택](#호출-스택)
> - [이벤트 루프](#이벤트-루프)
> - [var, const, let](#var-const-let)
> - [템플릿 문자열, 객체 리터럴](#템플릿-문자열-객체-리터럴)
> - [화살표 함수](#화살표-함수)
> - [구조분해 할당](#구조분해-할당)
> - [클래스](#클래스)
> - [Promise, async/await](#promise-asyncawait)
> - [Map, Set, WeakMap, WeakSet](#map-set-weakmap-weakset)
> - [옵셔널 체이닝, 널 병합](#옵셔널-체이닝-널-병합)
> - [프론트엔드 자바스크립트](#프론트엔드-자바스크립트)

---

## 호출 스택

---

## 이벤트 루프

---

## var, const, let

### var vs const, let
- `var` : 함수 스코프 또는 전역 스코프
    - function() {} 안에서 선언된 var은 해당 함수를 벗어나면 접근 불가능함.
    - if, while, for 등에서 선언된 var는 <b>그 블록을 벗어나도 접근할 수 있음</b>.
- `const, let` : 블록 스코프
    - function() {} 안에서 선언된 var은 해당 함수를 벗어나면 접근 불가능함.
    -  if, while, for 등의 블록 내에서 선언된 변수는 <b>그 블록 내에서만 접근 가능함</b>.

#### 조건문 내부에서 선언된 변수 x
```
if (true) {
	var x = 3;
}
console.log(x);  // 3 
```
- 'var'로 선언된 변수 x는 <b>함수 또는 전역 범위</b>에서 접근 가능
- 'var'는 <b>함수 스코프 또는 전역 스코프</b>를 가지므로, if문 내부에서 선언된 x는 외부에서 접근 가능

#### 함수 내부에서 선언된 변수 y
```
function a() {
	var y = 3;
}
console.log(y);  // ReferenceError: y is not defined
```
- 'var'로 선언된 변수 y는 <b>함수 스코프</b>를 가짐
- 'y'는 함수 a() 내부에서만 유효한 변수이기 때문에 외부에서 접근할 수 없음

---

## 템플릿 문자열, 객체 리터럴

---

## 화살표 함수

---

## 구조분해 할당

---

## 클래스

---

## Promise, async/await

---

## Map, Set, WeakMap, WeakSet

---

## 옵셔널 체이닝, 널 병합

---

## 프론트엔드 자바스크립트
> - AJAX (Asynchronous JavaScript and XML)
> - Axios 사용하기 
> - formData
> - encodeURIComponent, decodeURIComponent
> - html에서 데이터 속성과 dataset

### 1. AJAX (Asynchronous Javascript and XML)

#### 1) AJAX란?
- 웹 페이지에서 비동기적으로 서버와 데이터를 주고 받는 기술
- 페이지 전체를 새로고침하지 않고도 서버에서 데이터를 받아와 화면의 일부분만을 업데이트할 수 있음.
- 효과: 사용자 경험 향상, 서버 부하 감소, 동적 콘텐츠 로딩 (무한 스크롤, 실시간 데이터 표시 등)
- 예시: 구글 검색 자동 완성, 쇼셜 미디어 피드, 채팅 애플리케이션, 지도 서비스

#### 2) 구현 방식
- XMLHttpRequest, Fetch API, Axios를 사용하여 서버와 비동기적으로 데이터를 주고 받음.
- JSON 형식으로 데이터를 주고받는 경우가 많음.

- <b>XMLHttpRequest</b>
![image](https://github.com/user-attachments/assets/f7eb9180-b8b7-4967-97c3-c82ac7cee571)
    ```
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(JSON.parse(xhr.responseText));
        }
    };
    xhr.open('GET', 'https://api.example.com/data', true);
    xhr.send();
    ```

- <b>Fetch API</b>
    ```
    fetch('https://api.example.com/data')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    ```

- <b>Axios</b>
    ```
    axios.get('https://api.example.com/data')
        .then(response => console.log(response.data))
        .catch(error => console.error('Error:', error));
    ```

### 2. Axios 사용하기

#### 1) Fetch vs Axios 비교

| 기능                   | Fetch                                      | Axios                                     |
|------------------------|--------------------------------------------|-------------------------------------------|
| **설치 필요 여부**       | 브라우저 내장 API, 설치 필요 없음         | 외부 라이브러리, 설치 필요 (`npm install axios`) |
| **기본 동작**           | 기본적으로 Promise 반환, 응답 파싱 필요   | 응답 자동 파싱 (JSON)                     |
| **요청 방식**           | `GET`, `POST`, `PUT`, `DELETE` 등 사용 가능 | `GET`, `POST`, `PUT`, `DELETE` 등 사용 가능 |
| **응답 파싱**           | `.json()`, `.text()` 메소드로 파싱 필요    | 응답 데이터는 자동으로 JSON으로 파싱    |
| **인터셉터**            | 수동으로 구현해야 함 (예: 요청/응답 수정) | 내장된 인터셉터 기능 제공 (요청/응답 수정) |
| **에러 처리**           | HTTP 오류 상태 코드에 대해 별도 처리 필요  | 자동으로 `catch` 블록에서 처리 가능     |
| **타임아웃 설정**       | 별도의 설정 없음                          | `timeout` 옵션으로 타임아웃 설정 가능   |
| **요청 취소 기능**      | 별도의 취소 기능 없음                     | `CancelToken`을 사용하여 요청 취소 가능  |
| **브라우저 호환성**      | 최신 브라우저에서 기본적으로 지원        | 모든 브라우저 및 Node.js에서 동작        |
| **번들 사이즈**         | 가벼움 (내장 API 사용)                    | 상대적으로 큼 (라이브러리 크기 증가)      |

#### 2) Axios 사용 예시

![image](https://github.com/user-attachments/assets/9284aa5b-87a9-45d1-a823-3fbcbfc2ffcb)

- 브라우저 : html에 `<script src="https://unpkg.com/axios/dist/axios.min.js"></script>` 추가하기
- 노드 : 
    - 터미널에서 `npm install axios` 입력
    - axios를 require해서 사용 `const axios = require('axios');`
- HTTP 메서드에 맞는 Axios 사용법
    - `axios.get(url)` → 데이터 조회
    - `axios.post(url, 데이터)` → 데이터 생성
    - `axios.delete(url)` → 데이터 삭제
    - `axios.put(url, 데이터)` → 데이터 전체 수정
    - `axios.patch(url, 데이터)` → 데이터 일부 수정
- GET 요청 예시
    ```
    axios.get('https://www.zerocho.com/api/get')
    .then((response) => {
        console.log(response.data); // 실제 데이터 출력
    })
    .catch((error) => {
        console.error(error);
    });
    ```
- POST 요청 예시
    ```
    axios.post('https://www.zerocho.com/api/post', {
    name: '제로초',
    age: 30
    })
    .then((response) => {
        console.log(response.data); // 응답 데이터 출력
    })
    .catch((error) => {
        console.error(error);
    });
    ```
- 비동기 처리 시 주의사항
    - 항상 에러 처리 (catch) 구문을 포함할 것
    - Promise 사용 시 반드시 catch 블록을 추가할 것

### 3. formData
- <b>FormData</b>
    - 주로 멀티파트 요청을 처리하기 위해 사용됨. 
    - 특히, 이미지, 파일, 동영상과 같은 바이너리 데이터를 서버로 보내기 위한 방식
- **멀티파트 요청 (Multipart Request)**
    - HTTP 요청의 하나로, 여러 개의 데이터 조각을 하나의 요청으로 서버에 전송하는 방식
    ```
    const formData = new FormData();
    formData.append('image', file);  // file은 input[type="file"]에서 받은 파일
    formData.append('name', '제로초');

    axios.post('https://www.zerocho.com/api/upload', formData)
    .then((result) => {
        console.log(result.data);
    })
    .catch((error) => {
        console.error(error);
    });
    ```

### 4. encodeURIComponent, decodeURIComponent

#### 1) encodeURIComponent과 decodeURIComponent
- 원래 주소창에는 아스키 코드만 입력하는 것이 가장 안전함. 
- 아스키 코드에는 한글이 포함되지 않으므로, 한글을 입력하면 오류가 발생하거나 무시될 수 있음.
    ```
    // 인코딩
    const encoded = encodeURIComponent('안녕하세요');
    console.log(encoded);  // '%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94'

    // 디코딩
    const decoded = decodeURIComponent('%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94');
    console.log(decoded);  // '안녕하세요'
    ```

#### 2) URL vs URI
- <b>URL(Uniform Resource Locator)</b>
    - 인터넷에서 웹 페이지, 이미지, 비디오 등 리소스의 위치를 가리키는 문자열
    - HTTP 맥락에서 URL은 "웹 주소" 또는 "링크"
    - 서버의 <b>파일 위치</b>를 나타냄
- <b>URI(Uniform Resource Identifier)</b>
    - 하나의 리소스를 가리키는 문자열
    - 서버의 <b>자원 위치</b>를 나타냄 <b>(현대에 더 많이 사용)</b>

### 5. html에서 데이터 속성과 dataset

- HTML 요소에 관련된 데이터를 저장하고(화면에 안 보임) 이를 동적으로 처리하거나 스타일링할 때 매우 유용함.
    - <b>HTML</b>: `data-` 속성을 사용해 추가적인 데이터를 HTML 태그에 저장함.
    - <b>JavaScript</b>: `dataset`을 사용해 데이터 속성에 접근하고 값을 읽거나 변경할 수 있음.
    - <b>CSS</b>: `attr() 함수`나 `속성 선택자`를 통해 데이터 속성 값을 스타일에 활용할 수 있음.
- 데이터 속성 사용 시 주의사항
    - 공개된 데이터만 저장해야 함
    - 누구나 접근 가능하므로 민감한 정보는 저장하지 말 것

#### 1) HTML에서 데이터 속성 정의하기
```
<article
  id="electric-cars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
  ...
</article>
```
#### 2) JavaScript에서 데이터 속성 접근하기
- 주의: `data-` 뒤의 속성명은 JavaScript에서 `camelCase 형태`로 변환됨. <i>(예: data-index-number → indexNumber)</i>
```
const article = document.querySelector("#electric-cars");

// dataset을 사용하여 데이터 속성에 접근
console.log(article.dataset.columns);        // "3"
console.log(article.dataset.indexNumber);   // "12314"
console.log(article.dataset.parent);         // "cars"

// 데이터 속성에 값을 설정
article.dataset.columns = "5";
```
#### 3) CSS에서 데이터 속성 사용하기
- attr() 함수로 데이터 속성 값 사용하기
    ```
    article::before {
    content: attr(data-parent);
    }
    ```

- 속성 선택자로 스타일 변경하기
    ```
    /* data-columns="3"인 경우 width를 400px로 설정 */
    article[data-columns="3"] {
    width: 400px;
    }

    /* data-columns="4"인 경우 width를 600px로 설정 */
    article[data-columns="4"] {
    width: 600px;
    }
    ```