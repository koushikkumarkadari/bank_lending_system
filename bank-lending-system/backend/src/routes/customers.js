const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const customerController = require('../controllers/customerController');

router.get('/overview', authMiddleware, customerController.getOverview);

module.exports = router;