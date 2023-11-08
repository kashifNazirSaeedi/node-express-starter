const express = require('express');
const router = express.Router();

const {
  getUserById,
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} = require('../controller/user.controller.js');

router.get('/', getAllUsers);

router.post('/', createUser);

router.get('/:id', getUserById);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;
