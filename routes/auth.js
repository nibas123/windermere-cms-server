const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateAdmin } = require('../middleware/auth.js');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin/request-password-reset', authController.requestPasswordReset);
router.post('/admin/verify-reset-code', authController.verifyResetCode);
router.post('/admin/reset-password', authController.resetPassword);
router.post('/admin/avatar', authenticateAdmin, authController.uploadAvatar);
router.get('/admin/avatar', authenticateAdmin, authController.getAvatar);
router.get('/admin/profile', authenticateAdmin, authController.getProfile);
router.put('/admin/profile', authenticateAdmin, authController.updateProfile);
router.put('/admin/change-password', authenticateAdmin, authController.changePassword);

module.exports = router; 