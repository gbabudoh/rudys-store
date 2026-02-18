'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

// Icon components
const Dashboard = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const Package = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const Crown = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const Folder = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const Tag = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 011 12V7a4 4 0 014-4z" />
  </svg>
);

const Mail = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ShoppingBag = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const Truck = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
);

const MapPin = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CreditCard = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const BarChart = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const Settings = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Users = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const LogOut = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const Menu = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-5 h-5"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const X = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-5 h-5"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronRight = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-3.5 h-3.5"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ImageIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ColorSwatch = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  badge?: number;
  category?: string;
}

interface AdminSidebarProps {
  adminUser: {
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  } | null;
}

export default function AdminSidebar({ adminUser: adminUserProp }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminUser] = useState<AdminSidebarProps['adminUser']>(() => {
    if (adminUserProp) return adminUserProp;
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (error) {
          console.error('Error parsing admin user:', error);
        }
      }
    }
    return null;
  });

  const pathname = usePathname();
  const router = useRouter();

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const messages = await res.json();
        const unread = messages.filter((m: { status: string }) => m.status === 'unread').length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const initFetch = async () => {
      await fetchUnreadCount();
      // Polling every 2 minutes
      interval = setInterval(fetchUnreadCount, 120000);
    };

    initFetch();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/admin', icon: Dashboard, category: 'Overview' },
    { name: 'Customer Service', href: '/admin/customer-service', icon: Mail, category: 'Overview', badge: unreadCount > 0 ? unreadCount : undefined },
    { name: 'Banners', href: '/admin/banners', icon: ImageIcon, category: 'Content' },
    { name: 'Homepage Sections', href: '/admin/homepage-sections', icon: ImageIcon, category: 'Content' },
    { name: 'Footer', href: '/admin/footer', icon: ImageIcon, category: 'Content' },
    { name: 'Ruddys Store', href: '/admin/collections', icon: Package, category: 'Products' },
    { name: 'Ruddy Luxury', href: '/admin/luxury', icon: Crown, category: 'Products' },
    { name: 'Slide & Sole', href: '/admin/crocs', icon: ShoppingBag, category: 'Products' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, category: 'Sales' },
    { name: 'Shipping', href: '/admin/shipping', icon: Truck, category: 'Sales' },
    { name: 'Tracking', href: '/admin/tracking', icon: MapPin, category: 'Sales' },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard, category: 'Sales' },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart, category: 'Insights' },
    { name: 'Google Analytics', href: '/admin/google-analytics', icon: BarChart, category: 'Insights' },
    { name: 'Categories', href: '/admin/categories', icon: Package, category: 'Management' },
    { name: 'Sub-Categories', href: '/admin/sub-categories', icon: Folder, category: 'Management' },
    { name: 'Product Types', href: '/admin/product-types', icon: Tag, category: 'Management' },
    { name: 'Brands', href: '/admin/brands', icon: Crown, category: 'Management' },
    { name: 'Colors', href: '/admin/colors', icon: ColorSwatch, category: 'Management' },
    { name: 'Customers', href: '/admin/customers', icon: Users, category: 'Management' },
    { name: 'Admin Users', href: '/admin/users', icon: Users, category: 'Management' },
    { name: 'Settings', href: '/admin/settings', icon: Settings, category: 'Management' },
  ];

  // Group navigation by category
  const groupedNav = navigation.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const categoryOrder = ['Overview', 'Content', 'Products', 'Sales', 'Insights', 'Management'];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 shadow-2xl transform transition-all duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
            <div className="relative h-10 w-10">
              <Image
                src="/pwa-icon.png"
                alt="Rudy Store Icon"
                fill
                className="object-contain"
                priority
              />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto custom-scrollbar">
            {categoryOrder.map((category) => {
              const items = groupedNav[category];
              if (!items) return null;
              
              return (
                <div key={category}>
                  <h3 className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          className={`group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${
                            active
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                              : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                          }`}
                        >
                          {active && (
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur-xl opacity-30 -z-10" />
                          )}
                          <item.icon
                            className={`mr-3 flex-shrink-0 w-4 h-4 transition-all duration-200 ${
                              active ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'
                            }`}
                          />
                          <span className="flex-1">{item.name}</span>
                          {active && (
                            <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                          )}
                          {item.badge && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {item.badge}
                            </span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="border-t border-slate-700/50 p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center mb-3 p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all duration-200">
              <div className="flex-shrink-0">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30 ring-2 ring-purple-500/20">
                  <span className="text-white font-semibold text-sm">
                    {adminUser?.firstName?.charAt(0) || adminUser?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
              </div>
              <div className="ml-2.5 flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {adminUser?.firstName && adminUser?.lastName
                    ? `${adminUser.firstName} ${adminUser.lastName}`
                    : adminUser?.email || 'Admin'}
                </p>
                <p className="text-xs text-slate-400 capitalize flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  {adminUser?.role?.replace('_', ' ') || 'Admin'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 rounded-lg hover:bg-red-600/20 hover:text-red-400 border border-slate-700/50 hover:border-red-500/30 transition-all duration-200 group cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg shadow-purple-500/30 text-white hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </>
  );
}

