'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { type Product } from '@/lib/products';
import MessageModal from '@/app/components/MessageModal';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const X = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

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

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (product) {
      const img = product.images?.[0] || '/placeholder.png';
      const frame = requestAnimationFrame(() => {
        setMainImage(img);
        setSelectedSize('');
        setSelectedColor('');
        setQuantity(1);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if ((product.sizes?.length > 0 && !selectedSize) || (product.colors?.length > 0 && !selectedColor)) {
      setModalMessage('Please select your preferred size and color to add this item to your cart.');
      setIsModalOpen(true);
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.png',
      quantity: quantity,
      size: selectedSize,
      color: selectedColor
    });
    onClose();
  };

  const handleWishlistToggle = () => {
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '/placeholder.png',
      slug: product.slug || product.id
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative bg-white/95 backdrop-blur-md w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/50 backdrop-blur-sm hover:bg-gray-100 rounded-full transition-all z-10 cursor-pointer text-gray-800 hover:scale-110 active:scale-95 border border-gray-100 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
          {/* Left Side: Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-inner group">
              <Image
                src={mainImage || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                      mainImage === img ? 'border-[#cfa224] scale-105 shadow-md' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Info */}
          <div className="flex flex-col h-full">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">({product.reviews} reviews)</span>
              </div>

              <h2 className="text-3xl font-black text-[#201d1e] mb-4 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-[#cfa224]">
                  ₦{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {product.description || 'Premium quality apparel designed for style and comfort.'}
              </p>

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-[#201d1e] uppercase tracking-wider mb-3">Select Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-2.5 rounded-xl border-2 transition-all font-bold text-sm cursor-pointer ${
                          selectedSize === size
                            ? 'bg-[#cfa224] border-[#cfa224] text-white shadow-lg'
                            : 'bg-white border-gray-100 text-gray-800 hover:border-[#cfa224] hover:text-[#cfa224]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-[#201d1e] uppercase tracking-wider mb-3">Select Color</h4>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-xl border-2 transition-all text-sm font-semibold cursor-pointer ${
                          selectedColor === color
                            ? 'bg-[#201d1e] border-[#201d1e] text-white shadow-lg'
                            : 'bg-white border-gray-100 text-gray-700 hover:border-[#201d1e]'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto space-y-4 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-14 bg-gray-50/50">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 py-2 hover:bg-gray-100 transition-colors font-bold text-lg cursor-pointer disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 py-2 hover:bg-gray-100 transition-colors font-bold text-lg cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 h-14 bg-[#cfa224] text-white rounded-xl font-black text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
                >
                  <ShoppingBag className="w-6 h-6" />
                  Add to Cart
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all border-2 cursor-pointer ${
                    isWishlisted 
                      ? 'bg-red-500 border-red-500 text-white shadow-lg' 
                      : 'bg-white border-gray-100 text-gray-600 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-7 h-7 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <Link 
                href={`/product/${product.slug || product.id}`}
                className="block text-center text-sm font-bold text-[#cfa224] hover:underline py-2"
                onClick={onClose}
              >
                View Full Product Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <MessageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        message={modalMessage} 
      />
    </div>
  );
}
