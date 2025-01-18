const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isNotLoggedIn, isLoggedIn } = require("../middlewares");
const { join, login, logout } = require("../controllers/auth");

router.post("/login", isNotLoggedIn, login);

router.post("/join", isNotLoggedIn, join);

router.get("/logout", isLoggedIn, logout);

router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/?error=카카오로그인 실패",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

module.exports = router;
