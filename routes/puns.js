const express = require('express');
const router = express.Router();

const { getAll, getSingle, createPun, updatePun, deletePun } = require('../controllers/puns');

router.get('/:id', getSingle);

router.get('/', getAll);

router.post('/', createPun);

router.put('/:id', updatePun);

router.delete('/:id', deletePun);

const { getAllUsers, getSingleUsers, createUser, updateUser, deleteUser } = require('../controllers/users');

router.get('/:id', getSingleUsers);

router.get('/', getAllUsers);

router.post('/', createUser);

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

module.exports = router;
