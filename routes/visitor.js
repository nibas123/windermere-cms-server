const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const auth = require('../middleware/authMiddleware');

// Public visitor endpoints
router.post('/register', visitorController.register);
router.post('/verify-code', visitorController.verifyCode);
router.post('/login', visitorController.login);
router.post('/social-register', visitorController.socialRegister); // provision for phase 2
router.post('/request-password-reset', visitorController.requestPasswordReset);
router.post('/reset-password', visitorController.resetPassword);

// Admin endpoints (require authentication)
router.get('/', visitorController.getVisitors);
router.get('/:id', auth, visitorController.getVisitor);
router.post('/admin', auth, visitorController.createVisitor);
router.put('/:id', auth, visitorController.updateVisitor);
router.delete('/:id', auth, visitorController.deleteVisitor);

module.exports = router;