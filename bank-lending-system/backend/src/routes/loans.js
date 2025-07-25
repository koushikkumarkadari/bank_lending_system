const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const loanController = require('../controllers/loanController');

router.post('/', authMiddleware, loanController.createLoan);
router.post('/:loan_id/payments', authMiddleware, loanController.makePayment);
router.get('/ledger', authMiddleware, loanController.getLedger); // Changed to list all loans for user

module.exports = router;