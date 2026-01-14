'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';

// Icons
const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-16 h-16"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

function SuccessContent() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  useEffect(() => {
    // Clear the cart when reaching the success page
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-black/5 border border-gray-100">
        <div className="flex justify-center">
          <div className="bg-green-50 p-4 rounded-full animate-bounce">
            <CheckCircle className="text-green-500" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Successful!</h1>
          <p className="text-gray-500 font-medium">
            Thank you for your purchase. Your order has been placed and is being processed.
          </p>
        </div>

        {reference && (
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 inline-block">
            <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Transaction Reference</p>
            <p className="text-sm font-mono font-bold text-gray-900">{reference}</p>
          </div>
        )}

        <div className="space-y-4 pt-4">
          <p className="text-sm text-gray-500">
            A confirmation email will be sent to your email address shortly with the details of your order.
          </p>
          <div className="flex flex-col gap-3">
            <Link 
              href="/collections" 
              className="w-full bg-[#201d1e] text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-black/10"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/" 
              className="w-full text-sm font-bold text-gray-500 hover:text-gray-900 transition-all py-2"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#cfa224] rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
