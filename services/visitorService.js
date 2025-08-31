const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

function generateAlphaNumericCode(length = 6) {
  return crypto.randomBytes(length)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, length);
}

function validatePassword(password) {
  // At least one lowercase, one uppercase, one digit, one special char, min 8 chars
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;
  return re.test(password);
}

exports.register = async ({ email, mobile, name, password }) => {
  if (!email && !mobile) throw new Error('Email or mobile is required');
  if (!password) throw new Error('Password is required');
  if (!validatePassword(password)) throw new Error('Password must be at least 8 characters and include a-z, A-Z, 0-9, and one special character');
  let visitor = await prisma.visitor.findFirst({ where: { OR: [{ email }, { mobile }] } });
  if (visitor && visitor.verified) throw new Error('Visitor already registered');
  const hash = await bcrypt.hash(password, 10);
  if (!visitor) {
    visitor = await prisma.visitor.create({
      data: {
        email,
        mobile,
        name,
        password: hash,
        registrationMethod: email ? 'email' : 'mobile',
        verified: false,
      },
    });
  } else {
    await prisma.visitor.update({ where: { id: visitor.id }, data: { name, password: hash } });
    visitor = await prisma.visitor.findUnique({ where: { id: visitor.id } });
  }
  const code = generateAlphaNumericCode(6);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  await prisma.verificationCode.create({
    data: { visitorId: visitor.id, code, type: email ? 'email' : 'sms', expiresAt },
  });
  if (email) {
    console.log(`Verification code sent to email ${email}: ${code}`);
  } else if (mobile) {
    console.log(`Verification code sent to mobile ${mobile}: ${code}`);
  }
  return { message: 'Verification code sent' };
};

exports.verifyCode = async ({ email, mobile, code }) => {
  console.log('Verifying for:', { email, mobile, code });
  const visitor = await prisma.visitor.findFirst({ where: { OR: [{ email }, { mobile }] } });
  console.log('Found visitor:', visitor);
  if (!visitor) throw new Error('Visitor not found');
  const vcode = await prisma.verificationCode.findFirst({
    where: {
      visitorId: visitor.id,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });
  if (!vcode) throw new Error('Invalid or expired code');
  await prisma.verificationCode.update({ where: { id: vcode.id }, data: { used: true } });
  await prisma.visitor.update({ where: { id: visitor.id }, data: { verified: true, verifiedAt: new Date() } });
  return { verified: true };
};

exports.login = async ({ email, mobile, password }) => {
  if (!email && !mobile) throw new Error('Email or mobile is required');
  if (!password) throw new Error('Password is required');
  const visitor = await prisma.visitor.findFirst({ where: { OR: [{ email }, { mobile }] } });
  if (!visitor || !visitor.verified) throw new Error('Invalid credentials or not verified');
  const valid = await bcrypt.compare(password, visitor.password);
  if (!valid) throw new Error('Invalid credentials');
  // FIX: Use { id, role: 'visitor', ... } for JWT payload
  const token = jwt.sign({ id: visitor.id, role: 'visitor', email: visitor.email, mobile: visitor.mobile }, JWT_SECRET, { expiresIn: '7d' });
  return { token, visitor: { id: visitor.id, email: visitor.email, mobile: visitor.mobile, name: visitor.name } };
};

// Social registration stub for future use
exports.socialRegister = async ({ socialProvider, socialProviderId, email, name }) => {
  let visitor = await prisma.visitor.findFirst({ where: { socialProvider, socialProviderId } });
  if (!visitor) {
    visitor = await prisma.visitor.create({
      data: {
        socialProvider,
        socialProviderId,
        email,
        name,
        registrationMethod: 'social',
        verified: true,
        verifiedAt: new Date(),
      },
    });
  }
  return { visitor };
};

exports.listAllVisitors = async () => {
  const allVisitors = await prisma.visitor.findMany();
  return allVisitors;
};

// Admin methods for visitor management
exports.getVisitors = async () => {
  return prisma.visitor.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

exports.getVisitor = async (id) => {
  return prisma.visitor.findUnique({
    where: { id },
  });
};

exports.createVisitor = async (data) => {
  return prisma.visitor.create({
    data: {
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      verified: true, // Admin created visitors are automatically verified
      verifiedAt: new Date(),
    },
  });
};

exports.updateVisitor = async (id, data) => {
  return prisma.visitor.update({
    where: { id },
    data,
  });
};

exports.deleteVisitor = async (id) => {
  return prisma.visitor.delete({
    where: { id },
  });
};

exports.findVisitors = async ({ email, mobile, bookingId }) => {
  const where = {};
  if (email) where.email = email;
  if (mobile) where.mobile = mobile;
  // Provision for bookingId
  if (bookingId) where.bookings = { some: { id: bookingId } };
  return prisma.visitor.findMany({ where });
};

exports.requestPasswordReset = async ({ email, mobile }) => {
  if (!email && !mobile) throw new Error('Email or mobile is required');
  const visitor = await prisma.visitor.findFirst({ where: { OR: [{ email }, { mobile }] } });
  if (!visitor) throw new Error('Visitor not found');
  if (mobile) {
    // Mobile: send code
    const code = generateAlphaNumericCode(6);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await prisma.verificationCode.create({
      data: { visitorId: visitor.id, code, type: 'sms', expiresAt },
    });
    console.log(`Password reset code sent to mobile ${mobile}: ${code}`);
    return { message: 'Password reset code sent to mobile' };
  } else if (email) {
    // Email: generate link
    const token = generateAlphaNumericCode(32);
    // Store token in VerificationCode for simplicity
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await prisma.verificationCode.create({
      data: { visitorId: visitor.id, code: token, type: 'reset-link', expiresAt },
    });
    const resetLink = `https://your-frontend.com/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    console.log(`Password reset link for ${email}: ${resetLink}`);
    return { message: 'Password reset link sent to email (see console for link)' };
  }
};

exports.resetPassword = async ({ email, mobile, code, token, newPassword }) => {
  if (!validatePassword(newPassword)) throw new Error('Password must be at least 8 characters and include a-z, A-Z, 0-9, and one special character');
  let visitor;
  if (mobile && code) {
    visitor = await prisma.visitor.findFirst({ where: { mobile } });
    if (!visitor) throw new Error('Visitor not found');
    const vcode = await prisma.verificationCode.findFirst({
      where: {
        visitorId: visitor.id,
        code,
        used: false,
        expiresAt: { gt: new Date() },
        type: 'sms',
      },
    });
    if (!vcode) throw new Error('Invalid or expired code');
    await prisma.verificationCode.update({ where: { id: vcode.id }, data: { used: true } });
  } else if (email && token) {
    visitor = await prisma.visitor.findFirst({ where: { email } });
    if (!visitor) throw new Error('Visitor not found');
    const vcode = await prisma.verificationCode.findFirst({
      where: {
        visitorId: visitor.id,
        code: token,
        used: false,
        expiresAt: { gt: new Date() },
        type: 'reset-link',
      },
    });
    if (!vcode) throw new Error('Invalid or expired token');
    await prisma.verificationCode.update({ where: { id: vcode.id }, data: { used: true } });
  } else {
    throw new Error('Invalid request');
  }
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.visitor.update({ where: { id: visitor.id }, data: { password: hash } });
  return { message: 'Password reset successful' };
};
