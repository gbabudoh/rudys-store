'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Simple Package icon
const Package = ({ className }: { className?: string }) => (
  <svg className={className || "w-16 h-16"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 md:pt-12 pb-24">
      {/* Mobile Header - Sleek & Native */}
      <div className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
        <div className="flex items-center h-14 px-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-gray-900 active:scale-95 transition-transform duration-200"
          >
            <span className="text-2xl font-bold text-[#201d1e] -ml-1">&lt;</span>
          </button>
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-[17px] font-bold tracking-tight text-gray-900">My Orders</h1>
          </div>
          <div className="ml-auto w-7 h-7" /> {/* Balance spacer */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-0">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block p-3 rounded-full bg-[#cfa224]/10 mb-4">
            <Package className="w-8 h-8 text-[#cfa224]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#201d1e] mb-4">
            My Orders
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {isAuthenticated 
              ? "Track your orders and view your purchase history."
              : "Sign in to view your orders and purchase history."}
          </p>
        </div>

        {isAuthenticated ? (
          /* Empty Orders State */
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center max-w-2xl mx-auto">
            <div className="mb-8 relative w-48 h-48 mx-auto">
              <div className="absolute inset-0 bg-[#cfa224]/5 rounded-full animate-pulse"></div>
              <Package className="w-24 h-24 text-gray-300 absolute inset-0 m-auto" />
            </div>
            <h2 className="text-2xl font-bold text-[#201d1e] mb-4">No orders yet</h2>
            <p className="text-gray-500 mb-8">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here!
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
        ) : (
          /* Not Logged In State */
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center max-w-2xl mx-auto">
            <div className="mb-8 relative w-48 h-48 mx-auto">
              <div className="absolute inset-0 bg-[#cfa224]/5 rounded-full animate-pulse"></div>
              <Package className="w-24 h-24 text-gray-300 absolute inset-0 m-auto" />
            </div>
            <h2 className="text-2xl font-bold text-[#201d1e] mb-4">Sign in to view orders</h2>
            <p className="text-gray-500 mb-8">
              Please sign in to your account to view your order history and track shipments.
            </p>
            <Link 
              href="/login" 
              className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-bold rounded-xl text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl cursor-pointer"
              style={{ backgroundColor: '#cfa224' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b8901f'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#cfa224'}
            >
              Sign In
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              New to Rudy? <Link href="/register" className="text-[#cfa224] font-bold hover:underline">Create Account</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
