const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const propertyService = require('../services/propertyService');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const upload = multer({ dest: path.join(__dirname, '../uploads') });

// POST /api/properties expects: name, description, address, refNo, location: { longitude, latitude }, features: [], price, images (multipart)
router.get('/', propertyController.list);
router.get('/:id', propertyController.get);
router.post('/', auth, upload.array('images'), propertyController.create);
router.put('/:id', auth, upload.array('images'), propertyController.update);
router.delete('/:id', auth, propertyController.remove);
router.post('/:id/images', auth, upload.single('image'), propertyController.uploadImage);
// router.delete('/:id/images/:imageUrl', auth, propertyController.removeImage);
router.delete('/:id/images/:imageUrl', auth, propertyController.removeImage);

router.post('/:id/gallery', auth, upload.array('images'), propertyController.uploadPropertyGalleryImages);
router.get('/:id/gallery', propertyController.getPropertyGalleryImages);
router.delete('/gallery/:imageId', auth, propertyController.deletePropertyGalleryImage);
router.post('/featured-gallery/:id', auth, propertyController.deletePropertyGalleryImageByUrl);
router.post('/update-featured-images/:id', auth,upload.array('images'), propertyController.updateFeaturedImage)
// router.patch('/:id/gallery/:imageId', auth, propertyController.updatePropertyGalleryImage);
router.patch('/gallery/:imageId', auth, propertyController.updatePropertyGalleryImage);

// router.delete('/gallery/:id', auth, propertyController.deletePropertyGalleryImageByUrl);

// Test database connection
router.get('/test-db', auth, async (req, res) => {
  try {
    // Test basic database operations
    const propertyCount = await prisma.property.count();
    const galleryCount = await prisma.propertyGalleryImage.count();
    const bookingCount = await prisma.booking.count();
    const commentCount = await prisma.comment.count();
    const enquiryCount = await prisma.enquiryBooking.count();
    
    res.json({
      success: true,
      message: 'Database connection successful',
      counts: {
        properties: propertyCount,
        galleryImages: galleryCount,
        bookings: bookingCount,
        comments: commentCount,
        enquiries: enquiryCount
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: error.stack 
    });
  }
});

// Step-by-step deletion test
router.delete('/test-delete-step/:id', auth, async (req, res) => {
  try {
    const propertyId = req.params.id;
    console.log('Step-by-step deletion test for property:', propertyId);
    
    // Step 1: Check property exists
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    console.log('Step 1: Property found -', property.name);
    
    // Step 2: Check related data
    const galleryCount = await prisma.propertyGalleryImage.count({ where: { propertyId } });
    const bookingCount = await prisma.booking.count({ where: { propertyId } });
    const commentCount = await prisma.comment.count({ where: { propertyId } });
    const enquiryCount = await prisma.enquiryBooking.count({ where: { propertyId } });
    
    console.log('Step 2: Related data counts -', { galleryCount, bookingCount, commentCount, enquiryCount });
    
    // Step 3: Delete payments
    const paymentResult = await prisma.payment.deleteMany({
      where: { booking: { propertyId } }
    });
    console.log('Step 3: Deleted payments -', paymentResult.count);
    
    // Step 4: Delete bookings
    const bookingResult = await prisma.booking.deleteMany({ where: { propertyId } });
    console.log('Step 4: Deleted bookings -', bookingResult.count);
    
    // Step 5: Delete gallery images
    const galleryResult = await prisma.propertyGalleryImage.deleteMany({ where: { propertyId } });
    console.log('Step 5: Deleted gallery images -', galleryResult.count);
    
    // Step 6: Delete comments
    const commentResult = await prisma.comment.deleteMany({ where: { propertyId } });
    console.log('Step 6: Deleted comments -', commentResult.count);
    
    // Step 7: Delete enquiry bookings
    const enquiryResult = await prisma.enquiryBooking.deleteMany({ where: { propertyId } });
    console.log('Step 7: Deleted enquiry bookings -', enquiryResult.count);
    
    // Step 8: Delete property
    const deletedProperty = await prisma.property.delete({ where: { id: propertyId } });
    console.log('Step 8: Deleted property -', deletedProperty.name);
    
    res.json({
      success: true,
      message: 'Property deleted successfully step by step',
      property: deletedProperty,
      deletedCounts: {
        payments: paymentResult.count,
        bookings: bookingResult.count,
        galleryImages: galleryResult.count,
        comments: commentResult.count,
        enquiries: enquiryResult.count
      }
    });
    
  } catch (error) {
    console.error('Step-by-step deletion error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
});

// Test property deletion using service
router.delete('/test-delete-service/:id', auth, async (req, res) => {
  try {
    console.log('Test delete service endpoint called for property:', req.params.id);
    const result = await propertyService.remove(req.params.id);
    console.log('Test delete service successful:', result);
    res.json({ success: true, message: 'Property deleted successfully via service', property: result });
  } catch (error) {
    console.error('Test delete service error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: error.stack 
    });
  }
});

module.exports = router; 