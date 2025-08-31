const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');

// Visitor submits a comment
router.post('/', auth, commentController.submit); // visitor JWT

// Admin endpoints
router.get('/', auth, commentController.list); // admin JWT
router.patch('/:id/approve', auth, commentController.approve); // admin JWT
router.patch('/:id/reject', auth, commentController.reject); // admin JWT
router.post('/:id/reply', auth, commentController.reply); // admin JWT
router.delete('/:id', auth, commentController.remove); // admin JWT

module.exports = router; 