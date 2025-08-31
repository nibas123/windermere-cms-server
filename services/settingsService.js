const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSettings = async (category = null) => {
  const where = category ? { category } : {};
  return prisma.settings.findMany({ where });
};

exports.getSetting = async (key) => {
  return prisma.settings.findUnique({ where: { key } });
};

exports.updateSetting = async (key, value) => {
  return prisma.settings.upsert({
    where: { key },
    update: { value, updatedAt: new Date() },
    create: { key, value, category: 'general' }
  });
};

exports.updateSettings = async (settings) => {
  const updates = settings.map(setting => 
    prisma.settings.upsert({
      where: { key: setting.key },
      update: { value: setting.value, updatedAt: new Date() },
      create: { 
        key: setting.key, 
        value: setting.value, 
        category: setting.category || 'general',
        description: setting.description
      }
    })
  );
  
  return prisma.$transaction(updates);
};

// Initialize default settings if they don't exist
exports.initializeDefaultSettings = async () => {
  const defaultSettings = [
    { key: 'company_name', value: 'Hoomee Real Estate', category: 'company', description: 'Company name' },
    { key: 'company_email', value: 'admin@hoomee.com', category: 'company', description: 'Company email' },
    { key: 'company_phone', value: '+1 (555) 123-4567', category: 'company', description: 'Company phone' },
    { key: 'company_address', value: '123 Real Estate Ave, City, State 12345', category: 'company', description: 'Company address' },
    { key: 'platform_name', value: 'Hoomee Admin Dashboard', category: 'platform', description: 'Platform name' },
    { key: 'timezone', value: 'utc-5', category: 'platform', description: 'Default timezone' },
    { key: 'currency', value: 'gbp', category: 'platform', description: 'Default currency' },
    { key: 'maintenance_mode', value: 'false', category: 'platform', description: 'Maintenance mode' },
    { key: 'stripe_enabled', value: 'true', category: 'integrations', description: 'Stripe payment integration' },
    { key: 'zapier_enabled', value: 'true', category: 'integrations', description: 'Zapier automation integration' },
    { key: 'aws_s3_enabled', value: 'true', category: 'integrations', description: 'AWS S3 storage integration' },
    { key: 'google_maps_enabled', value: 'true', category: 'integrations', description: 'Google Maps integration' },
    { key: 'mailchimp_enabled', value: 'false', category: 'integrations', description: 'Mailchimp email integration' },
    { key: 'twilio_enabled', value: 'false', category: 'integrations', description: 'Twilio SMS integration' },
    { key: 'smtp_enabled', value: 'false', category: 'integrations', description: 'SMTP email server integration' },
    { key: 'imap_enabled', value: 'false', category: 'integrations', description: 'IMAP email server integration' }
  ];

  for (const setting of defaultSettings) {
    await this.updateSetting(setting.key, setting.value);
  }
}; 