import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos are resized by the Unsplash CDN directly — see src/lib/image-loader.ts.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
};

export default nextConfig;
