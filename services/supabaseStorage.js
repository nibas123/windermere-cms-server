const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;

// Configuration flag - set to 'supabase' or 'cloudinary'
const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || 'cloudinary';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let supabase = null;

if (STORAGE_PROVIDER === 'supabase' && supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Cloudinary configuration (fallback)
if (STORAGE_PROVIDER === 'cloudinary') {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dzsppzdtb",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

async function uploadImageToSupabase(bucket, filePath, fileBuffer, fileType) {
  if (!supabase) {
    throw new Error('Supabase client not configured. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  }
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType: fileType,
      upsert: true,
    });
  
  if (error) throw error;
  
  // Get public URL
  const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(filePath).data;
  return publicUrl;
}

async function uploadImageToCloudinary(filePath) {
  const result = await cloudinary.uploader.upload(filePath);
  return result.secure_url;
}

async function uploadImage(bucket, filePath, fileBuffer, fileType, originalFilePath = null) {
  console.log(`Using storage provider: ${STORAGE_PROVIDER}`);
  
  if (STORAGE_PROVIDER === 'supabase') {
    return await uploadImageToSupabase(bucket, filePath, fileBuffer, fileType);
  } else {
    // For cloudinary, use the original file path if available, otherwise try filePath
    const pathToUpload = originalFilePath || filePath;
    return await uploadImageToCloudinary(pathToUpload);
  }
}

module.exports = {
  uploadImage,
  uploadImageToSupabase,
  uploadImageToCloudinary,
  supabase,
  STORAGE_PROVIDER,
};
