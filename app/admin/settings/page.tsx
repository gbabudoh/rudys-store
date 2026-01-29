'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Shield,
  Package,
  Mail,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  Share2
} from 'lucide-react';

// Custom TikTok icon since it's not in standard lucide
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-3.5 h-3.5"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    store_name: '',
    store_email: '',
    store_email_support: '',
    store_phone: '',
    store_phone_secondary: '',
    store_address: '',
    store_hours_weekday: '',
    store_hours_saturday: '',
    store_hours_sunday: '',
    maintenance_mode: 'false',
    email_notifications: 'true',
    low_stock_alerts: 'true',
    social_facebook: '',
    social_instagram: '',
    social_twitter: '',
    social_tiktok: '',
    social_whatsapp: ''
  });

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, ...data.settings }));
      }
    } catch {
      console.error('Error fetching settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = async (key: string, currentValue: string) => {
    const newValue = currentValue === 'true' ? 'false' : 'true';
    setFormData(prev => ({ ...prev, [key]: newValue }));
    
    // Auto-save toggle
    await saveSettings({ [key]: newValue });
  };

  const saveSettings = async (updates: Partial<typeof formData>) => {
    try {
      setSaving(true);
      setMessage(null);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updates })
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings updated successfully' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to update settings' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(formData);
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Store Settings</h1>
          <p className="mt-1 text-slate-500">
            Configure your store identity, contact information, and social presence
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

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Store Identity */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <Package className="w-5 h-5 mr-2 text-purple-600" />
                Store Identity
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  name="store_name"
                  value={formData.store_name}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  placeholder="Rudy Store"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Store Address
                </label>
                <textarea
                  name="store_address"
                  value={formData.store_address}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none"
                  placeholder="Street address..."
                />
              </div>
            </div>
          </section>

          {/* Social Media */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <Share2 className="w-5 h-5 mr-2 text-purple-600" />
                Social Presence
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                  <Instagram className="w-3.5 h-3.5 mr-2" /> Instagram
                </label>
                <input
                  type="text"
                  name="social_instagram"
                  value={formData.social_instagram}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  placeholder="https://instagram.com/rudystore"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                  <Facebook className="w-3.5 h-3.5 mr-2" /> Facebook
                </label>
                <input
                  type="text"
                  name="social_facebook"
                  value={formData.social_facebook}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  placeholder="https://facebook.com/rudystore"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                  <TikTokIcon className="w-3.5 h-3.5 mr-2" /> TikTok
                </label>
                <input
                  type="text"
                  name="social_tiktok"
                  value={formData.social_tiktok}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  placeholder="https://tiktok.com/@rudystore"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                  <Twitter className="w-3.5 h-3.5 mr-2" /> X (Twitter)
                </label>
                <input
                  type="text"
                  name="social_twitter"
                  value={formData.social_twitter}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  placeholder="https://twitter.com/rudystore"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                  <MessageCircle className="w-3.5 h-3.5 mr-2" /> WhatsApp
                </label>
                <input
                  type="text"
                  name="social_whatsapp"
                  value={formData.social_whatsapp}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  placeholder="https://wa.me/234..."
                />
              </div>
            </div>
          </section>

          {/* Contact Details */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-purple-600" />
                Contact Details
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-2" /> Primary Email
                  </label>
                  <input
                    type="email"
                    name="store_email"
                    value={formData.store_email}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-2" /> Support Email
                  </label>
                  <input
                    type="email"
                    name="store_email_support"
                    value={formData.store_email_support}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-2" /> Primary Phone
                  </label>
                  <input
                    type="tel"
                    name="store_phone"
                    value={formData.store_phone}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-2" /> Secondary Phone
                  </label>
                  <input
                    type="tel"
                    name="store_phone_secondary"
                    value={formData.store_phone_secondary}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Business Hours */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-purple-600" />
                Business Hours
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Weekday (Mon-Fri)</label>
                <input
                  type="text"
                  name="store_hours_weekday"
                  value={formData.store_hours_weekday}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Saturday</label>
                <input
                  type="text"
                  name="store_hours_saturday"
                  value={formData.store_hours_saturday}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sunday</label>
                <input
                  type="text"
                  name="store_hours_sunday"
                  value={formData.store_hours_sunday}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* General Controls */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-600" />
                General Controls
              </h2>
            </div>
            <div className="p-6 divide-y divide-slate-100">
              <div className="flex items-center justify-between py-4 first:pt-0">
                <div>
                  <label className="text-sm font-bold text-slate-900">Maintenance Mode</label>
                  <p className="text-sm text-slate-500">Temporarily disable storefront</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleToggle('maintenance_mode', formData.maintenance_mode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    formData.maintenance_mode === 'true' ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.maintenance_mode === 'true' ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <label className="text-sm font-bold text-slate-900">Email Notifications</label>
                  <p className="text-sm text-slate-500">Alerts for new orders</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleToggle('email_notifications', formData.email_notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    formData.email_notifications === 'true' ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.email_notifications === 'true' ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-4 last:pb-0">
                <div>
                  <label className="text-sm font-bold text-slate-900">Low Stock Alerts</label>
                  <p className="text-sm text-slate-500">Notify when inventory is low</p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleToggle('low_stock_alerts', formData.low_stock_alerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    formData.low_stock_alerts === 'true' ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.low_stock_alerts === 'true' ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <button 
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-bold shadow-xl shadow-purple-500/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-lg"
          >
            {saving ? (
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            ) : (
              <Save className="w-6 h-6 mr-3" />
            )}
            Update All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
