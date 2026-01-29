'use client';

import { useAuth } from '@/context/AuthContext';
import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';

// Hydration-safe hook
function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (hasMounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [hasMounted, isAuthenticated, router]);

  // Always show loading on server and initial client render to prevent hydration mismatch
  if (!hasMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#cfa224] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Top gradient bar */}
      <div className="h-1 bg-gradient-to-r from-[#201d1e] via-[#cfa224] to-[#201d1e]"></div>
      
      {/* Main Content - Full Width */}
      <main className="py-8 px-4 sm:px-8 lg:px-16 xl:px-24 max-w-screen-2xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
