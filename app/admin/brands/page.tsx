'use client';

import { useState, useEffect } from 'react';
import ConfirmationModal from '../../components/ConfirmationModal';

// Standard icons
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

const Star = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export default function BrandsManagement() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/brands', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBrands(data.brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAddBrand = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleDeleteBrand = (id: number) => {
    setBrandToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (brandToDelete === null) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/brands/${brandToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await fetchBrands();
        setIsDeleteModalOpen(false);
        setBrandToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveBrand = async (data: Partial<Brand>) => {
    try {
      const token = localStorage.getItem('admin_token');
      const method = editingBrand ? 'PUT' : 'POST';
      const url = editingBrand ? `/api/admin/brands/${editingBrand.id}` : '/api/admin/brands';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        fetchBrands();
        setIsModalOpen(false);
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to save brand');
      }
    } catch (error) {
      console.error('Error saving brand:', error);
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-gray-900 leading-tight italic">Brands</h1>
          <p className="mt-0.5 text-gray-500 text-[13px] leading-relaxed">Manage product brands and designers</p>
        </div>
        <button
          onClick={handleAddBrand}
          className="bg-[#201d1e] text-white px-3.5 py-1.5 rounded-lg hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer text-[13px] font-semibold shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight">Brand</th>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight">Slug</th>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight">Order</th>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight">Status</th>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brands.map(brand => (
                <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mr-4 group-hover:bg-purple-50 transition-colors overflow-hidden border border-gray-100">
                        {brand.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={brand.image} alt={brand.name} className="w-full h-full object-contain" />
                        ) : (
                          <Star className="w-6 h-6 text-purple-400" />
                        )}
                      </div>
                      <span className="font-bold text-[#201d1e] text-[13px]">{brand.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-[13px] font-medium text-gray-500">{brand.slug}</td>
                  <td className="px-8 py-6 text-[13px] font-bold text-gray-900">{brand.display_order}</td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[13px] font-black uppercase tracking-wider ${
                      brand.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {brand.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 transition-opacity">
                      <button onClick={() => handleEditBrand(brand)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-all active:scale-90">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteBrand(brand.id)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-all active:scale-90">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Star className="w-10 h-10 text-gray-300" />
                      </div>
                      <p className="text-[13px] font-bold text-gray-900">No brands found</p>
                      <p className="text-gray-500 text-[13px] mt-0.5">Click &quot;Add Brand&quot; to create your first one.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <BrandModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveBrand}
          brand={editingBrand}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBrandToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Brand"
        message="Are you sure you want to delete this brand? This action will remove the brand from all associated products and cannot be undone."
        confirmText="Delete Brand"
        loading={isDeleting}
        type="danger"
      />
    </div>
  );
}

function BrandModal({ onClose, onSave, brand }: {
  onClose: () => void;
  onSave: (data: Partial<Brand>) => void;
  brand: Brand | null;
}) {
  const [formData, setFormData] = useState({
    name: brand?.name || '',
    description: brand?.description || '',
    display_order: brand?.display_order || 0,
    is_active: brand?.is_active ?? true,
    image: brand?.image || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">{brand ? 'Edit Brand' : 'Add New Brand'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Brand Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-24 resize-none transition-all"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              value={formData.image}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                value={formData.display_order}
                onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer transition-all"
                />
                <span className="text-[13px] font-medium text-gray-700 group-hover:text-purple-600 transition-colors">Active</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#201d1e] text-white rounded-lg hover:bg-black transition-all cursor-pointer font-bold shadow-sm active:scale-95"
            >
              {brand ? 'Update Brand' : 'Create Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
