'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Simple icon components
const Facebook = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-5 h-5"} style={style} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const Twitter = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-5 h-5"} style={style} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const Instagram = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-5 h-5"} style={style} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTok = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-5 h-5"} style={style} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Mail = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Phone = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MapPin = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className || "w-4 h-4"} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface StoreSettings {
  store_address?: string;
  store_phone?: string;
  store_email?: string;
  social_facebook?: string;
  social_instagram?: string;
  social_twitter?: string;
  social_tiktok?: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<StoreSettings>({});

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="relative h-12 w-40">
                <Image
                  src="/rudy-store-logo.png"
                  alt="Rudy Store Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover premium fashion collections, luxury items, and exclusive Crocs. 
              Your one-stop destination for men&apos;s, women&apos;s, and children&apos;s fashion.
            </p>
            <div className="flex space-x-4">
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors cursor-pointer" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors cursor-pointer" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.social_tiktok && (
                <a href={settings.social_tiktok} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors cursor-pointer" aria-label="TikTok">
                  <TikTok className="w-5 h-5" />
                </a>
              )}
              {settings.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors cursor-pointer" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {!settings.social_facebook && !settings.social_instagram && !settings.social_tiktok && !settings.social_twitter && (
                <>
                  <span className="text-gray-400 cursor-pointer" aria-label="Facebook"><Facebook className="w-5 h-5" /></span>
                  <span className="text-gray-400 cursor-pointer" aria-label="Instagram"><Instagram className="w-5 h-5" /></span>
                  <span className="text-gray-400 cursor-pointer" aria-label="TikTok"><TikTok className="w-5 h-5" /></span>
                  <span className="text-gray-400 cursor-pointer" aria-label="Twitter"><Twitter className="w-5 h-5" /></span>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/collections" className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
                  Rudy Collections
                </Link>
              </li>
              <li>
                <Link href="/luxury" className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
                  Rudy Luxury
                </Link>
              </li>
              <li>
                <Link href="/crocs" className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
                  Slide & Sole
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#cfa224' }} />
                <span className="text-gray-300 text-sm">{settings.store_address || 'Loading...'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#cfa224' }} />
                <span className="text-gray-300 text-sm">{settings.store_phone || 'Loading...'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#cfa224' }} />
                <span className="text-gray-300 text-sm">{settings.store_email || 'Loading...'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Rudy&apos;s Store. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
