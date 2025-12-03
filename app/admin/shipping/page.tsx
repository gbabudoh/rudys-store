'use client';

import { useState } from 'react';

const Plus = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const Edit = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const Trash2 = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

interface ShippingMethod {
  id: string;
  name: string;
  carrier: string;
  estimatedDays: string;
  price: number;
  freeShippingThreshold?: number;
  isActive: boolean;
}

export default function ShippingManagement() {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([
    {
      id: '1',
      name: 'Standard Shipping',
      carrier: 'FedEx',
      estimatedDays: '5-7 business days',
      price: 5.99,
      freeShippingThreshold: 50,
      isActive: true,
    },
    {
      id: '2',
      name: 'Express Shipping',
      carrier: 'DHL',
      estimatedDays: '2-3 business days',
      price: 15.99,
      isActive: true,
    },
    {
      id: '3',
      name: 'Overnight Shipping',
      carrier: 'UPS',
      estimatedDays: '1 business day',
      price: 29.99,
      isActive: true,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shipping Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Configure shipping methods and rates
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Plus className="w-5 h-5 mr-2" />
          Add Shipping Method
        </button>
      </div>

      {/* Shipping Methods */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Shipping Methods</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {shippingMethods.map((method) => (
            <div key={method.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-medium text-gray-900">{method.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      method.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {method.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Carrier:</span> {method.carrier}
                    </div>
                    <div>
                      <span className="font-medium">Delivery:</span> {method.estimatedDays}
                    </div>
                    <div>
                      <span className="font-medium">Price:</span> ₦{method.price.toFixed(2)}
                      {method.freeShippingThreshold && (
                        <span className="text-gray-500 ml-1">
                          (Free over ${method.freeShippingThreshold})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Zones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Zones</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Domestic (Nigeria)</h3>
              <p className="text-sm text-gray-600">All shipping methods available</p>
            </div>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Configure
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">International</h3>
              <p className="text-sm text-gray-600">Express and Standard shipping available</p>
            </div>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

