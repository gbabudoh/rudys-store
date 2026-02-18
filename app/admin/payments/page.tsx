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

export default function PaymentSetup() {
  const [paystackConfigured] = useState(false);
  const [paystackPublicKey, setPaystackPublicKey] = useState('');
  const [paystackSecretKey, setPaystackSecretKey] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Configuration</h1>
        <p className="mt-1 text-sm text-gray-600">
          Configure payment gateways and settings
        </p>
      </div>

      {/* Paystack Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg cursor-pointer">
              <svg className="w-6 h-6 text-purple-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Paystack</h2>
              <p className="text-sm text-gray-600">Primary payment gateway</p>
            </div>
          </div>
          {paystackConfigured ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 cursor-pointer">
              <CheckCircle className="w-4 h-4 mr-1 cursor-pointer" />
              Configured
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 cursor-pointer">
              <XCircle className="w-4 h-4 mr-1 cursor-pointer" />
              Not Configured
            </span>
          )}
        </div>

        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Public Key
            </label>
            <input
              type="text"
              value={paystackPublicKey}
              onChange={(e) => setPaystackPublicKey(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="pk_test_..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Your Paystack public key (starts with pk_test_ or pk_live_)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secret Key
            </label>
            <input
              type="password"
              value={paystackSecretKey}
              onChange={(e) => setPaystackSecretKey(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="sk_test_..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Your Paystack secret key (starts with sk_test_ or sk_live_)
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="test-mode"
              defaultChecked
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="test-mode" className="ml-2 block text-sm text-gray-900 cursor-pointer">
              Test Mode (Use test keys for development)
            </label>
          </div>

          <button className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-medium transition-all cursor-pointer">
            Save Configuration
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Accepted Payment Methods</h2>
        <div className="space-y-3">
          {['Card Payments', 'Bank Transfer', 'Mobile Money', 'Pay on Delivery'].map((method) => (
            <label key={method} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transaction Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm cursor-pointer">
              <option className="cursor-pointer">NGN - Nigerian Naira</option>
              <option className="cursor-pointer">USD - US Dollar</option>
              <option className="cursor-pointer">GBP - British Pound</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Order Amount
            </label>
            <input
              type="number"
              defaultValue="0"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

