'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  RefreshCw, 
  ShoppingCart,
  Package,
  ArrowRight,
  Plus,
  Minus,
  Check,
  Loader2
} from 'lucide-react';

interface ReorderItem {
  product_id: number;
  product_name: string;
  slug: string;
  current_price: number;
  stock_quantity: number;
  product_status: string;
  product_image: string;
  last_ordered: string;
  total_ordered: number;
}

export default function ReorderPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<ReorderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set());

  const fetchReorderItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/customer/reorder', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
        // Initialize quantities
        const initialQuantities: Record<number, number> = {};
        (data.items || []).forEach((item: ReorderItem) => {
          initialQuantities[item.product_id] = 1;
        });
        setQuantities(initialQuantities);
      }
    } catch (error) {
      console.error('Error fetching reorder items:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReorderItems();
  }, [fetchReorderItems]);
  const updateQuantity = (productId: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const item = items.find(i => i.product_id === productId);
      const maxStock = item?.stock_quantity || 10;
      const newQty = Math.max(1, Math.min(current + delta, maxStock));
      return { ...prev, [productId]: newQty };
    });
  };

  const addToCart = async (productId: number) => {
    try {
      setAddingToCart(productId);
      const response = await fetch('/api/customer/reorder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          quantity: quantities[productId] || 1
        })
      });
      
      if (response.ok) {
        setAddedToCart(prev => new Set([...prev, productId]));
        // Reset after 2 seconds
        setTimeout(() => {
          setAddedToCart(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center">
            <RefreshCw className="w-8 h-8 mr-3 text-[#cfa224]" />
            Reorder
          </h1>
          <p className="text-gray-500 mt-1">Quickly reorder your favorite items</p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 border-4 border-[#cfa224] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your favorites...</p>
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Package className="w-12 h-12 text-purple-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No items to reorder</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Once you make purchases, you&apos;ll be able to quickly reorder them here.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#cfa224] to-[#e6b82e] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            Start Shopping
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      ) : (
        /* Reorder Items */
        <div className="space-y-4">
          {items.map((item) => {
            const isAdding = addingToCart === item.product_id;
            const isAdded = addedToCart.has(item.product_id);
            const qty = quantities[item.product_id] || 1;
            
            return (
              <div key={item.product_id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Product Image */}
                  <Link href={`/products/${item.slug}`} className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.product_image} 
                        alt={item.product_name} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  </Link>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-bold text-gray-900 hover:text-[#cfa224] transition-colors truncate">
                        {item.product_name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      Last ordered: {formatDate(item.last_ordered)}
                    </p>
                    <p className="text-sm text-gray-500">
                      You&apos;ve ordered this {item.total_ordered} time{item.total_ordered !== 1 ? 's' : ''}
                    </p>
                    <p className="font-bold text-[#cfa224] mt-2 text-lg">
                      {formatCurrency(item.current_price)}
                    </p>
                  </div>

                  {/* Quantity & Add to Cart */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-xl">
                      <button 
                        onClick={() => updateQuantity(item.product_id, -1)}
                        disabled={qty <= 1}
                        className="p-3 hover:bg-gray-200 rounded-l-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="px-4 font-bold text-gray-900 min-w-[3rem] text-center">{qty}</span>
                      <button 
                        onClick={() => updateQuantity(item.product_id, 1)}
                        disabled={qty >= item.stock_quantity}
                        className="p-3 hover:bg-gray-200 rounded-r-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <button 
                      onClick={() => addToCart(item.product_id)}
                      disabled={isAdding || isAdded}
                      className={`inline-flex items-center px-5 py-3 font-semibold rounded-xl transition-all cursor-pointer min-w-[140px] justify-center ${
                        isAdded 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-[#201d1e] text-white hover:bg-[#2d2a2b]'
                      }`}
                    >
                      {isAdding ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isAdded ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Added!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
