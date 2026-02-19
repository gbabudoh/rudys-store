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

const Folder = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  parent_category_id: number;
  parent_category_name?: string;
  description: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

export default function SubCategoriesManagement() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Parent categories
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<SubCategory | null>(null);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const [subsRes, catsRes] = await Promise.all([
        fetch('/api/admin/sub-categories', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/categories', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (subsRes.ok && catsRes.ok) {
        const subsData = await subsRes.json();
        const catsData = await catsRes.json();
        setSubCategories(subsData.subCategories);
        // Filter only root categories for selection
        setCategories(catsData.categories.filter((c: Category & { parent_id: number | null }) => !c.parent_id));
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

  const handleAddSub = () => {
    setEditingSub(null);
    setIsModalOpen(true);
  };

  const handleEditSub = (sub: SubCategory) => {
    setEditingSub(sub);
    setIsModalOpen(true);
  };

  const handleDeleteSub = (id: number) => {
    setSubToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (subToDelete === null) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/sub-categories/${subToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await fetchData();
        setIsDeleteModalOpen(false);
        setSubToDelete(null);
      } else {
        alert('Failed to delete sub-category');
      }
    } catch (error) {
      console.error('Error deleting sub-category:', error);
      alert('An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveSub = async (data: Partial<SubCategory>) => {
    try {
      const token = localStorage.getItem('admin_token');
      const method = editingSub ? 'PUT' : 'POST';
      const url = editingSub ? `/api/admin/sub-categories/${editingSub.id}` : '/api/admin/sub-categories';
      
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
        alert(err.error || 'Failed to save sub-category');
      }
    } catch (error) {
      console.error('Error saving sub-category:', error);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-gray-900 leading-tight">Sub-Categories</h1>
          <p className="mt-0.5 text-gray-500 text-[13px] leading-relaxed">Manage sub-categories and their parent assignments</p>
        </div>
        <button
          onClick={handleAddSub}
          className="bg-[#201d1e] text-white px-3.5 py-1.5 rounded-lg hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer text-[13px] font-semibold shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Sub-Category
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight">Name</th>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight">Parent Category</th>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight">Slug</th>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight">Order</th>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight">Status</th>
                <th className="px-8 py-5 text-[13px] font-bold text-gray-900 uppercase tracking-tight text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subCategories.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mr-4 group-hover:bg-purple-100 transition-colors">
                        <Folder className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-bold text-[#201d1e] text-[13px]">{sub.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[13px] font-black bg-blue-50 text-blue-700 uppercase tracking-wider">
                      {sub.parent_category_name || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-[13px] font-medium text-gray-500">{sub.slug}</td>
                  <td className="px-8 py-6 text-[13px] font-bold text-gray-900">{sub.display_order}</td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[13px] font-black uppercase tracking-wider ${
                      sub.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {sub.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 transition-opacity">
                      <button onClick={() => handleEditSub(sub)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-all active:scale-90">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteSub(sub.id)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-all active:scale-90">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {subCategories.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <Folder className="w-10 h-10 text-gray-300" />
                      </div>
                      <p className="text-[13px] font-bold text-gray-900">No sub-categories found</p>
                      <p className="text-gray-500 text-[13px] mt-1">Click &quot;Add Sub-Category&quot; to create your first one.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <SubCategoryModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSub}
          sub={editingSub}
          categories={categories}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSubToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Sub-Category"
        message="Are you sure you want to delete this sub-category? This action will remove the sub-category from all associated products."
        confirmText="Delete Sub-Category"
        loading={isDeleting}
        type="danger"
      />
    </div>
  );
}

import Modal from '@/app/components/Modal';

function SubCategoryModal({ onClose, onSave, sub, categories }: {
  onClose: () => void;
  onSave: (data: Partial<SubCategory>) => void;
  sub: SubCategory | null;
  categories: Category[];
}) {
  const [formData, setFormData] = useState({
    name: sub?.name || '',
    parent_category_id: sub?.parent_category_id || (categories.length > 0 ? categories[0].id : ''),
    description: sub?.description || '',
    display_order: sub?.display_order || 0,
    is_active: sub?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      parent_category_id: Number(formData.parent_category_id)
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={sub ? 'Edit Sub-Category' : 'Add New Sub-Category'}
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[13px] font-black text-gray-900 mb-2 uppercase tracking-wider">Sub-Category Name</label>
          <input
            type="text"
            required
            className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-bold text-[#201d1e] placeholder:text-gray-400 bg-gray-50/30"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Sneakers, Dresses"
          />
        </div>
        <div>
          <label className="block text-[13px] font-black text-gray-900 mb-2 uppercase tracking-wider">Parent Category</label>
          <div className="relative">
            <select
              className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none cursor-pointer appearance-none bg-gray-50/30 font-bold text-[#201d1e]"
              value={formData.parent_category_id}
              onChange={e => setFormData({ ...formData, parent_category_id: Number(e.target.value) })}
              required
            >
              <option value="" disabled>Select Parent Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
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
            placeholder="Briefly describe this sub-category..."
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
            {sub ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
