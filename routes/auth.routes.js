const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  resetPassword,
  sendResetEmail,
} = require("../controller/auth.controller");
const { verifyValidationResult } = require("../validation/index.validation.js");
const {
  signupValidation,
  loginValidation,
} = require("../validation/auth.validation.js");

router.post("/login", loginValidation(), verifyValidationResult, login);
router.post("/signup", signupValidation(), verifyValidationResult, signup);
router.get("/reset", verifyValidationResult, resetPassword);
router.post("/forget", verifyValidationResult, sendResetEmail);

module.exports = router;
