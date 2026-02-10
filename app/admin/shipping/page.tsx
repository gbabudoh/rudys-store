'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Truck, Type, Clock, Banknote, Package, CheckCircle2 } from 'lucide-react';

interface ShippingMethod {
  id: number;
  name: string;
  carrier: string;
  estimated_days: string;
  price: number;
  free_shipping_threshold: number | null;
  is_active: boolean;
}

export default function ShippingManagement() {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    carrier: '',
    estimated_days: '',
    price: '',
    free_shipping_threshold: '',
    is_active: true
  });

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const res = await fetch('/api/admin/shipping');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setShippingMethods(data);
      } else {
        console.error('API did not return an array:', data);
        setShippingMethods([]); // Fallback to empty array
      }
    } catch (err) {
      console.error('Failed to fetch:', err);
      setShippingMethods([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      carrier: '',
      estimated_days: '',
      price: '',
      free_shipping_threshold: '',
      is_active: true
    });
    setEditingMethod(null);
  };

  const handleOpenModal = (method?: ShippingMethod) => {
    if (method) {
      setEditingMethod(method);
      setFormData({
        name: method.name,
        carrier: method.carrier,
        estimated_days: method.estimated_days,
        price: method.price.toString(),
        free_shipping_threshold: method.free_shipping_threshold?.toString() || '',
        is_active: method.is_active
      });
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const url = editingMethod 
      ? `/api/admin/shipping/${editingMethod.id}` 
      : '/api/admin/shipping';
    
    const method = editingMethod ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          free_shipping_threshold: formData.free_shipping_threshold ? parseFloat(formData.free_shipping_threshold) : null
        })
      });

      if (res.ok) {
        setModalOpen(false);
        fetchMethods();
        resetForm();
      }
    } catch (err) {
      console.error('Error saving:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this shipping method?')) return;

    try {
      await fetch(`/api/admin/shipping/${id}`, { method: 'DELETE' });
      fetchMethods();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const toggleStatus = async (method: ShippingMethod) => {
    try {
      await fetch(`/api/admin/shipping/${method.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...method,
          is_active: !method.is_active
        })
      });
      fetchMethods();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Shipping Management</h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Configure shipping methods, rates, and carrier information.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-5 py-2.5 rounded-2xl shadow-lg shadow-purple-600/20 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Shipping Method
        </button>
      </div>

      {/* Shipping Methods Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Carrier & Method</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Delivery</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-600" />
                  </td>
                </tr>
              ) : shippingMethods.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No shipping methods found. Add one to get started.
                  </td>
                </tr>
              ) : (
                shippingMethods.map((method) => (
                  <tr key={method.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0">
                          {method.carrier.substring(0, 1).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{method.name}</div>
                          <div className="text-xs text-gray-500 font-medium">{method.carrier}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-600">{method.estimated_days}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-gray-900">₦{method.price.toLocaleString()}</div>
                      {method.free_shipping_threshold && (
                        <div className="text-[10px] text-green-600 font-bold">Free over ₦{method.free_shipping_threshold.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleStatus(method)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter cursor-pointer ${
                          method.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {method.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleOpenModal(method)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(method.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0b]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/20">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                    {editingMethod ? 'Edit Method' : 'Add New Method'}
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipping Configuration</p>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-3 text-gray-400 hover:text-gray-900 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer group"
              >
                <X className="w-5 h-5 group-active:scale-90" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-5">
                {/* Method Name */}
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 transition-colors group-focus-within:text-purple-600">Method Name</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                      <Type className="w-5 h-5" />
                    </div>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Premium Express"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-[6px] focus:ring-purple-500/5 outline-none transition-all font-semibold text-gray-900 placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {/* Carrier */}
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 transition-colors group-focus-within:text-purple-600">Carrier</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                        <Truck className="w-4 h-4" />
                      </div>
                      <input 
                        type="text"
                        required
                        value={formData.carrier}
                        onChange={(e) => setFormData({...formData, carrier: e.target.value})}
                        placeholder="DHL, FedEx..."
                        className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-[6px] focus:ring-purple-500/5 outline-none transition-all font-semibold text-gray-900 placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  {/* Delivery Time */}
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 transition-colors group-focus-within:text-purple-600">Delivery Time</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                        <Clock className="w-4 h-4" />
                      </div>
                      <input 
                        type="text"
                        required
                        value={formData.estimated_days}
                        onChange={(e) => setFormData({...formData, estimated_days: e.target.value})}
                        placeholder="1-2 days"
                        className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-[6px] focus:ring-purple-500/5 outline-none transition-all font-semibold text-gray-900 placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {/* Price */}
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 transition-colors group-focus-within:text-purple-600">Price (₦)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <input 
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="0.00"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-[6px] focus:ring-purple-500/5 outline-none transition-all font-black text-gray-900 placeholder:text-gray-300"
                      />
                    </div>
                  </div>

                  {/* Free Over */}
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 transition-colors group-focus-within:text-purple-600">Free Over (₦)</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                        <Package className="w-5 h-5" />
                      </div>
                      <input 
                        type="number"
                        step="0.01"
                        value={formData.free_shipping_threshold}
                        onChange={(e) => setFormData({...formData, free_shipping_threshold: e.target.value})}
                        placeholder="None"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-[6px] focus:ring-purple-500/5 outline-none transition-all font-black text-gray-900 placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Active Status</p>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Enable this method</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-4 pt-2">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-4 text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl shadow-gray-900/10 hover:bg-black hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{editingMethod ? 'Update Configuration' : 'Save New Method'}</span>
                      <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

