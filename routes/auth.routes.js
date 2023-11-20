const express = require("express");
const router = express.Router();

const {
  validate,
  fetchUserByEmailOrID,
  login,
  signup,
  getUser,
  refreshToken,
} = require("../controller/auth.controller");

const {
  tokenValidation,
  signupValidation,
  loginValidation,
} = require("../validation/auth.validation.js");

//const routes = Router({ strict: true });

// Register a new User
router.post("/signup", signupValidation(), signup);

// Login user through email and password
router.post("/login", login);

// Get the user data by providing the access token
router.get(
  "/profile",
  tokenValidation(),
  validate,
  getUser,
  fetchUserByEmailOrID
);

// Get new access and refresh token by providing the refresh token
router.get(
  "/refresh",
  tokenValidation(true),
  validate,
  refreshToken,
  fetchUserByEmailOrID
);

module.exports = router;
