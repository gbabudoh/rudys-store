import { NextResponse } from 'next/server';
import { queryOne, queryMany } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const product = await queryOne(
      'SELECT * FROM products WHERE slug = ? AND status = ?',
      [slug, 'active']
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Fetch color details for hex codes
    const allColors = await queryMany('SELECT name, hex_code FROM colors');
    const colorMap = (allColors || []).reduce((acc: Record<string, string>, curr: { name: string; hex_code: string }) => {
      acc[curr.name] = curr.hex_code;
      return acc;
    }, {});

    // Parse JSON fields and transform to frontend format
    const parsedProduct = {
      id: product.id.toString(),
      slug: product.slug,
      name: product.name,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : undefined,
      description: product.description,
      fullDescription: product.full_description,
      images: typeof product.images === 'string' ? JSON.parse(product.images || '[]') : product.images || [],
      sizes: typeof product.sizes === 'string' ? JSON.parse(product.sizes || '[]') : product.sizes || [],
      euSizes: typeof product.eu_sizes === 'string' ? JSON.parse(product.eu_sizes || '[]') : product.eu_sizes || [],
      colors: typeof product.colors === 'string' ? JSON.parse(product.colors || '[]') : product.colors || [],
      features: typeof product.features === 'string' ? JSON.parse(product.features || '[]') : product.features || [],
      additionalInfo: typeof product.additional_info === 'string' ? JSON.parse(product.additional_info || '{}') : product.additional_info || {},
      category: product.category,
      subcategory: product.subcategory,
      productType: product.product_type,
      storeSection: product.store_section,
      gender: product.gender,
      brand: product.brand,
      inStock: product.stock > 0,
      stock: product.stock,
      sku: product.sku,
      rating: parseFloat(product.rating) || 0,
      reviews: product.reviews || 0,
      isNew: !!product.is_new,
      isOnSale: !!product.is_on_sale,
      isFeatured: !!product.is_featured,
      discount: product.discount || 0,
      colorDetails: (typeof product.colors === 'string' ? JSON.parse(product.colors || '[]') : product.colors || []).map((c: string) => ({
        name: c,
        hex_code: colorMap[c] || ''
      }))
    };

    return NextResponse.json({ product: parsedProduct });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
