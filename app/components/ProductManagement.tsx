'use client';

import { useState } from 'react';
import Image from 'next/image';

// Icons
const Plus = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const Search = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

const Eye = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  category: string;
  sku: string;
  createdAt: string;
}

interface ProductManagementProps {
  title: string;
  category: string;
  products: Product[];
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onViewProduct?: (product: Product) => void;
}

export default function ProductManagement({
  title,
  category,
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onViewProduct,
}: ProductManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'created'>('created');

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return a.stock - b.stock;
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700';
      case 'inactive':
        return 'bg-gray-100 text-gray-600';
      case 'draft':
        return 'bg-amber-50 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/50 backdrop-blur-md p-4 rounded-lg border border-white/20 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-[#201d1e]">{title}</h1>
          <p className="mt-0.5 text-gray-500 text-[13px]">
            Manage your {category.toLowerCase()} products collection
          </p>
        </div>
        <button
          onClick={onAddProduct}
          className="bg-[#201d1e] text-white px-3.5 py-1.5 rounded-lg hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer text-[13px] font-semibold shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 p-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white/50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-sm text-gray-900"
            />
          </div>

          <div className="flex gap-3">
            {/* Status Filter */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive' | 'draft')}
                className="block w-full pl-3 pr-8 py-2 text-[13px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 rounded-lg cursor-pointer bg-white transition-all font-semibold text-gray-700 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Sort */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'stock' | 'created')}
                className="block w-full pl-3 pr-8 py-2 text-[13px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 rounded-lg cursor-pointer bg-white transition-all font-semibold text-gray-700 appearance-none"
              >
                <option value="created">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="price">Price Low-High</option>
                <option value="stock">Stock Level</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider text-center">SKU</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider text-center">Stock</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-[13px] font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Search className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900">No products found</p>
                      <p className="text-gray-500 text-[13px] mt-0.5">Try adjusting your filters or search terms.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-14 w-14 relative bg-gray-50 rounded-md overflow-hidden border border-gray-100 shadow-sm">
                          <Image
                            src={product.image || '/api/placeholder/48/48'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-[13px] font-semibold text-[#201d1e] leading-tight">{product.name}</div>
                          <div className="text-[13px] font-semibold text-purple-600 uppercase tracking-wider mt-0.5">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <div className="text-[13px] font-semibold text-gray-400 font-mono tracking-wider bg-gray-50 inline-block px-2 py-0.5 rounded">
                        {product.sku}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-[#201d1e]">₦{product.price.toLocaleString()}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[13px] text-gray-400 line-through">
                            ₦{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <div className={`inline-flex flex-col items-center justify-center min-w-[50px] py-1 rounded-md border ${
                        product.stock < 10 
                          ? 'bg-red-50 border-red-100 text-red-600' 
                          : product.stock < 50 
                            ? 'bg-amber-50 border-amber-100 text-amber-600' 
                            : 'bg-green-50 border-green-100 text-green-600'
                      }`}>
                        <span className="text-[13px] font-semibold">{product.stock}</span>
                        <span className="text-[13px] uppercase font-medium opacity-70">Units</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex px-2 py-0.5 text-[13px] font-semibold uppercase tracking-wider rounded-md ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onViewProduct && (
                          <button
                            onClick={() => onViewProduct(product)}
                            className="p-1.5 bg-gray-50 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-all active:scale-90"
                            title="View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onEditProduct && (
                          <button
                            onClick={() => onEditProduct(product)}
                            className="p-1.5 bg-gray-50 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-50 cursor-pointer transition-all active:scale-90"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteProduct && (
                          <button
                            onClick={() => onDeleteProduct(product.id)}
                            className="p-1.5 bg-gray-50 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-all active:scale-90"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="bg-gray-50/50 px-4 py-2.5 flex items-center justify-between border-t border-gray-100">
            <div className="text-[13px] text-gray-500">
              Showing <span className="font-semibold text-[#201d1e]">{filteredProducts.length}</span> products
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-[13px] font-semibold uppercase tracking-wider border border-gray-200 rounded-lg hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" disabled>
                Previous
              </button>
              <button className="px-3 py-1.5 text-[13px] font-semibold uppercase tracking-wider border border-gray-200 rounded-lg hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
