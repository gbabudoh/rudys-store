'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/app/components/AdminSidebar';

const platforms = [
  {
    key: 'pixel_facebook',
    label: 'Facebook Pixel',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    placeholder: 'Paste your Facebook Pixel base code here...',
    helpText: 'Find your pixel code in Meta Business Manager → Events Manager → Pixels',
  },
  {
    key: 'pixel_instagram',
    label: 'Instagram Pixel',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    placeholder: 'Paste your Instagram Pixel base code here...',
    helpText: 'Instagram shares the same Meta Pixel as Facebook. You can use the same pixel code.',
  },
  {
    key: 'pixel_tiktok',
    label: 'TikTok Pixel',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z" />
      </svg>
    ),
    color: 'text-gray-900',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    placeholder: 'Paste your TikTok Pixel base code here...',
    helpText: 'Find your pixel code in TikTok Ads Manager → Assets → Events → Pixel',
  },
  {
    key: 'pixel_x',
    label: 'X (Twitter) Pixel',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: 'text-gray-900',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    placeholder: 'Paste your X (Twitter) Pixel base code here...',
    helpText: 'Find your pixel code in X Ads → Tools → Conversion Tracking',
  },
  {
    key: 'pixel_linkedin',
    label: 'LinkedIn Insight Tag',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    placeholder: 'Paste your LinkedIn Insight Tag code here...',
    helpText: 'Find your Insight Tag in LinkedIn Campaign Manager → Account Assets → Insight Tag',
  },
  {
    key: 'pixel_snapchat',
    label: 'Snapchat Pixel',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.028.37-.043.57.698.204 1.575-.065 2.08-.214.1-.029.193-.056.282-.081.38-.107.745-.166 1.07-.166.396 0 .67.074.928.244.553.36.678.884.516 1.318-.219.578-.89.972-1.8 1.098-.08.012-.16.022-.24.03-.555.065-1.297.153-1.625.618-.115.16-.157.358-.123.589.068.449.578.96 1.038 1.424.275.275.538.535.76.815.696.874.977 1.753.843 2.716-.19 1.355-1.32 2.273-2.9 2.434-.255.026-.514.04-.774.04-.572 0-1.158-.073-1.73-.216a5.33 5.33 0 00-1.27-.175c-.437 0-.83.059-1.168.178-.344.122-.65.303-.944.48-.665.403-1.349.818-2.316.818-.966 0-1.65-.415-2.316-.818-.294-.177-.6-.358-.944-.48-.338-.119-.731-.178-1.168-.178-.436 0-.871.058-1.27.175-.572.143-1.158.216-1.73.216-.26 0-.519-.014-.774-.04-1.58-.16-2.71-1.079-2.9-2.434-.134-.963.147-1.842.843-2.716.222-.28.485-.54.76-.815.46-.464.97-.975 1.038-1.424.034-.231-.008-.429-.123-.589-.328-.465-1.07-.553-1.625-.618-.08-.008-.16-.018-.24-.03-.91-.126-1.581-.52-1.8-1.098-.162-.434-.037-.958.516-1.318.258-.17.532-.244.928-.244.325 0 .69.059 1.07.166.089.025.182.052.282.081.505.149 1.382.418 2.08.214-.015-.2-.031-.39-.043-.57l-.003-.06c-.104-1.628-.23-3.654.299-4.847C7.859 1.07 11.216.793 12.206.793z" />
      </svg>
    ),
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    placeholder: 'Paste your Snapchat Pixel base code here...',
    helpText: 'Find your pixel code in Snapchat Ads Manager → Assets → Snap Pixel',
  },
];

export default function PixelTrackingPage() {
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    fetch('/api/admin/settings', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          const pixelCodes: Record<string, string> = {};
          platforms.forEach((p) => {
            pixelCodes[p.key] = data.settings[p.key] || '';
          });
          setCodes(pixelCodes);
        }
      })
      .catch(() => setError('Failed to load pixel tracking codes.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ updates: codes }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save pixel tracking codes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const activeCount = platforms.filter((p) => codes[p.key]?.trim()).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar adminUser={null} />
      <div className="flex-1 lg:ml-72 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pixel Tracking</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage social media pixel codes to track conversions and advertising campaigns.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {activeCount > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                  {activeCount} of {platforms.length} active
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all disabled:opacity-60 cursor-pointer flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </>
                ) : (
                  'Save All'
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Info banner */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-800">
            Paste the full pixel base code provided by each platform. The codes will be automatically injected into the website header on all pages to enable conversion tracking for your advertising campaigns.
          </p>
        </div>

        {/* Platform cards */}
        {loading ? (
          <div className="grid gap-6">
            {platforms.map((p) => (
              <div key={p.key} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
                <div className="h-32 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {platforms.map((platform) => {
              const hasCode = !!codes[platform.key]?.trim();
              return (
                <div
                  key={platform.key}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${platform.bg} ${platform.color}`}>
                        {platform.icon}
                      </div>
                      <h2 className="text-base font-semibold text-gray-900">{platform.label}</h2>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        hasCode
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      {hasCode ? (
                        <>
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                          Active
                        </>
                      ) : (
                        'Not configured'
                      )}
                    </span>
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    <textarea
                      value={codes[platform.key] || ''}
                      onChange={(e) =>
                        setCodes((prev) => ({ ...prev, [platform.key]: e.target.value }))
                      }
                      rows={6}
                      placeholder={platform.placeholder}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs font-mono text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y bg-gray-50 focus:bg-white transition-colors"
                      spellCheck={false}
                    />
                    <p className="text-xs text-gray-500 flex items-start gap-1.5">
                      <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {platform.helpText}
                    </p>
                    {hasCode && (
                      <button
                        onClick={() => setCodes((prev) => ({ ...prev, [platform.key]: '' }))}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        Clear code
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom save */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all disabled:opacity-60 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
