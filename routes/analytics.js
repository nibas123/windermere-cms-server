const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/authMiddleware');

router.get('/overview', auth, analyticsController.overview);
router.get('/properties', auth, analyticsController.properties);
router.get('/recent', auth, analyticsController.recent);
router.get('/income', auth, analyticsController.income);
router.get('/expenses', auth, analyticsController.expenses);
router.get('/refunds', auth, analyticsController.refunds);
router.get('/bookings', auth, analyticsController.bookingStats);
router.get('/seasonal-trends', auth, analyticsController.seasonalTrends);

module.exports = router; 