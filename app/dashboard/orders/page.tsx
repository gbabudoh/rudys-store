'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Filter } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        
        <div className="flex gap-2">
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search orders..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="bg-purple-50 p-6 rounded-full mb-4">
                <ShoppingBag className="w-10 h-10 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-500 max-w-sm mb-6">
                Looks like you haven&apos;t placed any orders yet. Start shopping to find your favorite items.
            </p>
            <Link href="/" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
                Start Shopping
            </Link>
        </div>
      </div>
    </div>
  );
}
