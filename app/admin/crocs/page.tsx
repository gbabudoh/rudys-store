'use client';

import { useState } from 'react';
import ProductManagement from '../../components/ProductManagement';

// Sample products for Slide & Sole
const sampleProducts = [
  {
    id: '1',
    name: 'Crocs Classic Clogs',
    price: 49.99,
    originalPrice: 59.99,
    image: '/api/placeholder/48/48',
    stock: 200,
    status: 'active' as const,
    category: 'Clogs',
    sku: 'SS-CL-001',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Crocs Slides',
    price: 34.99,
    image: '/api/placeholder/48/48',
    stock: 150,
    status: 'active' as const,
    category: 'Slides',
    sku: 'SS-SL-002',
    createdAt: '2024-01-14T10:00:00Z',
  },
  {
    id: '3',
    name: 'Crocs Sandals',
    price: 39.99,
    originalPrice: 49.99,
    image: '/api/placeholder/48/48',
    stock: 100,
    status: 'active' as const,
    category: 'Sandals',
    sku: 'SS-SD-003',
    createdAt: '2024-01-13T10:00:00Z',
  },
];

export default function SlideSoleManagement() {
  const [products, setProducts] = useState(sampleProducts);

  const handleAddProduct = () => {
    console.log('Add new Slide & Sole product');
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
      title="Slide & Sole"
      category="Slide & Sole"
      products={products}
      onAddProduct={handleAddProduct}
      onEditProduct={handleEditProduct}
      onDeleteProduct={handleDeleteProduct}
      onViewProduct={handleViewProduct}
    />
  );
}
