'use client';

import { useState, useEffect } from 'react';
import ConfirmationModal from '@/app/components/ConfirmationModal';

// Simple icon components
const Plus = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const Search = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

const Shield = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-3 h-3"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className || "w-3 h-3"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  permissions: string[];
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
  createdBy: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUsers = () => {
      setTimeout(() => {
        setUsers([
          {
            id: '1',
            name: 'Super Admin',
            email: 'admin@rudystore.com',
            role: 'super_admin',
            permissions: ['all'],
            status: 'active',
            lastLogin: '2024-01-15T10:30:00Z',
            createdAt: '2024-01-01T00:00:00Z',
            createdBy: 'System'
          },
          {
            id: '2',
            name: 'Store Manager',
            email: 'manager@rudystore.com',
            role: 'admin',
            permissions: ['collections', 'luxury', 'crocs', 'orders'],
            status: 'active',
            lastLogin: '2024-01-15T09:15:00Z',
            createdAt: '2024-01-05T00:00:00Z',
            createdBy: 'Super Admin'
          },
          // ... more mock data would go here
        ]);
        setIsLoading(false);
      }, 1000);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    // setShowCreateModal(true);
  };

  const handleEditUser = () => {
    // setSelectedUser(user);
    // Open edit modal logic if it existed
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(users.filter(user => user.id !== userToDelete));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      setIsDeleting(false);
    }, 500);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-gray-900 leading-tight">User Management</h1>
          <p className="mt-0.5 text-gray-500 text-[13px] leading-relaxed">Manage administrative access and roles</p>
        </div>
        <button
          onClick={handleCreateUser}
          className="bg-[#201d1e] text-white px-3.5 py-1.5 rounded-lg hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer text-[13px] font-semibold shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all text-[13px] text-gray-900 bg-white/50"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 outline-none cursor-pointer bg-white transition-all text-[13px] font-semibold text-gray-700 appearance-none min-w-[120px]"
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Admin User</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Last Access</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-7 w-7 rounded-md bg-[#201d1e] flex items-center justify-center">
                        <span className="text-[13px] font-semibold text-white">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-[13px] font-semibold text-[#201d1e] leading-tight">{user.name}</div>
                        <div className="text-[13px] text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center">
                      {user.role === 'super_admin' ? (
                        <div className="flex items-center gap-1.5 text-purple-600">
                           <Shield className="w-3.5 h-3.5" />
                           <span className="text-[13px] font-semibold uppercase tracking-wider">Super Master</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-blue-600">
                           <User className="w-3.5 h-3.5" />
                           <span className="text-[13px] font-semibold uppercase tracking-wider">Administrator</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[13px] font-semibold uppercase tracking-wider transition-all ${
                        user.status === 'active'
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    >
                      {user.status === 'active' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {user.status}
                    </button>
                  </td>
                  <td className="px-4 py-2.5 text-[13px] text-gray-400">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEditUser()}
                        className="p-1.5 bg-gray-50 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-all active:scale-90"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {user.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 bg-gray-50 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-all active:scale-90"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Revoke Access"
        message="Are you sure you want to delete this admin account? They will lose all access to the store backend immediately."
        confirmText="Yes, Revoke Access"
        loading={isDeleting}
        type="danger"
      />
    </div>
  );
}
