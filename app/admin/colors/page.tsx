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

interface Color {
  id: number;
  name: string;
  hex_code: string;
  created_at: string;
}

export default function ColorsManagement() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<Color | null>(null);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchColors = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/colors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setColors(data.colors);
      }
    } catch (error) {
      console.error('Error fetching colors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleAddColor = () => {
    setEditingColor(null);
    setIsModalOpen(true);
  };

  const handleEditColor = (color: Color) => {
    setEditingColor(color);
    setIsModalOpen(true);
  };

  const handleDeleteColor = (id: number) => {
    setColorToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (colorToDelete === null) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/colors/${colorToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        await fetchColors();
        setIsDeleteModalOpen(false);
        setColorToDelete(null);
      } else {
        alert('Failed to delete color');
      }
    } catch (error) {
      console.error('Error deleting color:', error);
      alert('An error occurred during deletion');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveColor = async (data: { name: string; hex_code: string }) => {
    try {
      const token = localStorage.getItem('admin_token');
      const method = editingColor ? 'PUT' : 'POST';
      const url = editingColor ? `/api/admin/colors/${editingColor.id}` : '/api/admin/colors';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        fetchColors();
        setIsModalOpen(false);
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to save color');
      }
    } catch (error) {
      console.error('Error saving color:', error);
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
          <h1 className="text-sm font-bold text-gray-900 leading-tight">Colours</h1>
          <p className="mt-0.5 text-gray-500 text-xs leading-relaxed">Manage product colour options and swatches</p>
        </div>
        <button
          onClick={handleAddColor}
          className="bg-[#201d1e] text-white px-3.5 py-1.5 rounded-lg hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer text-xs font-semibold shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Colour
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-xs font-bold text-gray-900 uppercase tracking-tight">Colour</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-900 uppercase tracking-tight text-center">Swatch</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-900 uppercase tracking-tight">Hex Code</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-900 uppercase tracking-tight text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {colors.map(color => (
                <tr key={color.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-bold text-[#201d1e] text-xs">{color.name}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <div 
                        className="w-8 h-8 rounded-lg border-2 border-white shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: color.hex_code }}
                      />
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-black text-gray-500 font-mono tracking-widest bg-gray-50/30">
                    {color.hex_code.toUpperCase()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 transition-opacity">
                      <button onClick={() => handleEditColor(color)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-all active:scale-90">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteColor(color.id)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-all active:scale-90">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {colors.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-dashed" />
                      </div>
                      <p className="text-xs font-bold text-gray-900">No colours found</p>
                      <p className="text-gray-500 text-xs mt-0.5">Click &quot;Add Colour&quot; to define your first product swatch.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ColorModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveColor}
          color={editingColor}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setColorToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Colour"
        message={`Are you sure you want to delete this colour? This will remove the color option from all associated products.`}
        confirmText="Delete Colour"
        loading={isDeleting}
        type="danger"
      />
    </div>
  );
}

import Modal from '@/app/components/Modal';

function ColorModal({ onClose, onSave, color }: {
  onClose: () => void;
  onSave: (data: { name: string; hex_code: string }) => void;
  color: Color | null;
}) {
  const [formData, setFormData] = useState({
    name: color?.name || '',
    hex_code: color?.hex_code || '#201d1e'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={color ? 'Edit Colour' : 'Add New Colour'}
      width="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-xs font-black text-gray-900 mb-3 uppercase tracking-wider">Colour Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Royal Blue"
            className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-bold text-[#201d1e] placeholder:text-gray-400 bg-gray-50/30"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-900 mb-3 uppercase tracking-wider">Colour Swatch</label>
          <div className="flex flex-col gap-6 p-6 border border-gray-200 rounded-3xl bg-gray-50/30 transition-all focus-within:ring-4 focus-within:ring-purple-500/10 focus-within:border-purple-500">
             <div className="flex items-center gap-6">
                <div className="relative group">
                  <input
                    type="color"
                    className="w-20 h-20 rounded-2xl cursor-pointer border-4 border-white shadow-xl p-0 bg-transparent block"
                    value={formData.hex_code}
                    onChange={e => setFormData({ ...formData, hex_code: e.target.value })}
                  />
                  <div className="absolute -inset-2 bg-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-1" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">HEX Code</p>
                  <input
                    type="text"
                    required
                    pattern="^#[0-9A-Fa-f]{6}$"
                    placeholder="#201D1E"
                    className="w-full bg-transparent border-none outline-none uppercase font-black text-2xl text-[#201d1e] tracking-tighter"
                    value={formData.hex_code}
                    onChange={e => setFormData({ ...formData, hex_code: e.target.value })}
                  />
                </div>
             </div>
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
            {color ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
