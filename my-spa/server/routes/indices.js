const express = require('express');
const router  = express.Router();
const { getIndices } = require('../controllers/indicesController');

router.get('/', getIndices);

module.exports = router;
