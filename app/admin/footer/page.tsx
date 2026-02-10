'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Save, Loader2, CheckCircle2, AlertCircle, Plus, Trash2, Edit2, GripVertical, Eye, EyeOff, Link as LinkIcon
} from 'lucide-react';

interface FooterLink {
  id: number;
  section: string;
  label: string;
  href: string;
  display_order: number;
  is_active: boolean;
}

const SECTIONS = [
  { key: 'quick_links', label: 'Quick Links' },
  { key: 'customer_service', label: 'Customer Service' },
];

export default function FooterManagement() {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/footer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links);
      }
    } catch (error) {
      console.error('Error fetching footer links:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLinks(); }, [fetchLinks]);

  const handleSave = async (formData: Partial<FooterLink>) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      const isEdit = !!editingLink;
      const url = isEdit ? `/api/admin/footer/${editingLink.id}` : '/api/admin/footer';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: isEdit ? 'Link updated' : 'Link created' });
        setIsModalOpen(false);
        setEditingLink(null);
        fetchLinks();
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Failed to save' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this footer link?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/footer/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Link deleted' });
        fetchLinks();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggleActive = async (link: FooterLink) => {
    const token = localStorage.getItem('admin_token');
    await fetch(`/api/admin/footer/${link.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...link, is_active: !link.is_active }),
    });
    fetchLinks();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Footer Management</h1>
          <p className="mt-1 text-slate-500">Manage footer links, sections, and contact information</p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <div className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
              {message.text}
            </div>
          )}
          <button
            onClick={() => { setEditingLink(null); setIsModalOpen(true); }}
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SECTIONS.map(section => {
          const sectionLinks = links.filter(l => l.section === section.key);
          return (
            <div key={section.key} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center">
                  <LinkIcon className="w-5 h-5 mr-2 text-purple-600" />
                  {section.label}
                </h2>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  {sectionLinks.length} links
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {sectionLinks.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm">No links in this section</div>
                ) : (
                  sectionLinks.map(link => (
                    <div key={link.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors group">
                      <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold ${link.is_active ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                          {link.label}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{link.href}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleActive(link)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            link.is_active ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-100'
                          }`}
                          title={link.is_active ? 'Disable' : 'Enable'}
                        >
                          {link.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => { setEditingLink(link); setIsModalOpen(true); }}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Info Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-amber-900 mb-1">Contact Information</h3>
        <p className="text-sm text-amber-700">
          Contact details (address, phone, email) are managed in{' '}
          <a href="/admin/settings" className="font-bold underline hover:text-amber-900 cursor-pointer">Store Settings</a>.
          Social media links are also configured there.
        </p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <FooterLinkModal
          link={editingLink}
          onClose={() => { setIsModalOpen(false); setEditingLink(null); }}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
}

function FooterLinkModal({ link, onClose, onSave, saving }: {
  link: FooterLink | null;
  onClose: () => void;
  onSave: (data: Partial<FooterLink>) => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    section: link?.section || 'quick_links',
    label: link?.label || '',
    href: link?.href || '',
    display_order: link?.display_order || 0,
    is_active: link?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">{link ? 'Edit Link' : 'Add New Link'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Section</label>
            <select
              value={formData.section}
              onChange={e => setFormData({ ...formData, section: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
            >
              {SECTIONS.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Label</label>
            <input
              type="text"
              required
              value={formData.label}
              onChange={e => setFormData({ ...formData, label: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              placeholder="e.g. About Us"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">URL / Path</label>
            <input
              type="text"
              required
              value={formData.href}
              onChange={e => setFormData({ ...formData, href: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              placeholder="e.g. /about or https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-sm font-bold text-slate-700">Active</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {link ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
