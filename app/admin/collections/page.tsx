'use client';

import { useState, useEffect, useCallback } from 'react';
import ProductManagement from '../../components/ProductManagement';
import ProductFormModal from '../../components/ProductFormModal';
import { Product, DisplayProduct, RawProduct } from '@/types/product';

// Product interface moved to @/types/product

export default function CollectionsManagement() {
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/products?store_section=collections', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Transform to match ProductManagement interface
        const transformedProducts = data.products.map((p: RawProduct) => ({
          id: p.id.toString(),
          name: p.name,
          price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
          originalPrice: p.original_price ? (typeof p.original_price === 'string' ? parseFloat(p.original_price) : p.original_price) : undefined,
          image: (typeof p.images === 'string' ? JSON.parse(p.images)[0] : p.images?.[0]) || '/api/placeholder/48/48',
          stock: p.stock,
          status: p.status,
          category: p.category,
          sku: p.sku,
          createdAt: p.created_at,
          // Keep full data for editing
          _fullData: {
            ...p,
            price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
            original_price: p.original_price ? (typeof p.original_price === 'string' ? parseFloat(p.original_price) : p.original_price) : undefined,
            images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
            sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes || [],
            eu_sizes: typeof p.eu_sizes === 'string' ? JSON.parse(p.eu_sizes) : p.eu_sizes || [],
            colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors || [],
            features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features || [],
            is_new: !!p.is_new,
            is_on_sale: !!p.is_on_sale,
            is_featured: !!p.is_featured,
          } as Product,
        }));
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: DisplayProduct) => {
    setEditingProduct(product._fullData || null);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleViewProduct = (product: DisplayProduct) => {
    // Open in new tab
    window.open(`/product/${product._fullData?.slug || product.id}`, '_blank');
  };

  const handleSaveProduct = async (productData: Product) => {
    const token = localStorage.getItem('admin_token');
    const isEditing = !!productData.id;
    
    const url = isEditing 
      ? `/api/admin/products/${productData.id}`
      : '/api/admin/products';
    
    const response = await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save product');
    }

    await fetchProducts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      <ProductManagement
        title="Ruddy Collections"
        category="Collections"
        products={products}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onViewProduct={handleViewProduct}
      />

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        storeSection="collections"
      />
    </>
  );
}
