'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  History, 
  Calendar, 
  Search, 
  ChevronDown,
  Package,
  ArrowRight,
  Download,
  TrendingUp
} from 'lucide-react';

interface HistoryItem {
  item_id: number;
  product_id: number;
  product_name: string;
  variant_info: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  order_id: number;
  order_number: string;
  order_status: string;
  purchase_date: string;
  product_slug: string;
  product_image: string;
  current_price: number;
  product_status: string;
}

interface Stats {
  totalSpent: number;
  orderCount: number;
}

export default function PurchaseHistoryPage() {
  const { token } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<Stats>({ totalSpent: 0, orderCount: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const dateFilters = [
    { value: 'all', label: 'All Time' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
  ];

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        period: dateFilter,
        ...(searchQuery && { search: searchQuery })
      });
      
      const response = await fetch(`/api/customer/history?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
        setStats(data.stats || { totalSpent: 0, orderCount: 0 });
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, searchQuery, token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center">
            <History className="w-8 h-8 mr-3 text-[#cfa224]" />
            Purchase History
          </h1>
          <p className="text-gray-500 mt-1">View all your past purchases and transactions</p>
        </div>
        
        <button className="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
          <Download className="w-4 h-4 mr-2" />
          Export History
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#201d1e] to-[#2d2a2b] rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm font-medium">Total Spent</p>
              <p className="text-3xl font-black mt-1">{formatCurrency(stats.totalSpent)}</p>
            </div>
            <div className="w-14 h-14 bg-[#cfa224]/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-[#cfa224]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{stats.orderCount}</p>
            </div>
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Package className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#cfa224] focus:bg-white transition-all text-gray-900 font-medium placeholder:text-gray-400"
            />
          </div>
          
          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none pl-12 pr-10 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#cfa224] focus:bg-white transition-all text-gray-900 font-medium cursor-pointer"
            >
              {dateFilters.map(filter => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <button 
            type="submit"
            className="inline-flex items-center px-4 py-3 bg-[#201d1e] text-white font-semibold rounded-xl hover:bg-[#2d2a2b] transition-colors cursor-pointer"
          >
            Search
          </button>
        </div>
      </form>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-12 h-12 border-4 border-[#cfa224] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your purchase history...</p>
        </div>
      ) : history.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No purchase history</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Once you make your first purchase, it will appear here. Start exploring our collection!
          </p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#cfa224] to-[#e6b82e] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            Browse Products
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      ) : (
        /* History List */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {history.map((item) => (
              <div key={item.item_id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.product_image} 
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{item.product_name}</h3>
                    {item.variant_info && (
                      <p className="text-sm text-gray-500">{item.variant_info}</p>
                    )}
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span>Order #{item.order_number}</span>
                      <span>•</span>
                      <span>{formatDate(item.purchase_date)}</span>
                      <span>•</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900">{formatCurrency(item.total_price)}</p>
                    {item.product_status === 'active' && (
                      <Link 
                        href={`/products/${item.product_slug}`}
                        className="text-sm text-[#cfa224] font-semibold hover:underline cursor-pointer"
                      >
                        Buy Again
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
