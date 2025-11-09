import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
  reactStrictMode: false,
  swcMinify: true,
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "",
  assetPrefix: process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "",
};

export default nextConfig;
