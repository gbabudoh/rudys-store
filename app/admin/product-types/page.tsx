'use client';

import { useState, useEffect } from 'react';

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

const Tag = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 011 12V7a4 4 0 014-4z" />
  </svg>
);

interface SubCategory {
  id: number;
  name: string;
}

interface ProductType {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  sub_category_id?: number | null;
  sub_category_name?: string;
}

export default function ProductTypesManagement() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ProductType | null>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const [ptResponse, scResponse] = await Promise.all([
        fetch('/api/admin/product-types', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/sub-categories', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (ptResponse.ok && scResponse.ok) {
        const ptData = await ptResponse.json();
        const scData = await scResponse.json();
        setProductTypes(ptData.productTypes);
        setSubCategories(scData.subCategories);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddType = () => {
    setEditingType(null);
    setIsModalOpen(true);
  };

  const handleEditType = (type: ProductType) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleDeleteType = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product type?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/product-types/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error('Error deleting product type:', error);
    }
  };

  const handleSaveType = async (data: Partial<ProductType>) => {
    try {
      const token = localStorage.getItem('admin_token');
      const method = editingType ? 'PUT' : 'POST';
      const url = editingType ? `/api/admin/product-types/${editingType.id}` : '/api/admin/product-types';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        fetchData(); // Refresh all data
        setIsModalOpen(false);
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to save product type');
      }
    } catch (error) {
      console.error('Error saving product type:', error);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Types Management</h1>
          <p className="text-gray-600">Manage available product types and assign them to sub-categories</p>
        </div>
        <button
          onClick={handleAddType}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Product Type
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sub-Category</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productTypes.map(type => (
                <tr key={type.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3 text-purple-600">
                        <Tag className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900">{type.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {type.sub_category_name || 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{type.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{type.display_order}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      type.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {type.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 transition-opacity">
                      <button onClick={() => handleEditType(type)} className="p-2 text-gray-400 hover:text-purple-600 cursor-pointer">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteType(type.id)} className="p-2 text-gray-400 hover:text-red-600 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {productTypes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No product types found. Click &quot;Add Product Type&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ProductTypeModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveType}
          type={editingType}
          subCategories={subCategories}
        />
      )}
    </div>
  );
}

import Modal from '@/app/components/Modal';

function ProductTypeModal({ onClose, onSave, type, subCategories }: {
  onClose: () => void;
  onSave: (data: Partial<ProductType>) => void;
  type: ProductType | null;
  subCategories: SubCategory[];
}) {
  const [formData, setFormData] = useState({
    name: type?.name || '',
    description: type?.description || '',
    display_order: type?.display_order || 0,
    is_active: type?.is_active ?? true,
    sub_category_id: type?.sub_category_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      sub_category_id: formData.sub_category_id ? Number(formData.sub_category_id) : null
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={type ? 'Edit Product Type' : 'Add New Product Type'}
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Shoes, Shirt, Accessory"
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category</label>
           <div className="relative">
             <select
               className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none cursor-pointer appearance-none bg-white font-medium text-gray-900"
               value={formData.sub_category_id}
               onChange={e => setFormData({ ...formData, sub_category_id: e.target.value })}
             >
               <option value="">None (Global / Unassigned)</option>
               {subCategories.map(sub => (
                 <option key={sub.id} value={sub.id}>{sub.name}</option>
               ))}
             </select>
             <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
               </svg>
             </div>
           </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all h-24 resize-none text-gray-700 placeholder:text-gray-400"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-gray-900"
              value={formData.display_order}
              onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                formData.is_active 
                  ? 'bg-purple-600 border-purple-600' 
                  : 'bg-white border-gray-300 group-hover:border-purple-400'
              }`}>
                {formData.is_active && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={formData.is_active}
                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">Active Status</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transform transition-all cursor-pointer shadow-purple-500/25"
          >
            {type ? 'Update Type' : 'Create Type'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
