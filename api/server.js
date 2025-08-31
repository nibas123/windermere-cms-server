const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const apiRouter = require('../routes');
const settingsService = require('../services/settingsService');

app.use(cors());
app.use(express.json());

// If you also expect URL-encoded data (like from HTML forms)
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', apiRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Test endpoint to check uploads directory
app.get('/api/test-uploads', (req, res) => {
  const fs = require('fs');
  const uploadsPath = path.join(__dirname, '../uploads');
    try {
    const files = fs.readdirSync(uploadsPath);
    res.json({ 
      uploadsPath,
      files: files.slice(0, 10), // Show first 10 files
      totalFiles: files.length 
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      uploadsPath 
    });
  }
});

// Initialize default settings
const initializeSettings = async () => {
  try {
    await settingsService.initializeDefaultSettings();
    console.log('Default settings initialized successfully');
  } catch (error) {
    console.error('Failed to initialize default settings:', error);
  }
};

// TODO: Mount routes here

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, async () => {
    console.log(`Backend API server running on port ${PORT}`);
    await initializeSettings();
  });

module.exports = app; 