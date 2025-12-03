'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '../components/AdminSidebar';

interface AdminUser {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'super_admin' | 'admin' | 'staff';
  permissions: string[];
  lastLogin?: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  
  const [mounted, setMounted] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Skip auth check for login page
    if (isLoginPage) return;

    const token = localStorage.getItem('admin_token');
    const cachedUser = localStorage.getItem('admin_user');
    
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    // Set authenticated and user immediately if token exists
    setIsAuthenticated(true);
    if (cachedUser) {
      try {
        setAdminUser(JSON.parse(cachedUser));
      } catch (e) {
        console.error('Error parsing cached user:', e);
      }
    }

    // Verify token in background (non-blocking)
    fetch('/api/admin/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          setAdminUser(data.user);
          localStorage.setItem('admin_user', JSON.stringify(data.user));
        } else {
          // Token invalid, clear and redirect
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          router.replace('/admin/login');
        }
      })
      .catch((error) => {
        console.error('Auth check error:', error);
      });
  }, [isLoginPage, router]);
  
  // Login page - no layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Wait for client-side mount to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  // Not authenticated - redirect
  if (!isAuthenticated) {
    return null;
  }

  // Show dashboard with cached data
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      <AdminSidebar adminUser={adminUser} />
      <div className="lg:pl-72">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
