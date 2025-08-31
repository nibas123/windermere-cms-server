const settingsService = require('../services/settingsService');

exports.getSettings = async (req, res) => {
  try {
    const { category } = req.query;
    const settings = await settingsService.getSettings(category);
    res.json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { settings } = req.body; // Array of { key, value } objects
    const updatedSettings = await settingsService.updateSettings(settings);
    res.json(updatedSettings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await settingsService.getSetting(key);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(setting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const setting = await settingsService.updateSetting(key, value);
    res.json(setting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 