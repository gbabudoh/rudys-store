/**
 * Test Cloudinary Connection
 * 
 * This script tests the Cloudinary connection using environment variables
 * Run with: node scripts/test-cloudinary.js
 */

require('dotenv').config({ path: '.env.local' });
const { v2 as cloudinary } = require('cloudinary');

async function main() {
  console.log('🔍 Testing Cloudinary connection...\n');

  // Check if environment variables are set
  const requiredVars = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\nPlease add these variables to your .env.local file.');
    process.exit(1);
  }

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log('✅ Environment variables found');
  console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`   API Key: ${process.env.CLOUDINARY_API_KEY.substring(0, 10)}...`);
  console.log(`   API Secret: ${process.env.CLOUDINARY_API_SECRET ? '***' : 'Not set'}\n`);

  // Test connection
  try {
    // Try to ping Cloudinary API
    const result = await cloudinary.api.ping();
    
    if (result.status === 'ok') {
      console.log('✅ Cloudinary connection successful!');
      console.log('   Your Cloudinary setup is working correctly.\n');
    } else {
      console.error('❌ Cloudinary connection failed');
      console.error('   Please check your credentials and try again.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error testing Cloudinary connection:');
    console.error(`   ${error.message}\n`);
    if (error.http_code) {
      console.error(`   HTTP Code: ${error.http_code}`);
    }
    process.exit(1);
  }
}

main();

