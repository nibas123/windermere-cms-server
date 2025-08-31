const analyticsService = require('../services/analyticsService');

exports.overview = async (req, res) => {
  try {
    const data = await analyticsService.overview();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.properties = async (req, res) => {
  try {
    const data = await analyticsService.properties();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.recent = async (req, res) => {
  try {
    const data = await analyticsService.recent();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.income = async (req, res) => {
  try {
    const { start, end } = req.query;
    const data = await analyticsService.income({ start, end });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.expenses = async (req, res) => {
  try {
    const { start, end } = req.query;
    const data = await analyticsService.expenses({ start, end });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refunds = async (req, res) => {
  try {
    const { start, end } = req.query;
    const data = await analyticsService.refunds({ start, end });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.bookingStats = async (req, res) => {
  try {
    const { start, end, propertyId, status } = req.query;
    const data = await analyticsService.bookingStats({ start, end, propertyId, status });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.seasonalTrends = async (req, res) => {
  try {
    const { year } = req.query;
    const data = await analyticsService.seasonalTrends({ year });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 