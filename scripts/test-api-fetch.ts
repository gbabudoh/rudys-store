// Native fetch is available in Node 18+

async function testApi() {
  try {
    const response = await fetch('http://localhost:3000/api/products?store_section=collections&limit=100');
    const data = await response.json();
    
    interface ApiProduct {
      name: string;
      productType: string;
      status: string;
      storeSection: string;
    }

    if (data.products) {
      const longDress = data.products.find((p: ApiProduct) => p.productType === 'Long Dress');
      if (longDress) {
        console.log('✅ Product found in API response:');
        console.log(`- Name: ${longDress.name}`);
        console.log(`- Type: ${longDress.productType}`);
        console.log(`- Status: ${longDress.status}`); // If exposed, though api filters by active
        console.log(`- Store Section: ${longDress.storeSection}`);
      } else {
        console.log('❌ Product "Long Dress" NOT found in API response.');
        console.log('Total products returned:', data.products.length);
        console.log('Product Types found:', data.products.map((p: ApiProduct) => p.productType));
      }
    } else {
      console.error('❌ No products array in response:', data);
    }
  } catch (error) {
    console.error('❌ API request failed:', error);
  }
}

testApi();
