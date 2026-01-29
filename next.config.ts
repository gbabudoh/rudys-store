import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        // imgproxy server
        protocol: 'http',
        hostname: '149.102.128.35',
        port: '8080',
        pathname: '/**',
      },
      {
        // MinIO server (direct access if needed)
        protocol: 'http',
        hostname: '149.102.128.35',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
