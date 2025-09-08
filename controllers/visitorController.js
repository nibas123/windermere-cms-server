const visitorService = require('../services/visitorService');

exports.register = async (req, res) => {
  try {
    const { email, mobile, name, password } = req.body;
    const result = await visitorService.register({ email, mobile, name, password });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, mobile, code } = req.body;
    const result = await visitorService.verifyCode({ email, mobile, code });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
    const result = await visitorService.login({ email, mobile, password });
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

// Social registration stub for future use
exports.socialRegister = async (req, res) => {
  try {
    const { socialProvider, socialProviderId, email, name } = req.body;
    const result = await visitorService.socialRegister({ socialProvider, socialProviderId, email, name });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listAllVisitors = async (req, res) => {
  try {
    const visitors = await visitorService.listAllVisitors();
    console.log(visitors,"++++++++++++++++++++++++++")
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findVisitors = async (req, res) => {
  try {
    const { email, mobile, bookingId } = req.query;
    const visitors = await visitorService.findVisitors({ email, mobile, bookingId });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email, mobile } = req.body;
    const result = await visitorService.requestPasswordReset({ email, mobile });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, mobile, code, token, newPassword } = req.body;
    const result = await visitorService.resetPassword({ email, mobile, code, token, newPassword });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin methods for visitor management
exports.getVisitors = async (req, res) => {
  console.log("++++++++++++++++++++HELO++++++++++++++++")
  try {
    const visitors = await visitorService.getVisitors();
    console.log(visitors,"++++++++++++++++++++(((((((((((((((((++++++++++++++++++++")
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVisitor = async (req, res) => {
  try {
    const visitor = await visitorService.getVisitor(req.params.id);
    if (!visitor) return res.status(404).json({ error: 'Visitor not found' });
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createVisitor = async (req, res) => {
  try {
    const visitor = await visitorService.createVisitor(req.body);
    res.status(201).json(visitor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateVisitor = async (req, res) => {
  try {
    const visitor = await visitorService.updateVisitor(req.params.id, req.body);
    res.json(visitor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteVisitor = async (req, res) => {
  try {
    await visitorService.deleteVisitor(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
