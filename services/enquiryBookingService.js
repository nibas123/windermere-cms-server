const prisma = require('../api/prisma');

exports.create = async (data) => {
  return prisma.enquiryBooking.create({ 
    data,
    include: { property: true }
  });
};

exports.list = async (params = {}) => {
  const where = {};
  if (params.status) where.status = params.status;
  if (params.propertyId) where.propertyId = params.propertyId;
  
  return prisma.enquiryBooking.findMany({
    where,
    include: { property: true },
    orderBy: { createdAt: 'desc' },
  });
};

exports.get = async (id) => {
  return prisma.enquiryBooking.findUnique({
    where: { id },
    include: { property: true }
  });
};

exports.update = async (id, data) => {
  return prisma.enquiryBooking.update({
    where: { id },
    data,
    include: { property: true }
  });
};

exports.remove = async (id) => {
  return prisma.enquiryBooking.delete({ where: { id } });
};

exports.count = async () => {
  return prisma.enquiryBooking.count();
};

exports.confirm = async (id) => {
  return prisma.enquiryBooking.update({
    where: { id },
    data: { status: 'CONFIRMED' },
    include: { property: true }
  });
};

exports.cancel = async (id) => {
  return prisma.enquiryBooking.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: { property: true }
  });
}; 