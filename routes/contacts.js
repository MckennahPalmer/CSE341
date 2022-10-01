const express = require('express');
const router = express.Router();

const { getAll, getSingle, createContact, updateContact, deleteContact } = require('../controllers/contacts');

router.get('/', getAll);

router.get('/:id', getSingle);

router.get('/oid/:oid', getSingle);

router.post('/', createContact);

router.put('/:id', updateContact);

router.delete('/:id', deleteContact);

module.exports = router;
