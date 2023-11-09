const { body } = require('express-validator');

const updateUserValidationRules = () => {
  return [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone_number').isMobilePhone().withMessage('Invalid phone number'),
  ];
};

module.exports = { updateUserValidationRules };
