const express = require('express');
const router = express.Router();

const { getAll, getSingle, createPun, updatePun, deletePun } = require('../controllers/puns');

router.get('/:id', getSingle);

router.get('/', getAll);

router.post('/', createPun);

router.put('/:id', updatePun);

router.delete('/:id', deletePun);

module.exports = router;
