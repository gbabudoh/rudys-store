'use client';

import { useState } from 'react';

const Search = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Package = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

interface TrackingInfo {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  currentLocation: string;
  estimatedDelivery: string;
  customerName: string;
  customerEmail: string;
}

export default function TrackingManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [trackings] = useState<TrackingInfo[]>([
    {
      id: '1',
      orderId: 'ORD-001',
      trackingNumber: 'TRK123456789',
      carrier: 'FedEx',
      status: 'in_transit',
      currentLocation: 'Lagos Distribution Center',
      estimatedDelivery: '2024-01-20',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
    },
    {
      id: '2',
      orderId: 'ORD-002',
      trackingNumber: 'TRK987654321',
      carrier: 'DHL',
      status: 'out_for_delivery',
      currentLocation: 'En route to delivery address',
      estimatedDelivery: '2024-01-18',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
    },
    {
      id: '3',
      orderId: 'ORD-003',
      trackingNumber: 'TRK456789123',
      carrier: 'UPS',
      status: 'delivered',
      currentLocation: 'Delivered',
      estimatedDelivery: '2024-01-17',
      customerName: 'Mike Johnson',
      customerEmail: 'mike@example.com',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'exception':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTrackings = trackings.filter(
    (tracking) =>
      tracking.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tracking.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tracking.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
        <p className="mt-1 text-sm text-gray-600">
          Track and manage order shipments
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by tracking number, order ID, or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Tracking List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredTrackings.map((tracking) => (
            <div key={tracking.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Order {tracking.orderId}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {tracking.customerName} • {tracking.customerEmail}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tracking Number:</span>
                      <span className="ml-2 font-mono font-medium text-gray-900">
                        {tracking.trackingNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Carrier:</span>
                      <span className="ml-2 font-medium text-gray-900">{tracking.carrier}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Current Location:</span>
                      <span className="ml-2 text-gray-900">{tracking.currentLocation}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span className="ml-2 text-gray-900">{tracking.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(tracking.status)}`}>
                    {tracking.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

