const prisma = require('../api/prisma');

exports.availability = async (propertyId, from, to) => {
  const overlap = await prisma.booking.findFirst({
    where: {
      propertyId,
      OR: [
        { from: { lte: new Date(to) }, to: { gte: new Date(from) } },
      ],
      status: { in: ['pending', 'confirmed'] },
    },
  });
  return !overlap;
};

exports.initiate = async (propertyId, from, to, visitorId) => {
  // Optionally: check availability again
  const available = await exports.availability(propertyId, from, to);
  if (!available) throw new Error('Dates not available');
  return prisma.booking.create({
    data: {
      propertyId,
      from: new Date(from),
      to: new Date(to),
      visitorId,
      status: 'pending',
    },
  });
};

exports.confirm = async (bookingId, paymentIntentId) => {
  // Optionally: verify paymentIntentId with Stripe
  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'confirmed' },
  });
}; 