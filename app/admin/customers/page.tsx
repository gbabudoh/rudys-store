'use client';

import { useState, useEffect } from 'react';
import ConfirmationModal from '@/app/components/ConfirmationModal';

// Simple icon components
const Search = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const Trash2 = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-3 h-3"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-3 h-3"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const Lock = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const Unlock = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

interface Customer {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  location: string;
  createdAt: string;
  isActive: boolean;
  emailVerified: boolean;
}

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    type: 'danger' | 'warning' | 'info';
    title: string;
    message: string;
    confirmText: string;
    action: 'delete' | 'restrict' | 'activate';
    targetId: number | null;
  }>({
    type: 'danger',
    title: '',
    message: '',
    confirmText: '',
    action: 'delete',
    targetId: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('admin_token');

      if (!token) {
        setError('No authentication token found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/admin/customers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setCustomers(data.customers);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load customers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const openConfirmModal = (action: 'delete' | 'restrict' | 'activate', id: number) => {
    let config = { ...modalConfig, targetId: id, action };
    
    if (action === 'delete') {
      config = {
        ...config,
        type: 'danger',
        title: 'Delete Customer',
        message: 'Are you sure you want to permanently delete this customer account? This action cannot be undone and will remove all their order history records.',
        confirmText: 'Yes, Delete Account',
      };
    } else if (action === 'restrict') {
      config = {
        ...config,
        type: 'warning',
        title: 'Restrict Access',
        message: 'This will prevent the customer from logging in or placing new orders. You can reactivate them later.',
        confirmText: 'Restrict Customer',
      };
    } else {
      config = {
        ...config,
        type: 'info',
        title: 'Reactivate Customer',
        message: 'This will restore full shopping privileges to the customer account.',
        confirmText: 'Activate Account',
      };
    }
    
    setModalConfig(config);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!modalConfig.targetId) return;
    setIsProcessing(true);
    
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      if (modalConfig.action === 'delete') {
        const response = await fetch(`/api/admin/customers/${modalConfig.targetId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setCustomers(customers.filter(c => c.id !== modalConfig.targetId));
        }
      } else {
        const newStatus = modalConfig.action === 'activate';
        const response = await fetch(`/api/admin/customers/${modalConfig.targetId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ isActive: newStatus })
        });
        if (response.ok) {
          setCustomers(customers.map(c => 
            c.id === modalConfig.targetId ? { ...c, isActive: newStatus } : c
          ));
        }
      }
    } catch (err) {
      console.error(err);
      alert('Action failed');
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.toLowerCase();
    return fullName.includes(searchLower) || customer.email.toLowerCase().includes(searchLower);
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-gray-900 leading-tight italic">Customer Base</h1>
          <p className="mt-0.5 text-gray-500 text-[13px] leading-relaxed">Manage your storefront community and permissions</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-6 py-4 rounded-2xl border border-red-100 font-bold">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or contact details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-medium text-gray-900 bg-white/50"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight">Customer Profile</th>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight">Geo Location</th>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight">Status</th>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight">Joined On</th>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-200">
                        <Search className="w-10 h-10" />
                      </div>
                      <p className="text-xl font-bold text-gray-900">No customers found</p>
                      <p className="text-gray-500 mt-1">Your community will grow as customers visit.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-gray-900 flex items-center justify-center shadow-lg group-hover:bg-purple-600 transition-colors">
                          <span className="text-lg font-black text-white italic">
                            {(customer.firstName || customer.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-5">
                          <div className="text-[13px] font-bold text-[#201d1e] leading-tight">
                            {customer.firstName} {customer.lastName || 'Guest'}
                          </div>
                          <div className="text-[13px] font-medium text-gray-400">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-[13px] font-bold text-gray-500 italic">
                      {customer.location || 'Unknown'}
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[13px] font-black uppercase tracking-widest ${
                        customer.isActive
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {customer.isActive ? (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        {customer.isActive ? 'Verified' : 'Flagged'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[13px] font-bold text-gray-400">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 transition-opacity">
                        <button
                          onClick={() => openConfirmModal(customer.isActive ? 'restrict' : 'activate', customer.id)}
                          className={`p-3 rounded-xl transition-all active:scale-90 cursor-pointer ${
                            customer.isActive 
                              ? 'bg-gray-50 text-gray-400 hover:text-orange-600 hover:bg-orange-50' 
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          {customer.isActive ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => openConfirmModal('delete', customer.id)}
                          className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-all active:scale-90"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        loading={isProcessing}
        type={modalConfig.type}
      />
    </div>
  );
}
