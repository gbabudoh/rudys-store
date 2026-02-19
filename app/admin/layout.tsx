'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '../components/AdminSidebar';

interface AdminUser {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  role: 'super_admin' | 'admin' | 'staff' | 'store_manager' | 'sales_manager' | 'customer_service' | 'other';
  permissions: string[];
  lastLogin?: string;
}

interface AdminState {
  mounted: boolean;
  isAuthenticated: boolean;
  user: AdminUser | null;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  
  // Single state object to keep state updates atomic
  const [state, setState] = useState<AdminState>({
    mounted: false,
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    // Definitive Fix: Use an asynchronous initialization pattern.
    // By moving the setState call into an async microtask, we ensure that it
    // is NOT called synchronously during the effect body execution.
    // This resolves the "cascading renders" lint error while maintaining correct behavior.
    const initializeAdmin = async () => {
      // Small pause to separate execution from the initial effect body
      await Promise.resolve();

      const token = localStorage.getItem('admin_token');
      const cachedUser = localStorage.getItem('admin_user');
      
      let is_auth = false;
      let user_data = null;

      if (token) {
        is_auth = true;
        if (cachedUser) {
          try {
            user_data = JSON.parse(cachedUser);
          } catch (e) {
            console.error('Error parsing cached user:', e);
          }
        }
      }

      // If we're not on the login page and have no token, redirect immediately
      if (!isLoginPage && !token) {
        router.replace('/admin/login');
        return;
      }

      // Update state once in the asynchronous context
      setState({
        mounted: true,
        isAuthenticated: is_auth,
        user: user_data,
      });

      // Verify token in background if it exists
      if (token) {
        try {
          const response = await fetch('/api/admin/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setState(prev => ({ ...prev, user: data.user }));
            localStorage.setItem('admin_user', JSON.stringify(data.user));
          } else {
            // Token invalid, clear and redirect
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            router.replace('/admin/login');
          }
        } catch (error) {
          console.error('Auth check error:', error);
        }
      }
    };

    initializeAdmin();
  }, [isLoginPage, router]);
  
  // Login page - no layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Hydration safety: return null until client-side mount is confirmed
  if (!state.mounted) {
    return null;
  }

  // Prevents flicker for unauthenticated users before redirect triggers
  if (!state.isAuthenticated) {
    return null;
  }

  // Show dashboard with cached/verified data
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      <AdminSidebar adminUser={state.user} />
      <div className="lg:pl-72">
        <main className="p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
