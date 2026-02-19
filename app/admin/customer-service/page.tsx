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
import ConfirmationModal from '@/app/components/ConfirmationModal';

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

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/content-pages', {
        headers: { 'Authorization': `Bearer ${token}` }
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

  const handleDeleteMessage = (id: number) => {
    setMessageToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteMessage = async () => {
    if (messageToDelete === null) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/messages/${messageToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessages(prev => prev.filter(m => m.id !== messageToDelete));
        if (selectedMessage?.id === messageToDelete) {
          setSelectedMessage(null);
        }
        setIsDeleteModalOpen(false);
        setMessageToDelete(null);
        setMessage({ type: 'success', text: 'Message deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setIsDeleting(false);
      setTimeout(() => setMessage(null), 3000);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-gray-900 leading-tight">Support Ecosystem</h1>
          <p className="mt-0.5 text-gray-500 text-[13px] leading-relaxed">Manage help resources and customer communications.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-0.5 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveTab('pages')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all ${
                activeTab === 'pages' 
                  ? 'bg-white text-[#201d1e] shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600 cursor-pointer'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              Resource Pages
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all relative ${
                activeTab === 'messages' 
                  ? 'bg-white text-[#201d1e] shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600 cursor-pointer'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Message Inbox
              {messages.filter(m => m.status === 'unread').length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-600 text-[9px] text-white items-center justify-center font-semibold">
                    {messages.filter(m => m.status === 'unread').length}
                  </span>
                </span>
              )}
            </button>
          </div>
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

      {activeTab === 'pages' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Pages Sidebar List */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100">
                <h2 className="text-[13px] font-semibold text-gray-500">Resource Management</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => setSelectedPage(page)}
                    className={`w-full flex items-center justify-between px-4 py-3 transition-all hover:bg-gray-50/50 group cursor-pointer ${
                      selectedPage?.slug === page.slug ? 'bg-purple-50/50' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 transition-all ${
                        selectedPage?.slug === page.slug ? 'bg-[#201d1e] text-white' : 'bg-white text-gray-400 group-hover:bg-gray-100 border border-gray-100'
                      }`}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left">
                        <p className={`font-semibold text-[13px] ${
                          selectedPage?.slug === page.slug ? 'text-[#201d1e]' : 'text-gray-700'
                        }`}>{page.title}</p>
                        <p className="text-[13px] text-gray-400 mt-0.5">Slug: {page.slug}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      selectedPage?.slug === page.slug ? 'text-[#201d1e] translate-x-1' : 'text-gray-200'
                    }`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="lg:col-span-2">
            {selectedPage ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full min-h-[500px] animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-600 text-white rounded-lg shadow-sm mr-3">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">{selectedPage.title}</h2>
                      <p className="text-[13px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        Last Synced: {new Date(selectedPage.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-black hover:bg-white border border-transparent hover:border-gray-100 rounded-md transition-all cursor-pointer bg-gray-50">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center px-3.5 py-1.5 bg-[#201d1e] text-white rounded-lg text-[13px] font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {saving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                      Push Updates
                    </button>
                  </div>
                </div>

                  <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
                    <div className="group">
                      <label className="block text-[13px] font-semibold text-gray-500 mb-1.5 transition-colors group-focus-within:text-purple-600">Page Identity</label>
                      <input
                        type="text"
                        value={selectedPage.title}
                        onChange={(e) => setSelectedPage({...selectedPage, title: e.target.value})}
                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:border-purple-600 focus:ring-2 focus:ring-purple-500/5 outline-none transition-all text-sm font-semibold text-gray-900"
                      />
                    </div>
                    <div className="flex-1 flex flex-col group min-h-0">
                      <label className="block text-[13px] font-semibold text-gray-500 mb-1.5 flex items-center justify-between transition-colors group-focus-within:text-purple-600">
                        <span>Live Marketplace Content</span>
                        <span className="text-[13px] opacity-50 px-1.5 py-0.5 border border-gray-200 rounded">Rich Markdown Mode</span>
                      </label>
                      <textarea
                        value={selectedPage.content}
                        onChange={(e) => setSelectedPage({...selectedPage, content: e.target.value})}
                        className="flex-1 w-full p-4 bg-white border border-gray-300 rounded-lg focus:border-purple-600 focus:ring-2 focus:ring-purple-500/5 outline-none transition-all resize-none font-mono text-[13px] leading-relaxed text-gray-700"
                        placeholder="Start drafting your high-fidelity content..."
                      />
                    </div>
                  </div>

                  <div className="bg-[#201d1e] px-4 py-3 relative overflow-hidden group">
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-[13px] font-semibold text-white">Storefront Visibility</p>
                        <p className="text-[13px] text-gray-400 mt-0.5">Status: {selectedPage.is_active ? 'Live & Public' : 'Draft Only'}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedPage({...selectedPage, is_active: !selectedPage.is_active})}
                        className={`inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none cursor-pointer ${
                          selectedPage.is_active ? 'bg-purple-600' : 'bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white transition-transform ${
                          selectedPage.is_active ? 'translate-x-5.5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
              </div>
            ) : (
              <div className="bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center h-full min-h-[500px] group transition-all hover:bg-white hover:border-purple-200">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                  <Headphones className="w-8 h-8 text-gray-200" />
                </div>
                <h3 className="text-sm font-semibold text-[#201d1e]">Section Not Selected</h3>
                <p className="mt-1.5 text-gray-400 max-w-xs text-[13px]">
                  Choose a content segment from the navigation panel to begin your administrative refinements.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Messages Inbox */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Messages List Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px] overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 space-y-2">
                <h2 className="text-[13px] font-semibold text-gray-500">Message Archive</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                  <input
                    type="text"
                    placeholder="Search communications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-purple-500/5 focus:border-purple-500 transition-all"
                  />
                </div>
                <div className="flex gap-1.5">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ContactMessage['status'] | 'all')}
                    className="flex-1 bg-white border border-gray-100 rounded-md px-2.5 py-1.5 text-[13px] font-semibold text-gray-500 outline-none cursor-pointer hover:bg-gray-50 transition-colors appearance-none"
                  >
                    <option value="all">All Channels</option>
                    <option value="unread">New Only</option>
                    <option value="read">Processed</option>
                    <option value="archived">Stored</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto divide-y divide-gray-50 max-h-[500px]">
                {loadingMessages ? (
                  <div className="p-10 flex justify-center">
                    <div className="w-6 h-6 border-3 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Inbox className="w-5 h-5 text-gray-200" />
                    </div>
                    <p className="text-[13px] text-gray-400 font-medium">No incoming transmissions</p>
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
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50/50 transition-all group flex gap-3 cursor-pointer relative ${
                        selectedMessage?.id === m.id ? 'bg-purple-50/30' : ''
                      }`}
                    >
                      {m.status === 'unread' && (
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-600" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className={`text-[13px] font-semibold truncate ${
                            selectedMessage?.id === m.id ? 'text-purple-700' : 'text-gray-900'
                          }`}>{m.name}</p>
                          <p className="text-[13px] text-gray-300 whitespace-nowrap ml-2">
                             {new Date(m.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-[13px] font-medium text-gray-500 truncate mb-0.5">{m.subject}</p>
                        <p className="text-[13px] text-gray-400 truncate line-clamp-1 opacity-70">{m.message}</p>
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full min-h-[500px] animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/30">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#201d1e] flex items-center justify-center text-white relative overflow-hidden">
                        <User className="w-4 h-4 relative z-10" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">{selectedMessage.name}</h2>
                        <div className="flex items-center gap-2 text-[13px] text-gray-400 mt-0.5">
                          <span className="flex items-center gap-1 hover:text-purple-600 transition-colors cursor-pointer">
                            <Mail className="w-3 h-3" />
                            {selectedMessage.email}
                          </span>
                          {selectedMessage.phone && (
                            <span className="flex items-center gap-1 hover:text-purple-600 transition-colors cursor-pointer">
                              <Phone className="w-3 h-3" />
                              {selectedMessage.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => handleUpdateMessageStatus(selectedMessage.id, selectedMessage.status === 'archived' ? 'read' : 'archived')}
                        className={`p-1.5 rounded-md transition-all border cursor-pointer active:scale-90 ${
                          selectedMessage.status === 'archived'
                            ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                            : 'bg-white border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-300'
                        }`}
                        title={selectedMessage.status === 'archived' ? 'Restore' : 'Archive'}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        className="p-1.5 bg-white border border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 rounded-md transition-all cursor-pointer active:scale-90"
                        title="Evict"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 space-y-4 overflow-y-auto">
                   <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                        <div className="px-3 py-1 bg-[#201d1e] text-white rounded-md text-[13px] font-semibold">
                           Subject: {selectedMessage.subject}
                        </div>
                        <div className="flex items-center gap-1.5 text-[13px] text-gray-300">
                          <Clock className="w-3 h-3" />
                          {new Date(selectedMessage.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-50 relative overflow-hidden">
                        <p className="text-[13px] text-gray-900 leading-relaxed whitespace-pre-wrap relative z-10">
                          &quot;{selectedMessage.message}&quot;
                        </p>
                      </div>
                   </div>

                   <div className="bg-emerald-50 rounded-lg p-3 flex items-start gap-3 border border-emerald-100">
                      <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-semibold text-emerald-900">Secure Transmission Verified</h4>
                        <p className="text-[13px] text-emerald-600 mt-0.5 leading-relaxed max-w-md">
                          This correspondence was successfully vaulted. An automated response has been dispatched.
                        </p>
                      </div>
                   </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/20 flex justify-end">
                  <a 
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="inline-flex items-center px-4 py-2 bg-[#201d1e] text-white rounded-lg text-[13px] font-semibold uppercase tracking-wider hover:bg-black transition-all shadow-sm active:scale-[0.98] cursor-pointer group"
                  >
                    Reply
                    <ChevronRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center h-full min-h-[500px] group transition-all hover:bg-white hover:border-purple-200">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                  <Inbox className="w-8 h-8 text-gray-200" />
                </div>
                <h3 className="text-sm font-semibold text-[#201d1e]">Communication Void</h3>
                <p className="mt-1.5 text-gray-400 max-w-sm text-[13px]">
                  Select a customer transmission from the archive to begin processing.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMessageToDelete(null);
        }}
        onConfirm={confirmDeleteMessage}
        title="Evict Message"
        message="Are you sure you want to permanently delete this customer transmission? This action is irreversible and will purge the data from the secure vault."
        confirmText="Yes, Evict Message"
        loading={isDeleting}
        type="danger"
      />
    </div>
  );
}
