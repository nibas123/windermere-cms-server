const prisma = require('../api/prisma');
const Stripe = require('stripe');
console.log('Stripe Key:', process.env.STRIPE_SECRET_KEY); // DEBUG: Check if key is loaded
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createSession = async (bookingId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { property: true },
  });
  if (!booking) throw new Error('Booking not found');
  if (!booking.property) throw new Error('Property not found');
  // For demo: use basePrice from pricing or fallback
  const property = booking.property;
  const pricing = await prisma.pricing.findUnique({ where: { propertyId: property.id } });
  const amount = pricing ? pricing.basePrice : 100;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: property.name,
            description: property.description,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: process.env.PAYMENT_SUCCESS_URL || 'http://localhost:3000/success',
    cancel_url: process.env.PAYMENT_CANCEL_URL || 'http://localhost:3000/cancel',
    metadata: { bookingId },
  });
  // Save payment intent/session to DB
  await prisma.payment.create({
    data: {
      bookingId,
      stripeId: session.id,
      amount,
      status: 'pending',
    },
  });
  return session;
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;
    await prisma.payment.update({ where: { stripeId: session.id }, data: { status: 'paid' } });
    await prisma.booking.update({ where: { id: bookingId }, data: { status: 'confirmed' } });
  }
  res.json({ received: true });
}; 