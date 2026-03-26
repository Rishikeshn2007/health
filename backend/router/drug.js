const express = require('express');
const router = express.Router();
const drugController = require('../controllers/drug');

// GET /drug/search?name=aspirin
router.get('/search', drugController.handleDrugSearch);

module.exports = router;
