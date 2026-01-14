'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Package, ShoppingBag, MapPin, User, ArrowRight, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Orders', value: '0', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600' },
    { name: 'Processing', value: '0', icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
    { name: 'Delivered', value: '0', icon: Package, color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening with your account today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center min-h-[200px]">
             <div className="bg-gray-50 p-4 rounded-full mb-3">
                 <ShoppingBag className="w-8 h-8 text-gray-400" />
             </div>
             <h3 className="text-gray-900 font-medium mb-1">No orders yet</h3>
             <p className="text-gray-500 text-sm mb-4">Start shopping to see your orders here</p>
             <Link href="/" className="btn btn-primary bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                 Start Shopping
             </Link>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Account Details</h2>
            <Link href="/dashboard/profile" className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center">
              Edit <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                    <span className="block text-sm text-gray-500">Name</span>
                    <span className="block font-medium text-gray-900">{user?.first_name} {user?.last_name}</span>
                </div>
            </div>
            <div className="flex items-start space-x-3">
                <div className="w-5 flex justify-center mt-0.5"><span className="text-gray-400">@</span></div>
                <div>
                    <span className="block text-sm text-gray-500">Email</span>
                    <span className="block font-medium text-gray-900">{user?.email}</span>
                </div>
            </div>
             <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                    <span className="block text-sm text-gray-500">Address</span>
                    <span className="block font-medium text-gray-900">{user?.address || 'No address saved'}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
