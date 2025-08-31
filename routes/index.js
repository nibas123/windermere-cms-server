const express = require('express');
const router = express.Router();

const healthRouter = require('./health');
const authRouter = require('./auth');
const propertyRouter = require('./property');
const visitorRouter = require('./visitor');
const bookingRouter = require('./booking');
const paymentRouter = require('./payment');
const analyticsRouter = require('./analytics');
const commentRouter = require('./comment');
const enquiryBookingRouter = require('./enquiryBooking');
const settingsRouter = require('./settings');

console.log('Registering enquiry booking routes...'); // Debug log

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/properties', propertyRouter);
router.use('/visitors', visitorRouter);
router.use('/bookings', bookingRouter);
router.use('/payments', paymentRouter);
router.use('/analytics', analyticsRouter);
router.use('/comments', commentRouter);
router.use('/enquiry-bookings', enquiryBookingRouter);
router.use('/settings', settingsRouter);

console.log('All routes registered successfully'); // Debug log

// TODO: Add other routers (auth, properties, bookings, etc.)

module.exports = router; 