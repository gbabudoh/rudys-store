'use client';

import { useState, useEffect } from 'react';
import ConfirmationModal from '@/app/components/ConfirmationModal';

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
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteType = (id: number) => {
    setTypeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (typeToDelete === null) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/product-types/${typeToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await fetchData();
        setIsDeleteModalOpen(false);
        setTypeToDelete(null);
      } else {
        alert('Failed to delete product type');
      }
    } catch (error) {
      console.error('Error deleting product type:', error);
      alert('An error occurred during deletion');
    } finally {
      setIsDeleting(false);
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
        fetchData();
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-gray-900 leading-tight">Product Types</h1>
          <p className="mt-0.5 text-gray-500 text-[13px] leading-relaxed">Manage categories and classifications for your products</p>
        </div>
        <button
          onClick={handleAddType}
          className="bg-[#201d1e] text-white px-3.5 py-1.5 rounded-lg hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer text-[13px] font-semibold shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Product Type
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Sub-Category</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {productTypes.map(type => (
                <tr key={type.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-md bg-purple-50 flex items-center justify-center mr-3 group-hover:bg-purple-100 transition-colors">
                        <Tag className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                      <span className="text-[13px] font-semibold text-gray-900">{type.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                     <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[13px] font-semibold bg-blue-50 text-blue-700 uppercase tracking-wider">
                      {type.sub_category_name || 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[13px] text-gray-500">{type.slug}</td>
                  <td className="px-4 py-2.5 text-[13px] font-semibold text-gray-900">{type.display_order}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[13px] font-semibold uppercase tracking-wider ${
                      type.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {type.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => handleEditType(type)} className="p-1.5 bg-gray-50 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-all active:scale-90">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteType(type.id)} className="p-1.5 bg-gray-50 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-all active:scale-90">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {productTypes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Tag className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-[13px] font-semibold text-gray-900">No product types found</p>
                      <p className="text-gray-500 text-[13px] mt-0.5">Click &quot;Add Product Type&quot; to create your first one.</p>
                    </div>
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTypeToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Product Type"
        message="Are you sure you want to delete this product type? This action cannot be undone and will affect any products using this type."
        confirmText="Delete Type"
        loading={isDeleting}
        type="danger"
      />
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
          <label className="block text-[13px] font-black text-gray-900 mb-2 uppercase tracking-wider">Type Name</label>
          <input
            type="text"
            required
            className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-bold text-[#201d1e] placeholder:text-gray-400 bg-gray-50/30"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Shoes, Shirt, Accessory"
          />
        </div>

        <div>
           <label className="block text-[13px] font-black text-gray-900 mb-2 uppercase tracking-wider">Sub-Category</label>
           <div className="relative">
             <select
               className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none cursor-pointer appearance-none bg-gray-50/30 font-bold text-[#201d1e]"
               value={formData.sub_category_id}
               onChange={e => setFormData({ ...formData, sub_category_id: e.target.value })}
             >
               <option value="">None (Global / Unassigned)</option>
               {subCategories.map(sub => (
                 <option key={sub.id} value={sub.id}>{sub.name}</option>
               ))}
             </select>
             <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none text-gray-500">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
               </svg>
             </div>
           </div>
        </div>

        <div>
          <label className="block text-[13px] font-black text-gray-900 mb-2 uppercase tracking-wider">Description</label>
          <textarea
            className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all h-32 resize-none font-medium text-[#201d1e] placeholder:text-gray-400 bg-gray-50/30"
            value={formData.description || ''}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Briefly describe this product type..."
          />
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
            {type ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
