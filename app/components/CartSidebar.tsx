'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

// Icons
const X = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Trash2 = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-5 h-5"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ShoppingBag = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-12 h-12"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

export default function CartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalAmount } = useCart();

  const handleClose = () => setIsCartOpen(false);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 cursor-pointer"
        onClick={handleClose}
      />

      {/* Sidebar Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div 
          className="w-screen max-w-md transform transition-transform duration-500 ease-in-out"
          style={{ transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)' }}
        >
          <div className="h-full flex flex-col bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  {cart.length} items
                </span>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="bg-gray-50 p-6 rounded-full">
                    <ShoppingBag className="text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Your cart is empty</h3>
                    <p className="text-gray-500 mt-1 max-w-[240px]">
                      Looks like you haven&apos;t added anything to your cart yet.
                    </p>
                  </div>
                  <button 
                    onClick={handleClose}
                    className="mt-4 px-6 py-2 bg-[#201d1e] text-white rounded-lg font-medium hover:bg-black transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 group">
                      {/* Product Image */}
                      <div className="relative h-24 w-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#cfa224] transition-colors">
                              {item.name}
                            </h3>
                            <button 
                              onClick={() => removeFromCart(item.id, item.size, item.color)}
                              className="text-gray-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                            {item.size && (
                              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                                Color: {item.color}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-end mt-2">
                          <div className="flex items-center space-x-1 border border-gray-100 rounded-lg p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Summary */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4 bg-gray-50/50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₦{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium whitespace-nowrap">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-base font-bold text-gray-900 tracking-tight">Total</span>
                    <div className="text-right">
                      <p className="text-xl font-black text-gray-900 leading-none">
                        ₦{totalAmount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">Tax included</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Link 
                    href="/checkout"
                    onClick={handleClose}
                    className="w-full bg-[#201d1e] text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-black/10 hover:shadow-2xl transition-all duration-300 hover:bg-black group cursor-pointer"
                  >
                    <span>Checkout Now</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <button 
                    onClick={handleClose}
                    className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors py-2 cursor-pointer"
                  >
                    Or continue shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
