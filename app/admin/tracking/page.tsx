'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  MapPin, 
  Calendar, 
  StickyNote,
  ChevronRight
} from 'lucide-react';

interface TrackingInfo {
  id: number;
  order_id: number;
  order_number: string;
  tracking_number: string;
  carrier: string;
  status: 'pending' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  current_location: string;
  estimated_delivery: string;
  notes: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  created_at: string;
}

interface Order {
  id: number;
  order_number: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default function TrackingManagement() {
  const [trackings, setTrackings] = useState<TrackingInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTracking, setEditingTracking] = useState<TrackingInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Order search state
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  
  const [formData, setFormData] = useState({
    order_id: '',
    tracking_number: '',
    carrier: '',
    status: 'pending',
    current_location: '',
    estimated_delivery: '',
    notes: ''
  });

  useEffect(() => {
    fetchTrackings();
    fetchOrders();
  }, []);

  const fetchTrackings = async () => {
    try {
      const res = await fetch('/api/admin/tracking');
      const data = await res.json();
      if (Array.isArray(data)) setTrackings(data);
    } catch (err) {
      console.error('Error fetching trackings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const getStatusConfig = (status: TrackingInfo['status']) => {
    switch (status) {
      case 'pending': return { color: 'bg-yellow-50 text-yellow-600 border-yellow-100', icon: Clock, label: 'Pending' };
      case 'in_transit': return { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Truck, label: 'In Transit' };
      case 'out_for_delivery': return { color: 'bg-purple-50 text-purple-600 border-purple-100', icon: Package, label: 'Out for Delivery' };
      case 'delivered': return { color: 'bg-green-50 text-green-600 border-green-100', icon: CheckCircle2, label: 'Delivered' };
      case 'exception': return { color: 'bg-red-50 text-red-600 border-red-100', icon: AlertCircle, label: 'Exception' };
      default: return { color: 'bg-gray-50 text-gray-600 border-gray-100', icon: Clock, label: 'Unknown' };
    }
  };

  const handleOpenModal = (tracking?: TrackingInfo) => {
    if (tracking) {
      setEditingTracking(tracking);
      setFormData({
        order_id: tracking.order_id.toString(),
        tracking_number: tracking.tracking_number,
        carrier: tracking.carrier,
        status: tracking.status,
        current_location: tracking.current_location || '',
        estimated_delivery: tracking.estimated_delivery ? tracking.estimated_delivery.split('T')[0] : '',
        notes: tracking.notes || ''
      });
      setOrderSearch(tracking.order_number);
    } else {
      setEditingTracking(null);
      setFormData({
        order_id: '',
        tracking_number: '',
        carrier: '',
        status: 'pending',
        current_location: '',
        estimated_delivery: '',
        notes: ''
      });
      setOrderSearch('');
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const url = editingTracking ? `/api/admin/tracking/${editingTracking.id}` : '/api/admin/tracking';
    const method = editingTracking ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setModalOpen(false);
        fetchTrackings();
      }
    } catch (err) {
      console.error('Error submitting:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tracking record?')) return;
    try {
      await fetch(`/api/admin/tracking/${id}`, { method: 'DELETE' });
      fetchTrackings();
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const filteredTrackings = trackings.filter(t => 
    t.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${t.customer_first_name} ${t.customer_last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.order_number.toLowerCase().includes(orderSearch.toLowerCase()) ||
    `${o.first_name} ${o.last_name}`.toLowerCase().includes(orderSearch.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            Shipment Tracking
            <div className="px-3 py-1 bg-purple-100 text-purple-600 text-[10px] font-bold rounded-full border border-purple-200">
              {trackings.length} Active
            </div>
          </h1>
          <p className="mt-2 text-gray-400 font-medium max-w-xl">
            Monitor and update real-time shipping status for all customer orders. Manage carriers, tracking numbers, and delivery estimates.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="h-10 px-5 bg-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/20 hover:bg-purple-700 hover:shadow-purple-700/30 transition-all flex items-center justify-center gap-2 cursor-pointer group whitespace-nowrap"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Add Shipment
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
          <input 
            type="text"
            placeholder="Search by tracking number, order #, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 outline-none transition-all text-sm font-medium text-gray-600 placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Tracking List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Loading Shipments...</p>
        </div>
      ) : filteredTrackings.length === 0 ? (
        <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[3rem] py-32 flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 text-gray-200">
            <Package className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">No shipments found</h3>
          <p className="text-gray-400 text-sm mt-1">Start by adding a new shipment tracking record.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredTrackings.map((tracking) => {
            const config = getStatusConfig(tracking.status);
            return (
              <div 
                key={tracking.id}
                className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/40 hover:border-purple-200 hover:shadow-2xl hover:shadow-purple-500/10 transition-all cursor-default"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                  {/* Status & ID Column */}
                  <div className="lg:w-64 space-y-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${config.color} text-[10px] font-black uppercase tracking-wider`}>
                      <config.icon className="w-3 h-3" />
                      {config.label}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Order Number</h4>
                      <p className="text-lg font-black text-gray-900 tracking-tight">#{tracking.order_number}</p>
                    </div>
                  </div>

                  {/* Shipment Details Column */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2">Tracking Number</h4>
                      <div className="flex items-center gap-2 text-gray-900 font-bold">
                        <Package className="w-4 h-4 text-purple-600" />
                        <span className="font-mono">{tracking.tracking_number}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{tracking.carrier}</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2 text-transparent md:text-gray-300">Customer</h4>
                      <div className="text-sm font-bold text-gray-900">{tracking.customer_first_name} {tracking.customer_last_name}</div>
                      <div className="text-[10px] text-gray-400 uppercase font-medium">{tracking.customer_email}</div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2">Current Location</h4>
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {tracking.current_location || 'Not updated'}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2">Est. Delivery</h4>
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {tracking.estimated_delivery ? new Date(tracking.estimated_delivery).toLocaleDateString() : 'TBD'}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-3 lg:border-l border-gray-100 lg:pl-8">
                    <button 
                      onClick={() => handleOpenModal(tracking)}
                      className="p-4 bg-gray-50 text-gray-400 hover:bg-purple-600 hover:text-white rounded-2xl transition-all cursor-pointer group/btn"
                      title="Edit Shipment"
                    >
                      <Edit2 className="w-5 h-5 group-active/btn:scale-90" />
                    </button>
                    <button 
                      onClick={() => handleDelete(tracking.id)}
                      className="p-4 bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all cursor-pointer group/btn"
                      title="Delete Shipment"
                    >
                      <Trash2 className="w-5 h-5 group-active/btn:scale-90" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modern Modal Interface */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0b]/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 items-center animate-in zoom-in-95 duration-300 my-8">
            {/* Modal Header */}
            <div className="px-10 py-8 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between rounded-t-[3rem]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[1.5rem] bg-purple-600 flex items-center justify-center text-white shadow-xl shadow-purple-600/20">
                  <Truck className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                    {editingTracking ? 'Edit Shipment' : 'New Tracking'}
                  </h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Logistics Sync</p>
                </div>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-4 text-gray-400 hover:text-gray-900 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer group"
              >
                <X className="w-6 h-6 group-active:scale-90" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                {/* Order Search/Selection */}
                {!editingTracking && (
                  <div className="relative group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1 transition-colors group-focus-within:text-purple-600">Select Order</label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors">
                        <Search className="w-5 h-5" />
                      </div>
                      <input 
                        type="text"
                        placeholder="Search by order number or customer name..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-[6px] focus:ring-purple-500/5 outline-none transition-all font-semibold text-gray-900"
                        required={!editingTracking}
                      />
                    </div>
                    {/* Order Dropdown */}
                    {orderSearch && !formData.order_id && filteredOrders.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl z-10 overflow-hidden divide-y divide-gray-50">
                        {filteredOrders.map(order => (
                          <div 
                            key={order.id}
                            onClick={() => {
                              setFormData({...formData, order_id: order.id.toString()});
                              setOrderSearch(`#${order.order_number} - ${order.first_name}`);
                            }}
                            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <div className="font-bold text-gray-900">#{order.order_number}</div>
                            <div className="text-xs text-gray-400">{order.first_name} {order.last_name} • {order.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  {/* Tracking Number */}
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Tracking Number</label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600">
                        <Package className="w-5 h-5" />
                      </div>
                      <input 
                        type="text"
                        required
                        value={formData.tracking_number}
                        onChange={(e) => setFormData({...formData, tracking_number: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-[6px] focus:ring-purple-500/5 outline-none transition-all font-mono font-bold text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Carrier */}
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Carrier</label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600">
                        <Truck className="w-5 h-5" />
                      </div>
                      <input 
                        type="text"
                        required
                        value={formData.carrier}
                        onChange={(e) => setFormData({...formData, carrier: e.target.value})}
                        placeholder="e.g. FedEx, DHL"
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-[6px] focus:ring-purple-500/5 outline-none transition-all font-bold text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Shipping Status</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {(['pending', 'in_transit', 'out_for_delivery', 'delivered', 'exception'] as const).map(s => {
                      const config = getStatusConfig(s);
                      const isSelected = formData.status === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setFormData({...formData, status: s})}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${isSelected ? `${config.color.split(' ')[0]} ${config.color.split(' ')[2]} border-2 scale-105 shadow-lg` : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                        >
                          <config.icon className={`w-5 h-5 mb-1 ${isSelected ? config.color.split(' ')[1] : ''}`} />
                          <span className="text-[8px] font-black uppercase tracking-tighter">{config.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Location */}
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Current Location</label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <input 
                        type="text"
                        value={formData.current_location}
                        onChange={(e) => setFormData({...formData, current_location: e.target.value})}
                        placeholder="e.g. Lagos HUB"
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-[6px] focus:ring-purple-500/5 outline-none transition-all font-bold text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Est. Delivery</label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <input 
                        type="date"
                        value={formData.estimated_delivery}
                        onChange={(e) => setFormData({...formData, estimated_delivery: e.target.value})}
                        className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-[6px] focus:ring-purple-500/5 outline-none transition-all font-bold text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Internal Notes</label>
                  <div className="relative">
                    <div className="absolute left-5 top-5 text-gray-400 group-focus-within:text-purple-600">
                      <StickyNote className="w-5 h-5" />
                    </div>
                    <textarea 
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Add any internal shipment notes here..."
                      rows={3}
                      className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-[6px] focus:ring-purple-500/5 outline-none transition-all font-semibold text-gray-900 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-5 text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:text-gray-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] py-3.5 bg-purple-600 text-white font-bold text-sm rounded-xl shadow-xl shadow-purple-600/20 hover:bg-purple-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{editingTracking ? 'Update Logistics' : 'Add Shipment'}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

