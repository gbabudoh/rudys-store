'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Cookie = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Settings = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      setTimeout(() => {
        setShowBanner(true);
      }, 1000);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(cookieConsent);
        setPreferences(savedPreferences);
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(onlyEssential);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    setShowPreferences(false);
    setShowBanner(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Initialize analytics based on preferences
    if (prefs.analytics && typeof window !== 'undefined') {
      // Initialize Google Analytics if enabled
      // This would typically be handled by your analytics setup
      console.log('Analytics cookies enabled');
    }
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {!showPreferences ? (
              // Main Banner View
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(207, 162, 36, 0.1)' }}>
                      <Cookie className="w-6 h-6" style={{ color: '#cfa224' }} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      We Value Your Privacy
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                      By clicking "Accept All", you consent to our use of cookies. You can also choose to customize 
                      your preferences or reject non-essential cookies.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <Link 
                        href="/privacy" 
                        className="hover:text-[#cfa224] transition-colors underline"
                      >
                        Privacy Policy
                      </Link>
                      <span>•</span>
                      <Link 
                        href="/terms" 
                        className="hover:text-[#cfa224] transition-colors underline"
                      >
                        Terms of Service
                      </Link>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                    <button
                      onClick={() => setShowPreferences(true)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Customize
                    </button>
                    <button
                      onClick={handleRejectAll}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-6 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 shadow-md"
                      style={{ backgroundColor: '#cfa224' }}
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Preferences View
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Cookie Preferences
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage your cookie preferences. You can enable or disable different types of cookies below.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close preferences"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cookie Categories */}
                <div className="space-y-4 mb-6">
                  {/* Essential Cookies */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Essential Cookies</h4>
                        <p className="text-xs text-gray-600">
                          Required for the website to function properly. These cannot be disabled.
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="relative inline-flex items-center h-6 w-11 cursor-not-allowed opacity-50">
                          <input
                            type="checkbox"
                            checked={preferences.essential}
                            disabled
                            className="sr-only"
                          />
                          <div className="w-11 h-6 rounded-full" style={{ backgroundColor: '#cfa224' }}></div>
                          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Analytics Cookies</h4>
                        <p className="text-xs text-gray-600">
                          Help us understand how visitors interact with our website (e.g., Google Analytics).
                        </p>
                      </div>
                      <div className="ml-4">
                        <label className="relative inline-flex items-center h-6 w-11 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.analytics}
                            onChange={() => handleTogglePreference('analytics')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#cfa224] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#cfa224]"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Marketing Cookies</h4>
                        <p className="text-xs text-gray-600">
                          Used to deliver relevant advertisements and track campaign effectiveness.
                        </p>
                      </div>
                      <div className="ml-4">
                        <label className="relative inline-flex items-center h-6 w-11 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.marketing}
                            onChange={() => handleTogglePreference('marketing')}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#cfa224] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#cfa224]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowPreferences(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 shadow-md"
                    style={{ backgroundColor: '#cfa224' }}
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {showBanner && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => {}} // Prevent closing on backdrop click for better UX
        />
      )}

      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

