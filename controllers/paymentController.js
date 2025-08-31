const paymentService = require('../services/paymentService');

exports.createSession = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const session = await paymentService.createSession(bookingId);
    res.json({ url: session.url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.webhook = async (req, res) => {
  try {
    await paymentService.handleWebhook(req, res);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 