const express = require('express');
const router = express.Router();

const { getAll, getSingle } = require('../controllers/contacts');

router.get('/', getAll);

router.get('/:id', getSingle);

router.get('/oid/:oid', getSingle);

router.post('/', contactsController.createContact);

router.put('/:id', contactsController.updateContact);

router.delete('/:id', contactsController.deleteContact);

module.exports = router;
