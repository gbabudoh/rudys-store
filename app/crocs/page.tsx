'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ProductCard from '../components/ProductCard';
import { getAllProducts, type Product } from '@/lib/products';
// Simple icon components to replace lucide-react

const Grid = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const List = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const SlidersHorizontal = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
  </svg>
);



const categories = ['All', 'Clothing', 'Footwear', 'Accessories'];

export default function CrocsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [productsPerPage] = useState(12);
  const [displayedCount, setDisplayedCount] = useState(12);

  // Get real footwear products (crocs and sneakers)
  const allProducts = getAllProducts();
  const crocsProducts = allProducts
    .filter(p => p.productType === 'shoe')
    .map(product => ({
      ...product,
      gender: product.gender || 'Unisex',
      brand: product.brand || 'Rudy Store',
      sizes: product.sizes || [],
      subcategory: product.subcategory || product.category,
    }));

  // Extract unique values for filters
  const genders = Array.from(new Set(crocsProducts.map(p => p.gender))).filter(Boolean);
  const brands = Array.from(new Set([...crocsProducts.map(p => p.brand), 'Adidas', 'Nike'])).filter(Boolean).sort();
  const allSizes = Array.from(new Set(crocsProducts.flatMap(p => p.sizes))).filter(Boolean).sort();
  const subcategories = Array.from(new Set(crocsProducts.map(p => p.subcategory))).filter(Boolean);

  const filteredProducts = crocsProducts.filter(product => {
    // Category mapping to productType
    let categoryMatch = selectedCategories.includes('All');
    if (!categoryMatch) {
      categoryMatch = selectedCategories.some(cat => {
        if (cat === 'Clothing') return product.productType === 'clothing';
        if (cat === 'Footwear') return product.productType === 'shoe';
        if (cat === 'Accessories') return product.productType === 'accessory';
        return false;
      });
    }

    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const genderMatch = selectedGender.length === 0 || selectedGender.includes(product.gender);
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const sizeMatch = selectedSizes.length === 0 || selectedSizes.some(size => product.sizes.includes(size));
    const subcategoryMatch = selectedSubcategories.length === 0 || selectedSubcategories.includes(product.subcategory);
    
    return categoryMatch && priceMatch && genderMatch && brandMatch && sizeMatch && subcategoryMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Paginate products
  const displayedProducts = sortedProducts.slice(0, displayedCount);
  const hasMoreProducts = displayedCount < sortedProducts.length;

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + productsPerPage);
  };

  // Reset displayed count when filters change
  useEffect(() => {
    // eslint-disable-next-line
    setDisplayedCount(productsPerPage);
  }, [selectedCategories, selectedGender, selectedBrands, selectedSizes, selectedSubcategories, priceRange, sortBy, productsPerPage]);

  const handleAddToCart = (product: Product) => {
    console.log('Added to cart:', product);
  };

  const handleAddToWishlist = (product: Product) => {
    console.log('Added to wishlist:', product);
  };

  const handleQuickView = (product: Product) => {
    console.log('Quick view:', product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#201d1e]/5 to-[#cfa224]/5">
      {/* Hero Section */}
      <div className="relative text-white py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #201d1e 0%, #2a2526 50%, #201d1e 100%)' }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#201d1e' }}></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#201d1e' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-6">
              <div className="relative h-20 w-64 mx-auto">
                <Image
                  src="/ss-logo.png"
                  alt="Slide & Sole Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Comfortable and stylish footwear
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border p-6" style={{ borderColor: '#cfa224' }}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: '#cfa224' }}>
                <h3 className="text-lg font-bold" style={{ color: '#201d1e' }}>Filters</h3>
                <div className="flex items-center gap-2">
                  {(selectedGender.length > 0 || selectedBrands.length > 0 || selectedSizes.length > 0 || selectedSubcategories.length > 0 || !selectedCategories.includes('All')) && (
                    <button
                      onClick={() => {
                        setSelectedCategories(['All']);
                        setSelectedGender([]);
                        setSelectedBrands([]);
                        setSelectedSizes([]);
                        setSelectedSubcategories([]);
                      }}
                      className="text-xs px-2 py-1 rounded text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: '#cfa224' }}
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden transition-colors hover:opacity-70 text-xl"
                    style={{ color: '#cfa224' }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Gender Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 flex items-center" style={{ color: '#201d1e' }}>
                  <span className="w-1 h-5 rounded-full mr-2" style={{ backgroundColor: '#cfa224' }}></span>
                  Gender
                </h4>
                <div className="space-y-2">
                  {genders.map((gender) => (
                    <label key={gender} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGender.includes(gender)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGender([...selectedGender, gender]);
                          } else {
                            setSelectedGender(selectedGender.filter(g => g !== gender));
                          }
                        }}
                        className="mr-3 w-4 h-4 focus:ring-2 border-gray-300 rounded"
                        style={{ accentColor: '#cfa224' }}
                      />
                      <span className={`text-sm transition-colors ${
                        selectedGender.includes(gender)
                          ? 'font-semibold'
                          : 'text-gray-700 group-hover:opacity-70'
                      }`} style={selectedGender.includes(gender) ? { color: '#cfa224' } : {}}>{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 flex items-center" style={{ color: '#201d1e' }}>
                  <span className="w-1 h-5 rounded-full mr-2" style={{ backgroundColor: '#cfa224' }}></span>
                  Brand
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBrands([...selectedBrands, brand]);
                          } else {
                            setSelectedBrands(selectedBrands.filter(b => b !== brand));
                          }
                        }}
                        className="mr-3 w-4 h-4 focus:ring-2 border-gray-300 rounded"
                        style={{ accentColor: '#cfa224' }}
                      />
                      <span className={`text-sm transition-colors ${
                        selectedBrands.includes(brand)
                          ? 'font-semibold'
                          : 'text-gray-700 group-hover:opacity-70'
                      }`} style={selectedBrands.includes(brand) ? { color: '#cfa224' } : {}}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 flex items-center" style={{ color: '#201d1e' }}>
                  <span className="w-1 h-5 rounded-full mr-2" style={{ backgroundColor: '#cfa224' }}></span>
                  Sizes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <label key={size} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSizes([...selectedSizes, size]);
                          } else {
                            setSelectedSizes(selectedSizes.filter(s => s !== size));
                          }
                        }}
                        className="sr-only"
                      />
                      <span className={`px-3 py-1.5 text-sm rounded-lg border-2 transition-all ${
                        selectedSizes.includes(size)
                          ? 'text-white border-transparent font-semibold'
                          : 'text-gray-700 border-gray-300 hover:border-[#cfa224]'
                      }`} style={selectedSizes.includes(size) ? { backgroundColor: '#cfa224' } : {}}>
                        {size}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 flex items-center" style={{ color: '#201d1e' }}>
                  <span className="w-1 h-5 rounded-full mr-2" style={{ backgroundColor: '#cfa224' }}></span>
                  Category
                </h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (category === 'All') {
                            setSelectedCategories(['All']);
                          } else {
                            const newCategories = e.target.checked
                              ? [...selectedCategories.filter(c => c !== 'All'), category]
                              : selectedCategories.filter(c => c !== category);
                            
                            setSelectedCategories(newCategories.length === 0 ? ['All'] : newCategories);
                          }
                        }}
                        className="mr-3 w-4 h-4 focus:ring-2 border-gray-300 rounded"
                        style={{ accentColor: '#cfa224' }}
                      />
                      <span className={`text-sm transition-colors ${
                        selectedCategories.includes(category)
                          ? 'font-semibold'
                          : 'text-gray-700 group-hover:opacity-70'
                      }`} style={selectedCategories.includes(category) ? { color: '#cfa224' } : {}}>{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategories Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 flex items-center" style={{ color: '#201d1e' }}>
                  <span className="w-1 h-5 rounded-full mr-2" style={{ backgroundColor: '#cfa224' }}></span>
                  Subcategories
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {subcategories.map((subcategory) => (
                    <label key={subcategory} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSubcategories.includes(subcategory)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubcategories([...selectedSubcategories, subcategory]);
                          } else {
                            setSelectedSubcategories(selectedSubcategories.filter(s => s !== subcategory));
                          }
                        }}
                        className="mr-3 w-4 h-4 focus:ring-2 border-gray-300 rounded"
                        style={{ accentColor: '#cfa224' }}
                      />
                      <span className={`text-sm transition-colors ${
                        selectedSubcategories.includes(subcategory)
                          ? 'font-semibold'
                          : 'text-gray-700 group-hover:opacity-70'
                      }`} style={selectedSubcategories.includes(subcategory) ? { color: '#cfa224' } : {}}>{subcategory}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 flex items-center" style={{ color: '#201d1e' }}>
                  <span className="w-1 h-5 rounded-full mr-2" style={{ backgroundColor: '#cfa224' }}></span>
                  Price Range
                </h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #cfa224 0%, #cfa224 ${(priceRange[1]/200)*100}%, #e5e5e5 ${(priceRange[1]/200)*100}%, #e5e5e5 100%)`,
                      accentColor: '#cfa224'
                    }}
                  />
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold" style={{ color: '#cfa224' }}>₦{priceRange[0]}</span>
                    <span className="font-semibold" style={{ color: '#cfa224' }}>₦{priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all shadow-md hover:opacity-90"
                  style={{ backgroundColor: '#cfa224' }}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                <p className="text-gray-700 font-medium">
                  Showing <span className="font-bold" style={{ color: '#cfa224' }}>{displayedProducts.length}</span> of <span className="font-bold" style={{ color: '#cfa224' }}>{sortedProducts.length}</span> products
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border-2 rounded-lg focus:ring-2 bg-white text-gray-700 font-medium transition-all"
                  style={{ borderColor: '#cfa224', '--tw-ring-color': '#cfa224' } as React.CSSProperties}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                </select>

                <div className="flex border-2 rounded-lg overflow-hidden" style={{ borderColor: '#cfa224' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-all ${
                      viewMode === 'grid' 
                        ? 'text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={viewMode === 'grid' ? { backgroundColor: '#cfa224' } : {}}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-all ${
                      viewMode === 'list' 
                        ? 'text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={viewMode === 'list' ? { backgroundColor: '#cfa224' } : {}}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' 
                : 'flex flex-col gap-4'
            }`}>
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onQuickView={handleQuickView}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMoreProducts && (
              <div className="text-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  className="text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                  style={{ backgroundColor: '#14699f' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#115a87';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#14699f';
                  }}
                >
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
