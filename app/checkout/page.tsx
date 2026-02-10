'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { List, ListInput, BlockTitle, Button } from 'konsta/react';

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

const ShoppingBagIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-16 h-16"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 14.5l6 0" />
  </svg>
);

export default function CheckoutPage() {
  const { cart, totalAmount, cartCount } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'Nigeria',
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
          channels: ['card', 'bank', 'ussd', 'bank_transfer', 'opay', 'payattitude'],
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
      <div className="min-h-screen bg-white md:bg-gray-50 relative overflow-hidden flex flex-col font-inter">
        {/* Mobile Header - Consistently Sleek */}
        <div className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
          <div className="flex items-center h-14 px-4">
            <button 
              onClick={() => router.push('/')}
              className="flex items-center text-gray-900 active:scale-95 transition-transform duration-200 cursor-pointer"
            >
              <span className="text-2xl font-bold text-[#201d1e] -ml-1">&lt;</span>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2">
              <h1 className="text-[17px] font-bold tracking-tight text-gray-900">Checkout</h1>
            </div>
          </div>
        </div>

        {/* Background Elements - Wow factor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 w-full max-w-7xl mx-auto">
          <div className="max-w-md w-full text-center">
            <div className="relative inline-block mb-10">
              <div className="absolute inset-0 bg-gray-900/5 rounded-full blur-3xl scale-150 transform"></div>
              <div className="relative w-24 h-24 bg-white rounded-[2rem] shadow-2xl shadow-black/5 border border-gray-50 flex items-center justify-center mx-auto transition-transform hover:scale-110 duration-500">
                <ShoppingBagIcon className="w-10 h-10 text-gray-300" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-[10px] font-black">0</span>
                </div>
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-[#201d1e] tracking-tight mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 text-base md:text-lg font-medium mb-12 max-w-[280px] mx-auto leading-relaxed">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>

            <Link href="/collections" className="group relative inline-flex items-center justify-center w-full md:w-auto px-10 h-16 bg-[#201d1e] text-white rounded-2xl font-black text-lg shadow-2xl shadow-black/20 active:scale-[0.98] transition-all overflow-hidden cursor-pointer">
              <span className="relative z-10">Browse Collections</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>

            <div className="mt-12 pt-12 border-t border-gray-100/50">
              <p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em] mb-4">
                Need help?
              </p>
              <div className="flex items-center justify-center space-x-6 text-gray-500">
                <Link href="/contact" className="text-xs font-bold hover:text-[#201d1e] transition-colors cursor-pointer">Contact Support</Link>
                <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                <Link href="/faq" className="text-xs font-bold hover:text-[#201d1e] transition-colors cursor-pointer">View FAQ</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-gray-50/50 relative overflow-hidden flex flex-col font-inter">
      {/* Mobile Header - Sleek & Native */}
      <div className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
        <div className="flex items-center h-14 px-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center text-gray-900 active:scale-95 transition-transform duration-200 cursor-pointer"
          >
            <span className="text-2xl font-bold text-[#201d1e] -ml-1">&lt;</span>
          </button>
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-[17px] font-black tracking-tight text-gray-900 uppercase">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 py-8 md:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:block mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#cfa224] transition-colors group cursor-pointer">
              <ChevronLeft className="mr-1 transition-transform group-hover:-translate-x-1" />
              Back to store
            </Link>
            <h1 className="mt-4 text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Mobile Native Form (Konsta UI) */}
              <div className="md:hidden space-y-6">
                {/* Compact Order Summary for Mobile - Shows at Top */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">Order Summary</h3>
                      <span className="text-sm text-gray-500">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={`mobile-${item.id}-${item.size}-${item.color}`} className="flex items-center gap-3">
                        <div className="relative h-14 w-14 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {item.size && <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{item.size}</span>}
                            {item.color && <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{item.color}</span>}
                          </div>
                        </div>
                        <span className="font-bold text-gray-900 text-sm">₦{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-[#cfa224]/5 border-t border-[#cfa224]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600">Total</span>
                        <p className="text-[10px] text-gray-400">Incl. VAT & Free Shipping</p>
                      </div>
                      <span className="text-xl font-black text-[#cfa224]">₦{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <BlockTitle>Contact Information</BlockTitle>
                <List strong inset>
                  <ListInput
                    label="Email Address"
                    type="email"
                    placeholder="alex@example.com"
                    value={formData.email}
                    name="email"
                    onInput={handleInputChange}
                    required
                  />
                  <ListInput
                    label="Phone Number"
                    type="tel"
                    placeholder="+234 ..."
                    value={formData.phone}
                    name="phone"
                    onInput={handleInputChange}
                    required
                  />
                </List>

                <BlockTitle>Shipping Details</BlockTitle>
                <List strong inset>
                  <ListInput
                    label="First Name"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    name="firstName"
                    onInput={handleInputChange}
                    required
                  />
                  <ListInput
                    label="Last Name"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    name="lastName"
                    onInput={handleInputChange}
                    required
                  />
                  <ListInput
                    label="Address"
                    type="text"
                    placeholder="Street address"
                    value={formData.address}
                    name="address"
                    onInput={handleInputChange}
                    required
                  />
                  <ListInput
                    label="City"
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    name="city"
                    onInput={handleInputChange}
                    required
                  />
                  <ListInput
                    label="Country"
                    type="text"
                    placeholder="Country"
                    value={formData.country}
                    name="country"
                    onInput={handleInputChange}
                    required
                  />
                </List>
              </div>

              {/* Desktop Checkout Form */}
              <div className="hidden md:block space-y-8">
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
                      <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                      <input
                        required
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all"
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Desktop Checkout Button */}
              <button
                type="submit"
                disabled={loading}
                className="hidden md:flex w-full bg-[#201d1e] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-black/10 hover:bg-black transition-all items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
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

              {/* Mobile-Only Fixed Bottom Button */}
              <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <Button
                  large
                  rounded
                  onClick={(e: React.MouseEvent) => {
                    const form = (e.currentTarget as HTMLElement).closest('form');
                    if (form) form.requestSubmit();
                  }}
                  disabled={loading}
                  className="bg-[#201d1e] text-white font-black h-14"
                >
                  {loading ? 'Processing...' : `Pay ₦${totalAmount.toLocaleString()} Now`}
                </Button>
              </div>
              
              <p className="text-center text-xs text-gray-400 pb-24 md:pb-0">
                Secure payment powered by Paystack. Your financial information is never stored.
              </p>
            </form>
          </div>

          {/* Order Summary - Hidden on Mobile (shown at top of form instead) */}
          <div className="hidden md:block lg:col-span-5">
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
  </div>
  );
}
