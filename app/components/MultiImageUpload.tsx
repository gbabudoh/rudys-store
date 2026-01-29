'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';

interface MultiImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  maxImages?: number;
}

export default function MultiImageUpload({ 
  onImagesChange, 
  maxImages = 5 
}: MultiImageUploadProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleUploadSuccess = (url: string) => {
    const newUrls = [...imageUrls, url];
    setImageUrls(newUrls);
    onImagesChange(newUrls);
  };

  const removeImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    onImagesChange(newUrls);
  };

  return (
    <div className="space-y-4">
      {imageUrls.length < maxImages && (
        <ImageUpload onUploadSuccess={handleUploadSuccess} />
      )}
      
      <div className="grid grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <div key={url} className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={url} 
              alt={`Upload ${index + 1}`} 
              className="w-full h-32 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <p className="text-sm text-gray-500">
        {imageUrls.length} / {maxImages} images uploaded
      </p>
    </div>
  );
}
