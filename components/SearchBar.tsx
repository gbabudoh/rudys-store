'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts, Product } from '@/lib/products';

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

interface SearchBarProps {
  isMobile?: boolean;
}

export default function SearchBar({ isMobile = false }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Search products
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (searchResults.length > 0) setSearchResults([]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (showResults) setShowResults(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const products = getAllProducts();
      const lowerQuery = query.toLowerCase();
      
      const results = products.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        product.colors.some(color => color.toLowerCase().includes(lowerQuery)) ||
        product.features.some(feature => feature.toLowerCase().includes(lowerQuery))
      );

      setSearchResults(results);
      setShowResults(true);
      setIsSearching(false);
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, searchResults.length, showResults]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
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
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search products..."
          className="w-full pl-10 pr-24 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:border-transparent transition-all"
          style={{ '--tw-ring-color': '#cfa224' } as React.CSSProperties & { '--tw-ring-color': string }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#cfa224';
            if (searchResults.length > 0) setShowResults(true);
          }}
          onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
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
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={handleResultClick}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {/* Product Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
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
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <>
                            <span className="text-sm text-gray-400 line-through">
                              ${product.originalPrice.toFixed(2)}
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
              {searchResults.length > 5 && (
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
