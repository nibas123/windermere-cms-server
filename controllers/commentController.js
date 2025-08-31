const commentService = require('../services/commentService');

// Visitor submits a comment
exports.submit = async (req, res) => {
  try {
    const { propertyId, content, rating } = req.body;
    const visitorId = req.user?.visitorId; // from JWT
    console.log('DEBUG submit:', { propertyId, content, visitorId, user: req.user });
    if (!propertyId || !content || !visitorId) {
      return res.status(400).json({ error: 'propertyId, content, and visitorId are required' });
    }
    const comment = await commentService.submit({ propertyId, content, rating, visitorId });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin fetches all comments (with optional filters)
exports.list = async (req, res) => {
  try {
    const { status, propertyId } = req.query;
    const comments = await commentService.list({ status, propertyId });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin approves a comment
exports.approve = async (req, res) => {
  try {
    const comment = await commentService.approve(req.params.id);
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin rejects a comment
exports.reject = async (req, res) => {
  try {
    const comment = await commentService.reject(req.params.id);
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin replies to a comment
exports.reply = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ error: 'Reply is required' });
    const comment = await commentService.reply(req.params.id, reply);
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin deletes a comment
exports.remove = async (req, res) => {
  try {
    await commentService.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 