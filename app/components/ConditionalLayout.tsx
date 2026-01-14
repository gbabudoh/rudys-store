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

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if we're on an admin route
  const isAdminRoute = pathname?.startsWith('/admin');

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
            <Header />
            <main>{children}</main>
            <Footer />
            <CartSidebar />
            <CookieBanner />
          </QuickViewProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
