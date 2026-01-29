'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Search, 
  Loader2, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
  product_id: number;
  product_name: string;
  variant_info: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_slug: string;
  product_image: string;
}

interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: string;
  subtotal: number;
  total: number;
  currency: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  items: OrderItem[];
}

export default function TrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(`/api/orders/track?orderNumber=${orderNumber}&email=${email}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to track order');
      }

      setOrder(data.order);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to track order');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (step: string) => {
    if (!order) return 'upcoming';
    
    const statuses = {
      pending: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
      cancelled: 0
    };

    const currentStatusLevel = statuses[order.status] || 1;
    const stepLevel = {
      'Order Placed': 1,
      'Processing': 2,
      'Shipped': 3,
      'Delivered': 4
    }[step] || 0;

    if (order.status === 'cancelled') return 'cancelled';
    if (stepLevel < currentStatusLevel) return 'completed';
    if (stepLevel === currentStatusLevel) return 'current';
    return 'upcoming';
  };

  const steps = [
    { label: 'Order Placed', icon: Clock, date: order?.created_at },
    { label: 'Processing', icon: Package, date: null },
    { label: 'Shipped', icon: Truck, date: order?.shipped_at },
    { label: 'Delivered', icon: CheckCircle2, date: order?.delivered_at }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Track Your Order</h1>
          <p className="text-slate-500">Enter your details to follow your order&apos;s journey.</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 mb-8 border border-white/50 backdrop-blur-sm">
          <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Order Number</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="ORD-..."
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-slate-300 font-medium"
              />
            </div>
            <div className="md:col-span-1 flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    Track Order
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {order && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Status Timeline */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-white/50">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Order #{order.order_number}</h2>
                  <p className="text-sm text-slate-400 font-medium">Placed on {new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                  order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {order.status}
                </div>
              </div>

              <div className="relative">
                {/* Horizontal Line */}
                <div className="absolute top-7 left-0 w-full h-1 bg-slate-100 -z-0" />
                
                <div className="relative z-10 grid grid-cols-4 gap-4">
                  {steps.map((step, index) => {
                    const status = getStepStatus(step.label);
                    const Icon = step.icon;
                    
                    return (
                      <div key={index} className="flex flex-col items-center text-center">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          status === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' :
                          status === 'current' ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-110' :
                          status === 'cancelled' ? 'bg-red-500 text-white shadow-lg shadow-red-200' :
                          'bg-white border-2 border-slate-100 text-slate-300'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className={`mt-4 text-xs font-bold uppercase tracking-wider ${
                          status === 'upcoming' ? 'text-slate-300' : 'text-slate-900'
                        }`}>
                          {step.label}
                        </h3>
                        {step.date && (
                          <p className="mt-1 text-[10px] text-slate-400 font-medium">
                            {new Date(step.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Items List */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-white/50">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Order Summary
                </h3>
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden shadow-inner">
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{item.product_name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{item.variant_info}</p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Qty: {item.quantity}</span>
                          <span className="text-xs font-black text-slate-900">₦{item.total_price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-sm text-slate-400 font-medium">
                    <span>Subtotal</span>
                    <span>₦{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-slate-900">
                    <span>Total</span>
                    <span>₦{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 border border-white/50">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Shipping Information
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</label>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <div className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-emerald-500' : 'bg-purple-500'}`} />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</label>
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                      {order.shipping_address}<br />
                      {order.shipping_city}, {order.shipping_state}
                    </p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payment</label>
                    <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                      {order.payment_status}
                    </p>
                  </div>
                </div>

                <div className="mt-12">
                  <div className="bg-slate-900 rounded-2xl p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Courier Partner</p>
                        <p className="text-xs font-black">Standard Express Delivery</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
