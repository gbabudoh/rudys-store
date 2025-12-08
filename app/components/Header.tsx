'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
// Simple icon components to replace lucide-react
const ShoppingBag = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const Menu = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Search = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Heart = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto pl-0 pr-4 sm:pr-6 lg:pr-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center">
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
            <Link href="/collections" className="text-gray-700 hover:transition-colors font-medium" style={{ '--hover-color': '#cfa224' } as React.CSSProperties & { '--hover-color': string }} onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
              Rudy Collections
            </Link>
            <Link href="/luxury" className="text-gray-700 hover:transition-colors font-medium" onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
              Rudy Luxury
            </Link>
            <Link href="/crocs" className="text-gray-700 hover:transition-colors font-medium" onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'} onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}>
              Slide & Sole
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'} onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
              <User className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 transition-colors" onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'} onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 transition-colors relative" onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'} onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}>
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" style={{ backgroundColor: '#201d1e' }}>
                0
              </span>
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 transition-colors"
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
                className="text-gray-700 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Rudy Collections
              </Link>
              <Link 
                href="/luxury" 
                className="text-gray-700 transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.color = '#cfa224'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
              >
                Rudy Luxury
              </Link>
              <Link 
                href="/crocs" 
                className="text-gray-700 transition-colors font-medium py-2"
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
