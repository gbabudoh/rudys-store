'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Save, CheckCircle2, AlertCircle, Plus, Trash2, Edit2, GripVertical, Eye, EyeOff, Link as LinkIcon
} from 'lucide-react';
import ConfirmationModal from '@/app/components/ConfirmationModal';

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

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = (id: number) => {
    setLinkToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (linkToDelete === null) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/footer/${linkToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Link deleted' });
        setIsDeleteModalOpen(false);
        setLinkToDelete(null);
        fetchLinks();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete' });
    } finally {
      setIsDeleting(false);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white/50 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-[#201d1e]">Footer Architecture</h1>
          <p className="mt-0.5 text-gray-500 text-[13px]">Standardize your store&apos;s navigational structure and site metadata.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setEditingLink(null); setIsModalOpen(true); }}
            className="inline-flex items-center px-3.5 py-1.5 bg-[#201d1e] text-white rounded-lg text-[13px] font-semibold shadow-sm hover:bg-black transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            New Navigation Link
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg border text-[13px] font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {SECTIONS.map(section => {
          const sectionLinks = links.filter(l => l.section === section.key);
          return (
            <div key={section.key} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <div className="p-1 bg-white rounded shadow-sm">
                    <LinkIcon className="w-3 h-3 text-purple-600" />
                  </div>
                  {section.label}
                </h2>
                <span className="text-[13px] font-semibold text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {sectionLinks.length} Items
                </span>
              </div>
              <div className="divide-y divide-gray-50 flex-1">
                {sectionLinks.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-200">
                       <LinkIcon className="w-5 h-5" />
                    </div>
                    <p className="text-gray-400 text-[13px] font-medium">This section is currently empty</p>
                  </div>
                ) : (
                  sectionLinks.map(link => (
                    <div key={link.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/50 transition-all group">
                      <div className="p-1 bg-gray-50 rounded text-gray-300 group-hover:text-gray-900 transition-colors">
                        <GripVertical className="w-3.5 h-3.5 cursor-grab active:cursor-grabbing" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-semibold text-[#201d1e] ${link.is_active ? '' : 'text-gray-300 line-through'}`}>
                          {link.label}
                        </p>
                        <p className="text-[13px] text-gray-400 font-mono tracking-tighter truncate opacity-70">{link.href}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleActive(link)}
                          className={`p-1.5 rounded-md transition-all cursor-pointer active:scale-90 ${
                            link.is_active ? 'text-emerald-500 bg-emerald-50' : 'text-gray-300 bg-gray-50'
                          }`}
                          title={link.is_active ? 'Offline' : 'Online'}
                        >
                          {link.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => { setEditingLink(link); setIsModalOpen(true); }}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 bg-gray-50 rounded-md transition-all cursor-pointer active:scale-90"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 bg-gray-50 rounded-md transition-all cursor-pointer active:scale-90"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Info Card */}
      <div className="bg-[#201d1e] text-white rounded-lg p-4 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-xl rounded-lg border border-white/10">
            <AlertCircle className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-sm font-semibold tracking-tight mb-0.5">Global Store Metadata</h3>
            <p className="text-gray-400 text-[13px] leading-relaxed max-w-xl">
              Site-wide contact details including address, phone, and social media handles are centralized in the system&apos;s core settings.
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/admin/settings'}
            className="px-3 py-1.5 bg-white text-[#201d1e] rounded-lg font-semibold uppercase tracking-wider text-[13px] hover:bg-gray-100 transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-sm"
          >
            Go to Settings
          </button>
        </div>
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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setLinkToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Remove Navigation"
        message="Are you sure you want to delete this footer link? This will break any existing references to this URL in external search results."
        confirmText="Yes, Remove Link"
        loading={isDeleting}
        type="danger"
      />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in duration-300">
        <div className="h-1.5 w-full bg-purple-600" />
        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#201d1e]">{link ? 'Edit Link' : 'Add Link'}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-10 pb-12 pt-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-black uppercase tracking-widest text-gray-400 mb-2">Navigation Section</label>
              <select
                value={formData.section}
                onChange={e => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-5 py-4 border border-gray-100 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold text-gray-700 cursor-pointer appearance-none transition-all"
              >
                {SECTIONS.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-black uppercase tracking-widest text-gray-400 mb-2">Display Label</label>
              <input
                type="text"
                required
                value={formData.label}
                onChange={e => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-5 py-4 border border-gray-100 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold text-[#201d1e] transition-all"
                placeholder="Shop All Collections"
              />
            </div>
            <div>
              <label className="block text-[13px] font-black uppercase tracking-widest text-gray-400 mb-2">Destination URL</label>
              <input
                type="text"
                required
                value={formData.href}
                onChange={e => setFormData({ ...formData, href: e.target.value })}
                className="w-full px-5 py-4 border border-gray-100 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold text-[#201d1e] transition-all"
                placeholder="/store/collections"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-black uppercase tracking-widest text-gray-400 mb-2">Priority Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-5 py-4 border border-gray-100 bg-gray-50 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold text-[#201d1e]"
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer group w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-gray-100/50 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 rounded-lg border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-sm font-black text-[#201d1e] tracking-tight">Active link</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-[#201d1e] text-white rounded-xl font-bold shadow-sm hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
              {link ? 'Save Changes' : 'Publish Link'}
            </button>
            <button type="button" onClick={onClose} className="w-full py-3 text-gray-400 font-black uppercase tracking-[0.2em] text-[13px] hover:text-black transition-all cursor-pointer">
              Discard Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
