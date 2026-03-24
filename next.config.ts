import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static generation for pages that need runtime env vars
  output: 'standalone',
};

export default nextConfig;
