const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authenticateAdmin } = require('../middleware/auth.js');

router.get('/', authenticateAdmin, settingsController.getSettings);
router.put('/', authenticateAdmin, settingsController.updateSettings);
router.get('/:key', authenticateAdmin, settingsController.getSetting);
router.put('/:key', authenticateAdmin, settingsController.updateSetting);

module.exports = router; 