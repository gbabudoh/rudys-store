'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, ShoppingBag, Heart, LogOut, Package, User, ChevronRight, Menu } from 'lucide-react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
    { name: 'Track Order', href: '/dashboard/tracking', icon: Package },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    // { name: 'Addresses', href: '/dashboard/addresses', icon: MapPin }, // Can add later
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 shadow-xl lg:shadow-none transform transition-all duration-300 ease-out lg:transform-none lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full bg-slate-50/50">
          {/* User Info */}
          <div className="p-6 border-b border-gray-100 bg-white">
            <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{user?.first_name} {user?.last_name}</h3>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
                </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:bg-white hover:text-purple-600 hover:shadow-sm'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 transition-colors ${
                      active ? 'text-purple-600' : 'text-gray-400 group-hover:text-purple-500'
                    }`}
                  />
                  <span className="flex-1">{item.name}</span>
                  {active && <ChevronRight className="w-4 h-4 text-purple-400" />}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-700" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
