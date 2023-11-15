const { Router } = require('express');
const { validate, fetchUserByEmailOrID } = require('../controller/auth.controller');
const controller = require('../controller/auth.controller');
const {
    tokenValidation,
    signupValidation,
    loginValidation,
} = require('../validation/auth.validation.js');

const routes = Router({ strict: true });

// Register a new User
routes.post('/signup', signupValidation, validate, controller.signup);

// Login user through email and password
routes.post('/login', loginValidation, validate, controller.login);

// Get the user data by providing the access token
routes.get('/profile', tokenValidation(), validate, controller.getUser);

// Get new access and refresh token by providing the refresh token
routes.get('/refresh', tokenValidation(true), validate, controller.refreshToken);

module.exports = routes;
