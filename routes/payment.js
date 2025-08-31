const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/create-session', paymentController.createSession);
// Stripe webhook needs raw body
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.webhook);

module.exports = router; 