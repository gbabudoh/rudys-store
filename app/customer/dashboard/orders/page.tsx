'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ArrowRight, 
  ChevronDown,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react';

interface OrderItem {
  id: number;
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
  created_at: string;
  shipped_at: string | null;
  delivered_at: string | null;
  items: OrderItem[];
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-gray-100 text-gray-600', icon: Clock },
  processing: { label: 'Processing', color: 'bg-amber-100 text-amber-700', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-blue-100 text-blue-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusFilters = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customer/orders?status=${statusFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const filteredOrders = orders.filter(order => 
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center">
            <ShoppingBag className="w-8 h-8 mr-3 text-[#cfa224]" />
            My Orders
          </h1>
          <p className="text-gray-500 mt-1">Track and manage your orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#cfa224] focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#cfa224] focus:bg-white transition-all text-gray-900 font-medium cursor-pointer"
            >
              {statusFilters.map(filter => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <button 
            onClick={fetchOrders}
            className="inline-flex items-center px-4 py-3 bg-[#201d1e] text-white font-semibold rounded-xl hover:bg-[#2d2a2b] transition-colors cursor-pointer"
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 border-4 border-[#cfa224] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#cfa224]/20 to-[#e6b82e]/10 rounded-2xl flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-[#cfa224]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-500 max-w-sm mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'No orders match your filters. Try adjusting your search.'
                : 'Looks like you haven\'t placed any orders yet. Start shopping to find your favorite items.'}
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#cfa224] to-[#e6b82e] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-900">#{order.order_number}</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Placed on {formatDate(order.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-gray-900">{formatCurrency(order.total)}</p>
                      <p className="text-sm text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="p-4 md:p-6">
                  <div className="flex flex-wrap gap-4">
                    {order.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={item.product_image} 
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-[150px]">{item.product_name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl text-gray-500 font-semibold">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                    <Link 
                      href={`/customer/dashboard/tracking?order=${order.order_number}`}
                      className="inline-flex items-center px-4 py-2 text-[#cfa224] font-semibold hover:bg-[#cfa224]/10 rounded-xl transition-colors cursor-pointer"
                    >
                      Track Order
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
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
