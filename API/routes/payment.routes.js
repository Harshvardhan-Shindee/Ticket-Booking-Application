const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { auth } = require('../middleware/auth');

// Create payment order
router.post('/create-order', auth, paymentController.createOrder);

// Verify payment and create ticket
router.post('/verify', auth, paymentController.verifyPayment);

module.exports = router;
