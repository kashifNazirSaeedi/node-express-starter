const express = require('express');
const router = express.Router();

const { login, signup } = require('../controller/auth.controller');
const { signupValidation, loginValidation } = require('../validation/auth.validation.js');
const { verifyValidationResult } = require('../validation/index.validation.js');

router.post('/login', loginValidation(), verifyValidationResult, login);
router.post('/signup', signupValidation(), verifyValidationResult, signup);

module.exports = router;
