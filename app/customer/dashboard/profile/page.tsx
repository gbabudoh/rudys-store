'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { User, Phone, MapPin, Mail, Save, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    phone: user?.phone || '',
    address: '', // Example, typically fetched from user object if available
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        // Show success
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Avatar Card */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <div className="w-24 h-24 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-3xl mb-4">
                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{user?.first_name} {user?.last_name}</h2>
                    <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                        Verified Account
                    </div>
                </div>
            </div>

            {/* Forms */}
            <div className="lg:col-span-2 space-y-6">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                         <User className="w-5 h-5 mr-2 text-purple-600" />
                         Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={user?.email}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                             <div className="relative">
                                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center pt-6 border-t border-gray-100">
                         <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                         Address Book
                    </h3>
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="123 Main St"
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
       </div>
    </div>
  );
}
