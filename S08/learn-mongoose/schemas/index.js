require("dotenv").config();
const mongoose = require("mongoose");

const connect = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }

  const dbUser = process.env.MONGODB_USER;
  const dbPassword = process.env.MONGODB_PASSWORD;
  mongoose
    .connect(`mongodb://${dbUser}:${dbPassword}@localhost:27017/admin`, {
      dbName: "nodejs",
    })
    .then(() => {
      console.log("몽고디비 연결 성공");
    })
    .catch((err) => {
      console.error("몽고디비 연결 에러", err);
    });
};

mongoose.connection.on("error", (error) => {
  console.error("몽고디비 연결 에러", error);
});
mongoose.connection.on("disconnected", () => {
  console.error("몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.");
  connect();
});

module.exports = connect;
