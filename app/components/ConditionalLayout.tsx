'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CookieBanner from './CookieBanner';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { QuickViewProvider } from '@/context/QuickViewContext';
import { AuthProvider } from '@/context/AuthContext';
import CartSidebar from './CartSidebar';
import BottomNav from './BottomNav';
import PWAInstallPrompt from './PWAInstallPrompt';
import Chatbot from '@/components/Chatbot';
import { App } from 'konsta/react';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if we're on an admin or auth route
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAuthRoute = pathname === '/login' || pathname === '/register' || pathname === '/checkout' || pathname === '/wishlist' || pathname === '/orders';

  if (isAdminRoute) {
    // No header/footer for admin routes
    return <main>{children}</main>;
  }

  // Regular layout with header and footer
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <QuickViewProvider>
            <App theme="parent" safeAreas>
              {!isAuthRoute && <Header />}
              <main className={`${!isAuthRoute ? 'pb-20 md:pb-0' : ''} ${isAuthRoute ? 'md:pt-0' : ''}`}>
                {children}
              </main>
              {!isAuthRoute && <Footer />}
              <BottomNav />
              <PWAInstallPrompt />
              <CartSidebar />
              <CookieBanner />
              <Chatbot />
            </App>
          </QuickViewProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
