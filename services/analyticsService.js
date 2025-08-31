const prisma = require('../api/prisma');

exports.overview = async () => {
  const totalBookings = await prisma.booking.count();
  const totalRevenue = await prisma.payment.aggregate({ _sum: { amount: true } });
  const totalProperties = await prisma.property.count();
  const confirmedBookings = await prisma.booking.count({ where: { status: 'confirmed' } });
  const occupancy = totalProperties ? (confirmedBookings / totalProperties) : 0;
  return {
    totalBookings,
    totalRevenue: totalRevenue._sum.amount || 0,
    totalProperties,
    occupancy,
  };
};

exports.getPropertyAnalytics = async () => {
  const properties = await prisma.property.findMany({
    include: {
      bookings: true,
      // images: true, // Remove this line, images is now a String[]
    },
  });
  return properties.map(p => ({
    ...p,
    // images: p.images.map(img => img.url), // Remove this, just use p.images
    images: p.images,
    bookingCount: p.bookings.length,
  }));
};

exports.recent = async () => {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { property: true, visitor: true, payment: true },
  });
  return bookings;
};

exports.income = async ({ start, end }) => {
  const where = { type: 'income' };
  if (start || end) where.createdAt = {};
  if (start) where.createdAt.gte = new Date(start);
  if (end) where.createdAt.lte = new Date(end);
  const total = await prisma.payment.aggregate({
    _sum: { amount: true },
    where,
  });
  return { totalIncome: total._sum.amount || 0 };
};

exports.expenses = async ({ start, end }) => {
  const where = { type: 'expense' };
  if (start || end) where.createdAt = {};
  if (start) where.createdAt.gte = new Date(start);
  if (end) where.createdAt.lte = new Date(end);
  const total = await prisma.payment.aggregate({
    _sum: { amount: true },
    where,
  });
  return { totalExpenses: total._sum.amount || 0 };
};

exports.refunds = async ({ start, end }) => {
  const where = { type: 'refund' };
  if (start || end) where.createdAt = {};
  if (start) where.createdAt.gte = new Date(start);
  if (end) where.createdAt.lte = new Date(end);
  const total = await prisma.payment.aggregate({
    _sum: { amount: true },
    where,
  });
  return { totalRefunds: total._sum.amount || 0 };
};

exports.bookingStats = async ({ start, end, propertyId, status }) => {
  const where = {};
  if (start || end) where.createdAt = {};
  if (start) where.createdAt.gte = new Date(start);
  if (end) where.createdAt.lte = new Date(end);
  if (propertyId) where.propertyId = propertyId;
  if (status) where.status = status;
  const total = await prisma.booking.count({ where });
  return { totalBookings: total };
};

exports.seasonalTrends = async ({ year }) => {
  // Group bookings by month for the given year
  const bookings = await prisma.booking.findMany({
    where: year ? {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${Number(year) + 1}-01-01`),
      },
    } : {},
    select: { createdAt: true },
  });
  const trends = Array(12).fill(0);
  bookings.forEach(b => {
    const month = b.createdAt.getMonth();
    trends[month]++;
  });
  return { monthlyBookings: trends };
}; 