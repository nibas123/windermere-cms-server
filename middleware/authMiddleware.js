const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
// const prisma = new PrismaClient();

module.exports = async function (req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Auth header:', authHeader); // DEBUG

  let token = null;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In development, fallback to a real visitor from DB
    if (process.env.NODE_ENV === 'development') {
      const visitor = await prisma.visitor.findFirst();
      if (!visitor) {
        return res.status(401).json({ error: 'No visitors in DB for fallback.' });
      }
      token = jwt.sign(
        { id: visitor.id, role: 'visitor', email: visitor.email, mobile: visitor.mobile },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      console.log('No token provided, using first visitor from DB (development only)');
    } else {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }
  } else {
    token = authHeader.replace('Bearer ', '').trim();
    // If placeholder, use real visitor in development
    if (token.startsWith('{{') && token.endsWith('}}')) {
      if (process.env.NODE_ENV === 'development') {
        const visitor = await prisma.visitor.findFirst();
        if (!visitor) {
          return res.status(401).json({ error: 'No visitors in DB for fallback.' });
        }
        token = jwt.sign(
          { id: visitor.id, role: 'visitor', email: visitor.email, mobile: visitor.mobile },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        console.log('Placeholder token detected, using first visitor from DB (development only)');
      } else {
        return res.status(401).json({ error: 'Token variable not set. Please login and set the token variable in your API client.' });
      }
    }
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded JWT:', decoded); // DEBUG
    if (decoded.role === 'visitor') {
      req.user = { visitorId: decoded.id, role: decoded.role };
    } else {
      req.user = { id: decoded.id, role: decoded.role };
    }
    next();
  } catch (err) {
    console.error('JWT verification error:', err); // DEBUG
    res.status(401).json({ error: 'Token is not valid', details: err.message });
  }
}; 