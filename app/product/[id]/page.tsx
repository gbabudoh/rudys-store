'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { getProductById } from '@/lib/products';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/" className="text-purple-600 hover:text-purple-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return <ProductContent product={product} />;
}

function ProductContent({ product }: { product: NonNullable<ReturnType<typeof getProductById>> }) {

  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedEuSize, setSelectedEuSize] = useState('');
  const [sizeSystem, setSizeSystem] = useState<'us' | 'eu'>('us');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');

  // Transform images for react-image-gallery
  const galleryImages = product.images.map((image) => ({
    original: image,
    thumbnail: image,
  }));

  const handleAddToCart = () => {
    const size = sizeSystem === 'eu' ? selectedEuSize : selectedSize;
    if (!size || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    console.log('Added to cart:', { 
      product, 
      size: `${size} ${product.productType === 'shoe' ? `(${sizeSystem.toUpperCase()})` : ''}`, 
      selectedColor, 
      quantity 
    });
    alert('Product added to cart!');
  };

  return (
    <>
      <style jsx global>{`
        .image-gallery-slide img {
          object-fit: cover;
          height: 600px;
          width: 100%;
        }
        
        .image-gallery-thumbnails-wrapper {
          margin-top: 16px;
        }
        
        .image-gallery-thumbnails {
          padding: 0;
        }
        
        .image-gallery-thumbnail {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          width: calc(20% - 8px) !important;
          margin: 0 4px;
        }
        
        .image-gallery-thumbnail:hover {
          border-color: #9333ea;
        }
        
        .image-gallery-thumbnail.active {
          border-color: #9333ea;
          box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.2);
        }
        
        .image-gallery-thumbnail-image {
          height: 100px;
          object-fit: cover;
        }
        
        .image-gallery-thumbnail-inner {
          width: 100%;
        }
        
        .image-gallery-icon {
          color: #9333ea;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        
        .image-gallery-icon:hover {
          color: #7c3aed;
        }
        
        .image-gallery-left-nav,
        .image-gallery-right-nav {
          padding: 20px;
        }
        
        .image-gallery-left-nav .image-gallery-svg,
        .image-gallery-right-nav .image-gallery-svg {
          height: 60px;
          width: 40px;
        }
        
        @media (max-width: 1024px) {
          .image-gallery-thumbnail {
            width: calc(20% - 6px) !important;
            margin: 0 3px;
          }
          
          .image-gallery-thumbnail-image {
            height: 80px;
          }
        }
        
        @media (max-width: 768px) {
          .image-gallery-slide img {
            height: 400px;
          }
          
          .image-gallery-thumbnail {
            width: calc(20% - 4px) !important;
            margin: 0 2px;
          }
          
          .image-gallery-thumbnail-image {
            height: 60px;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-purple-600">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-purple-600">Collections</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="relative">
            {product.isOnSale && product.discount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold z-10 shadow-lg">
                -{product.discount}% OFF
              </div>
            )}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <ImageGallery
                items={galleryImages}
                showPlayButton={false}
                showFullscreenButton={true}
                showNav={true}
                thumbnailPosition="bottom"
                slideDuration={450}
                slideInterval={3000}
                lazyLoad={true}
                showBullets={false}
              />
            </div>
          </div>

          {/* Product Details */}
          <div>
            {/* Product Name and Rating */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-gray-900">
                  ₦{product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-2xl text-gray-500 line-through">
                    ₦{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className={`mt-2 text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-900">
                  Select Size
                </label>
                {product.productType === 'shoe' && product.euSizes && (
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setSizeSystem('us')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        sizeSystem === 'us'
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      US
                    </button>
                    <button
                      onClick={() => setSizeSystem('eu')}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                        sizeSystem === 'eu'
                          ? 'bg-white text-purple-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      EU
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-6 gap-2">
                {(sizeSystem === 'eu' && product.euSizes ? product.euSizes : product.sizes).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      if (sizeSystem === 'eu') {
                        setSelectedEuSize(size);
                      } else {
                        setSelectedSize(size);
                      }
                    }}
                    className={`py-2 px-4 border-2 rounded-lg font-medium transition-all ${
                      (sizeSystem === 'eu' ? selectedEuSize : selectedSize) === size
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select Color
              </label>
              <div className="flex items-center space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                      selectedColor === color
                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              style={{ backgroundColor: product.inStock ? '#cfa224' : undefined }}
              onMouseEnter={(e) => {
                if (product.inStock) {
                  e.currentTarget.style.backgroundColor = '#b8901f';
                }
              }}
              onMouseLeave={(e) => {
                if (product.inStock) {
                  e.currentTarget.style.backgroundColor = '#cfa224';
                }
              }}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Description and Additional Information Tabs */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Tab Headers */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 px-8 py-4 text-lg font-semibold transition-all ${
                    activeTab === 'description'
                      ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('additional')}
                  className={`flex-1 px-8 py-4 text-lg font-semibold transition-all ${
                    activeTab === 'additional'
                      ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Additional Information
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' ? (
                <div className="prose max-w-none">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.fullDescription}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.additionalInfo).map(([key, value]) => (
                    <div key={key} className="flex items-start border-b border-gray-100 pb-4">
                      <div className="flex-1">
                        <dt className="text-sm font-semibold text-gray-900 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </dt>
                        <dd className="text-gray-600">{value}</dd>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
