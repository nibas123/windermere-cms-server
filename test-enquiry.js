const axios = require('axios');

const testEnquiryBooking = async () => {
  try {
    const response = await axios.post('http://localhost:4000/api/enquiry-bookings', {
      propertyId: 'test-property-id', // You'll need to replace this with a real property ID
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      mobile: '1234567890',
      arrivalDate: '2024-08-01T00:00:00.000Z',
      departureDate: '2024-08-05T00:00:00.000Z',
      adults: 2,
      children: 1,
      message: 'We would like a quiet lodge with a view of the lake.'
    });

    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

testEnquiryBooking(); 