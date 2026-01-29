'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  Package, 
  ShoppingBag, 
  MapPin, 
  User, 
  ArrowRight, 
  Clock,
  RefreshCw,
  TrendingUp,
  Heart,
  Headphones
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Orders', value: '0', icon: ShoppingBag, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Processing', value: '0', icon: Clock, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50' },
    { name: 'Delivered', value: '0', icon: Package, color: 'from-emerald-500 to-green-600', bgColor: 'bg-emerald-50' },
    { name: 'Wishlist', value: '0', icon: Heart, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50' },
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
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#cfa224]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#cfa224]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
        
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
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#cfa224] to-[#e6b82e] text-white font-bold rounded-xl shadow-lg shadow-[#cfa224]/30 hover:shadow-[#cfa224]/50 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.name} 
            className="group bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
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
            <Link
              key={action.name}
              href={action.href}
              className="group relative overflow-hidden p-6 rounded-2xl text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link 
              href="/customer/dashboard/orders" 
              className="text-sm font-semibold text-[#cfa224] hover:text-[#b8911f] flex items-center transition-colors cursor-pointer"
            >
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center min-h-[250px]">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-[#201d1e] text-white font-semibold rounded-xl hover:bg-[#2d2a2b] transition-colors cursor-pointer"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-lg font-bold text-gray-900">Account Details</h2>
            <Link 
              href="/customer/dashboard/profile" 
              className="text-sm font-semibold text-[#cfa224] hover:text-[#b8911f] flex items-center transition-colors cursor-pointer"
            >
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
