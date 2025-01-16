# 섹션7. MySQL

1. [MySQL 설치하기](#mysql-설치하기)
2. [테이블 만들기](#테이블-만들기)
3. [컬럼의 옵션들](#컬럼의-옵션들)
4. [CRUD 작업하기](#crud-작업하기)
5. [시퀄라이즈 사용하기](#시퀄라이즈-사용하기)
6. [시퀄라이즈 모델 만들기](#시퀄라이즈-모델-만들기)
7. [테이블 관계 이해하기](#테이블-관계-이해하기)
8. [시퀄라이즈 쿼리 알아보기](#시퀄라이즈-쿼리-알아보기)
9. [시퀄라이즈 실습하기](#시퀄라이즈-실습하기)

---

## MySQL 설치하기
- 서버 재시작 시 데이터가 사라지므로 영구 저장 공간이 필요함. 
- 클라이언트에 데이터를 저장하면 위변조 위험이 존재함.
- `store in vault` => 보안적으로 안 좋음.
- 개발용 소프트웨어 설치할 때는 경로에 한글이 있으면 에러날 확률이 높음.

### 1. MySQL 개요
- MySQL <b>관계형 데이터베이스</b> 사용
    - 데이터베이스 : 관련성을 가지며 중복이 없는 데이터들의 집합
    - <b>DBMS</b> : 데이터베이스를 관리하는 시스템
    - <b>RDBMS</b> : 관계형 데이터베이스를 관리하는 시스템
    - 서버의 하드 디스크나 SSD 등의 저장 매체에 데이터를 저장
    - 서버 종료 여부와 상관없이 데이터를 계속 사용할 수 있음.
    - 여러 사람이 동시에 접근할 수 있고, 권한을 따로 줄 수 있음.
- NoSQL: 수집 목적에 맞게 데이터를 저장하며, 대규모 데이터 처리에 주로 사용됨.

### 2. MySQL 설치 경로 (윈도우 기준)
- 기본적으로 MySQL의 설치 경로
```
C:\Program Files\MySQL\MySQL Server 8.0\bin
```

### 3. MySQL 명령어 사용법 (윈도우)
```
mysql -h localhost -u root -p
```
- `-h localhost`: 접속할 호스트(서버 주소). 일반적으로 로컬에서 사용할 경우 `localhost`
- `-u root`: 사용할 사용자 이름. MySQL의 기본 사용자 이름은 root
- `-p`: 비밀번호를 입력하겠다는 뜻

![image](https://github.com/user-attachments/assets/e327e7e2-3205-4e5f-9541-fa31b145fee4)

### 4. MySQL 명령어 사용법 (리눅스)
- 패키지 목록 업데이트
```
sudo apt-get update
```

- MySQL 설치
```
sudo apt-get install -y mysql-server-8.0
```

- MySQL 설정
```
sudo mysql
```
- MySQL 프롬프트로 전환 후, 비밀번호 설정
```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '비밀번호';
```

- MySQL 종료
```
exit;
```

---

## 테이블 만들기

### 1. 데이터베이스 생성
- `CREATE SCHEMA `nodejs` DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_general_ci;` : 새로운 데이터베이스를 생성하는 명령어
    - `DEFAULT CHARACTER SET utf8mb4` : 한글과 이모티콘을 지원하는 문자 집합
    - `DEFAULT COLLATE utf8mb4_general_ci` : 문자 정렬 방식을 설정 (한글 문제를 피하기 위해 utf8mb4_general_ci 사용)
- `use nodejs;`: nodejs 데이터베이스를 사용하겠다고 선택하는 명령어
- SQL 명령어 <b>끝에 세미콜론</b>을 붙여야 실행됨.
- SQL 예약어는 사용자가 만든 테이블명과 구분하기 위해 <b>대문자</b>로 쓰는 것이 좋음.

![image](https://github.com/user-attachments/assets/303cd435-6a14-44fa-a475-4b2311cd5e87)

### 2. 테이블 생성
```
CREATE TABLE nodejs.users (
    id INT NOT NULL AUTO_INCREMENT,      -- 자동 증가하는 id
    name VARCHAR(20) NOT NULL,           -- 이름 (최대 20자)
    age INT UNSIGNED NOT NULL,           -- 나이 (음수 불가)
    married TINYINT NOT NULL,            -- 결혼 여부 (0 또는 1)
    comment TEXT NULL,                   -- 자기소개 (NULL 허용)
    created_at DATETIME NOT NULL DEFAULT now(), -- 생성일 (기본값: 현재 시간)
    PRIMARY KEY(id),                     -- id를 기본 키로 설정
    UNIQUE INDEX name_UNIQUE (name ASC)  -- name 컬럼에 유니크 인덱스 설정
) COMMENT = '사용자 정보'               -- 테이블 설명
ENGINE = InnoDB;                       -- InnoDB 엔진 사용
```

![image](https://github.com/user-attachments/assets/c2f0bf7e-bcaa-40f3-9b9d-5c4125ba3e85)

---

## 컬럼의 옵션들

![image](https://github.com/user-attachments/assets/3e71b5b0-e1ca-4a67-a431-8a189d298802)

### 1. **자료형 (Data Types)**

| 자료형       | 설명                                                         |
|--------------|--------------------------------------------------------------|
| **INT**      | 정수형 데이터. 소수점이 필요하면 `FLOAT` 또는 `DOUBLE` 사용. |
| **VARCHAR(n)** | 가변 길이 문자열 (최대 `n`길이).                             |
| **CHAR(n)**   | 고정 길이 문자열. 지정된 길이만큼 문자열을 입력해야 함.      |
| **TEXT**      | 긴 문자열을 저장 (수백 자 이상의 문자열).                  |
| **TINYINT**   | -128부터 127까지의 정수. `BOOLEAN` 역할로 사용 가능 (0 또는 1). |
| **DATETIME**  | 날짜와 시간을 저장 (기본적으로 `YYYY-MM-DD HH:MM:SS` 포맷). |
| **DATE**      | 날짜만 저장 (예: `YYYY-MM-DD`).                             |
| **TIME**      | 시간만 저장 (예: `HH:MM:SS`).                               |

### 2. **옵션 (Options)**

| 옵션                | 설명                                                            |
|---------------------|-----------------------------------------------------------------|
| **AUTO_INCREMENT**   | 숫자를 자동으로 증가시켜 고유값을 부여 (주로 `id` 컬럼에 사용)   |
| **UNSIGNED**         | 음수 값을 허용하지 않음 (0 이상만 저장)                          |
| **DEFAULT**          | 컬럼 값이 없으면 기본값을 자동으로 입력 (예: `DEFAULT now()`)    |
| **NOT NULL**         | 해당 컬럼에 빈 값(`NULL`)을 허용하지 않음                        |
| **PRIMARY KEY**      | 해당 컬럼을 테이블의 고유 식별자로 설정                          |
| **UNIQUE INDEX**     | 해당 컬럼의 값이 고유해야 함. 중복 값 저장 불가                    |
| **COMMENT**          | 테이블이나 컬럼에 대한 설명을 추가 (선택적)                        |
| **ENGINE**           | 테이블의 저장 엔진 설정 (`InnoDB`, `MyISAM` 등)                  |

### 3. 테이블 옵션
- 테이블 삭제
```
DROP TABLE users;
```

- 테이블 구조 확인
```
DESC users;
```

---

## CRUD 작업하기

### CREATE

- INSERT INTO [테이블명] ([컬럼1], [컬럼2], .. .) VALUES ([값1], [값 2], ...)
- id는 AUTO_INCREMENT에 의해, created_at은 DEFAULT 값에 의해 자동으로 들어감.

![image](https://github.com/user-attachments/assets/7feb2cf1-4285-48f1-a69b-22c188538369)

### READ

- 테이블의 모든 데이터 조회
```
SELECT * FROM nodejs.users;
```
![image](https://github.com/user-attachments/assets/7580e873-c572-459c-952b-944d010339fd)

- 특정 컬럼만 조회
```
SELECT name, married FROM nodejs.users;
```
![image](https://github.com/user-attachments/assets/c1624ef0-6101-42cd-89c8-78ec68549d79)

- 특정 조건을 가진 데이터만 조회
```
SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;
```
```
SELECT id, name FROM nodejs.users WHERE married = 0 OR age > 30;
```
![image](https://github.com/user-attachments/assets/8be07a9b-21b7-493d-aacb-5f8ecfb7a5d0)

- 정렬 : ASC, DESC
```
SELECT id, name FROM nodejs.users ORDER BY age DESC;
``` 
![image](https://github.com/user-attachments/assets/d6671851-bab5-48ca-938b-dd0254a87d7d)

- `limit`: 조회할 개수, `offset`: 건너뛸 개수
```
 SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1;
```
```
 SELECT id, name FROM nodejs.users ORDER BY age DESC LIMIT 1 OFFSET 1;
```
![image](https://github.com/user-attachments/assets/aff864b5-0b90-4d96-9b61-2207c84ea672)

### Update
-  UPDATE [테이블명] SET [컬럼명=바꿀 값] WHERE [조건]
```
UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;
```
![image](https://github.com/user-attachments/assets/99763990-5a20-4945-b3dc-7e32c877ec65)

### Delete
- DELETE FROM [테이블명] WHERE [조건]
```
DELETE FROM nodejs.users WHERE id = 2;
```
![image](https://github.com/user-attachments/assets/b847e4b8-7860-4d7c-b99c-f9d94534ed0c)

---

## 시퀄라이즈 사용하기
### 1. 시퀄라이즈 ORM
- MySQL 작업을 쉽게 할 수 있도록 도와주는 라이브러리
- <b>ORM (Object Relational Mapping)</b> : 자바스크립트 객체와 데이터베이스의 릴레이션을 매핑해주는 도구
- MySQL 외에도 다른 RDB (Maria, Postgre, SQLite, MSSQL)와도 호환됨
- 자바스크립트 문법으로 데이터베이스 조작 가능

### 2. Sequelize 설정 및 DB 연결 절차
#### 1) package.json 추가 및 필요한 패키지 설치
```
npm install express morgan nunjucks sequelize sequelize-cli mysql2
npm install --save-dev nodemon
```
- mysql2는 MySQL과 Node.js 간의 드라이버, DB가 아님.
- 하나의 Node 애플리케이션에서 여러 개의 DB에 연결 가능

#### 2) Sequelize 초기화
```
npx sequelize init
```

#### 3) DB 연결 실패 시 에러 메시지
- `Error: connect ECONNREFUSED 127.0.0.1:3306` : MySQL 서버가 실행되지 않음
- `Error: Access denied for user 'root'@'localhost' (using password: YES)` : 비밀번호 오류
- `Error: Unknown database` : 데이터베이스 존재하지 않음

#### 4) DB 연결 성공

![image](https://github.com/user-attachments/assets/5fdefa6a-f929-460d-86b1-ce1774dcd485)

---

## 시퀄라이즈 모델 만들기

### 1. Sequelize 모델 정의 패턴
- Sequelize.Model을 확장한 클래스로 모델을 정의
- 모델은 static `init` 메서드와 static `associate` 메서드로 구성
    - `init` 메서드: 테이블 컬럼 및 테이블 설정을 정의
    - `associate` 메서드: 다른 모델과의 관계를 설정

### 2. init 메서드
- init 메서드는 두 가지 인수를 받음.
- <b>첫 번째 인수</b>: 테이블 컬럼에 대한 설정
    - 각 컬럼은 Sequelize의 자료형을 사용하여 정의
    - 예: STRING(100), INTEGER, BOOLEAN, DATE, INTEGER.UNSIGNED 등.
- <b>두 번째 인수</b>: 테이블 자체에 대한 설정
    - `sequelize`: DB 연결 객체를 지정
    - `timestamps`: true로 설정 시 자동으로 createdAt과 updatedAt 컬럼을 추가. (예제에서는 false로 설정할 수 있음)
    - `underscored`: 컬럼명과 테이블명을 스네이크 케이스로 설정.
    - `modelName`: 모델의 이름을 지정
    - `tableName`: 실제 테이블 이름을 지정. 기본적으로는 모델 이름을 소문자 복수형으로 사용
    - `paranoid`: true로 설정 시 deletedAt 컬럼을 추가하여, 삭제된 데이터도 복구 가능.
    - `charset`과 `collate`: 데이터베이스의 문자셋과 정렬 설정. 한글을 포함하려면 `utf8` 또는 `utf8mb4` 설정이 필요함.


### 3. 테이블 설정 옵션
- `timestamps`: true면 createdAt, updatedAt 자동 생성
- `underscored`: true면 스네이크 케이스(created_at) 사용
- `modelName`: 자바스크립트에서 사용할 모델 이름
- `tableName`: 실제 DB 테이블 이름
- `paranoid`: true면 삭제 시 deletedAt 컬럼에 시간 기록
- `charset/collate`: 한글 지원을 위한 인코딩 설정

### 4. Sequelize 자료형과 MySQL 자료형의 차이 비교

| MySQL 자료형              | Sequelize 자료형     | 옵션/설명                                 |
|---------------------------|----------------------|------------------------------------------|
| `VARCHAR(100)`             | `STRING(100)`         | 문자열, 길이 제한                        |
| `INT`                      | `INTEGER`             | 정수형                                   |
| `TINYINT`                  | `BOOLEAN`             | 불리언값 (0 또는 1)                      |
| `DATETIME`                 | `DATE`                | 날짜 및 시간                             |
| `INT UNSIGNED`             | `INTEGER.UNSIGNED`    | 부호 없는 정수형                         |
| `NOT NULL`                 | `allowNull: false`    | `NULL` 허용하지 않음                     |
| `UNIQUE`                   | `unique: true`        | 유일한 값만 허용                         |
| `DEFAULT NOW()`            | `defaultValue: Sequelize.NOW` | 기본값으로 현재 시간 설정           |

### 5. 명명 규칙
- <b>모델 이름</b>: 단수형 (예: User, Post)
- <b>테이블 이름</b>: 복수형 (예: users, posts)
- 시퀄라이즈가 자동으로 복수형으로 변환

### 6. id 컬럼
- 기본 키는 자동으로 생성되므로 따로 정의할 필요 없음

![image](https://github.com/user-attachments/assets/fc34487a-1747-4964-8b87-26ac797f8dad)

---

## 테이블 관계 이해하기

### 1. 1:1 (일대일) 관계
- 1:1 관계에서는 한 모델이 다른 모델과 1:1 관계를 맺음. 
- 예를 들어, 사용자는 하나의 정보 테이블만 가질 수 있고, 정보 테이블은 하나의 사용자만을 가리킴.
- hasOne vs belongsTo:
    - `hasOne`: 한 모델이 다른 모델과 1:1 관계를 설정할 때 사용됨. hasOne을 설정한 모델에 외래 키(foreign key)가 추가됨. 이 외래 키는 belongsTo를 사용하는 모델에 위치함.
    - `belongsTo`: 다른 모델의 외래 키(foreign key)를 포함하는 모델에 사용됨. belongsTo를 사용한 모델에 외래 키가 추가됨.
```
// 1:1 관계에서 `hasOne`과 `belongsTo` 설정
db.User.hasOne(db.Info, { foreignKey: 'UserId', sourceKey: 'id' });
db.Info.belongsTo(db.User, { foreignKey: 'UserId', targetKey: 'id' });
```

### 2. 1:N (일대다) 관계
- 한 사용자는 여러 개의 댓글을 작성할 수 있음. 하지만 댓글 하나에 여러 명의 사용자가 있을 수는 없음.
- User 모델은 hasMany를 사용하여 여러 개의 댓글을 가질 수 있음을 나타냄.
- Comment 모델은 belongsTo를 사용하여 댓글이 작성자(User)를 참조함을 나타냄.
```
// User 모델
db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });

// Comment 모델
db.Comment.belongsTo(db.User, { foreignKey: 'commenter', targetKey: 'id' });
```

### 3. N:M (다대다) 관계
- 다대다 관계에서는 두 모델 간에 중간 테이블이 필요함. 
- 예를 들어, 게시글과 해시태그는 다대다 관계. 하나의 게시글에는 여러 해시태그가 달릴 수 있고, 하나의 해시태그는 여러 게시글에 달릴 수 있음.
- 다대다 관계에서는 두 모델을 연결하는 중간 테이블이 필요함. 
    - 예를 들어, Post와 Hashtag 모델 간의 관계를 나타내기 위해 PostHashtag라는 중간 테이블을 만들 수 있음.
    - 중간 테이블을 사용하지 않으면 <b>데이터 중복이 발생</b>할 수 있음.
    - 정규화의 원칙에 따르면, 각 테이블의 컬럼에는 하나의 데이터만 포함되어야 하므로 중간 테이블을 사용하여 여러 데이터를 연결함.
```
// N:M 관계에서 `belongsToMany` 설정
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
```

### 4. foreignKey와 targetKey
- `foreignKey`: 외래 키(다른 테이블의 기본 키를 참조하는 컬럼).
- `sourceKey`: 참조하는 모델의 키
- `targetKey`: 참조되는 모델의 키
    - 예를 들어, Comment 모델에서는 commenter 컬럼이 User 모델의 id를 참조하는 외래 키

### 5. 순환 참조 문제와 db 매개변수
- require를 통해 <b>순환 참조를 방지</b>하기 위해 db 객체를 사용하여 모델들을 연결함.
- 예를 들어, `user.js`와 `comment.js`가 서로를 require하지 않고 <b>index.js에서 db 객체</b>를 만들어 모델 간의 관계를 설정함.

### 6. 요약
- <b>1:1 관계</b>: 한 모델이 다른 모델과 1:1 관계를 설정할 때 `hasOne`과 `belongsTo`를 사용함. 외래 키는 `belongsTo`가 포함하는 모델에 위치함.
- <b>1:N 관계</b>: 한 모델이 다른 모델과 1:N 관계를 설정할 때 `hasMany`와 `belongsTo`를 사용함. 외래 키는 `belongsTo`가 포함하는 모델에 위치함.
- <b>N:M 관계</b>: 두 모델 간 다대다 관계를 표현할 때 <b>중간 테이블</b>을 사용해야 하며, 이를 통해 정규화가 유지됨. `belongsToMany`를 사용하여 관계를 설정하고, `through` 옵션으로 중간 테이블을 지정함.

---

## 시퀄라이즈 쿼리 알아보기

[시퀄라이즈 쿼리 알아보기](./sequelize-query/README.md)

- 만약 시퀄라이즈의 쿼리를 사용하기 싫거나 어떻게 해야 할지 모르겠다면 직접 SQL문을 통해 쿼리할 수도 있음.
```
const [result, metadata] = await sequelize.query('SELECT * from comments');
console.log(result);
```

---

## 시퀄라이즈 실습하기
