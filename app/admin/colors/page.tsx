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

  const handleDeleteColor = async (id: number) => {
    if (!confirm('Are you sure you want to delete this color?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/colors/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) fetchColors();
    } catch (error) {
      console.error('Error deleting color:', error);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Colors Management</h1>
          <p className="text-gray-600">Manage product color options</p>
        </div>
        <button
          onClick={handleAddColor}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Color
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Color</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hex Code</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {colors.map(color => (
                <tr key={color.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{color.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{color.hex_code}</td>
                  <td className="px-6 py-4">
                    <div 
                      className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
                      style={{ backgroundColor: color.hex_code }}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 transition-opacity">
                      <button onClick={() => handleEditColor(color)} className="p-2 text-gray-400 hover:text-purple-600 cursor-pointer">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteColor(color.id)} className="p-2 text-gray-400 hover:text-red-600 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {colors.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    No colors found. Click &quot;Add Color&quot; to create one.
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
    </div>
  );
}

import Modal from '@/app/components/Modal';

// ... (existing imports, icons and Color interface)

// ... (ColorsManagement component logic)

function ColorModal({ onClose, onSave, color }: {
  onClose: () => void;
  onSave: (data: { name: string; hex_code: string }) => void;
  color: Color | null;
}) {
  const [formData, setFormData] = useState({
    name: color?.name || '',
    hex_code: color?.hex_code || '#000000'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={color ? 'Edit Color' : 'Add New Color'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Royal Blue"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color Hex Code</label>
          <div className="flex gap-4 items-center p-1 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
            <input
              type="color"
              className="w-12 h-12 rounded-lg cursor-pointer border-none p-0 bg-transparent"
              value={formData.hex_code}
              onChange={e => setFormData({ ...formData, hex_code: e.target.value })}
            />
            <input
              type="text"
              required
              pattern="^#[0-9A-Fa-f]{6}$"
              placeholder="#000000"
              className="flex-1 px-4 py-2 border-none outline-none uppercase font-mono text-gray-600 bg-transparent"
              value={formData.hex_code}
              onChange={e => setFormData({ ...formData, hex_code: e.target.value })}
            />
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
            {color ? 'Update Color' : 'Create Color'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
