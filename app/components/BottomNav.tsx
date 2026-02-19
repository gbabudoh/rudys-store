'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Tabbar, TabbarLink } from 'konsta/react';

// Icons
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={`${className || "w-6 h-6"} cursor-pointer`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ShopIcon = ({ className }: { className?: string }) => (
  <svg className={`${className || "w-6 h-6"} cursor-pointer`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={`${className || "w-6 h-6"} cursor-pointer`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MoreIcon = ({ className }: { className?: string }) => (
  <svg className={`${className || "w-6 h-6"} cursor-pointer`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    setIsShopMenuOpen(false);
    setIsMoreMenuOpen(false);
    router.push(path);
  };

  const isShopActive = ['/store', '/luxury', '/crocs'].includes(pathname);
  const isMoreActive = ['/wishlist', '/orders', '/contact', '/faq'].includes(pathname);

  return (
    <div className="md:hidden">
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Tabbar labels icons className="left-0 bottom-0 fixed border-t border-gray-100 bg-white/80 backdrop-blur-lg">
          <TabbarLink
            active={pathname === '/'}
            onClick={() => router.push('/')}
            label="Home"
            icon={<HomeIcon className="w-6 h-6" />}
          />
          <TabbarLink
            active={isShopActive}
            onClick={() => { setIsMoreMenuOpen(false); setIsShopMenuOpen(!isShopMenuOpen); }}
            label="Shop"
            icon={<ShopIcon className="w-6 h-6" />}
          />
          <TabbarLink
            active={pathname === '/login' || pathname === '/dashboard'}
            onClick={() => router.push('/dashboard')}
            label="Account"
            icon={<UserIcon className="w-6 h-6" />}
          />
          <TabbarLink
            active={isMoreActive}
            onClick={() => { setIsShopMenuOpen(false); setIsMoreMenuOpen(!isMoreMenuOpen); }}
            label="More"
            icon={<MoreIcon className="w-6 h-6" />}
          />
        </Tabbar>
      </div>

      {/* Custom Shop Menu */}
      {isShopMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 z-40 transition-opacity"
            onClick={() => setIsShopMenuOpen(false)}
          />
          {/* Menu */}
          <div className="fixed bottom-16 left-4 right-4 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ruddy&apos;s Store Categories</p>
            </div>
            <button 
              onClick={() => handleNavigate('/store')}
              className="w-full px-4 py-4 text-left text-gray-800 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center space-x-3 cursor-pointer"
            >
              <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </span>
              <span>Rudy Collections</span>
            </button>
            <button 
              onClick={() => handleNavigate('/luxury')}
              className="w-full px-4 py-4 text-left text-gray-800 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center space-x-3 border-t border-gray-50 cursor-pointer"
            >
              <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                </svg>
              </span>
              <span>Ruddy Luxury</span>
            </button>
            <button 
              onClick={() => handleNavigate('/crocs')}
              className="w-full px-4 py-4 text-left text-gray-800 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center space-x-3 border-t border-gray-50 cursor-pointer"
            >
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </span>
              <span>Slide & Sole</span>
            </button>
            <button 
              onClick={() => setIsShopMenuOpen(false)}
              className="w-full px-4 py-4 text-center text-gray-500 font-bold hover:bg-gray-50 active:bg-gray-100 transition-colors border-t border-gray-100 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Custom More Menu */}
      {isMoreMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 z-40 transition-opacity"
            onClick={() => setIsMoreMenuOpen(false)}
          />
          {/* Menu */}
          <div className="fixed bottom-16 left-4 right-4 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">More Features</p>
            </div>
            <button 
              onClick={() => handleNavigate('/wishlist')}
              className="w-full px-4 py-4 text-left text-gray-800 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center space-x-3 cursor-pointer"
            >
              <span className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
              <span>My Wishlist</span>
            </button>
            <button 
              onClick={() => handleNavigate('/orders')}
              className="w-full px-4 py-4 text-left text-gray-800 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center space-x-3 border-t border-gray-50 cursor-pointer"
            >
              <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </span>
              <span>My Orders</span>
            </button>
            <button 
              onClick={() => handleNavigate('/contact')}
              className="w-full px-4 py-4 text-left text-gray-800 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center space-x-3 border-t border-gray-50 cursor-pointer"
            >
              <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <span>Contact Us</span>
            </button>
            <button 
              onClick={() => handleNavigate('/faq')}
              className="w-full px-4 py-4 text-left text-gray-800 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center space-x-3 border-t border-gray-50 cursor-pointer"
            >
              <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span>FAQ & Help</span>
            </button>
            <button 
              onClick={() => setIsMoreMenuOpen(false)}
              className="w-full px-4 py-4 text-center text-gray-500 font-bold hover:bg-gray-50 active:bg-gray-100 transition-colors border-t border-gray-100 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
