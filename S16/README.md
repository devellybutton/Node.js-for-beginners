# 섹션16. AWS 서버리스(S3+Lambda) 사용하기

1. [서버리스 컴퓨팅](#서버리스-컴퓨팅)
2. [S3에 대신 파일 올리기](#s3에-대신-파일-올리기)
3. [람다 사용하기](#람다-사용하기)

---

## 서버리스 컴퓨팅

- 서버리스(Serverless)는 '서버가 없다'는 의미가 아니라, 개발자가 서버 관리에 신경 쓰지 않아도 되는 클라우드 컴퓨팅 모델

### 핵심 특징
- 서버 관리 부담 감소 : 클라우드 제공업체가 서버 인프라를 관리
- 사용량 기반 과금 : 실제 사용한 리소스에 대해서만 비용 지불
- 필요시 실행 : 24시간 서버 운영이 필요없는 경우 비용 절감 가능
- 개발 집중 : 개발자는 비즈니스 로직에만 집중 가능

### 주요 서버리스 서비스
#### AWS 서비스
- Lambda: 이벤트 기반으로 코드 실행 (FaaS)
- API Gateway: API 생성 및 관리
- S3: 클라우드 스토리지 서비스

#### GCP 서비스
- Cloud Functions: 이벤트 기반 함수 실행
- Cloud Run: 컨테이너화된 애플리케이션 실행
- Firebase: 모바일/웹 앱 개발 플랫폼
- Cloud Storage: 객체 스토리지 서비스

#### 활용 사례: 이미지 처리
- NodeBird 애플리케이션에서는 서버리스를 다음과 같이 활용:
1. 이미지 업로드 시 리사이징 작업을 FaaS(Lambda/Cloud Functions)가 대신 처리
2. 처리된 이미지는 클라우드 스토리지(S3/Cloud Storage)에 저장
3. 이미지 제공도 클라우드 스토리지 서비스가 담당
이러한 방식으로 노드 서버의 부담을 줄이고, 필요한 만큼의 컴퓨팅 자원만 사용해 비용 효율적으로 서비스를 운영할 수 있음.

---

## S3에 대신 파일 올리기

### 1. AWS S3 버킷 설정
- 고유한 이름의 버킷 생성
- 모든 퍼블릭 액세스 차단 해제 (테스트용)
    - 프록시 기반 접근 제어
        - 실무에서는 퍼블릭 액세스를 차단하지 않음.
        - S3 앞에 다른 서비를 하나 더 두어서 권한 체크함.
- 버킷 정책 설정: GetObject와 PutObject 권한 부여
<details>
<summary><i>퍼블릭 액세스 차단 해제</i></summary>

![Image](https://github.com/user-attachments/assets/ba1f08a3-40ae-462e-b66e-6975ae284bda)

</details>
<details>
<summary><i>버킷 정책</i></summary>

![Image](https://github.com/user-attachments/assets/b98978cc-8a47-450e-9db1-64761a1690b4)

</details>

### 2. 필요한 자격 증명 설정
- AWS 액세스 키 ID와 시크릿 키 발급
- `.env` 파일에 보안 키 저장

### 3. 서버 코드 구현
- 필요 패키지 설치: `multer-s3`, `@aws-sdk/client-s3`
- S3 클라이언트 생성 및 설정
- multer 스토리지를 multerS3로 설정
- 파일명과 경로 설정 (original 폴더에 저장)

### 4. 라우트 처리
- 이미지 업로드 라우트 구현 `(POST /post/img)`
- 업로드 완료 시 S3 이미지 URL 응답 `(req.file.location)`

### 5. 권한 관련 문제 해결
- 403 에러: 
    - S3 버킷 퍼블릭 액세스와 권한 정책 확인
    - IAM 사용자 권한 설정 확인
    - 로그인 관련 코드, 로그인 여부 체크 (서버에서 403으로 처리중일 경우)

### 6. 업로드 테스트
<details>
<summary><i>업로드 완료</i></summary>

![Image](https://github.com/user-attachments/assets/f86c3263-d806-4431-96e4-2726577d1c2e)

</details>

---

## 람다 사용하기

![Image](https://github.com/user-attachments/assets/b17f524d-978c-4c8a-ace9-1085346b5b34) 
<br>
출처 : [Node.js교과서](https://thebook.io/080334/0562/)



