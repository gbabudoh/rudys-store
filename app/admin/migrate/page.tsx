'use client';

import { useState } from 'react';

export default function MigratePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleMigrate = async () => {
    if (!confirm('This will import all hardcoded products to the database. Products that already exist (by slug) will be skipped. Continue?')) {
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/products/migrate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Migration failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/products/migrate', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Migration</h1>
        <p className="mt-1 text-sm text-gray-600">
          Import hardcoded products from the codebase into the database for admin management.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800 mb-2">⚠️ Important</h3>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• This will import all products from <code className="bg-amber-100 px-1 rounded">lib/products.ts</code> to the database</li>
            <li>• Products with existing slugs will be skipped (no duplicates)</li>
            <li>• After migration, products can be managed from the admin panel</li>
            <li>• Only Super Admins can run this migration</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={checkStatus}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Check Status
          </button>
          <button
            onClick={handleMigrate}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Run Migration
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">
              {result.message || 'Status'}
            </h3>
            <div className="text-sm text-green-700 space-y-1">
              {result.totalHardcodedProducts !== undefined && (
                <p>Total hardcoded products: <strong>{result.totalHardcodedProducts}</strong></p>
              )}
              {result.imported !== undefined && (
                <p>Products imported: <strong>{result.imported}</strong></p>
              )}
              {result.skipped !== undefined && (
                <p>Products skipped (already exist): <strong>{result.skipped}</strong></p>
              )}
              {result.total !== undefined && (
                <p>Total processed: <strong>{result.total}</strong></p>
              )}
              {result.errors && result.errors.length > 0 && (
                <div className="mt-2 p-2 bg-red-50 rounded text-red-700">
                  <p className="font-semibold">Errors:</p>
                  <ul className="list-disc list-inside text-xs">
                    {result.errors.map((err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">After Migration</h3>
        <p className="text-sm text-blue-700">
          Once products are migrated, you can manage them from:
        </p>
        <ul className="text-sm text-blue-700 mt-2 space-y-1">
          <li>• <strong>Ruddy Collections</strong> → /admin/collections</li>
          <li>• <strong>Ruddy Luxury</strong> → /admin/luxury</li>
          <li>• <strong>Slide & Sole</strong> → /admin/crocs</li>
        </ul>
      </div>
    </div>
  );
}
