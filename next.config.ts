import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BUILD_TIME: new Date().toISOString(),
  },
};

export default nextConfig;
