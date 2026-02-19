'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductImage from '@/app/components/ProductImage';

const Search = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface SearchProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  category: string;
  colors: string[];
  features: string[];
  inStock: boolean;
  discount?: number;
}

interface SearchBarProps {
  isMobile?: boolean;
}

export default function SearchBar({ isMobile = false }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState<SearchProduct[]>([]);
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch all products from the API once (on first focus/interaction)
  const loadProducts = useCallback(async () => {
    if (productsLoaded) return;
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setAllProducts(data.products || []);
        setProductsLoaded(true);
      }
    } catch (error) {
      console.error('Failed to load products for search:', error);
    }
  }, [productsLoaded]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  };

  // Search products locally after fetching
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      return;
    }

    const timer = setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      
      const results = allProducts.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        (product.colors && product.colors.some(color => color.toLowerCase().includes(lowerQuery))) ||
        (product.features && product.features.some(feature => feature.toLowerCase().includes(lowerQuery)))
      );

      setSearchResults(results);
      setShowResults(true);
      setIsSearching(false);
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, allProducts]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    setIsSearching(false);
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery('');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div ref={searchRef} className={`relative ${isMobile ? 'w-full' : 'flex-1 max-w-md'}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => {
            loadProducts();
            if (searchResults.length > 0) setShowResults(true);
          }}
          placeholder="Search products..."
          className="w-full pl-10 pr-24 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:border-transparent transition-all"
          style={{ '--tw-ring-color': '#cfa224' } as React.CSSProperties & { '--tw-ring-color': string }}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              title="Clear search"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            className="bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed transition-colors text-sm font-medium"
            title="Search"
          >
            Find
          </button>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          {isSearching ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-600">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-100 bg-gray-50">
                <p className="text-sm font-semibold text-gray-700">
                  Found {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {searchResults.slice(0, 8).map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={handleResultClick}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <ProductImage
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {product.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-gray-900">
                          ₦{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              ₦{product.originalPrice.toLocaleString()}
                            </span>
                            {product.discount && (
                              <span className="text-xs font-semibold text-white bg-red-500 px-2 py-0.5 rounded">
                                -{product.discount}%
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex-shrink-0">
                      {product.inStock ? (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* View All Results Link */}
              {searchResults.length > 8 && (
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <Link
                    href={`/products?search=${encodeURIComponent(searchQuery)}`}
                    onClick={handleResultClick}
                    className="block text-center text-sm font-semibold hover:underline cursor-pointer"
                    style={{ color: '#cfa224' }}
                  >
                    View all {searchResults.length} results →
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Search className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <p className="text-gray-600 font-medium">No products found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try searching for something else
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
