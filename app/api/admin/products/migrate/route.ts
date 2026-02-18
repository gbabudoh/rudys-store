import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verify } from 'jsonwebtoken';
import { products as hardcodedProducts } from '@/lib/products';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AdminJWTPayload {
  id: number;
  email: string;
  role: 'super_admin' | 'admin' | 'staff';
}

async function checkAuth(request: Request): Promise<AdminJWTPayload | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return verify(token, JWT_SECRET) as unknown as AdminJWTPayload;
  } catch {
    return null;
  }
}

// Determine store section based on category
function getStoreSection(category: string, productName: string): 'collections' | 'luxury' | 'crocs' {
  const luxuryCategories = ['Bags', 'Glasses', 'Dresses', 'Watches', 'Jewelry', 'Handbags', 'Sunglasses'];
  const crocsCategories = ['Crocs', 'Slides', 'Sandals', 'Clogs', 'Slippers'];
  
  // Check product name for crocs-related keywords
  const nameLower = productName.toLowerCase();
  if (nameLower.includes('croc') || nameLower.includes('slide') || nameLower.includes('clog')) {
    return 'crocs';
  }
  
  if (luxuryCategories.some(c => category.toLowerCase().includes(c.toLowerCase()))) {
    return 'luxury';
  }
  if (crocsCategories.some(c => category.toLowerCase().includes(c.toLowerCase()))) {
    return 'crocs';
  }
  return 'collections';
}

async function ensureProductsTable() {
  // Create table if not exists
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      description TEXT,
      full_description LONGTEXT,
      price DECIMAL(10, 2) NOT NULL,
      original_price DECIMAL(10, 2),
      sku VARCHAR(100) UNIQUE,
      category VARCHAR(100) NOT NULL,
      subcategory VARCHAR(100),
      product_type ENUM('clothing', 'shoe', 'accessory') DEFAULT 'clothing',
      store_section ENUM('collections', 'luxury', 'crocs') DEFAULT 'collections',
      images JSON,
      sizes JSON,
      eu_sizes JSON,
      colors JSON,
      features JSON,
      additional_info JSON,
      gender ENUM('Men', 'Women', 'Unisex', 'Kids') DEFAULT 'Unisex',
      brand VARCHAR(100) DEFAULT 'Rudy Store',
      stock INT DEFAULT 0,
      rating DECIMAL(2, 1) DEFAULT 0,
      reviews INT DEFAULT 0,
      is_new BOOLEAN DEFAULT FALSE,
      is_on_sale BOOLEAN DEFAULT FALSE,
      is_featured BOOLEAN DEFAULT FALSE,
      discount INT DEFAULT 0,
      status ENUM('active', 'inactive', 'draft') DEFAULT 'draft',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Add missing columns if they don't exist
  const columnsToAdd = [
    { name: 'full_description', definition: 'LONGTEXT' },
    { name: 'subcategory', definition: 'VARCHAR(100)' },
    { name: 'eu_sizes', definition: 'JSON' },
    { name: 'features', definition: 'JSON' },
    { name: 'additional_info', definition: 'JSON' },
    { name: 'gender', definition: "ENUM('Men', 'Women', 'Unisex', 'Kids') DEFAULT 'Unisex'" },
    { name: 'brand', definition: "VARCHAR(100) DEFAULT 'Rudy Store'" },
    { name: 'rating', definition: 'DECIMAL(2, 1) DEFAULT 0' },
    { name: 'reviews', definition: 'INT DEFAULT 0' },
    { name: 'is_featured', definition: 'BOOLEAN DEFAULT FALSE' },
  ];

  for (const col of columnsToAdd) {
    try {
      await query(`ALTER TABLE products ADD COLUMN ${col.name} ${col.definition}`);
    } catch (err: unknown) {
      const error = err as { message?: string };
      // Column already exists, ignore
      if (!error.message?.includes('Duplicate column')) {
        // Ignore duplicate column errors
      }
    }
  }
}

export async function POST(request: Request) {
  const user = await checkAuth(request);
  if (!user || user.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized - Super Admin only' }, { status: 401 });
  }

  try {
    await ensureProductsTable();

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const product of hardcodedProducts) {
      try {
        const storeSection = getStoreSection(product.category, product.name);
        
        // Check if product already exists by slug
        const existing = await query('SELECT id FROM products WHERE slug = ?', [product.slug]);
        if (Array.isArray(existing) && existing.length > 0) {
          skipped++;
          continue;
        }

        await query(
          `INSERT INTO products (
            name, slug, description, full_description, price, original_price, sku,
            category, subcategory, product_type, store_section, images, sizes, eu_sizes,
            colors, features, additional_info, gender, brand, stock, rating, reviews,
            is_new, is_on_sale, is_featured, discount, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product.name,
            product.slug,
            product.description || '',
            product.fullDescription || '',
            product.price,
            product.originalPrice || null,
            product.sku,
            product.category,
            product.subcategory || null,
            product.productType || 'clothing',
            storeSection,
            JSON.stringify(product.images || []),
            JSON.stringify(product.sizes || []),
            JSON.stringify(product.euSizes || []),
            JSON.stringify(product.colors || []),
            JSON.stringify(product.features || []),
            JSON.stringify(product.additionalInfo || {}),
            product.gender || 'Unisex',
            product.brand || 'Rudy Store',
            product.inStock ? 100 : 0, // Default stock
            product.rating || 0,
            product.reviews || 0,
            product.isNew || false,
            product.isOnSale || false,
            false, // is_featured
            product.discount || 0,
            'active', // Set all migrated products as active
          ]
        );
        imported++;
    } catch (err: unknown) {
      const error = err as { message?: string };
      errors.push(`${product.name}: ${error.message || 'Unknown error'}`);
    }
  }

  return NextResponse.json({
    message: 'Migration completed',
    imported,
    skipped,
    total: hardcodedProducts.length,
    errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Migration Error:', err);
    return NextResponse.json({ error: 'Migration failed: ' + err.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const user = await checkAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    message: 'Product migration endpoint',
    totalHardcodedProducts: hardcodedProducts.length,
    instructions: 'POST to this endpoint to migrate all hardcoded products to the database',
  });
}
