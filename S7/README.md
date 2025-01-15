# 섹션7. MySQL

1. [MySQL 설치하기](#mysql-설치하기)
2. [테이블 만들기](#테이블-만들기)
3. [컬럼의 옵션들](#컬럼의-옵션들)
4. [CRUD 작업하기](#crud-작업하기)
5. [시퀄라이즈 사용하기](#시퀄라이즈-사용하기)
6. [시퀄라이즈 모델 만들기](#시퀄라이즈-모델-만들기)
7. [테이블 관계 이해하기](#테이블-관계-이해하기)
8. [시퀄라이즈 쿼리 알아보기](#시퀄라이즈-쿼리-알아보기)
9. [관계 쿼리 알아보기](#관계-쿼리-알아보기)
10. [시퀄라이즈 실습하기](#시퀄라이즈-실습하기)

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

---

## 시퀄라이즈 모델 만들기

---

## 테이블 관계 이해하기

---

## 시퀄라이즈 쿼리 알아보기

---

## 관계 쿼리 알아보기

---

## 시퀄라이즈 실습하기
