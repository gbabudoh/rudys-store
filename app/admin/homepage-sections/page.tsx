'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SuccessModal from '@/app/components/SuccessModal';
import ImageUpload from '@/app/components/ImageUpload';
import ConfirmModal from '@/app/components/ConfirmModal';

const Plus = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const Trash = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);


const Edit = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

interface HomepageSection {
  id: string;
  section_key: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  productCount: number;
  isActive: boolean;
  displayOrder: number;
  gradient: string;
}

export default function HomepageSectionsManagement() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [deletingSection, setDeletingSection] = useState<HomepageSection | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch sections from API
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/admin/homepage-sections', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch homepage sections');
        }

        const data = await response.json();
        // Transform database format to component format
        const transformedSections = data.sections.map((section: {
          id: number;
          section_key: string;
          title: string;
          subtitle?: string;
          description?: string;
          image_url?: string;
          link_url?: string;
          product_count?: number;
          is_active: boolean;
          display_order: number;
          gradient_color?: string;
        }) => ({
          id: section.id.toString(),
          section_key: section.section_key,
          title: section.title,
          subtitle: section.subtitle || '',
          description: section.description || '',
          image: section.image_url || '',
          link: section.link_url || '',
          productCount: section.product_count || 0,
          isActive: section.is_active,
          displayOrder: section.display_order,
          gradient: section.gradient_color || '',
        }));
        setSections(transformedSections);
        setError(null);
      } catch (err: unknown) {
        console.error('Error fetching homepage sections:', err);
        setError(err instanceof Error ? err.message : 'Failed to load homepage sections');
        setSections([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleEditSection = (section: HomepageSection) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleCreateSection = () => {
    setEditingSection(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (section: HomepageSection) => {
    setDeletingSection(section);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSection) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/homepage-sections/${deletingSection.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete homepage section');
      }

      setSections(prev => prev.filter(s => s.id !== deletingSection.id));
      setIsDeleteModalOpen(false);
      setDeletingSection(null);
      setSuccessMessage('Section deleted successfully');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete homepage section');
    }
  };

  const handleSaveSection = async (sectionData: Omit<HomepageSection, 'id'>) => {
    try {
      const token = localStorage.getItem('admin_token');
      const payload = {
        section_key: sectionData.section_key,
        title: sectionData.title,
        subtitle: sectionData.subtitle,
        description: sectionData.description,
        image_url: sectionData.image,
        link_url: sectionData.link,
        product_count: sectionData.productCount,
        is_active: sectionData.isActive,
        display_order: sectionData.displayOrder,
        gradient_color: sectionData.gradient,
      };

      let response;
      if (editingSection) {
        // Update existing section
        response = await fetch(`/api/admin/homepage-sections/${editingSection.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new section
        response = await fetch('/api/admin/homepage-sections', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save homepage section');
      }

      const data = await response.json();
      const section = data.section;
      const transformedSection: HomepageSection = {
        id: section.id.toString(),
        section_key: section.section_key,
        title: section.title,
        subtitle: section.subtitle || '',
        description: section.description || '',
        image: section.image_url || '',
        link: section.link_url || '',
        productCount: section.product_count || 0,
        isActive: section.is_active,
        displayOrder: section.display_order,
        gradient: section.gradient_color || '',
      };

      if (editingSection) {
        setSections(prev => prev.map(s => s.id === editingSection.id ? transformedSection : s));
      } else {
        setSections(prev => [...prev, transformedSection]);
      }
      
      setIsModalOpen(false);
      setEditingSection(null);
      setSuccessMessage(`Section ${editingSection ? 'updated' : 'created'} successfully!`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save homepage section');
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
          <h1 className="text-2xl font-bold text-gray-900">Homepage Sections</h1>
          <p className="text-gray-600">Manage the three main category sections on homepage</p>
        </div>
        <button
          onClick={handleCreateSection}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Section
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <ImageIcon className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Sections</p>
              <p className="text-2xl font-bold text-gray-900">{sections.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Sections</p>
              <p className="text-2xl font-bold text-gray-900">
                {sections.filter(s => s.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold">H</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {sections.reduce((sum, s) => sum + s.productCount, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Category Sections</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {sections.map((section) => (
            <div key={section.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  {section.image ? (
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{section.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-1">{section.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      section.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {section.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {section.productCount} products
                    </span>
                    <span className="text-xs text-gray-500">
                      Order: {section.displayOrder}
                    </span>
                    <span className="text-xs text-gray-500">
                      Key: {section.section_key}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditSection(section)}
                  className="p-2 text-gray-400 hover:text-purple-600 transition-colors cursor-pointer"
                  title="Edit Section"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(section)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete Section"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <HomepageSectionModal
          section={editingSection}
          onSave={handleSaveSection}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSection(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Homepage Section"
        message={`Are you sure you want to delete "${deletingSection?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingSection(null);
        }}
        isDestructive={true}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={!!successMessage}
        message={successMessage || ''}
        onClose={() => setSuccessMessage(null)}
      />
    </div>
  );
}

import Modal from '@/app/components/Modal';

// ... (previous code)

// Modal Component
function HomepageSectionModal({
  section,
  onSave,
  onClose,
}: {
  section: HomepageSection | null;
  onSave: (sectionData: Omit<HomepageSection, 'id'>) => void;
  onClose: () => void;
}) {
  // Initialize form data. Use safe defaults for null section.
  const [formData, setFormData] = useState<Omit<HomepageSection, 'id'>>({
    section_key: section?.section_key || '',
    title: section?.title || '',
    subtitle: section?.subtitle || '',
    description: section?.description || '',
    image: section?.image || '',
    link: section?.link || '',
    productCount: section?.productCount || 0,
    isActive: section?.isActive ?? true,
    displayOrder: section?.displayOrder || 0,
    gradient: section?.gradient || '',
  });

  const generateSectionKey = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      // Only auto-generate key if we are creating a new section (no existing section)
      section_key: !section ? generateSectionKey(newTitle) : prev.section_key
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={section ? 'Edit Homepage Section' : 'Create New Homepage Section'}
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Key is hidden and auto-generated */}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
            required
            placeholder="e.g. New Arrivals"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtitle
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
            placeholder="e.g. Fresh styles just for you"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 resize-none"
            rows={3}
            placeholder="Brief description of this section..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Image
          </label>
          <div className="space-y-4">
            {formData.image && (
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm group">
                <Image
                  src={formData.image}
                  alt="Section preview"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-red-600 hover:text-white hover:bg-red-600 transition-all cursor-pointer transform hover:scale-110"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
            
            {!formData.image && (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors bg-gray-50/50">
                <ImageUpload
                  onUploadSuccess={(url) => setFormData({ ...formData, image: url })}
                  maxSize={5 * 1024 * 1024} // 5MB
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Recommended size: 800x600px or larger. Max size: 5MB.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link URL
          </label>
          <input
            type="text"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="e.g., /products/categories or https://example.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              min="0"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-gray-900"
            />
          </div>
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                formData.isActive 
                  ? 'bg-purple-600 border-purple-600' 
                  : 'bg-white border-gray-300 group-hover:border-purple-400'
              }`}>
                {formData.isActive && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">Active Status</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all cursor-pointer shadow-sm"
          >
            {section ? 'Update Section' : 'Create Section'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

