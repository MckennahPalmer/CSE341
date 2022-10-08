const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

const { getAll, getSingle, createContact, updateContact, deleteContact } = require('../controllers/contacts');

router.get('/:id', getSingle);

router.get('/', getAll);

router.post('/', createContact);

router.put('/:id', updateContact);

router.delete('/:id', deleteContact);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;
