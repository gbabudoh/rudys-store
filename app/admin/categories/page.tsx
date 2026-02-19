'use client';

import { useState, useEffect } from 'react';
import ConfirmationModal from '@/app/components/ConfirmationModal';

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

const Folder = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: number | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: number) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete === null) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/categories/${categoryToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await fetchCategories();
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveCategory = async (data: Partial<Category>) => {
    try {
      const token = localStorage.getItem('admin_token');
      const method = editingCategory ? 'PUT' : 'POST';
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : '/api/admin/categories';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        fetchCategories();
        setIsModalOpen(false);
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('An error occurred');
    }
  };

  const getSubcategories = (parentId: number) => {
    return categories.filter(c => c.parent_id === parentId);
  };

  const rootCategories = categories.filter(c => !c.parent_id);

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
          <h1 className="text-lg font-semibold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-[13px] mt-0.5">Manage product categories and subcategories</p>
        </div>
        <button
          onClick={handleAddCategory}
          className="bg-[#201d1e] text-white px-3.5 py-1.5 rounded-lg hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer text-[13px] font-semibold shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Slug</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Order</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rootCategories.map(category => (
                <CategoryRow 
                   key={category.id} 
                   category={category} 
                   subcategories={getSubcategories(category.id)}
                   onEdit={handleEditCategory}
                   onDelete={handleDeleteCategory}
                />
              ))}
              {rootCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                     <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Folder className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-[13px] font-semibold text-gray-900">No categories found</p>
                      <p className="text-gray-500 text-[13px] mt-0.5">Click &quot;Add Category&quot; to create one.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CategoryModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCategory}
          category={editingCategory}
          parentOptions={categories.filter(c => !c.parent_id && c.id !== editingCategory?.id)}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This will also affect any subcategories or products linked to it."
        confirmText="Delete Category"
        loading={isDeleting}
        type="danger"
      />
    </div>
  );
}

function CategoryRow({ category, subcategories, onEdit, onDelete }: { 
  category: Category; 
  subcategories: Category[];
  onEdit: (c: Category) => void;
  onDelete: (id: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      <tr className="hover:bg-gray-50/50 transition-colors group">
        <td className="px-4 py-2.5">
          <div className="flex items-center">
            {subcategories.length > 0 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="mr-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <svg className={`w-3.5 h-3.5 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
            {!subcategories.length && <div className="w-5.5" />}
            <div className="w-7 h-7 rounded-md bg-purple-50 flex items-center justify-center mr-3 group-hover:bg-purple-100 transition-colors border border-purple-100">
              <Folder className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <span className="text-[13px] font-semibold text-gray-900">{category.name}</span>
          </div>
        </td>
        <td className="px-4 py-2.5 text-[13px] text-gray-500">{category.slug}</td>
        <td className="px-4 py-2.5 text-[13px] font-semibold text-gray-900">{category.display_order}</td>
        <td className="px-4 py-2.5">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[13px] font-semibold uppercase tracking-wider ${
            category.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {category.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className="px-4 py-2.5 text-right">
          <div className="flex justify-end gap-1.5">
            <button onClick={() => onEdit(category)} className="p-1.5 bg-gray-50 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-all active:scale-90">
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(category.id)} className="p-1.5 bg-gray-50 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-all active:scale-90">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && subcategories.map(sub => (
        <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group bg-gray-50/20">
          <td className="px-4 py-2.5 pl-16">
            <div className="flex items-center">
              <div className="w-4 h-[2px] bg-gray-100 mr-3 rounded-full" />
              <span className="text-gray-700 font-semibold text-[13px]">{sub.name}</span>
            </div>
          </td>
          <td className="px-4 py-2.5 text-[13px] text-gray-500">{sub.slug}</td>
          <td className="px-4 py-2.5 text-[13px] font-semibold text-gray-900">{sub.display_order}</td>
          <td className="px-4 py-2.5">
             <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[13px] font-semibold uppercase tracking-wider ${
              sub.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {sub.is_active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-4 py-2.5 text-right">
            <div className="flex justify-end gap-1.5">
              <button onClick={() => onEdit(sub)} className="p-1.5 bg-gray-50 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-all active:scale-90">
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete(sub.id)} className="p-1.5 bg-gray-50 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-all active:scale-90">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

import Modal from '@/app/components/Modal';

function CategoryModal({ onClose, onSave, category, parentOptions }: {
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
  category: Category | null;
  parentOptions: Category[];
}) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    parent_id: category?.parent_id || '',
    description: category?.description || '',
    display_order: category?.display_order || 0,
    is_active: category?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      parent_id: formData.parent_id ? Number(formData.parent_id) : null
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add New Category'}
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[13px] font-black text-gray-900 mb-2 uppercase tracking-wider">Category Name</label>
          <input
            type="text"
            required
            className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-bold text-[#201d1e] placeholder:text-gray-400 bg-gray-50/30"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Footwear, Apparel"
          />
        </div>

        <div>
           <label className="block text-[13px] font-black text-gray-900 mb-2 uppercase tracking-wider">Parent Category (Optional)</label>
           <div className="relative">
             <select
               className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none cursor-pointer appearance-none bg-gray-50/30 font-bold text-[#201d1e]"
               value={formData.parent_id}
               onChange={e => setFormData({ ...formData, parent_id: e.target.value })}
             >
               <option value="">None (Top Level)</option>
               {parentOptions.map(cat => (
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
            placeholder="Briefly describe this category..."
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
            {category ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
