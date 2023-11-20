const { body, param } = require('express-validator');

const createUserValidation = () => [
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('email').notEmpty().isEmail().withMessage('Invalid email address'),
  body('password')
    .notEmpty()
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
  body('phone_number').optional().isMobilePhone().withMessage('Invalid phone number'),
];

const updateUserValidation = () => [
  param('id').notEmpty().withMessage('User ID is required'),
  body('first_name').optional(),
  body('last_name').optional(),
  body('phone_number').optional(),
];

const getUserByIdValidation = () => [
  param('id').notEmpty().withMessage('User Id is required'),
];

const deleteUserByIdValidation = () => [
  param('id').notEmpty().withMessage('User Id is required'),
];

module.exports = {
  createUserValidation,
  updateUserValidation,
  getUserByIdValidation,
  deleteUserByIdValidation,
};
