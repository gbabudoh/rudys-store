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
  Settings,
  Mail,
  Inbox,
  Trash2,
  Archive,
  User,
  Phone,
  Clock,
  Search,
  Check
} from 'lucide-react';

interface ContentPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  is_active: boolean;
  updated_at: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
}

export default function CustomerServiceManagement() {
  const [activeTab, setActiveTab] = useState<'pages' | 'messages'>('pages');
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState<ContentPage | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');

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

  const fetchMessages = useCallback(async () => {
    try {
      setLoadingMessages(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/messages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
    fetchMessages();
  }, [fetchPages, fetchMessages]);

  const handleUpdateMessageStatus = async (id: number, status: ContactMessage['status']) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
        if (selectedMessage?.id === id) {
          setSelectedMessage(prev => prev ? { ...prev, status } : null);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
        setMessage({ type: 'success', text: 'Message deleted successfully' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

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

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'pages' 
              ? 'bg-white text-purple-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 cursor-pointer'
          }`}
        >
          <Edit2 className="w-4 h-4" />
          Content Pages
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all relative ${
            activeTab === 'messages' 
              ? 'bg-white text-purple-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50 cursor-pointer'
          }`}
        >
          <Mail className="w-4 h-4" />
          Message Inbox
          {messages.filter(m => m.status === 'unread').length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-600 text-[10px] text-white items-center justify-center">
                {messages.filter(m => m.status === 'unread').length}
              </span>
            </span>
          )}
        </button>
      </div>

      {activeTab === 'pages' ? (
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
      ) : (
        /* Messages Inbox */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages List Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[600px]">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ContactMessage['status'] | 'all')}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 outline-none cursor-pointer"
                  >
                    <option value="all">All</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[500px]">
                {loadingMessages ? (
                  <div className="p-12 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-12 text-center">
                    <Inbox className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs font-medium text-slate-400">No messages found</p>
                  </div>
                ) : (
                  messages
                    .filter(m => {
                      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                           m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                           m.subject.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMessage(m);
                        if (m.status === 'unread') handleUpdateMessageStatus(m.id, 'read');
                      }}
                      className={`w-full text-left p-4 hover:bg-slate-50 transition-all group flex gap-3 cursor-pointer ${
                        selectedMessage?.id === m.id ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                        m.status === 'unread' ? 'bg-purple-600 animate-pulse' : 'bg-transparent'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm font-bold truncate ${
                            selectedMessage?.id === m.id ? 'text-purple-700' : 'text-slate-900'
                          }`}>{m.name}</p>
                          <p className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                             {new Date(m.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 truncate mb-1">{m.subject}</p>
                        <p className="text-[11px] text-slate-400 truncate line-clamp-1">{m.message}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Message Content View */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full min-h-[600px] animate-in fade-in slide-in-from-right-4">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-200">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900 leading-tight">{selectedMessage.name}</h2>
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-1">
                          <span className="flex items-center gap-1 hover:text-purple-600 transition-colors cursor-pointer">
                            <Mail className="w-3.5 h-3.5" />
                            {selectedMessage.email}
                          </span>
                          {selectedMessage.phone && (
                            <span className="flex items-center gap-1 hover:text-purple-600 transition-colors cursor-pointer">
                              <Phone className="w-3.5 h-3.5" />
                              {selectedMessage.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleUpdateMessageStatus(selectedMessage.id, selectedMessage.status === 'archived' ? 'read' : 'archived')}
                        className={`p-2.5 rounded-xl transition-all border cursor-pointer hover:shadow-md ${
                          selectedMessage.status === 'archived'
                            ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                            : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
                        }`}
                        title={selectedMessage.status === 'archived' ? 'Unarchive' : 'Archive'}
                      >
                        <Archive className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all cursor-pointer hover:shadow-md"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-8 flex-1 space-y-8 overflow-y-auto">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-purple-100">
                           {selectedMessage.subject}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(selectedMessage.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                          {selectedMessage.message}
                        </p>
                      </div>
                   </div>

                   <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-start gap-4">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                        <Check className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-900">Message Delivered</h4>
                        <p className="text-xs text-emerald-600 mt-1 font-medium">
                          This message was successfully persisted to your database and and an automated receipt was sent to the customer.
                        </p>
                      </div>
                   </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/30 flex justify-end">
                  <a 
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="inline-flex items-center px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95 cursor-pointer"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center h-full min-h-[600px]">
                <div className="p-6 bg-white rounded-3xl shadow-sm mb-6">
                  <Inbox className="w-16 h-16 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Your Messaging Hub</h3>
                <p className="mt-2 text-slate-500 max-w-sm leading-relaxed font-medium">
                  Select a message from the list to read details, archive it for later, or reply directly. Keep your customer support snappy and organized!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
