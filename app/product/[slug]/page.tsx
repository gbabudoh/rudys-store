'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
// @ts-expect-error - react-image-gallery missing types
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { getProductBySlug, getProductById, type Product } from '@/lib/products';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  
  // Try finding by slug
  const productBySlug = getProductBySlug(slug);
  // If not found by slug, it might be an ID (backward compatibility)
  const productById = !productBySlug ? getProductById(slug) : null;
  
  const product = productBySlug || productById;

  useEffect(() => {
    if (productById) {
      // Found by ID, redirect to slug-based URL for better SEO
      router.replace(`/product/${productById.slug}`);
    }
  }, [productById, router]);

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

function ProductContent({ product }: { product: Product }) {
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedEuSize, setSelectedEuSize] = useState('');
  const [sizeSystem, setSizeSystem] = useState<'us' | 'eu'>('us');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>('description');

  // Transform images for react-image-gallery
  const galleryImages = product.images.map((image: string) => ({
    original: image,
    thumbnail: image,
  }));

  const handleAddToCart = () => {
    const size = sizeSystem === 'eu' ? selectedEuSize : selectedSize;
    if (!size || !selectedColor) {
      alert('Please select size and color');
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.png',
      quantity: quantity,
      size: `${size} ${product.productType === 'shoe' ? `(${sizeSystem.toUpperCase()})` : ''}`,
      color: selectedColor,
      productType: product.productType
    });
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
          cursor: pointer;
        }
        
        .image-gallery-thumbnail:hover {
          border-color: #cfa224;
        }
        
        .image-gallery-thumbnail.active {
          border-color: #cfa224;
          box-shadow: 0 0 0 2px rgba(207, 162, 36, 0.2);
        }
        
        .image-gallery-thumbnail-image {
          height: 100px;
          object-fit: cover;
        }
        
        .image-gallery-thumbnail-inner {
          width: 100%;
        }
        
        .image-gallery-icon {
          color: #cfa224;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        
        .image-gallery-icon:hover {
          color: #b8901f;
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
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8 font-medium">
          <Link href="/" className="hover:text-[#cfa224]">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-[#cfa224]">Collections</Link>
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
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
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
                <span className="text-4xl font-black text-gray-900">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-2xl text-gray-500 line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className={`mt-2 text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed bg-white/50 p-4 rounded-xl border border-gray-100">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Select Size
                </label>
                {product.productType === 'shoe' && product.euSizes && (
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setSizeSystem('us')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        sizeSystem === 'us'
                          ? 'bg-white text-[#cfa224] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      US
                    </button>
                    <button
                      onClick={() => setSizeSystem('eu')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        sizeSystem === 'eu'
                          ? 'bg-white text-[#cfa224] shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      EU
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-6 gap-2">
                {(sizeSystem === 'eu' && product.euSizes ? product.euSizes : product.sizes).map((size: string) => (
                  <button
                    key={size}
                    onClick={() => {
                      if (sizeSystem === 'eu') {
                        setSelectedEuSize(size);
                      } else {
                        setSelectedSize(size);
                      }
                    }}
                    className={`py-2 px-1 border-2 rounded-lg font-bold transition-all text-sm cursor-pointer ${
                      (sizeSystem === 'eu' ? selectedEuSize : selectedSize) === size
                        ? 'border-[#cfa224] bg-[#cfa224]/5 text-[#cfa224]'
                        : 'border-gray-100 bg-white hover:border-[#cfa224]/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Select Color
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-2 border-2 rounded-lg font-bold transition-all text-sm cursor-pointer ${
                      selectedColor === color
                        ? 'border-[#cfa224] bg-[#cfa224]/5 text-[#cfa224]'
                        : 'border-gray-100 bg-white hover:border-[#cfa224]/30'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Quantity
              </label>
              <div className="flex items-center space-x-1 border-2 border-gray-100 rounded-xl w-fit p-1 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-lg transition-colors font-bold text-xl cursor-pointer"
                >
                  -
                </button>
                <span className="text-lg font-bold w-12 text-center text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-lg transition-colors font-bold text-xl cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full text-white py-5 px-8 rounded-2xl font-black text-xl transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-xl shadow-[#cfa224]/10 hover:shadow-2xl hover:shadow-[#cfa224]/20 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
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
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Tab Headers */}
            <div className="border-b border-gray-100">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 px-8 py-5 text-sm font-bold uppercase tracking-widest transition-all cursor-pointer ${
                    activeTab === 'description'
                      ? 'text-[#cfa224] border-b-2 border-[#cfa224] bg-[#cfa224]/5'
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('additional')}
                  className={`flex-1 px-8 py-5 text-sm font-bold uppercase tracking-widest transition-all cursor-pointer ${
                    activeTab === 'additional'
                      ? 'text-[#cfa224] border-b-2 border-[#cfa224] bg-[#cfa224]/5'
                      : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Additional Info
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8 md:p-12">
              {activeTab === 'description' ? (
                <div className="prose max-w-none">
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                    {product.fullDescription}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  {Object.entries(product.additionalInfo).map(([key, value]) => (
                    <div key={key} className="flex flex-col border-b border-gray-100 pb-4">
                      <dt className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </dt>
                      <dd className="text-gray-900 font-bold">{value as string}</dd>
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
