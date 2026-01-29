export interface UploadResponse {
  success: boolean;
  url?: string;
  fileName?: string;
  path?: string;
  error?: string;
}

export interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  accept?: string;
  maxSize?: number; // in bytes
}

export type FileType = 'image' | 'video' | 'document';

export interface UploadedFile {
  url: string;
  fileName: string;
  path: string;
  fileType: FileType;
  size: number;
  uploadedAt: Date;
}
