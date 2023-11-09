const express = require('express');
const router = express.Router();

const {
  getUserById,
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} = require('../controller/user.controller.js');

const {
  createUserValidationRules,
  ValidationRulesForupdate,
  ValidationRulesForGetbyId,
  ValidationRulesFordeletebyId,
} = require('../controller/user.validater.js');

router.get('/', getAllUsers);

router.post('/', createUserValidationRules(), createUser);

router.get('/:id', ValidationRulesForGetbyId(), getUserById);

router.patch('/:id', ValidationRulesForupdate(), updateUser);

router.delete('/:id', ValidationRulesFordeletebyId(), deleteUser);

module.exports = router;
