const express = require('express');
const router = express.Router();
const enquiryBookingController = require('../controllers/enquiryBookingController');
const auth = require('../middleware/authMiddleware');

console.log('Loading enquiry booking routes...'); // Debug log

// Public endpoint for creating enquiries
router.post('/', enquiryBookingController.create);

// Admin endpoints (require authentication)
router.get('/', auth, enquiryBookingController.list);
router.get('/count', auth, enquiryBookingController.count);
router.get('/:id', auth, enquiryBookingController.get);
router.put('/:id', auth, enquiryBookingController.update);
router.delete('/:id', auth, enquiryBookingController.remove);
router.patch('/:id/confirm', auth, enquiryBookingController.confirm);
router.patch('/:id/cancel', auth, enquiryBookingController.cancel);

console.log('Enquiry booking routes loaded successfully'); // Debug log

module.exports = router; 