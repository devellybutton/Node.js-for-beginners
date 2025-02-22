# 섹션13. 실시간 경매 시스템 만들기(서버센트이벤트, 스케줄링)

1. [서버센트 이벤트 사용하기](#서버센트-이벤트-사용하기)
2. [스케줄링 구현하기](#스케줄링-구현하기)
3. [스스로 해보기](#스스로-해보기)
4. [핵심정리](#핵심-정리)

---

## 서버센트 이벤트 사용하기

- 웹소켓은 양방향, SSE는 서버→클라이언트 일방향 통신
- 온라인 경매에서는 정확한 서버 시간을 표시해야 함.
- 클라이언트 시간은 신뢰할 수 없으므로 서버 시간을 사용하는 것이 중요함.

<details>
<summary><i>시행결과 1</i></summary>

![Image](https://github.com/user-attachments/assets/ea9f10fa-7f6f-4221-9dca-188be117dcfd)

</details>
<details>
<summary><i>시행결과 2</i></summary>

![Image](https://github.com/user-attachments/assets/bfbf766b-0eb2-46f5-ba1a-b7a9d158ada7)

</details>

---

## 스케줄링 구현하기

### 1. 트랜잭션(Transaction)의 필요성과 구현
#### 트랜잭션이 필요한 이유
- setSold DB 작업은 성공했는데, update DB 작업이 실패하면 데이터 정합성이 깨질 수 있음
- 낙찰자가 정해졌는데 돈이 차감되지 않거나, 돈만 차감되고 낙찰자가 지정되지 않는 상황 방지
- 여러 DB 작업이 모두 성공하거나 모두 실패해야 하는 경우에 사용
```
// 문제가 될 수 있는 코드 (트랜잭션 없음)
const success = await Auction.findOne({
    where: { GoodId: good_id },
    order: [['bid', 'DESC']], // 입찰가 내림차순 정렬
});
await good.setSold(success.UserId); // 낙찰자 설정
await User.update({ // 낙찰금액 차감
    money: sequelize.literal(`money - ${success.bid}`),
}, {
    where: { id: success.UserId },
});
```

#### 트랜잭션을 사용한 구현
```
// 트랜잭션 시작
const t = await sequelize.transaction();
try {
  // 1. 최고 입찰자 찾기
  const success = await Auction.findOne({
    where: { GoodId: good.id },
    order: [['bid', 'DESC']],
    transaction: t, // 트랜잭션 객체 전달
  });

  // 2. 상품에 낙찰자 정보 업데이트
  await good.setSold(success.UserId, { 
    transaction: t 
  });

  // 3. 낙찰자의 보유금액에서 입찰금액 차감
  await User.update({
    money: sequelize.literal(`money - ${success.bid}`),
    where: { id: success.UserId },
  }, {
    transaction: t 
  });

  // 모든 작업이 성공하면 커밋
  await t.commit();
} catch (error) {
  // 하나라도 실패하면 롤백
  await t.rollback();
  console.error(error);
}
```
#### 트랜잭션 작업 특징
- READ, DELETE 작업은 첫 번째 안에 즉시 수행
- CREATE, UPDATE 작업은 두 번째 안에 지연 수행
- 모든 DB 작업에는 가능하면 트랜잭션 적용 권장

### 2. 스케줄링 시스템 구현

#### 사용 목적
- 카운트다운이 끝나면 더 이상 경매를 진행할 수는 없지만, 아직 낙찰자가 정해지지 않은 상태임.
- 경매 종료를 24시간 후로 정했으므로 경매가 생성되고 나서 24시간이 지난 후에 낙찰자를 정하는 시스템 구현해야 됨.
- 이떄 `node-schedule` 모듈을 사용함

#### 한계 극복 : 운영체제의 스케줄러
- `node-scheduler` 패키지로 등록한 스케줄은 노드 서버가 종료될 때 같이 종료된다는 단점이 있음.
- 이를 극복하려면 운영체제의 스케줄러를 사용하는 것이 좋음.
- 윈도우에서는 `schtasks`가 대표적이고, 맥과 리눅스에서는 `cron`이 대표적임.
- 노드에서는 이 두 프로그램의 명령어를 `child_process`를 통해 호출할 수 있음.

---

## 스스로 해보기
- 상품 등록자는 참여할 수 없게 만들기 (라우터에서 검사)
- 경매 시간을 자유롭게 조정할 수 있도록 만들기 (상품 등록 시 생성할 수 있게 화면과 DB 수정)
- 노드 서버가 꺼졌다 다시 켜졌을 때 스케줄러 다시 생성하기(checkAuction에서 DB 조회후 스케줄러 설정)
- 아무도 입찰하지 않아 낙찰자가 없을 때를 대비한 처리 로직 구현하기(checkAuction과 스케줄러 수정)

---

## 핵심 정리
- 서버에서 클라이언트로 보내는 일방향 통신은 웹 소켓 대신 서버센트 이벤트를 사용해도 됨.
- 기존 입찰내역은 데이터베이스에서 불러오고, 방 참여 후에 추가되는 내역은 웹 소켓에서 불러옴. 이 둘을 매끄럽게 연결하는 방법을 기억해둘것.
- 코드가 길어질 것 같으면 `app.js`로부터 `socket.js`와 `checkAution.js`처럼 분리함.
- 사용자의 입력값은 프론트엔드와 백엔드에서 모두 체크하는게 좋음.
- 스케줄링을 통해 주기적으로 일어나는 작업을 처리할 수 있지만, 노드 서버가 계속 켜져 있어야만 하므로 노드 서버가 꺼졌을 때 대처할 방법을 마련해야 함.