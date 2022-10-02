const express = require('express');
const router = express.Router();

const { getAll, getSingle, createContact, updateContact, deleteContact } = require('../controllers/contacts');

router.get('/:id', getSingle);

router.get('/', getAll);

router.post('/', createContact);

router.put('/:id', updateContact);

router.delete('/:id', deleteContact);

module.exports = router;
