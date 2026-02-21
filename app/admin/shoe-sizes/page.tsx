'use client';

import { useState, useEffect } from 'react';
import ConfirmationModal from '@/app/components/ConfirmationModal';
import Modal from '@/app/components/Modal';

// Icons
const Plus = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

const Footprints = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-1 4h12l-1-4M6 8v10a2 2 0 002 2h8a2 2 0 002-2V8M6 8h12" />
  </svg>
);

interface ShoeSize {
  id: number;
  size: string;
  system: 'EU' | 'UK' | 'USA' | 'Other';
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export default function ShoeSizesManagement() {
  const [sizes, setSizes] = useState<ShoeSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<ShoeSize | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sizeToDelete, setSizeToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [activeSystem, setActiveSystem] = useState<'EU' | 'UK' | 'USA' | 'Other'>('EU');

  const fetchSizes = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/shoe-sizes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSizes(data.sizes);
      }
    } catch (error) {
      console.error('Error fetching shoe sizes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleAddSize = () => {
    setEditingSize(null);
    setIsModalOpen(true);
  };

  const handleEditSize = (size: ShoeSize) => {
    setEditingSize(size);
    setIsModalOpen(true);
  };

  const handleDeleteSize = (id: number) => {
    setSizeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (sizeToDelete === null) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/shoe-sizes/${sizeToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await fetchSizes();
        setIsDeleteModalOpen(false);
        setSizeToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting size:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveSize = async (data: Partial<ShoeSize>) => {
    try {
      const token = localStorage.getItem('admin_token');
      const method = editingSize ? 'PUT' : 'POST';
      const url = editingSize ? `/api/admin/shoe-sizes/${editingSize.id}` : '/api/admin/shoe-sizes';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        fetchSizes();
        setIsModalOpen(false);
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to save size');
      }
    } catch (error) {
      console.error('Error saving size:', error);
      alert('An error occurred');
    }
  };

  const filteredSizes = sizes.filter(s => s.system === activeSystem);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Shoe Sizes</h1>
          <p className="text-gray-500 text-[13px] mt-0.5">Manage available sizes for shoe items</p>
        </div>
        <button
          onClick={handleAddSize}
          className="bg-[#201d1e] text-white px-3.5 py-1.5 rounded-lg hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer text-[13px] font-semibold shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Size
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {(['EU', 'UK', 'USA', 'Other'] as const).map(system => (
          <button
            key={system}
            onClick={() => setActiveSystem(system)}
            className={`px-6 py-2 rounded-lg text-[13px] font-black transition-all cursor-pointer ${
              activeSystem === system 
                ? 'bg-white text-[#201d1e] shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {system}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Size</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">System</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSizes.map(size => (
                <tr key={size.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-md bg-green-50 flex items-center justify-center mr-3 group-hover:bg-green-100 transition-colors border border-green-100">
                        <Footprints className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-[13px] font-semibold text-gray-900">{size.size}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[13px] font-semibold text-gray-500">{size.system}</td>
                  <td className="px-4 py-2.5 text-[13px] font-semibold text-gray-900">{size.display_order}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[13px] font-semibold uppercase tracking-wider ${
                      size.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {size.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => handleEditSize(size)} className="p-1.5 bg-gray-50 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-all active:scale-90">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteSize(size.id)} className="p-1.5 bg-gray-50 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-all active:scale-90">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSizes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                     <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Footprints className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-[13px] font-semibold text-gray-900">No {activeSystem} shoe sizes found</p>
                      <p className="text-gray-500 text-[13px] mt-0.5">Click &quot;Add Size&quot; to create one.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ShoeSizeModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSize}
          size={editingSize}
          defaultSystem={activeSystem}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSizeToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Size"
        message="Are you sure you want to delete this shoe size?"
        confirmText="Delete Size"
        loading={isDeleting}
        type="danger"
      />
    </div>
  );
}

function ShoeSizeModal({ onClose, onSave, size, defaultSystem }: {
  onClose: () => void;
  onSave: (data: Partial<ShoeSize>) => void;
  size: ShoeSize | null;
  defaultSystem: 'EU' | 'UK' | 'USA' | 'Other';
}) {
  const [formData, setFormData] = useState({
    size: size?.size || '',
    system: size?.system || defaultSystem,
    display_order: size?.display_order || 0,
    is_active: size?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={size ? 'Edit Shoe Size' : 'Add New Shoe Size'}
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-black text-gray-900 mb-2 uppercase tracking-wider">Size</label>
            <input
              type="text"
              required
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-bold text-[#201d1e] placeholder:text-gray-400 bg-gray-50/30"
              value={formData.size}
              onChange={e => setFormData({ ...formData, size: e.target.value })}
              placeholder="e.g. 42, 9, 10.5"
            />
          </div>
          <div>
            <label className="block text-[13px] font-black text-gray-900 mb-2 uppercase tracking-wider">System</label>
            <div className="relative">
              <select
                className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none cursor-pointer appearance-none bg-gray-50/30 font-bold text-[#201d1e]"
                value={formData.system}
                onChange={e => setFormData({ ...formData, system: e.target.value as 'EU' | 'UK' | 'USA' | 'Other' })}
              >
                <option value="EU">EU</option>
                <option value="UK">UK</option>
                <option value="USA">USA</option>
                <option value="Other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-black text-gray-900 mb-2 uppercase tracking-wider">Display Order</label>
            <input
              type="number"
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-bold text-[#201d1e] bg-gray-50/30"
              value={formData.display_order}
              onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-end pb-1">
             <label className="flex items-center gap-4 cursor-pointer group w-full bg-gray-50/30 border border-gray-200 p-4 rounded-2xl hover:border-purple-500 transition-all">
              <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
                formData.is_active 
                  ? 'bg-purple-600 border-purple-600 shadow-lg shadow-purple-200' 
                  : 'bg-white border-gray-300 group-hover:border-purple-400'
              }`}>
                {formData.is_active && (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={formData.is_active}
                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span className="text-[13px] font-black text-gray-900 uppercase tracking-widest">Active</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-4 text-gray-600 font-bold hover:bg-gray-100 rounded-2xl transition-all cursor-pointer active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-10 py-4 bg-[#201d1e] text-white font-black rounded-2xl hover:shadow-2xl hover:scale-[1.02] transform transition-all cursor-pointer shadow-xl active:scale-95 uppercase tracking-widest"
          >
            {size ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
