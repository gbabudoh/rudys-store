'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
}

interface FeaturedProductsProps {
  title: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

export default function FeaturedProducts({ 
  title, 
  products, 
  onAddToCart, 
  onAddToWishlist, 
  onQuickView,
  viewMode = 'grid'
}: FeaturedProductsProps) {
  const [activeTab, setActiveTab] = useState('featured');

  const tabs = [
    { id: 'featured', label: 'Featured Products' },
    { id: 'sale', label: 'On Sale' },
    { id: 'bestseller', label: 'Best Sellers' }
  ];

  // Filter products based on active tab
  const getFilteredProducts = () => {
    let filtered = [];
    switch (activeTab) {
      case 'sale':
        filtered = products.filter(product => product.isOnSale);
        break;
      case 'bestseller':
        // Filter products with high ratings (4.5+) and good review counts
        filtered = products.filter(product => 
          product.rating >= 4.5 && product.reviews >= 50
        );
        break;
      case 'featured':
      default:
        filtered = products;
        break;
    }
    console.log(`Active tab: ${activeTab}, Filtered products: ${filtered.length}`);
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium fashion items
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'flex flex-col gap-4'
        }`}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                onQuickView={onQuickView}
                viewMode={viewMode}
              />
            ))
          ) : (
            <div className={`${viewMode === 'grid' ? 'col-span-full' : 'w-full'} text-center py-12`}>
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            href="/products"
            className="inline-block text-white px-8 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
            style={{ backgroundColor: '#cfa224' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#b8901f';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#cfa224';
            }}
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
