'use client';

import { useState, ChangeEvent } from 'react';
import { ImageUploadProps, UploadResponse } from '@/types/upload';

export default function ImageUpload({ 
  onUploadSuccess, 
  accept = 'image/*,video/*',
  maxSize = 10 * 1024 * 1024,
  label 
}: ImageUploadProps & { label?: string }) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    setError(null);

    // Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }

    // Upload
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data: UploadResponse = await response.json();
      
      if (data.success && data.url) {
        onUploadSuccess(data.url);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
      />
      
      {uploading && (
        <p className="text-sm text-gray-600">Uploading...</p>
      )}
      {!uploading && label && (
        <p className="text-xs text-gray-400 mt-1">{label}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img 
          src={preview} 
          alt="Preview" 
          className="max-w-xs rounded shadow-md" 
        />
      )}
    </div>
  );
}
