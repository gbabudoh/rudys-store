'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Headphones,
  Edit2,
  ChevronRight,
  Eye,
  Settings
} from 'lucide-react';

interface ContentPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  is_active: boolean;
  updated_at: string;
}

export default function CustomerServiceManagement() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/content-pages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPages(data.pages);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleSave = async () => {
    if (!selectedPage) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/content-pages', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedPage)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Content updated successfully' });
        await fetchPages();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to update content' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer Service</h1>
          <p className="mt-1 text-slate-500">
            Manage your store&apos;s informational and support pages
          </p>
        </div>
        
        {message && (
          <div className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
            {message.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pages Sidebar List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Content Sections</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page)}
                  className={`w-full flex items-center justify-between p-4 transition-all hover:bg-slate-50 group cursor-pointer ${
                    selectedPage?.slug === page.slug ? 'bg-purple-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 transition-colors ${
                      selectedPage?.slug === page.slug ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}>
                      <Edit2 className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className={`font-bold text-sm ${
                        selectedPage?.slug === page.slug ? 'text-purple-700' : 'text-slate-700'
                      }`}>{page.title}</p>
                      <p className="text-xs text-slate-400">/{page.slug}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    selectedPage?.slug === page.slug ? 'text-purple-600 translate-x-1' : 'text-slate-300'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-2">
          {selectedPage ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full min-h-[600px] animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center">
                  <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-200 mr-4">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedPage.title}</h2>
                    <p className="text-xs text-slate-500 font-medium">Last updated: {new Date(selectedPage.updated_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer" title="Preview">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Page Title</label>
                  <input
                    type="text"
                    value={selectedPage.title}
                    onChange={(e) => setSelectedPage({...selectedPage, title: e.target.value})}
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
                    <span>Page Content</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Supports Markdown</span>
                  </label>
                  <textarea
                    value={selectedPage.content}
                    onChange={(e) => setSelectedPage({...selectedPage, content: e.target.value})}
                    className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none font-mono text-sm leading-relaxed min-h-[400px]"
                    placeholder="Enter page content here..."
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Visibility</p>
                    <p className="text-xs text-slate-500">Toggle whether this page is visible on the storefront.</p>
                  </div>
                  <button 
                    onClick={() => setSelectedPage({...selectedPage, is_active: !selectedPage.is_active})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none cursor-pointer ${
                      selectedPage.is_active ? 'bg-purple-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      selectedPage.is_active ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center h-full min-h-[600px]">
              <div className="p-4 bg-white rounded-full shadow-sm mb-6">
                <Headphones className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Select a section to edit</h3>
              <p className="mt-2 text-slate-500 max-w-xs leading-relaxed">
                Choose one of the customer service sections from the left to start editing its content.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
