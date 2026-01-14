// Test the database API endpoint
import http from 'http';

const port = process.env.PORT || 3000;
const url = `http://localhost:${port}/api/db/test`;

console.log('🔍 Testing API endpoint...');
console.log(`📡 URL: ${url}`);
console.log('');

// Check if server is running
const req = http.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('📊 Response Status:', res.statusCode);
      console.log('📋 Response Data:', JSON.stringify(result, null, 2));
      console.log('');
      
      if (result.success) {
        console.log('✅ API endpoint is working correctly!');
        process.exit(0);
      } else {
        console.log('❌ API endpoint returned an error');
        process.exit(1);
      }
    } catch (error) {
      const err = error as Error;
      console.error('❌ Failed to parse response:', err.message);
      console.log('Raw response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  const err = error as Error;
  console.error('');
  console.error('❌ Failed to connect to API endpoint!');
  console.error('Error:', err.message);
  console.error('');
  console.error('💡 Make sure the Next.js dev server is running:');
  console.error('   npm run dev');
  console.error('');
  process.exit(1);
});

req.setTimeout(5000, () => {
  console.error('');
  console.error('❌ Request timeout!');
  console.error('💡 Make sure the Next.js dev server is running');
  process.exit(1);
});
