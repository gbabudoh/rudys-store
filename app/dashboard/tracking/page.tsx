'use client';

import { useState } from 'react';
import { Package, Truck, MapPin, CheckCircle } from 'lucide-react';

export default function TrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    // Simulate API call
    setTimeout(() => {
        setIsTracking(false);
        // Show mock result
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-600">Enter your order number to track its current status</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleTrack} className="flex gap-4">
            <div className="flex-1 relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                    type="text" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter Order Number (e.g. ORD-12345)"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />
            </div>
            <button 
                type="submit" 
                disabled={isTracking}
                className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
                {isTracking ? 'Tracking...' : 'Track Order'}
            </button>
        </form>
      </div>

      {/* Mock Result Example (Hidden by default in real app, shown here for demo) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
            <div>
                <p className="text-sm text-gray-500 mb-1">Order Number</p>
                <p className="text-lg font-bold text-gray-900">#ORD-83921</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
                <p className="text-lg font-bold text-green-600">Arriving Tomorrow</p>
            </div>
        </div>

        <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-100"></div>

            <div className="space-y-8">
                {/* Step 1 */}
                <div className="relative flex gap-6">
                    <div className="relative z-10 w-16 h-16 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="pt-3">
                        <p className="font-bold text-gray-900">Order Placed</p>
                        <p className="text-sm text-gray-500">Jan 12, 2026 at 10:23 AM</p>
                        <p className="text-sm text-gray-500 mt-1">We have received your order.</p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex gap-6">
                    <div className="relative z-10 w-16 h-16 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center flex-shrink-0">
                        <Package className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="pt-3">
                        <p className="font-bold text-gray-900">Packed</p>
                        <p className="text-sm text-gray-500">Jan 12, 2026 at 2:00 PM</p>
                        <p className="text-sm text-gray-500 mt-1">Your order is packed and ready to ship.</p>
                    </div>
                </div>

                 {/* Step 3 (Active) */}
                <div className="relative flex gap-6">
                    <div className="relative z-10 w-16 h-16 rounded-full bg-purple-600 border-4 border-purple-100 shadow-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                        <Truck className="w-8 h-8 text-white" />
                    </div>
                    <div className="pt-3">
                        <p className="font-bold text-purple-600">On The Way</p>
                        <p className="text-sm text-gray-500">Jan 13, 2026 at 8:45 AM</p>
                        <p className="text-sm text-gray-500 mt-1">Your item is out for delivery with our logistics partner.</p>
                    </div>
                </div>

                 {/* Step 4 (Pending) */}
                <div className="relative flex gap-6 opacity-40">
                    <div className="relative z-10 w-16 h-16 rounded-full bg-gray-50 border-2 border-gray-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="pt-3">
                        <p className="font-bold text-gray-900">Delivered</p>
                        <p className="text-sm text-gray-500">Estimated Jan 14, 2026</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
