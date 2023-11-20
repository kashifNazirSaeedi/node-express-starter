const { body } = require('express-validator');

const loginValidation = () => [
  body('email', 'invalid email').trim().isEmail(),
  body('password').trim().isLength({ min: 6 }),
];

const signupValidation = () => [
  body('first_name').notEmpty().withMessage('first name should not be empty'),
  body('last_name').notEmpty().withMessage('last name should not be empty'),
  body('email').notEmpty().isEmail().withMessage('Invalid email'),
  body('phone_number').notEmpty().withMessage('Invalid phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('confirm_password')
    .isLength({ min: 6 })
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password do not match');
      }
      return true;
    })
    .withMessage('Password do not match'),
];

module.exports = {
  signupValidation,
  loginValidation,
};
