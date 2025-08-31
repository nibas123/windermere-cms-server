const enquiryBookingService = require('../services/enquiryBookingService');
const nodemailer = require('nodemailer');

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const booking = await enquiryBookingService.create(data);

    // Send confirmation email to the visitor
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: 'Your Enquiry Has Been Received',
      text: `Thank you for your enquiry for property ${booking.propertyId}. We aim to respond to your request within 24 hours. This is purely an enquiry service and does not commit either party to a booking.\n\nPrices may be subject to seasonal change or special events. Note our preferred changeover day is Saturday, however we will try to work with clients where possible to offer flexibility around different departure dates where possible. Full T&Cs will be provided at the booking stage.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({
      message: 'Enquiry received. We aim to respond to your request within 24 hours. This is purely an enquiry service and does not commit either party to a booking.'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { status, propertyId } = req.query;
    const bookings = await enquiryBookingService.list({ status, propertyId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const booking = await enquiryBookingService.get(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Enquiry booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const booking = await enquiryBookingService.update(req.params.id, req.body);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await enquiryBookingService.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.count = async (req, res) => {
  try {
    const count = await enquiryBookingService.count();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.confirm = async (req, res) => {
  try {
    const booking = await enquiryBookingService.confirm(req.params.id);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.cancel = async (req, res) => {
  try {
    const booking = await enquiryBookingService.cancel(req.params.id);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 