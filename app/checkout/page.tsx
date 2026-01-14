'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

// Icons
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const Lock = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function CheckoutPage() {
  const { cart, totalAmount, clearCart, cartCount } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  useEffect(() => {
    if (cartCount === 0 && !loading) {
      // router.push('/collections');
    }
  }, [cartCount, router, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          amount: totalAmount,
          metadata: {
            ...formData,
            items: cart.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              size: item.size,
              color: item.color
            }))
          }
        }),
      });

      const result = await response.json();

      if (result.success && result.data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = result.data.authorization_url;
      } else {
        alert(result.message || 'Payment initialization failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout');
      setLoading(false);
    }
  };

  if (cartCount === 0 && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-500">You need to add items to your cart before checking out.</p>
          <Link href="/collections" className="inline-block bg-[#201d1e] text-white px-8 py-3 rounded-xl font-bold">
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#cfa224] transition-colors group">
            <ChevronLeft className="mr-1 transition-transform group-hover:-translate-x-1" />
            Back to store
          </Link>
          <h1 className="mt-4 text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm mr-3">1</span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      required
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all"
                      placeholder="alex@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      required
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all"
                      placeholder="+234 ..."
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm mr-3">2</span>
                  Shipping Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input
                      required
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input
                      required
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <input
                      required
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all"
                      placeholder="Street address, apartment, suite, etc."
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      required
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
                    <input
                      required
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all"
                    />
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#201d1e] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-black/10 hover:bg-black transition-all flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Pay ₦{totalAmount.toLocaleString()} Now</span>
                  </>
                )}
              </button>
              
              <p className="text-center text-xs text-gray-400">
                Secure payment powered by Paystack. Your financial information is never stored.
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-32">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute top-1 right-1 bg-gray-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{item.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.size && (
                          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded">
                            {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded">
                            {item.color}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-gray-900 mt-2">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₦{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-lg font-black text-gray-900 tracking-tight">Total</span>
                    <p className="text-[10px] text-gray-400">Including VAT and taxes</p>
                  </div>
                  <span className="text-2xl font-black text-gray-900 bg-[#cfa224]/10 text-[#cfa224] px-4 py-1 rounded-lg">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-gray-50 pt-6">
                <div className="text-center space-y-1">
                  <div className="w-8 h-8 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400">Secure</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-8 h-8 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400">Verified</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-8 h-8 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400">Fast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
