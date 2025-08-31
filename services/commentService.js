const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.submit = async ({ propertyId, content, rating, visitorId }) => {
  if (!propertyId || !content || !visitorId) throw new Error('propertyId, content, and visitorId are required');
  
  const data = {
    propertyId,
    content,
    visitorId,
    status: 'PENDING', // Use the enum value instead of string
  };
  
  // Only add rating if it's provided and valid
  if (rating !== undefined && rating !== null) {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
    data.rating = rating;
  }
  
  return prisma.comment.create({ data });
};

exports.list = async ({ status, propertyId }) => {
  const where = {};
  if (status) where.status = status;
  if (propertyId) where.propertyId = propertyId;
  
  console.log('CommentService.list - Filter params:', { status, propertyId });
  console.log('CommentService.list - Where clause:', where);
  
  const comments = await prisma.comment.findMany({
    where,
    include: { visitor: true, property: true },
    orderBy: { createdAt: 'desc' },
  });
  
  console.log('CommentService.list - Found comments:', comments.length);
  console.log('CommentService.list - Comment statuses:', comments.map(c => c.status));
  
  return comments;
};

exports.approve = async (id) => {
  return prisma.comment.update({
    where: { id },
    data: { status: 'APPROVED' },
  });
};

exports.reject = async (id) => {
  return prisma.comment.update({
    where: { id },
    data: { status: 'REJECTED' },
  });
};

exports.reply = async (id, reply) => {
  return prisma.comment.update({
    where: { id },
    data: { reply },
  });
};

exports.remove = async (id) => {
  return prisma.comment.delete({ where: { id } });
}; 