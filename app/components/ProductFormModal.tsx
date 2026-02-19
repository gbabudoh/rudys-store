'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types/product';
import ImageUpload from './ImageUpload';

// Icons
const X = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Upload = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const Loader = ({ className }: { className?: string }) => (
  <svg className={className || "w-5 h-5 animate-spin"} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Product interface is now imported from @/types/product

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<void>;
  product?: Product | null;
  storeSection: 'collections' | 'luxury' | 'crocs';
}

const defaultProduct: Product = {
  name: '',
  description: '',
  full_description: '',
  price: 0,
  original_price: undefined,
  sku: '',
  category: '',
  subcategory: '',
  product_type: 'Shirt',
  store_section: 'collections',
  images: [],
  sizes: [],
  eu_sizes: [],
  colors: [],
  features: [],
  gender: 'Unisex',
  brand: '',
  stock: 0,
  is_new: false,
  is_on_sale: false,
  is_featured: false,
  is_best_seller: false,
  discount: 0,
  status: 'draft',
};


const SIZES = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  shoe: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
  accessory: ['One Size', 'S', 'M', 'L'],
};

const COLORS = ['Black', 'White', 'Navy', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Beige', 'Pink', 'Purple', 'Orange', 'Yellow', 'Multi'];

interface ColorData {
  id: number;
  name: string;
  hex_code: string;
}

export default function ProductFormModal({ isOpen, onClose, onSave, product, storeSection }: ProductFormModalProps) {
  const [formData, setFormData] = useState<Product>({ ...defaultProduct, store_section: storeSection });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'inventory'>('basic');
  const [newFeature, setNewFeature] = useState('');
  const [dbCategories, setDbCategories] = useState<CategoryData[]>([]);
  const [dbBrands, setDbBrands] = useState<BrandData[]>([]);
  const [dbColors, setDbColors] = useState<ColorData[]>([]);
  const [dbProductTypes, setDbProductTypes] = useState<ProductTypeData[]>([]);
  const [dbSubCategories, setDbSubCategories] = useState<SubCategoryData[]>([]);

  interface CategoryData {
    id: number;
    name: string;
    parent_id: number | null;
  }

  interface BrandData {
    id: number;
    name: string;
  }
  
  interface ProductTypeData {
    id: number;
    name: string;
  }

  interface SubCategoryData {
    id: number;
    name: string;
    parent_category_id: number;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const [catsRes, brandsRes, colorsRes, typesRes, subsRes] = await Promise.all([
          fetch('/api/admin/categories', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/brands', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/colors', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/product-types', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/sub-categories', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        if (catsRes.ok) {
          const data = await catsRes.json();
          setDbCategories(data.categories);
        }
        if (brandsRes.ok) {
          const data = await brandsRes.json();
          setDbBrands(data.brands);
        }
        if (colorsRes.ok) {
          const data = await colorsRes.json();
          setDbColors(data.colors);
        }
        if (typesRes.ok) {
          const data = await typesRes.json();
          setDbProductTypes(data.productTypes);
        }
        if (subsRes.ok) {
          const data = await subsRes.json();
          setDbSubCategories(data.subCategories);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({ ...defaultProduct, ...product });
    } else {
      setFormData({ ...defaultProduct, store_section: storeSection });
    }
    setActiveTab('basic');
    setError('');
  }, [product, storeSection, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleColorToggle = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleAddImage = (url: string) => {
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setError('Valid price is required');
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  // Now using separate tables, so categories are just the ones from categories table (likely all roots if intended, but let's keep logic if recursive)
  // But wait, the previous code filtered dbCategories by !c.parent_id.
  // With the new system, dbCategories likely still contains the main categories (Men, Women etc).
  // subCategories should now come from dbSubCategories filtered by parent_category_id.
  
  const mainCategories = dbCategories.filter(c => !c.parent_id);
  
  // Find the selected category object to get its ID for filtering subcategories
  const selectedCategoryObj = dbCategories.find(c => c.name === formData.category);
  const selectedCategoryId = selectedCategoryObj ? selectedCategoryObj.id : null;
  
  const filteredSubCategories = dbSubCategories.filter(c => 
    selectedCategoryId && c.parent_category_id === selectedCategoryId
  );

  const getSizeOptions = () => {
    const type = formData.product_type;
    // Map dynamic types to size charts if possible, or default to clothing
    // For now, simple matching
    if (type.toLowerCase().includes('shoe')) return SIZES.shoe;
    if (['Bag', 'Glasses', 'Watch', 'Belt', 'Hat', 'Accessory'].some(t => type.includes(t))) return SIZES.accessory;
    return SIZES.clothing;
  };

  const sizeOptions = getSizeOptions();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {(['basic', 'details', 'inventory'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab === 'basic' ? 'Basic Info' : tab === 'details' ? 'Details & Media' : 'Inventory & Status'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Category *</label>
                        <a href="/admin/categories" className="text-xs text-purple-600 hover:text-purple-700 font-medium">Manage Categories</a>
                      </div>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
                      >
                        <option value="">Select category</option>
                        {mainCategories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Sub Category</label>
                        <a href="/admin/sub-categories" className="text-xs text-purple-600 hover:text-purple-700 font-medium">Manage Sub-Cats</a>
                      </div>
                      <select
                        name="subcategory"
                        value={formData.subcategory || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
                        disabled={!formData.category}
                      >
                        <option value="">None</option>
                        {filteredSubCategories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Product Type</label>
                        <a href="/admin/product-types" className="text-xs text-purple-600 hover:text-purple-700 font-medium">Manage Types</a>
                      </div>
                      <select
                        name="product_type"
                        value={formData.product_type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
                      >
                        <option value="">Select Type</option>
                        {dbProductTypes.length > 0 ? (
                          dbProductTypes.map(type => (
                            <option key={type.id} value={type.name}>{type.name}</option>
                          ))
                        ) : (
                          // Fallback if no types created yet
                          <>
                            <option value="Shirt">Shirt</option>
                            <option value="T-Shirt">T-Shirt</option>
                            <option value="Dress">Dress</option>
                            <option value="shoes">shoes</option>
                            <option value="Pants">Pants</option>
                            <option value="Accessory">Accessory</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦) *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price || ''}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₦)</label>
                      <input
                        type="number"
                        name="original_price"
                        value={formData.original_price || ''}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0.00 (for sale items)"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Brief product description..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  {/* Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                    <div className="mb-4">
                      <ImageUpload 
                        onUploadSuccess={handleAddImage}
                        accept="image/*"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <Image src={img} alt="" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {formData.images.length === 0 && (
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          <Upload className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {sizeOptions.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeToggle(size)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                            formData.sizes.includes(size)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors and Variations */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Available Colours & Variations</label>
                      <a href="/admin/colors" className="text-xs text-purple-600 hover:text-purple-700 font-medium">Manage Colours</a>
                    </div>
                    {/* Color Selection */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(dbColors.length > 0 ? dbColors : COLORS.map(c => ({ name: c, hex_code: '' }))).map(color => {
                        const colorName = typeof color === 'string' ? color : color.name;
                        const isSelected = formData.colors.includes(colorName);
                        return (
                          <button
                            key={colorName}
                            type="button"
                            onClick={() => handleColorToggle(colorName)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border ${
                              isSelected
                                ? 'bg-purple-600 text-white border-purple-600'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {typeof color !== 'string' && color.hex_code && (
                              <span 
                                className="w-4 h-4 rounded-full border border-gray-200" 
                                style={{ backgroundColor: color.hex_code }}
                              />
                            )}
                            {colorName}
                          </button>
                        );
                      })}
                    </div>

                    {/* Color Variation Images */}
                    {formData.colors.length > 0 && (
                      <div className="space-y-4 mt-6 border-t pt-4">
                        <h4 className="text-sm font-bold text-gray-900">Color Variations (Specific Images)</h4>
                        <p className="text-xs text-gray-500 mb-4">Upload specific images for each selected color. These will be shown when the customer selects the color.</p>
                        
                        {formData.colors.map(color => {
                          const colorData = dbColors.find(c => c.name === color);
                          const variationImages = formData.color_images?.find(ci => ci.color === color)?.images || [];
                          
                          return (
                            <div key={color} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <div className="flex items-center gap-2 mb-3">
                                {colorData?.hex_code && (
                                  <span 
                                    className="w-4 h-4 rounded-full border border-gray-300" 
                                    style={{ backgroundColor: colorData.hex_code }}
                                  />
                                )}
                                <span className="font-bold text-sm text-gray-800">{color} Images</span>
                              </div>
                              
                              <div className="mb-3">
                                <ImageUpload 
                                  onUploadSuccess={(url) => {
                                    setFormData(prev => {
                                      const existing = prev.color_images || [];
                                      const colorEntry = existing.find(ci => ci.color === color);
                                      let newColorImages;
                                      
                                      if (colorEntry) {
                                        newColorImages = existing.map(ci => 
                                          ci.color === color 
                                            ? { ...ci, images: [...ci.images, url] }
                                            : ci
                                        );
                                      } else {
                                        newColorImages = [...existing, { color, images: [url] }];
                                      }
                                      
                                      return { ...prev, color_images: newColorImages };
                                    });
                                  }}
                                  accept="image/*"
                                  label={`Add ${color} Image`}
                                />
                              </div>
                              
                              <div className="grid grid-cols-6 gap-2">
                                {variationImages.map((img, idx) => (
                                  <div key={idx} className="relative group aspect-square bg-white rounded-md overflow-hidden border border-gray-200">
                                    <Image src={img} alt="" fill className="object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData(prev => {
                                          const existing = prev.color_images || [];
                                          const newColorImages = existing.map(ci => 
                                            ci.color === color 
                                              ? { ...ci, images: ci.images.filter((_, i) => i !== idx) }
                                              : ci
                                          ).filter(ci => ci.images.length > 0);
                                          
                                          return { ...prev, color_images: newColorImages };
                                        });
                                      }}
                                      className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                {variationImages.length === 0 && (
                                  <div className="col-span-6 text-xs text-gray-400 italic">
                                    No specific images for {color} (will use default images)
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Features</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Add a feature (e.g., 100% Cotton)"
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Full Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                    <textarea
                      name="full_description"
                      value={formData.full_description}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      placeholder="Detailed product description..."
                    />
                  </div>
                </div>
              )}

              {/* Inventory Tab */}
              {activeTab === 'inventory' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Auto-generated if empty"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
                      >
                        <option value="Unisex">Unisex</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Brand</label>
                        <a href="/admin/brands" className="text-xs text-purple-600 hover:text-purple-700 font-medium">Manage Brands</a>
                      </div>
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
                      >
                        <option value="">None</option>
                        {dbBrands.map(brand => (
                          <option key={brand.id} value={brand.name}>{brand.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_new"
                        checked={formData.is_new}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">Mark as New Arrival</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_on_sale"
                        checked={formData.is_on_sale}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">On Sale</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured Product</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_best_seller"
                        checked={formData.is_best_seller}
                        onChange={handleCheckboxChange}
                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">Best Seller</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {saving && <Loader className="w-4 h-4" />}
                {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
