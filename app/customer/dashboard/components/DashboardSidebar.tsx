'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  LogOut, 
  Package, 
  User, 
  ChevronRight, 
  Menu,
  History,
  MapPin,
  RefreshCw,
  X
} from 'lucide-react';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'My Orders', href: '/customer/dashboard/orders', icon: ShoppingBag },
    { name: 'Track Order', href: '/customer/dashboard/tracking', icon: Package },
    { name: 'Purchase History', href: '/customer/dashboard/history', icon: History },
    { name: 'Reorder', href: '/customer/dashboard/reorder', icon: RefreshCw },
    { name: 'Saved Addresses', href: '/customer/dashboard/addresses', icon: MapPin },
    { name: 'Profile', href: '/customer/dashboard/profile', icon: User },
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
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-[#201d1e] text-white rounded-full shadow-2xl hover:bg-[#cfa224] transition-all duration-300 cursor-pointer group"
      >
        <Menu className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 bg-gradient-to-b from-[#201d1e] to-[#2d2a2b] shadow-2xl transform transition-all duration-300 ease-out lg:transform-none lg:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button - Mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Brand Header */}
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-[#cfa224] to-[#e6b82e] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">R</span>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Ruddy&apos;s Store</h2>
                <p className="text-white/50 text-xs">Customer Portal</p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-white/10 bg-white/5">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#cfa224] to-[#e6b82e] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-lg truncate">
                  {user?.first_name} {user?.last_name}
                </h3>
                <p className="text-white/50 text-sm truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-4 py-3.5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-[#cfa224] to-[#e6b82e] text-white shadow-lg shadow-[#cfa224]/30'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`mr-3.5 h-5 w-5 transition-all duration-200 ${
                      active ? 'text-white' : 'text-white/50 group-hover:text-[#cfa224]'
                    }`}
                  />
                  <span className="flex-1">{item.name}</span>
                  {active && <ChevronRight className="w-4 h-4 text-white/80" />}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="group flex w-full items-center px-4 py-3.5 text-sm font-semibold text-red-400 rounded-xl hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="mr-3.5 h-5 w-5 text-red-400 group-hover:text-red-300" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
