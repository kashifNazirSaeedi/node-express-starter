const express = require('express');
const router = express.Router();

const {
  getUserById,
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} = require('../controller/user.controller.js');

const { createUserValidationRules,
  ValidationRulesForupdate ,
 ValidationRulesForGetbyId,
 ValidationRulesFordeletebyId,
 handleValidationErrors}
= require('../controller/user.validater.js');

router.get('/', getAllUsers);

router.post('/', createUserValidationRules,handleValidationErrors,createUser,);

router.get('/:id', getUserById,ValidationRulesForGetbyId);

router.patch('/:id', updateUser,ValidationRulesForupdate);

router.delete('/:id', deleteUser,ValidationRulesFordeletebyId);

module.exports = router;
