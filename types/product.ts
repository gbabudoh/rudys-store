export interface Product {
  id?: number;
  name: string;
  slug?: string;
  description: string;
  full_description: string;
  price: number;
  original_price?: number;
  sku: string;
  category: string;
  subcategory?: string;
  product_type: 'Shirt' | 'T-Shirt' | 'Dress' | 'shoes' | 'Pants' | 'Bag' | 'Glasses' | 'Watch' | 'Belt' | 'Hat' | 'Accessory';
  store_section: 'collections' | 'luxury' | 'crocs';
  images: string[];
  sizes: string[];
  eu_sizes?: string[];
  colors: string[];
  color_details?: { name: string; hex_code: string }[];
  color_images?: { color: string; images: string[] }[];
  features: string[];
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  brand: string;
  stock: number;
  is_new: boolean;
  is_on_sale: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  discount: number;
  status: 'active' | 'inactive' | 'draft';
  created_at?: string;
  updated_at?: string;
}

export interface DisplayProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  category: string;
  sku: string;
  createdAt: string;
  _fullData?: Product;
}

export interface RawProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  full_description: string;
  price: string | number;
  original_price: string | number | null;
  sku: string;
  category: string;
  subcategory: string | null;
  product_type: string;
  store_section: string;
  images: string | string[];
  sizes: string | string[];
  eu_sizes: string | string[] | null;
  colors: string | string[];
  features: string | string[];
  additional_info: string | Record<string, unknown>;
  gender: string;
  brand: string;
  stock: number;
  is_new: number | boolean;
  is_on_sale: number | boolean;
  is_featured: number | boolean;
  is_best_seller: number | boolean;
  discount: number;
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  updated_at: string;
}
