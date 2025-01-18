const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isNotLoggedIn, isLoggedIn } = require("../middlewares");
const { join, login, logout } = require("../controllers/auth");

router.post(
  "/login",
  passport.authenticate("local", () => {
    req.login();
  })
);

router.post("/join", isNotLoggedIn, join);

module.exports = router;
