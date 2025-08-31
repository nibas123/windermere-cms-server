const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const visitorAuth = require('../middleware/authMiddleware');

router.post('/availability', bookingController.availability);
router.post('/initiate', visitorAuth, bookingController.initiate);
router.post('/:bookingId/confirm', visitorAuth, bookingController.confirm);

module.exports = router; 