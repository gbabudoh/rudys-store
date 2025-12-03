import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    const [width, height] = params.params;
    const w = parseInt(width) || 300;
    const h = parseInt(height) || 300;
    
    // Create a simple SVG placeholder
    const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8fafc"/>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#gradient)"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f1f5f9;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#e2e8f0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#cbd5e1;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50%" cy="40%" r="20" fill="#94a3b8" opacity="0.3"/>
      <text x="50%" y="60%" text-anchor="middle" dy=".3em" font-family="system-ui, -apple-system, sans-serif" font-size="${Math.min(w, h) / 20}" fill="#64748b" font-weight="500">
        ${w} × ${h}
      </text>
    </svg>`;

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Placeholder API error:', error);
    return new NextResponse('Error generating placeholder', { status: 500 });
  }
}
