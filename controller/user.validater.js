const { body, param } = require('express-validator');
const { max, min } = require('../db');

const createUserValidationRules = () => {
  return [
   // param('id').notEmpty().withMessage('User ID is required').isInt().withMessage('Invalid user ID'),
    body('first_name').optional().notEmpty().withMessage('First name is required'),
    body('last_name').optional().notEmpty().withMessage('Last name is required'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone_number').optional().isMobilePhone().withMessage('Invalid phone number'),
  ];
};

const ValidationRulesForupdate = () => {
  return [
    param('id').notEmpty().withMessage('User ID is required').isInt().withMessage('Invalid user ID'),
    body('first_name').optional(),
    body('last_name').optional(),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone_number').optional().isMobilePhone().withMessage('Invalid phone number'),
  ];
};

const ValidationRulesForGetbyId = () => {
  return [param('id').notEmpty().withMessage('User Id is required').isInt().withMessage('Invalid user ID')];
};

const ValidationRulesFordeletebyId = () => {
  return [param('id').notEmpty().withMessage('User Id is required').isInt().withMessage('Invalid user ID')];
};


module.exports = {
  createUserValidationRules,
  ValidationRulesForupdate,
  ValidationRulesForGetbyId,
  ValidationRulesFordeletebyId,
};
