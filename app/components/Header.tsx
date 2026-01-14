'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
// Simple icon components to replace lucide-react
const ShoppingBag = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const Menu = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const X = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-6 h-6"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const User = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-5 h-5"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Heart = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-5 h-5"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

interface UserDropdownProps {
  user: { first_name: string | null; last_name: string | null; email: string } | null;
}

function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold hover:bg-purple-700 transition-colors">
          {user?.first_name?.[0]}{user?.last_name?.[0]}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto pl-0 pr-4 sm:pr-6 lg:pr-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center cursor-pointer">
            <div className="relative h-16 w-52 md:h-20 md:w-64">
              <Image
                src="/rudy-store-logo.png"
                alt="Rudy Store Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/collections" className="text-gray-700 hover:transition-colors font-medium cursor-pointer" style={{ '--hover-color': '#cfa224' } as React.CSSProperties & { '--hover-color': string }} onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
              Rudy Collections
            </Link>
            <Link href="/luxury" className="text-gray-700 hover:transition-colors font-medium cursor-pointer" onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
              Rudy Luxury
            </Link>
            <Link href="/crocs" className="text-gray-700 hover:transition-colors font-medium cursor-pointer" onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
              Slide & Sole
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* User Icon / Avatar with Dropdown */}
            {mounted && isAuthenticated ? (
              <UserDropdown user={user} />
            ) : (
              <Link 
                href="/login"
                className="p-2 text-gray-600 transition-colors cursor-pointer" 
                onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'} 
                onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}
              >
                <User className="w-5 h-5" />
              </Link>
            )}
            <Link 
              href="/wishlist" 
              className="p-2 text-gray-600 transition-colors cursor-pointer relative" 
              onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'} 
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}
            >
              <Heart className="w-5 h-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{ backgroundColor: '#cfa224' }}>
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button 
              className="p-2 text-gray-600 transition-colors relative cursor-pointer" 
              onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'} 
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{ backgroundColor: '#201d1e' }}>
                  {cartCount}
                </span>
              )}
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 transition-colors cursor-pointer"
              onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/collections" 
                className="text-gray-700 transition-colors font-medium py-2 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Rudy Collections
              </Link>
              <Link 
                href="/luxury" 
                className="text-gray-700 transition-colors font-medium py-2 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Rudy Luxury
              </Link>
              <Link 
                href="/crocs" 
                className="text-gray-700 transition-colors font-medium py-2 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Slide & Sole
              </Link>
              
              {/* Mobile Search */}
              <div className="pt-4">
                <SearchBar isMobile />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
