'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

// Payment method icons
const CardIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const BankIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const TransferIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const USSDIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const WalletIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

type PaymentChannel = 'card' | 'bank_transfer' | 'bank' | 'ussd' | 'payattitude' | 'opay';

const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

interface PaymentMethod {
  id: PaymentChannel;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'card', name: 'Card Payment', description: 'Visa, Mastercard, Verve', icon: CardIcon },
  { id: 'bank_transfer', name: 'Bank Transfer', description: 'Pay via bank transfer', icon: TransferIcon },
  { id: 'bank', name: 'Pay with Bank', description: 'Direct bank debit', icon: BankIcon },
  { id: 'ussd', name: 'USSD', description: 'Pay using USSD code', icon: USSDIcon },
  { id: 'opay', name: 'OPay', description: 'Pay with OPay wallet', icon: WalletIcon },
  { id: 'payattitude', name: 'PayAttitude', description: 'Pay with your phone number', icon: WalletIcon },
];

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

export default function CheckoutPage() {
  const { cart, totalAmount, cartCount, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentChannel>('card');
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'Nigeria',
    phone: '',
  });

  // Load Paystack inline script
  useEffect(() => {
    if (document.getElementById('paystack-script')) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (cartCount === 0 && !loading) {
      // Allow staying on page
    }
  }, [cartCount, router, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = useCallback(() => {
    return formData.email && formData.firstName && formData.lastName && 
           formData.address && formData.city && formData.phone;
  }, [formData]);

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      setStep('payment');
    }
  };

  const handlePayment = async () => {
    if (!scriptLoaded || !window.PaystackPop) {
      alert('Payment system is loading. Please try again.');
      return;
    }

    setLoading(true);

    try {
      const reference = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const publicKey = PAYSTACK_PUBLIC_KEY;

      if (!publicKey) {
        alert('Payment configuration error. Please contact support.');
        setLoading(false);
        return;
      }

      // Map selected method to Paystack channel, or omit to show all
      const paystackChannels: Record<string, string> = {
        card: 'card',
        bank_transfer: 'bank_transfer',
        bank: 'bank',
        ussd: 'ussd',
      };
      const channel = paystackChannels[selectedMethod];

      const config: Record<string, unknown> = {
        key: publicKey,
        email: formData.email,
        amount: Math.round(totalAmount * 100),
        currency: 'NGN',
        ref: reference,
        metadata: {
          custom_fields: [
            { display_name: 'Customer Name', variable_name: 'customer_name', value: `${formData.firstName} ${formData.lastName}` },
            { display_name: 'Phone', variable_name: 'phone', value: formData.phone },
          ],
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.country,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
          })),
        },
      };

      // Only set channels for standard Paystack channels
      // OPay, PayAttitude, Zap are shown automatically by Paystack when enabled
      if (channel) {
        config.channels = [channel];
      }

      const handler = window.PaystackPop.setup({
        ...config,
        onClose: () => {
          setLoading(false);
        },
        callback: async (response: { reference: string }) => {
          // Trigger server-side order saving via the callback endpoint
          try {
            await fetch('/api/payment/callback?reference=' + response.reference, {
              redirect: 'manual', // Don't follow the redirect
            });
          } catch {
            // The callback may redirect, which is fine — order is saved
          }
          clearCart();
          router.push(`/checkout/success?reference=${response.reference}`);
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  // Empty cart view
  if (cartCount === 0 && !loading) {
    return (
      <div className="min-h-screen bg-white md:bg-gray-50 relative overflow-hidden flex flex-col font-inter">
        <div className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
          <div className="flex items-center h-14 px-4">
            <button onClick={() => router.push('/')} className="flex items-center text-gray-900 active:scale-95 transition-transform duration-200 cursor-pointer">
              <span className="text-2xl font-bold text-[#201d1e] -ml-1">&lt;</span>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2">
              <h1 className="text-[17px] font-bold tracking-tight text-gray-900">Checkout</h1>
            </div>
          </div>
        </div>
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
            <h2 className="text-3xl md:text-4xl font-black text-[#201d1e] tracking-tight mb-4">Your cart is empty</h2>
            <p className="text-gray-500 text-base md:text-lg font-medium mb-12 max-w-[280px] mx-auto leading-relaxed">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link href="/collections" className="group relative inline-flex items-center justify-center w-full md:w-auto px-10 h-16 bg-[#201d1e] text-white rounded-2xl font-black text-lg shadow-2xl shadow-black/20 active:scale-[0.98] transition-all overflow-hidden cursor-pointer">
              <span className="relative z-10">Browse Collections</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <div className="mt-12 pt-12 border-t border-gray-100/50">
              <p className="text-xs font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Need help?</p>
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
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100/50">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={() => step === 'payment' ? setStep('info') : router.push('/')}
            className="flex items-center text-gray-900 active:scale-95 transition-transform duration-200 cursor-pointer"
          >
            <span className="text-2xl font-bold text-[#201d1e] -ml-1">&lt;</span>
          </button>
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-[17px] font-black tracking-tight text-gray-900 uppercase">
              {step === 'info' ? 'Checkout' : 'Payment'}
            </h1>
          </div>
        </div>
        {/* Step indicator */}
        <div className="flex px-4 pb-3 gap-2">
          <div className={`h-1 flex-1 rounded-full transition-all ${step === 'info' ? 'bg-[#cfa224]' : 'bg-[#cfa224]'}`} />
          <div className={`h-1 flex-1 rounded-full transition-all ${step === 'payment' ? 'bg-[#cfa224]' : 'bg-gray-200'}`} />
        </div>
      </div>

      <div className="flex-1 py-8 md:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop header */}
          <div className="hidden md:block mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#cfa224] transition-colors group cursor-pointer">
              <ChevronLeft className="mr-1 transition-transform group-hover:-translate-x-1" />
              Back to store
            </Link>
            <h1 className="mt-4 text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
            {/* Desktop step indicator */}
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => setStep('info')} className="flex items-center gap-2 cursor-pointer">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === 'info' ? 'bg-[#cfa224] text-white' : 'bg-[#cfa224] text-white'
                }`}>
                  {step === 'payment' ? <CheckIcon className="w-4 h-4" /> : '1'}
                </span>
                <span className={`text-sm font-semibold ${step === 'info' ? 'text-gray-900' : 'text-gray-500'}`}>Your Details</span>
              </button>
              <div className="w-12 h-[2px] bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === 'payment' ? 'bg-[#cfa224] text-white' : 'bg-gray-200 text-gray-400'
                }`}>2</span>
                <span className={`text-sm font-semibold ${step === 'payment' ? 'text-gray-900' : 'text-gray-400'}`}>Payment</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column - Form or Payment Methods */}
            <div className="lg:col-span-7">
              {step === 'info' ? (
                <form onSubmit={handleContinueToPayment} className="space-y-8">
                  {/* Mobile Native Form */}
                  <div className="md:hidden space-y-6">
                    {/* Compact Order Summary for Mobile */}
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
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                              <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{item.quantity}</span>
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
                      <ListInput label="Email Address" type="email" placeholder="alex@example.com" value={formData.email} name="email" onInput={handleInputChange} required />
                      <ListInput label="Phone Number" type="tel" placeholder="+234 ..." value={formData.phone} name="phone" onInput={handleInputChange} required />
                    </List>
                    <BlockTitle>Shipping Details</BlockTitle>
                    <List strong inset>
                      <ListInput label="First Name" type="text" placeholder="First Name" value={formData.firstName} name="firstName" onInput={handleInputChange} required />
                      <ListInput label="Last Name" type="text" placeholder="Last Name" value={formData.lastName} name="lastName" onInput={handleInputChange} required />
                      <ListInput label="Address" type="text" placeholder="Street address" value={formData.address} name="address" onInput={handleInputChange} required />
                      <ListInput label="City" type="text" placeholder="City" value={formData.city} name="city" onInput={handleInputChange} required />
                      <ListInput label="Country" type="text" placeholder="Country" value={formData.country} name="country" onInput={handleInputChange} required />
                    </List>
                  </div>

                  {/* Desktop Form */}
                  <div className="hidden md:block space-y-8">
                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm mr-3">1</span>
                        Contact Information
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                          <input required type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all" placeholder="alex@example.com" />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                          <input required type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all" placeholder="+234 ..." />
                        </div>
                      </div>
                    </section>
                    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm mr-3">2</span>
                        Shipping Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                          <input required type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all" />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                          <input required type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all" />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                          <input required type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all" placeholder="Street address, apartment, suite, etc." />
                        </div>
                        <div>
                          <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                          <input required type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all" />
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                          <input required type="text" id="country" name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#cfa224]/20 focus:border-[#cfa224] outline-none transition-all" />
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Desktop Continue Button */}
                  <button type="submit" className="hidden md:flex w-full bg-[#cfa224] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-[#cfa224]/20 hover:bg-[#b8911f] transition-all items-center justify-center space-x-3 group cursor-pointer">
                    <span>Continue to Payment</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Mobile Fixed Bottom Button */}
                  <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                    <Button large rounded onClick={(e: React.MouseEvent) => { const form = (e.currentTarget as HTMLElement).closest('form'); if (form) form.requestSubmit(); }} className="bg-[#cfa224] text-white font-black h-14">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              ) : (
                /* Payment Method Selection */
                <div className="space-y-8">
                  <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Payment Method</h2>
                    <p className="text-sm text-gray-500 mb-6">Select your preferred method. All available options will be shown in the secure payment window.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {paymentMethods.map((method) => {
                        const isSelected = selectedMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer group ${
                              isSelected
                                ? 'border-[#cfa224] bg-[#cfa224]/5 shadow-lg shadow-[#cfa224]/10'
                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {/* Selection indicator */}
                            <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'border-[#cfa224] bg-[#cfa224]' : 'border-gray-200'
                            }`}>
                              {isSelected && <CheckIcon className="w-3 h-3 text-white" />}
                            </div>

                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                              isSelected ? 'bg-[#cfa224] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                            }`}>
                              <method.icon className="w-6 h-6" />
                            </div>
                            <div className="pr-6">
                              <p className={`font-bold text-sm ${isSelected ? 'text-[#cfa224]' : 'text-gray-900'}`}>{method.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{method.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* Order details summary on payment step */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-600">Shipping to</span>
                      <button onClick={() => setStep('info')} className="text-xs font-bold text-[#cfa224] hover:underline cursor-pointer">Edit</button>
                    </div>
                    <p className="text-sm text-gray-900 font-medium">{formData.firstName} {formData.lastName}</p>
                    <p className="text-sm text-gray-500">{formData.address}, {formData.city}</p>
                    <p className="text-sm text-gray-500">{formData.email} · {formData.phone}</p>
                  </div>

                  {/* Desktop Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={loading || !scriptLoaded}
                    className="hidden md:flex w-full bg-[#201d1e] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-black/10 hover:bg-black transition-all items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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

                  {/* Mobile Fixed Bottom Pay Button */}
                  <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                    <Button large rounded onClick={handlePayment} disabled={loading || !scriptLoaded} className="bg-[#201d1e] text-white font-black h-14">
                      {loading ? 'Processing...' : `Pay ₦${totalAmount.toLocaleString()} Now`}
                    </Button>
                  </div>

                  <p className="text-center text-xs text-gray-400 pb-24 md:pb-0">
                    <Lock className="w-3 h-3 inline mr-1" />
                    Secure payment powered by Paystack. Your financial information is never stored.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary (Desktop) */}
            <div className="hidden md:block lg:col-span-5">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-32">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                        <span className="absolute top-1 right-1 bg-gray-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">{item.quantity}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 truncate">{item.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.size && <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded">{item.size}</span>}
                          {item.color && <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest bg-gray-50 px-1.5 py-0.5 rounded">{item.color}</span>}
                        </div>
                        <p className="text-sm font-bold text-gray-900 mt-2">₦{(item.price * item.quantity).toLocaleString()}</p>
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
                    <span className="text-2xl font-black bg-[#cfa224]/10 text-[#cfa224] px-4 py-1 rounded-lg">₦{totalAmount.toLocaleString()}</span>
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

                {/* Payment method selected indicator */}
                {step === 'payment' && (
                  <div className="mt-6 p-4 bg-[#cfa224]/5 rounded-xl border border-[#cfa224]/20">
                    <p className="text-xs font-bold text-[#cfa224] uppercase tracking-wider mb-1">Paying with</p>
                    <p className="text-sm font-bold text-gray-900">{paymentMethods.find(m => m.id === selectedMethod)?.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
