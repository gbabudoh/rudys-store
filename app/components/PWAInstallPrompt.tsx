'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Download, Share2, PlusSquare } from 'lucide-react';

// Types for PWA Events
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other' | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppDetected, setIsAppDetected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to report installation/app open to the backend
  const trackAppStatus = async () => {
    try {
      await fetch('/api/app-status', { method: 'POST' });
    } catch (err) {
      console.error('Failed to track app status:', err);
    }
  };

  useEffect(() => {
    // 1. Check if they've dismissed it in this session or permanently
    const checkDismissal = () => {
      if (typeof window === 'undefined') return true;
      return localStorage.getItem('pwa_prompt_dismissed') === 'true' || 
             sessionStorage.getItem('pwa_prompt_dismissed_session') === 'true';
    };

    if (checkDismissal()) {
      setIsLoading(false);
      return;
    }

    // 2. Check if IP/App is already registered on the backend
    const checkIpStatus = async () => {
      try {
        const res = await fetch('/api/app-status');
        const data = await res.json();
        // If the backend says it's already installed for this IP, hide the prompt
        if (data.isInstalled) {
          setIsAppDetected(true);
        }
      } catch (err) {
        console.error('Failed to check IP status:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkIpStatus();

    // Detect platform and standalone status
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent) || 
                 (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    const isAndroid = /android/.test(userAgent);
    const isStandalone = (window.navigator as NavigatorWithStandalone).standalone || 
                         window.matchMedia('(display-mode: standalone)').matches;

    // If already in standalone mode, don't show prompt and record status
    if (isStandalone) {
      trackAppStatus();
      setIsAppDetected(true);
      return;
    }

    // Scheduling the prompt display
    let timer: NodeJS.Timeout;

    const showPromptAfterDelay = () => {
      if (!checkDismissal()) {
        setShowPrompt(true);
      }
    };

    if (!isStandalone) {
      if (isIOS) {
        setPlatform('ios');
        timer = setTimeout(showPromptAfterDelay, 5000); // 5s delay for iOS
      } else if (isAndroid) {
        setPlatform('android');
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // For Android/Chrome-based browsers
      timer = setTimeout(showPromptAfterDelay, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    // Set both permanent and session-based dismissal
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    sessionStorage.setItem('pwa_prompt_dismissed_session', 'true');
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
      localStorage.setItem('pwa_prompt_dismissed', 'true');
      trackAppStatus();
    } else {
      // Even if they cancel the native prompt, we treat it as a dismissal for the session
      setShowPrompt(false);
      sessionStorage.setItem('pwa_prompt_dismissed_session', 'true');
    }
    setDeferredPrompt(null);
  };

  if (isLoading || isAppDetected || !showPrompt) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[100] animate-slide-up">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 relative overflow-hidden group">
        {/* Background Sparkle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#cfa224]/10 rounded-full blur-3xl group-hover:bg-[#cfa224]/20 transition-colors duration-500"></div>
        
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1 rounded-full bg-gray-100/50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <div className="absolute inset-0 bg-gray-900/5 rounded-2xl blur-lg scale-110"></div>
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <Image 
                src="/pwa-icon.png" 
                alt="Ruddy's Store App" 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1 pt-1">
            <h3 className="text-lg font-black text-gray-900 leading-tight">Install Ruddy&apos;s Store App</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">Get the full luxury experience on your home screen.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {platform === 'ios' ? (
            <div className="bg-gray-50/50 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">How to Install</p>
              <div className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-500">
                  <Share2 className="w-4 h-4" />
                </div>
                <span>Tap the <strong>Share</strong> button below</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-900">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <span>Select <strong>Add to Home Screen</strong></span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="w-full py-4 bg-[#201d1e] text-white font-black rounded-2xl shadow-xl shadow-black/10 active:scale-95 transition-transform flex items-center justify-center gap-2 group/btn cursor-pointer"
            >
              <Download className="w-5 h-5 group-hover/btn:animate-bounce" />
              Download & Install App
            </button>
          )}

          <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Native experience • Faster Access • Exclusive UI
          </p>
        </div>
      </div>
    </div>
  );
}
