'use client';

import { useState, useEffect, useCallback } from 'react';

const Search = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Eye = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const Package = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Clock = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Truck = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0 2 2 0 00-4 0z" />
  </svg>
);

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: string;
  total: number;
  items: number;
  date: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  paymentMethod: string;
  paymentReference: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const paymentStatusColors: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-700',
};

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: Clock
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  interface APIOrder {
    id: number;
    order_number: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: string;
    payment_status: string;
    total: string | number;
    date: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    payment_method: string;
    payment_reference: string;
    items: string | number;
  }

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError('');
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const mappedOrders = data.map((o: APIOrder) => ({
          id: o.id.toString(),
          orderNumber: o.order_number,
          customerName: `${o.first_name} ${o.last_name}`,
          customerEmail: o.email,
          customerPhone: o.phone || '',
          status: o.status as Order['status'],
          paymentStatus: o.payment_status || 'pending',
          total: typeof o.total === 'string' ? parseFloat(o.total) : o.total,
          items: typeof o.items === 'string' ? parseInt(o.items) : o.items,
          date: o.date,
          shippingAddress: o.shipping_address,
          shippingCity: o.shipping_city || '',
          shippingState: o.shipping_state || '',
          paymentMethod: o.payment_method,
          paymentReference: o.payment_reference || '',
        }));
        setOrders(mappedOrders);
      } else {
        const err = await response.json().catch(() => ({}));
        setFetchError(err.error || 'Failed to load orders. Please try again.');
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setFetchError('Network error. Could not reach the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (order.orderNumber?.toLowerCase() || '').includes(searchLower) ||
      (order.customerName?.toLowerCase() || '').includes(searchLower) ||
      (order.customerEmail?.toLowerCase() || '').includes(searchLower);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev =>
          prev.map(order => (order.id === orderId ? { ...order, status: newStatus } : order))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : prev);
        }
      } else {
        alert('Failed to update order status. Please try again.');
      }
    } catch {
      alert('Network error updating status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    const IconComponent = statusIcons[status] || Clock;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-500 text-[13px]">Manage and track customer orders</p>
      </div>

      {/* Error Banner */}
      {fetchError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center justify-between">
          <span>{fetchError}</span>
          <button onClick={fetchOrders} className="ml-4 text-red-600 underline text-xs cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-4 py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.items} item{order.items !== 1 ? 's' : ''}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[13px] font-medium ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                        {getStatusIcon(order.status as Order['status'])}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-medium capitalize ${paymentStatusColors[order.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-purple-600 hover:text-purple-900 p-1 cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                          className="text-[13px] border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-purple-500 focus:border-transparent cursor-pointer disabled:opacity-50"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                    {fetchError ? 'Could not load orders.' : 'No orders found matching your criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">Order Number</label>
                  <p className="mt-1 text-sm font-mono text-gray-900">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">Order Date</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedOrder.date).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">Fulfillment Status</label>
                  <div className="mt-1">
                    <select
                      value={selectedOrder.status}
                      disabled={updatingId === selectedOrder.id}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as Order['status'])}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-purple-500 cursor-pointer disabled:opacity-50"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">Payment Status</label>
                  <span className={`mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium capitalize ${paymentStatusColors[selectedOrder.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">Customer Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedOrder.customerEmail}</p>
                </div>
              </div>

              {selectedOrder.customerPhone && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedOrder.customerPhone}</p>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">Shipping Address</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedOrder.shippingAddress}
                  {selectedOrder.shippingCity && `, ${selectedOrder.shippingCity}`}
                  {selectedOrder.shippingState && `, ${selectedOrder.shippingState}`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">Payment Method</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">Total</label>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    ₦{selectedOrder.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {selectedOrder.paymentReference && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase">Payment Reference</label>
                  <p className="mt-1 text-sm font-mono text-gray-600">{selectedOrder.paymentReference}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
