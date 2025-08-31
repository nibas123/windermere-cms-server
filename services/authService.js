const prisma = require('../api/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// In-memory store for demo (replace with DB in production)
const resetCodes = {};

function validatePassword(password) {
  // At least one lowercase, one uppercase, one digit, one special char, min 8 chars
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  return re.test(password);
}

function generateAlphaNumericCode(length = 6) {
  return crypto.randomBytes(length)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, length);
}

exports.register = async (email, password, name) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('User already exists');
  if (!validatePassword(password)) throw new Error('Password must be at least 8 characters and include a-z, A-Z, 0-9, and one special character');
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hash, name },
  });
  
  // Generate JWT token for immediate login after registration
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  
  return { 
    token, 
    user: { id: user.id, email: user.email, name: user.name, role: user.role } 
  };
};

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid credentials');
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};

exports.setAvatar = async (userId, avatarUrl) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { avatar: avatarUrl },
  });
  return { id: user.id, avatar: user.avatar };
};

exports.requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  const code = generateAlphaNumericCode(6);
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min
  resetCodes[email] = { code, expiresAt };
  console.log(`Admin password reset code for ${email}: ${code}`);
  return { message: 'Password reset code sent to email (see console for code)' };
};

exports.verifyResetCode = async (email, code) => {
  const entry = resetCodes[email];
  if (!entry || entry.code !== code || entry.expiresAt < Date.now()) {
    throw new Error('Invalid or expired code');
  }
  return { verified: true };
};

exports.resetPassword = async (email, code, newPassword) => {
  const entry = resetCodes[email];
  if (!entry || entry.code !== code || entry.expiresAt < Date.now()) {
    throw new Error('Invalid or expired code');
  }
  if (!validatePassword(newPassword)) throw new Error('Password must be at least 8 characters and include a-z, A-Z, 0-9, and one special character');
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { email }, data: { password: hash } });
  delete resetCodes[email];
  return { message: 'Password reset successful' };
};

exports.getUserById = async (userId) => {
  return prisma.user.findUnique({ where: { id: userId } });
};

exports.updateProfile = async (userId, data) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { 
      name: data.name,
      email: data.email,
      updatedAt: new Date()
    },
  });
  return user;
};

exports.changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new Error('Current password is incorrect');
  
  if (!validatePassword(newPassword)) {
    throw new Error('Password must be at least 8 characters and include a-z, A-Z, 0-9, and one special character');
  }
  
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hash, updatedAt: new Date() }
  });
}; 