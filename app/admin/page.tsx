'use client';

import { useState, useEffect } from 'react';

// Icons
const Package = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const Users = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const ShoppingBag = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const DollarSign = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const Crown = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const Footprints = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-1 4h12l-1-4M6 8v10a2 2 0 002 2h8a2 2 0 002-2V8M6 8h12" />
  </svg>
);

interface RecentOrder {
  id: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  collectionsProducts: number;
  luxuryProducts: number;
  crocsProducts: number;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    collectionsProducts: 0,
    luxuryProducts: 0,
    crocsProducts: 0,
    recentOrders: [],
    topProducts: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = () => {
      setTimeout(() => {
        setStats({
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          collectionsProducts: 0,
          luxuryProducts: 0,
          crocsProducts: 0,
          recentOrders: [],
          topProducts: []
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700';
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'shipped': return 'bg-blue-50 text-blue-700';
      case 'processing': return 'bg-purple-50 text-purple-700';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-sm">
        <h1 className="text-4xl font-black text-[#201d1e] tracking-tight">Dashboard</h1>
        <p className="text-gray-500 font-medium mt-2 text-lg">
          Welcome back! Here&apos;s a quick overview of your store&apos;s performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Products', value: stats.totalProducts.toLocaleString(), icon: Package, color: 'blue' },
          { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'green' },
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'purple' },
          { label: 'Total Customers', value: stats.totalCustomers.toLocaleString(), icon: Users, color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-[#201d1e] tracking-tighter">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-3xl bg-${stat.color}-50 group-hover:rotate-12 transition-transform duration-500`}>
                <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          { title: 'Rudy Collections', count: stats.collectionsProducts, icon: Package, color: 'purple', lightColor: 'purple' },
          { title: 'Rudy Luxury', count: stats.luxuryProducts, icon: Crown, color: 'amber', lightColor: 'amber' },
          { title: 'Slide & Sole', count: stats.crocsProducts, icon: Footprints, color: 'green', lightColor: 'green' },
        ].map((cat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-[#201d1e] tracking-tight">{cat.title}</h3>
              <div className={`p-3 rounded-2xl bg-${cat.lightColor}-50`}>
                <cat.icon className={`w-6 h-6 text-${cat.color}-600`} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Inventory</span>
                <span className="text-2xl font-black text-[#201d1e]">{cat.count} <span className="text-xs text-gray-400">Items</span></span>
              </div>
              <div className="w-full bg-gray-50 rounded-full h-3 overflow-hidden">
                <div className={`bg-${cat.color}-600 h-full rounded-full transition-all duration-1000`} style={{ width: '0%' }}></div>
              </div>
              <p className="text-xs font-bold text-gray-400 tracking-wide">0% of absolute total stock</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-2xl font-black text-[#201d1e] tracking-tight">Recent Activity</h3>
            <button className="text-xs font-black uppercase tracking-widest text-purple-600 hover:text-purple-700 bg-purple-50 px-4 py-2 rounded-xl transition-all cursor-pointer">View All Orders</button>
          </div>
          <div className="p-8">
            {stats.recentOrders.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-lg font-bold text-gray-900">No recent orders</p>
                <p className="text-gray-400 mt-1">Activity will appear here as customers shop.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-gray-400 text-sm">
                        {order.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-[#201d1e]">{order.customer}</p>
                        <p className="text-xs font-bold text-gray-400">Order #{order.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#201d1e] mb-1">{formatCurrency(order.amount)}</p>
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-2xl font-black text-[#201d1e] tracking-tight">Top Sellers</h3>
            <button className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-all cursor-pointer">View Analytics</button>
          </div>
          <div className="p-8">
            {stats.topProducts.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-200" />
                </div>
                <p className="text-lg font-bold text-gray-900">No product data yet</p>
                <p className="text-gray-400 mt-1">High-selling items will be highlighted here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {stats.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-[#201d1e]">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-black text-[#201d1e]">{product.name}</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.sales} Sales this month</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#201d1e] mb-1">{formatCurrency(product.revenue)}</p>
                      <div className="flex items-center justify-end text-[10px] font-black text-green-600 uppercase tracking-widest">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>Trend Up</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
