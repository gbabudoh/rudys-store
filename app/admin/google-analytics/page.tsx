'use client';

import { useState } from 'react';

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function GoogleAnalyticsSetup() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [measurementId, setMeasurementId] = useState('');

  const handleSave = () => {
    // TODO: Save to environment variables via API
    console.log('Saving GA Measurement ID:', measurementId);
    setIsConfigured(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Google Analytics Setup</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure Google Analytics 4 (GA4) for your store
        </p>
      </div>

      {/* Configuration Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg cursor-pointer">
              <svg className="w-6 h-6 text-blue-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Google Analytics 4</h2>
              <p className="text-sm text-gray-600">Track visitor behavior and conversions</p>
            </div>
          </div>
          {isConfigured ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 cursor-pointer">
              <CheckCircle className="w-4 h-4 mr-1 cursor-pointer" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 cursor-pointer">
              <XCircle className="w-4 h-4 mr-1 cursor-pointer" />
              Not Configured
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Measurement ID (G-XXXXXXXXXX)
            </label>
            <input
              type="text"
              value={measurementId}
              onChange={(e) => setMeasurementId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-mono"
            />
            <p className="mt-1 text-xs text-gray-500">
              Find your Measurement ID in Google Analytics Admin → Data Streams → Web Stream
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Setup Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Go to Google Analytics and create a GA4 property</li>
              <li>Create a Web Data Stream for your website</li>
              <li>Copy the Measurement ID (format: G-XXXXXXXXXX)</li>
              <li>Paste it in the field above and click Save</li>
            </ol>
          </div>

          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </div>

      {/* Tracking Events */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tracked Events</h2>
        <div className="space-y-2">
          {[
            'Page Views',
            'Product Views',
            'Add to Cart',
            'Remove from Cart',
            'Checkout Started',
            'Purchase Completed',
            'Search',
          ].map((event) => (
            <div key={event} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-900 cursor-pointer">{event}</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 cursor-pointer">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

