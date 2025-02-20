# Node.js 모듈 내보내기/가져오기 방식
- CommonJS에는 Named Exports와 Default Export가 있음.

## 1. Named Exports
```
const follow = require("../services/user");
const User = require("../models/user");

exports.follow = async (userId, followingId) => {
  const user = await User.findOne({ where: { id: userId } });
  if (user) {
    await user.addFollowing(parseInt(followingId, 10));
    return "ok";
  } else {
    return "no user";
  }
};
```
### 1) 구조분해할당 
```
const { follow } = require("../services/user");
```

### 2) 전체 객체로 가져와서 사용
```
const userService = require("../services/user");
// 사용할 때: userService.follow
```

## 2. Default Export
```
// services/user.js
module.exports = async (userId, followingId) => {
  const user = await User.findOne({ where: { id: userId } });
  if (user) {
    await user.addFollowing(parseInt(followingId, 10));
    return "ok";
  } else {
    return "no user";
  }
};
```
### 1) 단일값 직접 가져오기
```
const follow = require("../services/user");
```