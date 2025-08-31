const { PrismaClient } = require('@prisma/client');
const settingsService = require('./services/settingsService');

const prisma = new PrismaClient();

async function initializeSettings() {
  try {
    console.log('Initializing default settings...');
    await settingsService.initializeDefaultSettings();
    console.log('Default settings initialized successfully!');
    
    // Verify settings were created
    const settings = await prisma.settings.findMany();
    console.log(`Created ${settings.length} settings:`);
    settings.forEach(setting => {
      console.log(`- ${setting.key}: ${setting.value} (${setting.category})`);
    });
    
  } catch (error) {
    console.error('Error initializing settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeSettings(); 