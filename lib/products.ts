export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  rating: number;
  reviews: number;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  category: string;
  productType: 'clothing' | 'shoe' | 'accessory';
  sizes: string[];
  euSizes?: string[];
  colors: string[];
  inStock: boolean;
  sku: string;
  features: string[];
  fullDescription: string;
  additionalInfo: Record<string, string>;
}

export const products: Product[] = [
  // T-Shirts
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    originalPrice: 39.99,
    description: 'Classic cotton t-shirt with a comfortable fit. Perfect for everyday wear.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68',
    ],
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isOnSale: true,
    discount: 25,
    category: 'T-Shirts',
    productType: 'clothing',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Navy', 'Gray', 'Red'],
    inStock: true,
    sku: 'TS-001',
    features: [
      '100% Premium Cotton',
      'Machine Washable',
      'Classic Fit',
      'Reinforced Stitching',
      'Breathable Fabric',
    ],
    fullDescription: `Our Premium Cotton T-Shirt is crafted from the finest 100% cotton, ensuring maximum comfort and durability. This versatile piece features a classic fit that flatters all body types.

Care Instructions:
- Machine wash cold with similar colors
- Tumble dry low or hang to dry
- Iron on low heat if needed
- Do not bleach`,
    additionalInfo: {
      weight: '200g',
      material: '100% Premium Cotton',
      careInstructions: 'Machine wash cold, tumble dry low',
      origin: 'Made in USA',
      brand: 'Rudy Collections',
      warranty: '30-day return policy',
    },
  },

  // Shirts
  {
    id: '2',
    name: 'Classic Oxford Shirt',
    price: 59.99,
    originalPrice: 79.99,
    description: 'Elegant oxford shirt perfect for business and casual occasions.',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157',
      'https://images.unsplash.com/photo-1598032895397-b9c37d3b6e5e',
    ],
    rating: 4.7,
    reviews: 89,
    isNew: false,
    isOnSale: true,
    discount: 25,
    category: 'Shirts',
    productType: 'clothing',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Blue', 'Pink', 'Gray'],
    inStock: true,
    sku: 'SH-001',
    features: [
      'Premium Oxford Fabric',
      'Button-Down Collar',
      'Wrinkle-Resistant',
      'Tailored Fit',
      'Easy Care',
    ],
    fullDescription: `Classic Oxford Shirt made from premium cotton blend fabric. Features a button-down collar and tailored fit for a sophisticated look.

Perfect for:
- Business meetings
- Casual Fridays
- Smart casual events
- Everyday wear`,
    additionalInfo: {
      weight: '250g',
      material: 'Cotton Blend Oxford',
      careInstructions: 'Machine wash warm, tumble dry low',
      origin: 'Made in Portugal',
      brand: 'Rudy Collections',
      warranty: '30-day return policy',
    },
  },

  // Trousers
  {
    id: '3',
    name: 'Slim Fit Chino Trousers',
    price: 69.99,
    description: 'Modern slim fit chinos with stretch comfort. Versatile and stylish.',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80',
      'https://images.unsplash.com/photo-1506629082955-511b1aa562c8',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27',
    ],
    rating: 4.6,
    reviews: 156,
    isNew: false,
    isOnSale: false,
    category: 'Trousers',
    productType: 'clothing',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Khaki', 'Navy', 'Black', 'Olive'],
    inStock: true,
    sku: 'TR-001',
    features: [
      'Stretch Cotton Blend',
      'Slim Fit Design',
      'Multiple Pockets',
      'Belt Loops',
      'Wrinkle-Resistant',
    ],
    fullDescription: `Slim Fit Chino Trousers crafted from premium stretch cotton blend. These versatile trousers offer comfort and style for any occasion.

Features:
- Modern slim fit
- Stretch fabric for comfort
- Classic chino styling
- Multiple pocket design`,
    additionalInfo: {
      weight: '400g',
      material: 'Cotton Blend with Stretch',
      careInstructions: 'Machine wash cold, hang dry',
      origin: 'Made in Italy',
      brand: 'Rudy Collections',
      warranty: '30-day return policy',
    },
  },

  // Crocs/Footwear
  {
    id: '4',
    name: 'Classic Crocs Clogs',
    price: 49.99,
    originalPrice: 59.99,
    description: 'Iconic comfort clogs with Croslite™ foam cushioning. Perfect for all-day wear.',
    images: [
      'https://images.unsplash.com/photo-1603487742131-4160ec999306',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329',
    ],
    rating: 4.8,
    reviews: 234,
    isNew: true,
    isOnSale: true,
    discount: 17,
    category: 'Footwear',
    productType: 'shoe',
    sizes: ['5', '6', '7', '8', '9', '10', '11', '12', '13'],
    euSizes: ['38', '39', '40', '41', '42', '43', '44', '45', '46'],
    colors: ['Black', 'White', 'Navy', 'Pink', 'Green'],
    inStock: true,
    sku: 'SS-001',
    features: [
      'Croslite™ Foam Cushioning',
      'Water-Friendly & Easy to Clean',
      'Ventilation Ports',
      'Lightweight Design',
      'Non-Marking Sole',
    ],
    fullDescription: `Classic Crocs Clogs featuring our proprietary Croslite™ foam cushioning that molds to your feet for custom comfort.

Perfect for:
- Casual wear
- Beach trips
- Gardening
- Indoor/outdoor use

Care Instructions:
- Rinse with water and mild soap
- Air dry away from direct sunlight
- Do not expose to extreme heat`,
    additionalInfo: {
      weight: '300g',
      material: 'Croslite™ Foam',
      careInstructions: 'Rinse with water, air dry',
      origin: 'Made in Vietnam',
      brand: 'Slide & Sole',
      warranty: '90-day manufacturer warranty',
      soleType: 'Non-marking',
      waterResistant: 'Yes',
    },
  },

  // Dresses
  {
    id: '5',
    name: 'Elegant Summer Dress',
    price: 89.99,
    originalPrice: 119.99,
    description: 'Flowing summer dress with floral print. Perfect for warm weather occasions.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03',
      'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f',
    ],
    rating: 4.9,
    reviews: 178,
    isNew: true,
    isOnSale: true,
    discount: 25,
    category: 'Dresses',
    productType: 'clothing',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Floral Blue', 'Floral Pink', 'Solid White', 'Solid Black'],
    inStock: true,
    sku: 'DR-001',
    features: [
      'Lightweight Fabric',
      'Floral Print Design',
      'Adjustable Straps',
      'Flowing Silhouette',
      'Breathable Material',
    ],
    fullDescription: `Elegant Summer Dress crafted from lightweight, breathable fabric. Features a beautiful floral print and flowing silhouette perfect for warm weather.

Ideal for:
- Summer parties
- Beach outings
- Garden events
- Casual gatherings

Care Instructions:
- Hand wash or gentle machine cycle
- Hang to dry
- Iron on low heat if needed`,
    additionalInfo: {
      weight: '250g',
      material: 'Polyester Blend',
      careInstructions: 'Hand wash cold, hang dry',
      origin: 'Made in India',
      brand: 'Rudy Luxury',
      warranty: '30-day return policy',
      length: 'Midi',
    },
  },

  // Bags
  {
    id: '6',
    name: 'Leather Crossbody Bag',
    price: 129.99,
    originalPrice: 179.99,
    description: 'Premium leather crossbody bag with adjustable strap. Elegant and practical.',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
      'https://images.unsplash.com/photo-1564422170194-896b89110ef8',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d',
    ],
    rating: 4.7,
    reviews: 92,
    isNew: false,
    isOnSale: true,
    discount: 28,
    category: 'Bags',
    productType: 'accessory',
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Tan', 'Burgundy'],
    inStock: true,
    sku: 'BG-001',
    features: [
      'Genuine Leather',
      'Adjustable Strap',
      'Multiple Compartments',
      'Secure Zipper Closure',
      'Gold-Tone Hardware',
    ],
    fullDescription: `Premium Leather Crossbody Bag crafted from genuine leather. Features multiple compartments and an adjustable strap for versatile wear.

Features:
- Main compartment with zipper
- Interior pockets for organization
- Adjustable shoulder strap
- Gold-tone hardware accents

Care Instructions:
- Wipe clean with damp cloth
- Use leather conditioner periodically
- Store in dust bag when not in use`,
    additionalInfo: {
      weight: '500g',
      dimensions: '25cm x 18cm x 8cm',
      material: 'Genuine Leather',
      careInstructions: 'Wipe clean, use leather conditioner',
      origin: 'Made in Italy',
      brand: 'Rudy Luxury',
      warranty: '1-year warranty',
      strapLength: 'Adjustable 50-120cm',
    },
  },

  // Sunglasses
  {
    id: '7',
    name: 'Designer Aviator Sunglasses',
    price: 149.99,
    originalPrice: 199.99,
    description: 'Classic aviator sunglasses with UV protection. Timeless style meets modern protection.',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
      'https://images.unsplash.com/photo-1577803645773-f96470509666',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4',
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a',
    ],
    rating: 4.8,
    reviews: 145,
    isNew: false,
    isOnSale: true,
    discount: 25,
    category: 'Glasses',
    productType: 'accessory',
    sizes: ['One Size'],
    colors: ['Gold/Brown', 'Silver/Gray', 'Black/Black', 'Rose Gold/Pink'],
    inStock: true,
    sku: 'GL-001',
    features: [
      'UV400 Protection',
      'Polarized Lenses',
      'Metal Frame',
      'Adjustable Nose Pads',
      'Scratch-Resistant Coating',
    ],
    fullDescription: `Designer Aviator Sunglasses featuring UV400 protection and polarized lenses. Classic aviator design with modern lens technology.

Features:
- 100% UV protection
- Polarized lenses reduce glare
- Durable metal frame
- Comfortable nose pads
- Includes protective case

Care Instructions:
- Clean lenses with microfiber cloth
- Store in protective case
- Avoid extreme temperatures`,
    additionalInfo: {
      weight: '30g',
      lensWidth: '58mm',
      material: 'Metal Frame, Polarized Lenses',
      careInstructions: 'Clean with microfiber cloth',
      origin: 'Made in Italy',
      brand: 'Rudy Luxury',
      warranty: '2-year warranty',
      uvProtection: 'UV400',
      polarized: 'Yes',
    },
  },

  // Sneakers
  {
    id: '8',
    name: 'Premium Leather Sneakers',
    price: 129.99,
    description: 'Classic leather sneakers with cushioned sole. Style meets comfort.',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3',
    ],
    rating: 4.7,
    reviews: 203,
    isNew: false,
    isOnSale: false,
    category: 'Footwear',
    productType: 'shoe',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    euSizes: ['39', '40', '41', '42', '43', '44', '45'],
    colors: ['White', 'Black', 'Navy', 'Gray'],
    inStock: true,
    sku: 'SN-001',
    features: [
      'Premium Leather Upper',
      'Cushioned Insole',
      'Rubber Outsole',
      'Breathable Lining',
      'Lace-Up Closure',
    ],
    fullDescription: `Premium Leather Sneakers crafted from high-quality leather. Features cushioned insole and durable rubber outsole for all-day comfort.

Perfect for:
- Casual wear
- Walking
- Everyday activities
- Smart casual occasions`,
    additionalInfo: {
      weight: '800g (pair)',
      material: 'Premium Leather',
      careInstructions: 'Wipe clean with damp cloth',
      origin: 'Made in Portugal',
      brand: 'Rudy Collections',
      warranty: '6-month warranty',
      soleType: 'Rubber',
    },
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

export function getAllProducts(): Product[] {
  return products;
}
