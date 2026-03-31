'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  MapPin, 
  User, 
  ArrowRight, 
  Clock,
  RefreshCw,
  Heart,
  Headphones,
  TrendingUp,
  Loader2
} from 'lucide-react';

interface Order {
  id: number;
  order_number: string;
  status: string;
  total: string | number;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    processing: 0,
    delivered: 0,
    wishlist: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/customer/orders?limit=5', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (data.orders) {
          const fetchedOrders = data.orders;
          setOrders(fetchedOrders);
          
          // Calculate stats
          const totalCount = data.pagination?.total || fetchedOrders.length;
          const processingCount = fetchedOrders.filter((o: Order) => 
            ['pending', 'processing', 'shipped'].includes(o.status.toLowerCase())
          ).length;
          const deliveredCount = fetchedOrders.filter((o: Order) => 
            o.status.toLowerCase() === 'delivered'
          ).length;

          setStats({
            total: totalCount,
            processing: processingCount,
            delivered: deliveredCount,
            wishlist: 0 // Placeholder for now
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const statsDisplay = [
    { name: 'Total Orders', value: stats.total.toString(), icon: ShoppingBag, color: 'from-blue-500 to-blue-600' },
    { name: 'Processing', value: stats.processing.toString(), icon: Clock, color: 'from-amber-500 to-orange-500' },
    { name: 'Delivered', value: stats.delivered.toString(), icon: Package, color: 'from-emerald-500 to-green-600' },
    { name: 'Wishlist', value: stats.wishlist.toString(), icon: Heart, color: 'from-pink-500 to-rose-500' },
  ];

  const quickActions = [
    { name: 'Reorder', description: 'Buy your favorites again', icon: RefreshCw, href: '/customer/dashboard/reorder', color: 'bg-gradient-to-br from-purple-500 to-indigo-600' },
    { name: 'Track Order', description: 'Check delivery status', icon: Package, href: '/customer/dashboard/tracking', color: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
    { name: 'Get Support', description: 'We\'re here to help', icon: Headphones, href: '/contact', color: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#201d1e] via-[#2d2a2b] to-[#201d1e] p-8 md:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="text-white/60 text-lg">
              Here&apos;s what&apos;s happening with your account today.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <Link href="/" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#cfa224] to-[#e6b82e] text-white font-bold rounded-xl shadow-lg shadow-[#cfa224]/30 hover:shadow-[#cfa224]/50 transition-all duration-300 hover:-translate-y-0.5">
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsDisplay.map((stat) => (
          <div key={stat.name} className="group bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
            <p className="text-3xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.name} href={action.href} className="group relative overflow-hidden p-6 rounded-2xl text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className={`absolute inset-0 ${action.color}`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-1">{action.name}</h3>
                <p className="text-white/80 text-sm">{action.description}</p>
              </div>
              <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px] flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/customer/dashboard/orders" className="text-sm font-semibold text-[#cfa224] hover:text-[#b8911f] flex items-center transition-colors">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="flex-1 p-4">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#cfa224] animate-spin" />
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{order.order_number}</p>
                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₦{Number(order.total).toLocaleString()}</p>
                      <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${
                        order.status.toLowerCase() === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold text-lg mb-2">No orders yet</h3>
                <Link href="/" className="text-[#cfa224] font-semibold hover:underline">Start Shopping</Link>
              </div>
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-bold text-gray-900">Account Details</h2>
            <Link href="/customer/dashboard/profile" className="text-sm font-semibold text-[#cfa224] hover:text-[#b8911f] flex items-center transition-colors">
              Edit <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-[#cfa224] to-[#e6b82e] rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block text-sm text-gray-500 font-medium">Full Name</span>
                <span className="block font-bold text-gray-900">{user?.first_name} {user?.last_name}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">@</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500 font-medium">Email Address</span>
                <span className="block font-bold text-gray-900">{user?.email}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="block text-sm text-gray-500 font-medium">Primary Address</span>
                <span className="block font-bold text-gray-900">{user?.address || 'No address saved'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
