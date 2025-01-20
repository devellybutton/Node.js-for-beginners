# Sequelize CRUD 쿼리 정리

## 1. Create (데이터 삽입)
```
-- sql
INSERT INTO nodejs.users (name, age, married, comment) 
VALUES ('zero', 24, 0, '자기소개1');

-- Sequelize
const { User } = require('../models');
User.create({
  name: 'zero',
  age: 24,
  married: false,
  comment: '자기소개1',
});
```

## 2. Read (데이터 조회)
### 1) 모든 데이터 조회
```
-- SQL
SELECT * FROM nodejs.users;

-- Sequelize
User.findAll({});
```

### 2) 하나의 데이터 조회
```
-- SQL
SELECT * FROM nodejs.users LIMIT 1;

-- Sequelize
User.findOne({});
```
### 3) 특정 컬럼만 조회
```
-- SQL
SELECT name, married FROM nodejs.users;

-- Sequelize
User.findAll({
  attributes: ['name', 'married'],
});
```
### 4) 조건부 조회
```
-- SQL
SELECT name, age FROM nodejs.users WHERE married = 1 AND age > 30;

-- Sequelize
const { Op } = require('sequelize');
User.findAll({
  attributes: ['name', 'age'],
  where: {
    married: true,
    age: { [Op.gt]: 30 },
  },
});
```
### 5) OR 연산자 사용
```
-- SQL
SELECT id, name FROM users WHERE married = 0 OR age > 30;

-- Sequelize
User.findAll({
  attributes: ['id', 'name'],
  where: {
    [Op.or]: [
      { married: false },
      { age: { [Op.gt]: 30 } }
    ],
  },
});
```

### 6) 정렬
```
-- SQL
SELECT id, name FROM users ORDER BY age DESC;

-- Sequelize
User.findAll({
  attributes: ['id', 'name'],
  order: [['age', 'DESC']],
});
```

### 7) LIMIT과 OFFSET
```
-- SQL
SELECT id, name FROM users ORDER BY age DESC LIMIT 1 OFFSET 1;

-- Sequelize
User.findAll({
  attributes: ['id', 'name'],
  order: [['age', 'DESC']],
  limit: 1,
  offset: 1,
});
```

## 3. Update (데이터 수정)
```
-- SQL
UPDATE nodejs.users SET comment = '바꿀 내용' WHERE id = 2;

-- Sequelize
User.update({
  comment: '바꿀 내용',
}, {
  where: { id: 2 },
});
```

## 4. Delete (데이터 삭제)
```
-- SQL
DELETE FROM nodejs.users WHERE id = 2;

-- Sequelize
User.destroy({
  where: { id: 2 },
});
```

## 5. 관계형 쿼리

### 1) Include로 관계 조회
```
const user = await User.findOne({
  include: [{
    model: Comment,
  }]
});
console.log(user.Comments); // 사용자 댓글
```

### 2) get메서드로 관계 조회
```
const user = await User.findOne({});
const comments = await user.getComments();
console.log(comments); // 사용자 댓글
```

### 3) 관계 추가
```
const user = await User.findOne({});
const comment = await Comment.create();
await user.addComment(comment);
```

### 4) 다중 관계 추가
```
const user = await User.findOne({});
const comment1 = await Comment.create();
const comment2 = await Comment.create();
await user.addComment([comment1, comment2]);
```

### 5) as 옵션 사용
- as 옵션을 사용하여 관계된 모델의 이름을 변경
```
// 관계 설정
db.User.hasMany(db.Comment, {
  foreignKey: 'commenter',
  sourceKey: 'id',
  as: 'Answers'
});

// 쿼리
const user = await User.findOne({});
const comments = await user.getAnswers();
```

### 6) 조건부 관계 조회
```
const user = await User.findOne({
  include: [{
    model: Comment,
    where: { id: 1 },
    attributes: ['id'],
  }]
});

// 또는
const comments = await user.getComments({
  where: { id: 1 },
  attributes: ['id'],
});
```


## 6. Op 연산자 종류
- `Op.gt`: 초과
- `Op.gte`: 이상
- `Op.lt`: 미만
- `Op.lte`: 이하
- `Op.ne`: 같지 않음
- `Op.or`: OR 연산
- `Op.in`: 배열 요소 중 하나
- `Op.notIn`: 배열 요소와 모두 다름

