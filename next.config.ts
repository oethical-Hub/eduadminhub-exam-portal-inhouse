import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Remove standalone for simpler Render deployment
  // If you want to use standalone, uncomment the line below and update startCommand in render.yaml
  // output: "standalone",
};

export default nextConfig;

