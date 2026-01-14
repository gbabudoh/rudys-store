'use client';

import { useWishlist } from '@/context/WishlistContext';
import { getAllProducts } from '@/lib/products';
import ProductCard from '@/app/components/ProductCard';
import Link from 'next/link';

// Simple Heart component
const Heart = ({ className }: { className?: string }) => (
  <svg className={className || "w-16 h-16"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

// Simple X component
const X = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function WishlistPage() {
  const { wishlist, wishlistCount, removeFromWishlist } = useWishlist();
  const allProducts = getAllProducts();

  // Get full product data for wishlisted items
  const wishlistedProducts = allProducts.filter(product => 
    wishlist.some(item => item.id === product.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block p-3 rounded-full bg-[#cfa224]/10 mb-4">
            <Heart className="w-8 h-8 text-[#cfa224] fill-[#cfa224]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#201d1e] mb-4">
            My Wishlist
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {wishlistCount > 0 
              ? `You have ${wishlistCount} item${wishlistCount === 1 ? '' : 's'} saved in your wishlist.`
              : "Items you've added to your wishlist will appear here."}
          </p>
        </div>

        {wishlistCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistedProducts.map((product) => (
              <div key={product.id} className="flex flex-col gap-3 group">
                <ProductCard 
                  product={product} 
                />
                <button 
                  onClick={() => removeFromWishlist(product.id)}
                  className="w-full py-2.5 text-sm font-bold text-red-600 hover:text-white hover:bg-red-500 rounded-xl transition-all flex items-center justify-center gap-2 border border-red-100 hover:border-red-500 shadow-sm cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center max-w-2xl mx-auto">
            <div className="mb-8 relative w-48 h-48 mx-auto">
              <div className="absolute inset-0 bg-[#cfa224]/5 rounded-full animate-pulse"></div>
              <Heart className="w-24 h-24 text-gray-300 absolute inset-0 m-auto" />
            </div>
            <h2 className="text-2xl font-bold text-[#201d1e] mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">
              Looks like you haven&apos;t added any items to your wishlist yet. 
              Start exploring our collections and save your favorite items!
            </p>
            <Link 
              href="/collections" 
              className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-xl text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer"
              style={{ backgroundColor: '#cfa224' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8901f'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#cfa224'}
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Featured Section for empty state suggestions */}
        {wishlistCount === 0 && (
          <div className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-[#201d1e]">Recommended for You</h3>
              <Link href="/collections" className="text-[#cfa224] font-bold hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {allProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
