const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  resetPassword,
  forgetPassword,
} = require("../controller/auth.controller");
const { verifyValidationResult } = require("../validation/index.validation.js");

const {
  signupValidation,
  loginValidation,
  resetPasswordValidation,
  forgetPasswordValidation,
} = require("../validation/auth.validation.js");

router.post("/signup", signupValidation(), verifyValidationResult, signup);
router.post("/login", loginValidation(), verifyValidationResult, login);
router.patch(
  "/forget",
  forgetPasswordValidation(),
  verifyValidationResult,
  forgetPassword
);
router.get(
  "/reset/:token",
  resetPasswordValidation(),
  verifyValidationResult,
  resetPassword
);

module.exports = router;
