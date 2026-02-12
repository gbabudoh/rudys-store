'use client';

import { useEffect, useState } from 'react';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const X = ({ className }: { className?: string }) => (
  <svg className={className || "w-6 h-6"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-8 h-8"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export default function MessageModal({ isOpen, onClose, message }: MessageModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  // Synchronize state with props during render to avoid cascading renders in useEffect
  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  useEffect(() => {
    if (!isOpen && shouldRender) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!shouldRender && !isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 backdrop-blur-md' : 'opacity-0 backdrop-blur-0'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      onClick={onClose}
    >
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full transform transition-all duration-300 border border-gray-100 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background element */}
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#cfa224]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#201d1e]/5 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#cfa224]/10 rounded-2xl flex items-center justify-center mb-6 text-[#cfa224] animate-bounce-slow">
            <AlertCircle className="w-8 h-8" />
          </div>
          
          <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Attention Required</h3>
          <p className="text-gray-600 font-bold leading-relaxed mb-8">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full bg-[#201d1e] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:shadow-xl hover:scale-[1.02] transform transition-all active:scale-[0.98] cursor-pointer"
          >
            Got it, thanks
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
