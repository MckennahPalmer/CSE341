const express = require('express');
const router = express.Router();

const { getAllUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users');

router.get('/:id', getUser);

router.get('/', getAllUsers);

router.post('/', createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;
