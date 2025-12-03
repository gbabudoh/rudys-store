'use client';

import { useState } from 'react';
import ProductManagement from '../../components/ProductManagement';

// Sample products for Ruddy Luxury
const sampleProducts = [
  {
    id: '1',
    name: 'Luxury Designer Handbag',
    price: 1299.99,
    image: '/api/placeholder/48/48',
    stock: 25,
    status: 'active' as const,
    category: 'Handbags',
    sku: 'RL-HB-001',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Premium Leather Watch',
    price: 899.99,
    image: '/api/placeholder/48/48',
    stock: 15,
    status: 'active' as const,
    category: 'Watches',
    sku: 'RL-WT-002',
    createdAt: '2024-01-14T10:00:00Z',
  },
  {
    id: '3',
    name: 'Designer Sunglasses',
    price: 349.99,
    image: '/api/placeholder/48/48',
    stock: 30,
    status: 'active' as const,
    category: 'Accessories',
    sku: 'RL-AC-003',
    createdAt: '2024-01-13T10:00:00Z',
  },
];

export default function LuxuryManagement() {
  const [products, setProducts] = useState(sampleProducts);

  const handleAddProduct = () => {
    console.log('Add new luxury product');
  };

  const handleEditProduct = (product: any) => {
    console.log('Edit product:', product);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleViewProduct = (product: any) => {
    console.log('View product:', product);
  };

  return (
    <ProductManagement
      title="Ruddy Luxury"
      category="Luxury"
      products={products}
      onAddProduct={handleAddProduct}
      onEditProduct={handleEditProduct}
      onDeleteProduct={handleDeleteProduct}
      onViewProduct={handleViewProduct}
    />
  );
}
