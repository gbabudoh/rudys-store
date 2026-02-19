import { NextResponse } from 'next/server';
import { query, queryMany } from '@/lib/db';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface AdminJWTPayload {
  id: number;
  email: string;
  role: 'super_admin' | 'admin' | 'staff' | 'store_manager' | 'sales_manager' | 'customer_service' | 'other';
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
      product_type VARCHAR(100) DEFAULT 'Shirt',
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
      is_best_seller BOOLEAN DEFAULT FALSE,
      discount INT DEFAULT 0,
      status ENUM('active', 'inactive', 'draft') DEFAULT 'draft',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Check if color_images column exists, if not add it
  try {
    await query('SELECT color_images FROM products LIMIT 1');
  } catch {
    console.log('Adding color_images column to products table...');
    await query('ALTER TABLE products ADD COLUMN color_images JSON AFTER colors');
  }
}

export async function GET(request: Request) {
  const user = await checkAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureProductsTable();
    
    const url = new URL(request.url);
    const storeSection = url.searchParams.get('store_section');
    const category = url.searchParams.get('category');
    const status = url.searchParams.get('status');
    
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: string[] = [];
    
    if (storeSection) {
      sql += ' AND store_section = ?';
      params.push(storeSection);
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const products = await queryMany(sql, params);
    
    // Parse JSON fields
    const parsedProducts = products.map((p: Record<string, unknown>) => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images || [],
      sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes || '[]') : p.sizes || [],
      eu_sizes: typeof p.eu_sizes === 'string' ? JSON.parse(p.eu_sizes || '[]') : p.eu_sizes || [],
      colors: typeof p.colors === 'string' ? JSON.parse(p.colors || '[]') : p.colors || [],
      features: typeof p.features === 'string' ? JSON.parse(p.features || '[]') : p.features || [],
      additional_info: typeof p.additional_info === 'string' ? JSON.parse(p.additional_info || '{}') : p.additional_info || {},
      color_images: typeof p.color_images === 'string' ? JSON.parse(p.color_images || '[]') : p.color_images || [],
    }));

    return NextResponse.json({ products: parsedProducts });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await checkAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureProductsTable();
    
    const body = await request.json();
    const {
      name,
      description,
      full_description,
      price,
      original_price,
      sku,
      category,
      subcategory,
      product_type,
      store_section,
      images,
      sizes,

      eu_sizes,
      colors,
      color_images,
      features,
      additional_info,
      gender,
      brand,
      stock,
      is_new,
      is_on_sale,
      is_featured,
      is_best_seller,
      discount,
      status,
    } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 });
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);

    // Generate SKU if not provided
    const finalSku = sku || `${store_section?.toUpperCase().slice(0, 2) || 'PR'}-${category.toUpperCase().slice(0, 2)}-${Date.now().toString(36).toUpperCase()}`;

    const result = await query(
      `INSERT INTO products (
        name, slug, description, full_description, price, original_price, sku,
        category, subcategory, product_type, store_section, images, sizes, eu_sizes,
        colors, color_images, features, additional_info, gender, brand, stock, is_new, is_on_sale,
        is_featured, is_best_seller, discount, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        description || '',
        full_description || '',
        price,
        original_price || null,
        finalSku,
        category,
        subcategory || null,
        product_type || 'Shirt',
        store_section || 'collections',
        JSON.stringify(images || []),
        JSON.stringify(sizes || []),
        JSON.stringify(eu_sizes || []),
        JSON.stringify(colors || []),
        JSON.stringify(color_images || []),
        JSON.stringify(features || []),
        JSON.stringify(additional_info || {}),
        gender || 'Unisex',
        brand || 'Rudy Store',
        stock || 0,
        is_new || false,
        is_on_sale || false,
        is_featured || false,
        is_best_seller || false,
        discount || 0,
        status || 'draft',
      ]
    );

    return NextResponse.json({ 
      message: 'Product created successfully',
      productId: (result as { insertId: number }).insertId 
    });
  } catch (error: unknown) {
    console.error('API Error:', error);
    if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A product with this SKU already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
