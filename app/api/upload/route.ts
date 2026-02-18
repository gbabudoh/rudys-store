import { NextRequest, NextResponse } from 'next/server';
import { minioClient, BUCKET_NAME } from '@/lib/minio-client';
import { v4 as uuidv4 } from 'uuid';
import { UploadResponse } from '@/types/upload';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File too large' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const folder = file.type.startsWith('video/') ? 'videos' : 'products';
    const filePath = `${folder}/${fileName}`;

    // Upload to MinIO
    await minioClient.putObject(
      BUCKET_NAME,
      filePath,
      buffer,
      buffer.length,
      {
        'Content-Type': file.type,
      }
    );

    // Generate URL using public domain
    const publicBaseUrl = process.env.MINIO_PUBLIC_URL || `https://www.ruddysstore.com/minio`;
    const fileUrl = `${publicBaseUrl}/${BUCKET_NAME}/${filePath}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      path: filePath
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
