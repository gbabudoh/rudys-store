'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Simple icon components to replace lucide-react
const Heart = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShoppingBag = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const Star = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const Eye = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  image?: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  onQuickView,
  viewMode = 'grid'
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist?.(product);
  };

  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  const handleQuickView = () => {
    onQuickView?.(product);
  };

  // List View Layout
  if (viewMode === 'list') {
    return (
      <div 
        className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          {/* Image Section */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 rounded-lg overflow-hidden">
            <Link href={`/product/${product.id}`} className="block w-full h-full">
              <Image
                src={product.images?.[0] || product.image || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 192px"
              />
            </Link>
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1 pointer-events-none">
              {product.isNew && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  New
                </span>
              )}
              {product.isOnSale && product.discount && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Details Section */}
          <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
            <Link href={`/product/${product.id}`} className="flex-1">
              <div className="flex-1 cursor-pointer">
                {/* Product Name */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {product.name}
                </h3>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
              </div>

                {/* Category/Badges */}
                <div className="flex items-center space-x-2 mb-3">
                  {product.rating >= 4.5 && product.reviews >= 50 && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Best Seller
                    </span>
                  )}
                </div>
              </div>
            </Link>

            {/* Price and Add to Cart Section */}
            <div className="flex flex-col sm:items-end sm:justify-between gap-3">
              {/* Price */}
              <div className="flex flex-col sm:items-end">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    ₦{product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ₦{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:opacity-90 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#cfa224' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b8901f';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#cfa224';
                }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Layout (existing)
  return (
    <div 
      className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.images?.[0] || product.image || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2 pointer-events-none">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {product.isOnSale && product.discount && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              -{product.discount}%
            </span>
          )}
          {product.rating >= 4.5 && product.reviews >= 50 && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Best Seller
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`absolute top-3 right-3 flex flex-col space-y-2 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full transition-colors ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleQuickView}
            className="p-2 bg-white text-gray-600 rounded-full hover:bg-purple-500 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-sm transition-transform duration-300 ${
          isHovered ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <button
            onClick={handleAddToCart}
            className="w-full text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            style={{ backgroundColor: '#cfa224' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#b8901f';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#cfa224';
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <Link href={`/product/${product.id}`}>
        <div className="p-4 cursor-pointer">
          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ₦{product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₦{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
