import { NextResponse } from 'next/server';
import { query, queryMany } from '@/lib/db';

async function ensureProductsTable() {
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
}

export async function GET(request: Request) {
  try {
    await ensureProductsTable();
    
    const url = new URL(request.url);
    const storeSection = url.searchParams.get('store_section');
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    const isNew = url.searchParams.get('is_new');
    const isOnSale = url.searchParams.get('is_on_sale');
    const limit = url.searchParams.get('limit');
    
    let sql = 'SELECT * FROM products WHERE status = ?';
    const params: (string | number)[] = ['active'];
    
    if (storeSection) {
      sql += ' AND store_section = ?';
      params.push(storeSection);
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (featured === 'true') {
      sql += ' AND is_featured = 1';
    }
    if (isNew === 'true') {
      sql += ' AND is_new = 1';
    }
    if (isOnSale === 'true') {
      sql += ' AND is_on_sale = 1';
    }
    
    sql += ' ORDER BY created_at DESC';
    
    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
    }
    
    const products = await queryMany(sql, params);
    
    // Parse JSON fields and transform to frontend format
    const parsedProducts = products.map((p: any) => ({
      id: p.id.toString(),
      slug: p.slug,
      name: p.name,
      price: parseFloat(p.price),
      originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
      description: p.description,
      fullDescription: p.full_description,
      images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images || [],
      sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes || '[]') : p.sizes || [],
      euSizes: typeof p.eu_sizes === 'string' ? JSON.parse(p.eu_sizes || '[]') : p.eu_sizes || [],
      colors: typeof p.colors === 'string' ? JSON.parse(p.colors || '[]') : p.colors || [],
      features: typeof p.features === 'string' ? JSON.parse(p.features || '[]') : p.features || [],
      additionalInfo: typeof p.additional_info === 'string' ? JSON.parse(p.additional_info || '{}') : p.additional_info || {},
      category: p.category,
      subcategory: p.subcategory,
      productType: p.product_type,
      storeSection: p.store_section,
      gender: p.gender,
      brand: p.brand,
      inStock: p.stock > 0,
      stock: p.stock,
      sku: p.sku,
      rating: parseFloat(p.rating) || 0,
      reviews: p.reviews || 0,
      isNew: !!p.is_new,
      isOnSale: !!p.is_on_sale,
      isFeatured: !!p.is_featured,
      discount: p.discount || 0,
    }));

    return NextResponse.json({ products: parsedProducts });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
