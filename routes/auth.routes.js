const express = require('express');
const router = express.Router();

const { login, signup } = require('../controller/auth.controller');
const { verifyValidationResult } = require('../validation/index.validation.js');
const { signupValidation, loginValidation } = require('../validation/auth.validation.js');

router.post('/login', loginValidation(), verifyValidationResult, login);
router.post('/signup', signupValidation(), verifyValidationResult, signup);

module.exports = router;
