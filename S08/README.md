# 섹션8. MongoDB

1. [NoSQL과 SQL](#nosql과-sql)
2. [MongoDB 설치하기](#mongodb-설치하기)
3. [데이터베이스와 컬렉션 만들기](#데이터베이스와-컬렉션-만들기)
4. [CRUD 작업하기](#crud-작업하기)
5. [MongoDB 연결 과정 트러블슈팅](#mongodb-연결-과정-트러블슈팅)
6. [몽구스 사용하기](#몽구스-사용하기)
7. [몽구스 스키마 사용하기](#몽구스-스키마-사용하기)
8. [몽구스 실전 프로젝트](#몽구스-실전-프로젝트)

---

## NoSQL과 SQL

| 특성            | SQL (MySQL)                                 | NoSQL (MongoDB)                                          |
| --------------- | ------------------------------------------- | -------------------------------------------------------- |
| **스키마**      | 정해진 데이터 스키마를 따라야 함            | 스키마가 없어 유연한 데이터 구조                         |
| **데이터 분산** | 수직적 확장 (Scale-up) - 하드웨어 성능 향상 | 수평적 확장 (Scale-out) - 서버 추가로 분산처리           |
| **ACID 특성**   | 준수 (원자성, 일관성, 고립성, 지속성)       | CAP 이론 준수 (일관성, 가용성, 분할내성)                 |
| **예시**        | 은행 거래, 항공권 예약 등                   | SNS, 실시간 채팅, 로그 분석 등 빠른 처리가 중요한 서비스 |

## MongoDB 설치하기

![Image](https://github.com/user-attachments/assets/fbfe3515-9b99-4dbb-adae-2c3b062839c9)

### 1. 설치 과정

- mongodb.com 커뮤니티 버전 다운로드
- 설치 파일 실행
- "Complete" 설치 선택
- MongoDB Compass 설치 (선택사항)

### 2. 초기 설정

- 데이터 디렉토리 생성

    ```
    mkdir -p "C:\data\db"
    ```

- 서버 실행

    ```
    cd "C:\Program Files\MongoDB\Server\8.0\bin"
    .\mongod --ipv6
    ```

- 보안 설정

    ```
    use admin
    db.createUser({
        user: "관리자이름",
        pwd: "비밀번호",
        roles: ["root"]
    })
    ```

- 인증 모드 활성화

    ```
    .\mongod --ipv6 --auth
    ```

### 3. 주요 명령어

- `show dbs`: 데이터베이스 목록 보기
- `use dbname`: 데이터베이스 선택/생성
- `show collections`: 컬렉션 목록 보기
- `db.collection.find()`: 데이터 조회

<details>
<summary><i>터미널 mongodb 접속</i></summary>

![Image](https://github.com/user-attachments/assets/ccb46da1-f739-4d88-a1cb-85aa25b95be2)

![Image](https://github.com/user-attachments/assets/482e116a-6ce5-477a-bc9e-88e1989cce79)

</details>

<details>
<summary><i>mongodb shell 접속 결과</i></summary>

![Image](https://github.com/user-attachments/assets/c72a2a53-516c-4fb4-aeb1-df84e7283e49)

</details>

<details>
<summary><i>mongodb compass 접속</i></summary>

![Image](https://github.com/user-attachments/assets/d89b8316-164d-4bea-b6c5-444efda134c9)

</details>

---

## 데이터베이스와 컬렉션 만들기

### 1. 데이터베이스 생성

- 참고로 `show dbs` 했을 때 새로 만든 DB가 보이지 않는 경우가 있는데, 이는 정상임.
- MongoDB는 <b>데이터가 최소 한 개 이상</b> 들어있어야 DB 목록에 표시됨.

```
// 데이터베이스 생성/선택
use nodejs

// 현재 사용 중인 DB 확인
db

// 사용할 DB 선택 (없으면 자동 생성)
use nodejs

// 모든 DB 목록 보기
show dbs
```

### 2. 컬렉션 생성

- 기본적으로 MongoDB는 처음 설치하면 다음 3개의 데이터베이스가 있음.
  - `admin`: 관리자 권한 DB
  - `local`: 복제 세트 관련 데이터 저장
  - `config`: 샤드 정보 저장

```
// 컬렉션 생성 (필수는 아님, 데이터 추가시 자동 생성됨)
db.createCollection('users')
db.createCollection('comments')

// 컬렉션 목록 확인
show collections
```

---

## CRUD 작업하기

### 1. Create (생성)

```
// 단일 문서 삽입
db.users.insertOne({
    name: 'zero',
    age: 24,
    married: false,
    comment: '안녕하세요',
    createdAt: new Date()
})
```

<details>
<summary><i>create</i></summary>

![Image](https://github.com/user-attachments/assets/94d27f65-a73d-4bf8-ac70-8316e427e5f1)

</details>

### 2. Read (조회)

```
// 전체 조회
db.users.find({})

// 특정 필드만 조회 (1: 포함, 0: 제외)
db.users.find({}, { name: 1, age: 1, _id: 0 })

// 조건 조회
db.users.find({ age: { $gt: 30 }, married: true })

// OR 조건
db.users.find({ $or: [{ age: { $gt: 30 }}, { married: false }] })

// 정렬 (sort), 제한 (limit), 건너뛰기 (skip)
db.users.find({}).sort({ age: -1 })  // 내림차순
db.users.find({}).limit(1)           // 1개만 조회
db.users.find({}).skip(1)            // 1개 건너뛰기
```

<details>
<summary><i>read</i></summary>

![Image](https://github.com/user-attachments/assets/d65b4ecd-6615-41e8-81db-00fd0553ec7e)

</details>

### 3. Update (수정)

```
// 특정 필드 수정 ($set 필수!)
db.users.updateOne(
    { name: 'nero' },
    { $set: { comment: '새로운 코멘트' }}
)
```

### 4. Delete (삭제)

```
// 문서 삭제
db.users.deleteOne({ name: 'nero' })
```

<details>
<summary><i>update와 delete</i></summary>

![Image](https://github.com/user-attachments/assets/7a87ea16-fc10-4039-8023-9a4557096769)

</details>

### 5. 주요 연산자

- `$gt`: 초과
- `$gte`: 이상
- `$lt`: 미만
- `$lte`: 이하
- `$ne`: 같지 않음
- `$or`: 또는
- `$in`: 배열 요소 중 하나

---

## MongoDB 연결 과정 트러블슈팅

### 1. 초기 문제 상황

- MongoDB에 인증이 활성화되어 있지 않은 상태
  ```
  Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
  ```
  ![Image](https://github.com/user-attachments/assets/b7872c40-8c47-4138-a3ea-99347894b275)

### 2. MongoDB 인증 활성화 설정

- 위치: `C:\Program Files\MongoDB\Server\8.0\bin\mongod.cfg`
- 주의: MongoDB 8.0에서는 `.conf`가 아닌 `.cfg` 확장자 사용
- 추가할 설정:
`    security:
    authorization: enabled
   `
<details>
<summary><i>notepad mongod.cfg 실행</i></summary>

![Image](https://github.com/user-attachments/assets/c803c354-4890-4cee-bc3e-6ff2b5e9a213)

</details>

### 3. MongoDB 서버 재시작

- 기존 서비스 중지 시도했으나 실패
  ```
  net stop MongoDB  # 성공
  net start MongoDB # 실패 (안 돼서 직접 실행)
  ```
- 직접 실행 방식으로 전환
  ```
  cd "C:\Program Files\MongoDB\Server\8.0\bin"
  .\mongod.exe --auth --ipv6
  ```

<details>
<summary><i>터미널에서 mongosh 실행</i></summary>

![Image](https://github.com/user-attachments/assets/3d4b2341-d425-43fd-a6e9-5656dff8394e)

![Image](https://github.com/user-attachments/assets/49663744-358f-4a5a-8e6d-7b12ad60fe64)

</details>

### 4. MongoDB Shell 접속 및 관리자 계정 생성

- 기존 관리자 계정 정보가 초기화되어서 새로 생성

  ```
  # 새 터미널에서 MongoDB Shell 실행
  mongosh

  # admin 데이터베이스로 전환
  use admin

  # root 계정 생성
  db.createUser({
      user: "root",
      pwd: "1234",
      roles: ["root"]
  })

  # 인증 테스트
  db.auth("root", "1234")  # { ok: 1 } 출력되면 성공
  ```

### 5. Node.js 애플리케이션 연결 설정

- Deprecated 경고 메시지 발생
`    [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
   `
<details>
<summary><i>deprecated 경고 메시지</i></summary>

![Image](https://github.com/user-attachments/assets/1a57c2d2-df20-4bb3-b21c-f9d1731553cc)

</details>

### 6. 해결 완료

![Image](https://github.com/user-attachments/assets/12c1afb7-6b2f-4914-b9a5-2ef69c7f6741)

- MongoDB 8.0에서는 config 파일 확장자가 `.cfg`임
- 서비스로 실행하는 대신 직접 실행 방식 사용
- 인증 모드 활성화 후에는 <b>관리자 계정을 새로 생성</b>해야 함
- <b>MongoDB 서버는 실행 상태를 유지한 채로</b> 애플리케이션 개발 진행해야 함
- `useNewUrlParser` 옵션은 MongoDB Driver 4.0.0 버전부터 기본 내장되어 있으므로 제거

## 몽구스 사용하기

---

## 몽구스 스키마 사용하기

---

## 몽구스 실전 프로젝트
