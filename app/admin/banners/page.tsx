'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Simple icon components to replace lucide-react
const Plus = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  buttonText: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function BannerManagement() {
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/admin/banners', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }

        const data = await response.json();
        // Transform database format to component format
        const transformedSlides = data.banners.map((banner: { 
          id: number; 
          title: string; 
          subtitle?: string; 
          image_url: string; 
          link_url?: string; 
          button_text?: string; 
          is_active: boolean; 
          display_order: number; 
          created_at?: string; 
          updated_at?: string; 
        }) => ({
          id: banner.id.toString(),
          title: banner.title,
          subtitle: banner.subtitle || '',
          image: banner.image_url,
          link: banner.link_url || '',
          buttonText: banner.button_text || 'Shop Now',
          isActive: banner.is_active,
          order: banner.display_order,
          createdAt: banner.created_at?.split('T')[0] || '',
          updatedAt: banner.updated_at?.split('T')[0] || '',
        }));
        setSlides(transformedSlides);
        setError(null);
      } catch (err: unknown) {
        console.error('Error fetching banners:', err);
        setError(err instanceof Error ? err.message : 'Failed to load banners');
        // Fallback to empty array
        setSlides([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleCreateSlide = () => {
    setEditingSlide(null);
    setIsModalOpen(true);
  };

  const handleEditSlide = (slide: BannerSlide) => {
    setEditingSlide(slide);
    setIsModalOpen(true);
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner slide?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete banner');
      }

      setSlides(prev => prev.filter(slide => slide.id !== id));
      alert('Banner deleted successfully!');
    } catch (err: unknown) {
      console.error('Delete error:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete banner');
    }
  };

  const handleToggleActive = async (id: string) => {
    const slide = slides.find(s => s.id === id);
    if (!slide) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !slide.isActive,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update banner');
      }

      const data = await response.json();
      const updatedSlide = {
        ...slide,
        isActive: data.banner.is_active,
      };
      setSlides(prev => prev.map(s => s.id === id ? updatedSlide : s));
      alert(`Banner ${data.banner.is_active ? 'activated' : 'deactivated'} successfully!`);
    } catch (err: unknown) {
      console.error('Toggle active error:', err);
      alert(err instanceof Error ? err.message : 'Failed to update banner');
    }
  };

  const handleSaveSlide = async (slideData: Omit<BannerSlide, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const token = localStorage.getItem('admin_token');
      const payload = {
        title: slideData.title,
        subtitle: slideData.subtitle,
        image_url: slideData.image,
        link_url: slideData.link,
        button_text: slideData.buttonText,
        is_active: slideData.isActive,
        display_order: slideData.order,
      };

      console.log('Saving banner with payload:', payload);
      console.log('Editing slide:', editingSlide);

      let response;
      if (editingSlide) {
        // Update existing slide
        console.log('Updating banner with ID:', editingSlide.id);
        response = await fetch(`/api/admin/banners/${editingSlide.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new slide
        console.log('Creating new banner');
        response = await fetch('/api/admin/banners', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || (editingSlide ? 'Failed to update banner' : 'Failed to create banner'));
      }

      const data = await response.json();
      const banner = data.banner;
      const transformedSlide: BannerSlide = {
        id: banner.id.toString(),
        title: banner.title,
        subtitle: banner.subtitle || '',
        image: banner.image_url,
        link: banner.link_url || '',
        buttonText: banner.button_text || 'Shop Now',
        isActive: banner.is_active,
        order: banner.display_order,
        createdAt: banner.created_at?.split('T')[0] || '',
        updatedAt: banner.updated_at?.split('T')[0] || '',
      };

      if (editingSlide) {
        setSlides(prev => prev.map(s => s.id === editingSlide.id ? transformedSlide : s));
      } else {
        setSlides(prev => [...prev, transformedSlide]);
      }

      setIsModalOpen(false);
      setEditingSlide(null);
      alert(`Banner ${editingSlide ? 'updated' : 'created'} successfully!`);
    } catch (err: unknown) {
      console.error('Save error:', err);
      alert(err instanceof Error ? err.message : 'Failed to save banner');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600">Manage homepage banner slider</p>
        </div>
        <button
          onClick={handleCreateSlide}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Slide
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <ImageIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Slides</p>
              <p className="text-2xl font-bold text-gray-900">{slides.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Slides</p>
              <p className="text-2xl font-bold text-gray-900">
                {slides.filter(slide => slide.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold">B</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Banner Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {slides.filter(slide => slide.isActive).length > 0 ? 'Live' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slides List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Banner Slides</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {slides.map((slide) => (
            <div key={slide.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-12 rounded-lg overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{slide.title}</h3>
                  <p className="text-sm text-gray-500">{slide.subtitle}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      slide.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">Order: {slide.order}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleActive(slide.id)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    slide.isActive
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {slide.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEditSlide(slide)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <BannerSlideModal
          slide={editingSlide}
          onSave={handleSaveSlide}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSlide(null);
          }}
        />
      )}
    </div>
  );
}

// Modal Component
const BannerSlideModal = ({ 
  slide, 
  onSave, 
  onClose 
}: { 
  slide: BannerSlide | null;
  onSave: (slideData: Omit<BannerSlide, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState<Omit<BannerSlide, 'id' | 'createdAt' | 'updatedAt'>>({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    image: slide?.image || '',
    link: slide?.link || '',
    buttonText: slide?.buttonText || '',
    isActive: slide?.isActive ?? true,
    order: slide?.order || 1
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('File too large. Maximum size is 5MB.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const token = localStorage.getItem('admin_token');
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataUpload,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const data = await response.json();
      setFormData({ ...formData, image: data.url });
    } catch (err: unknown) {
      console.error('Upload error:', err);
      setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {slide ? 'Edit Banner Slide' : 'Create New Banner Slide'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <textarea
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner Image
            </label>
            
            {/* Image Preview */}
            {formData.image && (
              <div className="mb-3 relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
                <Image
                  src={formData.image}
                  alt="Banner preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Upload Button */}
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {/* Or use URL */}
              <span className="text-sm text-gray-500">or</span>
              
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter image URL"
              />
            </div>

            {uploadError && (
              <p className="mt-2 text-sm text-red-600">{uploadError}</p>
            )}
            
            <p className="mt-2 text-xs text-gray-500">
              Upload an image (max 5MB) or enter an image URL
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link URL
            </label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="/collections or https://example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Button Text
            </label>
            <input
              type="text"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 cursor-pointer">
                Active
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors cursor-pointer"
            >
              {slide ? 'Update Slide' : 'Create Slide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
