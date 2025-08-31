const bookingService = require('../services/bookingService');

exports.availability = async (req, res) => {
  try {
    const { propertyId, from, to } = req.body;
    const available = await bookingService.availability(propertyId, from, to);
    res.json({ available });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.initiate = async (req, res) => {
  try {
    const { propertyId, from, to, visitorId } = req.body;
    const booking = await bookingService.initiate(propertyId, from, to, visitorId);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.confirm = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const booking = await bookingService.confirm(req.params.bookingId, paymentIntentId);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 