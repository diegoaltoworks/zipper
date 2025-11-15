import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  output: 'export',  // Enable static export
  basePath: isProd ? basePath : '',
  assetPrefix: isProd ? basePath : '',
  images: {
    unoptimized: true,  // Required for static export
  },
  trailingSlash: true,  // Ensures all paths end with /
};

export default nextConfig;
