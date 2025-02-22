const mongoose = require("mongoose");

const { Schema } = mongoose;
const roomSchema = new Schema({
  // 방 이름
  title: {
    type: String,
    required: true,
  },
  // 인원
  max: {
    type: Number,
    required: true,
    default: 10,
    min: 2,
  },
  // 방장
  owner: {
    type: String,
    required: true,
  },
  // 비밀번호 (조건부)
  password: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", roomSchema);
