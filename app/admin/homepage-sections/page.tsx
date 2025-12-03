'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const transformedSections = data.sections.map((section: any) => ({
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
      } catch (err: any) {
        console.error('Error fetching homepage sections:', err);
        setError(err.message || 'Failed to load homepage sections');
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

      const response = await fetch(`/api/admin/homepage-sections/${editingSection?.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update homepage section');
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

      setSections(prev => prev.map(s => s.id === editingSection?.id ? transformedSection : s));
      setIsModalOpen(false);
      setEditingSection(null);
    } catch (err: any) {
      alert(err.message || 'Failed to save homepage section');
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
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingSection && (
        <HomepageSectionModal
          section={editingSection}
          onSave={handleSaveSection}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSection(null);
          }}
        />
      )}
    </div>
  );
}

// Modal Component
function HomepageSectionModal({
  section,
  onSave,
  onClose,
}: {
  section: HomepageSection;
  onSave: (sectionData: Omit<HomepageSection, 'id'>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Omit<HomepageSection, 'id'>>({
    section_key: section.section_key,
    title: section.title,
    subtitle: section.subtitle,
    description: section.description,
    image: section.image,
    link: section.link,
    productCount: section.productCount,
    isActive: section.isActive,
    displayOrder: section.displayOrder,
    gradient: section.gradient,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Homepage Section</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Key
            </label>
            <input
              type="text"
              value={formData.section_key}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">Section key cannot be changed</p>
          </div>

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
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {formData.image && (
              <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={formData.image}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link URL
            </label>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.productCount}
                onChange={(e) => setFormData({ ...formData, productCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gradient Color (CSS class)
            </label>
            <input
              type="text"
              value={formData.gradient}
              onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
              placeholder="bg-gradient-to-br from-purple-500 to-pink-500"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Update Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

