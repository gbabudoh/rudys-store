'use client';

import React, { useEffect, useState } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false,
}: ConfirmationModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);

  // Sync state with prop during render phase to avoid cascading renders in useEffect
  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      document.body.style.overflow = 'unset';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const typeConfig = {
    danger: {
      accent: 'bg-red-500',
      iconBg: 'bg-red-50',
      iconText: 'text-red-500',
      confirmBtn: 'bg-red-600 hover:bg-red-700 shadow-red-100',
    },
    warning: {
      accent: 'bg-amber-500',
      iconBg: 'bg-amber-50',
      iconText: 'text-amber-500',
      confirmBtn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-100',
    },
    info: {
      accent: 'bg-blue-500',
      iconBg: 'bg-blue-50',
      iconText: 'text-blue-500',
      confirmBtn: 'bg-[#201d1e] hover:bg-black shadow-gray-100',
    },
  };

  const config = typeConfig[type] || typeConfig.danger;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop with sophisticated blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container - Ultra Modern "Floating" Card */}
      <div 
        className={`relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] transition-all duration-500 ease-out transform ${
          isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-12 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Accent */}
        <div className={`h-1.5 w-full ${config.accent}`} />
        
        <div className="relative px-8 pt-12 pb-10 sm:px-10 flex flex-col items-center">
          
          {/* Minimalist Premium Icon Container */}
          <div className={`mb-8 flex h-24 w-24 items-center justify-center rounded-3xl ${config.iconBg} transform -rotate-6 transition-transform hover:rotate-0 duration-500`}>
            {type === 'danger' && (
              <svg className={`h-12 w-12 ${config.iconText}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            )}
            {type === 'warning' && (
              <svg className={`h-12 w-12 ${config.iconText}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            )}
            {type === 'info' && (
              <svg className={`h-12 w-12 ${config.iconText}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            )}
          </div>

          {/* Heading - Bold & Punchy */}
          <h3 className="text-3xl font-black text-[#201d1e] italic tracking-tighter text-center leading-tight">
            {title}
          </h3>

          {/* Message - Airy and Readable */}
          <div className="mt-4 mb-10 w-full text-center px-2">
            <p className="text-lg font-medium text-gray-500 leading-relaxed max-w-xs mx-auto">
              {message}
            </p>
          </div>

          {/* Buttons - Premium Modern Style */}
          <div className="flex w-full flex-col gap-4">
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-[1.5rem] ${config.confirmBtn} py-5 text-lg font-black text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-xl`}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? (
                <>
                  <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
                  <span className="uppercase tracking-widest text-[13px]">Processing...</span>
                </>
              ) : (
                <span className="uppercase tracking-widest text-[13px]">{confirmText}</span>
              )}
            </button>
            
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full rounded-[1.5rem] py-5 text-[13px] font-black uppercase tracking-[0.2em] text-gray-400 transition-all hover:text-gray-900 active:scale-[0.98]"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
