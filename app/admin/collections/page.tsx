'use client';

import { useState } from 'react';
import ProductManagement from '../../components/ProductManagement';

// Sample products for Ruddy Collections
const sampleProducts = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    price: 29.99,
    originalPrice: 39.99,
    image: '/api/placeholder/48/48',
    stock: 150,
    status: 'active' as const,
    category: 'T-Shirts',
    sku: 'RC-TS-001',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Designer Jeans',
    price: 89.99,
    image: '/api/placeholder/48/48',
    stock: 75,
    status: 'active' as const,
    category: 'Jeans',
    sku: 'RC-JN-002',
    createdAt: '2024-01-14T10:00:00Z',
  },
  {
    id: '3',
    name: 'Casual Hoodie',
    price: 59.99,
    image: '/api/placeholder/48/48',
    stock: 45,
    status: 'active' as const,
    category: 'Hoodies',
    sku: 'RC-HD-003',
    createdAt: '2024-01-13T10:00:00Z',
  },
];

export default function CollectionsManagement() {
  const [products, setProducts] = useState(sampleProducts);

  const handleAddProduct = () => {
    console.log('Add new product');
    // TODO: Open add product modal
  };

  const handleEditProduct = (product: any) => {
    console.log('Edit product:', product);
    // TODO: Open edit product modal
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleViewProduct = (product: any) => {
    console.log('View product:', product);
    // TODO: Open view product modal or navigate to product page
  };

  return (
    <ProductManagement
      title="Ruddy Collections"
      category="Collections"
      products={products}
      onAddProduct={handleAddProduct}
      onEditProduct={handleEditProduct}
      onDeleteProduct={handleDeleteProduct}
      onViewProduct={handleViewProduct}
    />
  );
}
