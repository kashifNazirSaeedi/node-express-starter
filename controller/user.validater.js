const { body, param } = require('express-validator');

const createUserValidationRules = () => {
  return [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage(' email address already axists'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('phone_number').isMobilePhone().withMessage('Invalid phone number'),
  ];
};

const ValidationRulesForupdate = () => {
  return [
    param('id').notEmpty().withMessage('User Id is required'),
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('phone_number').isMobilePhone().withMessage('Invalid phone number'),
  ];
};

const ValidationRulesForGetbyId = () => {
  return [param('id').notEmpty().withMessage('User Id is required')];
};

const ValidationRulesFordeletebyId = () => {
  return [param('id').notEmpty().withMessage('User Id is required')];
};

module.exports = {
  createUserValidationRules,
  ValidationRulesForupdate,
  ValidationRulesForGetbyId,
  ValidationRulesFordeletebyId,
};
