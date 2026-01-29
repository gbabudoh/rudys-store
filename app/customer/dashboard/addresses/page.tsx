'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2,
  Home,
  Building,
  Check,
  X
} from 'lucide-react';

interface Address {
  id: string;
  label: string;
  type: 'home' | 'office' | 'other';
  fullAddress: string;
  city: string;
  state: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses] = useState<Address[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const AddressIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'office':
        return <Building className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center">
            <MapPin className="w-8 h-8 mr-3 text-[#cfa224]" />
            Saved Addresses
          </h1>
          <p className="text-gray-500 mt-1">Manage your delivery addresses</p>
        </div>
        
        <button 
          onClick={() => setIsAddingNew(true)}
          className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-[#cfa224] to-[#e6b82e] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </button>
      </div>

      {/* Add New Address Form */}
      {isAddingNew && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Add New Address</h2>
            <button 
              onClick={() => setIsAddingNew(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Label</label>
              <input
                type="text"
                placeholder="e.g., Home, Office"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#cfa224] focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address Type</label>
              <select className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#cfa224] focus:bg-white transition-all text-gray-900 font-medium cursor-pointer">
                <option value="home">Home</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Street Address</label>
              <input
                type="text"
                placeholder="Enter your full street address"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#cfa224] focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
              <input
                type="text"
                placeholder="City"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#cfa224] focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
              <input
                type="text"
                placeholder="State"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#cfa224] focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
              <input
                type="tel"
                placeholder="+234..."
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#cfa224] focus:bg-white transition-all text-gray-900 font-medium"
              />
            </div>
            
            <div className="md:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="default" className="w-5 h-5 accent-[#cfa224] cursor-pointer" />
              <label htmlFor="default" className="text-gray-700 font-medium cursor-pointer">Set as default address</label>
            </div>
            
            <div className="md:col-span-2 flex gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 px-6 py-3 bg-[#201d1e] text-white font-semibold rounded-xl hover:bg-[#2d2a2b] transition-colors cursor-pointer"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !isAddingNew ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <MapPin className="w-12 h-12 text-emerald-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No saved addresses</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Add your delivery addresses for faster checkout.
          </p>
          <button 
            onClick={() => setIsAddingNew(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#cfa224] to-[#e6b82e] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all ${
                address.isDefault ? 'border-[#cfa224]' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    address.isDefault 
                      ? 'bg-gradient-to-br from-[#cfa224] to-[#e6b82e] text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <AddressIcon type={address.type} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{address.label}</h3>
                    {address.isDefault && (
                      <span className="text-xs font-semibold text-[#cfa224] flex items-center">
                        <Check className="w-3 h-3 mr-1" /> Default
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                    <Edit3 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-2">{address.fullAddress}</p>
              <p className="text-gray-500 text-sm">{address.city}, {address.state}</p>
              <p className="text-gray-500 text-sm">{address.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
