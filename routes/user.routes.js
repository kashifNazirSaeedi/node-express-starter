const express = require("express");
const router = express.Router();

const {
  createUser,
  deleteUser,
  updateUser,
  getUserById,
  getAllUsers,
} = require("../controller/user.controller.js");

const {
  createUserValidation,
  updateUserValidation,
  getUserByIdValidation,
  deleteUserByIdValidation,
} = require("../validation/user.validation.js");
const { verifyValidationResult } = require("../validation/index.validation.js");

router.get("/", getAllUsers);
router.post("/", createUserValidation(), verifyValidationResult, createUser);
router.get(
  "/:id",
  getUserByIdValidation(),
  verifyValidationResult,
  getUserById
);
router.patch(
  "/:id",
  updateUserValidation(),
  verifyValidationResult,
  updateUser
);
router.delete(
  "/:id",
  deleteUserByIdValidation(),
  verifyValidationResult,
  deleteUser
);

module.exports = router;
