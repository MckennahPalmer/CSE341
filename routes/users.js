const express = require('express');
const router = express.Router();

const { getAllUsers, getSingleUsers, createUser, updateUser, deleteUser } = require('../controllers/users');

router.get('/:id', getSingleUsers);

router.get('/', getAllUsers);

router.post('/', createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;
