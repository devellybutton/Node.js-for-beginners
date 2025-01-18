const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post(
  "/auth/login",
  passport.authenticate("local", () => {
    req.login();
  })
);

module.exports = router;
