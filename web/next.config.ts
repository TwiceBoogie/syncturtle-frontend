import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // transpilePackages: ["@syncturtle/ui"],
  trailingSlash: true,
  // reactStrictMode: false,
  // swcMinify: true,
  // output: "standalone",
  async rewrites() {
    const rewrites = [];
    if (process.env.NEXT_PUBLIC_ADMIN_BASE_URL || process.env.NEXT_PUBLIC_ADMIN_BASE_PATH) {
      const ADMIN_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_BASE_URL || "";
      const ADMIN_BASE_PATH = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "";
      const GOD_MODE_BASE_URL = ADMIN_BASE_URL + ADMIN_BASE_PATH;
      rewrites.push({
        source: "/god-mode",
        destination: `${GOD_MODE_BASE_URL}/`,
      });
      rewrites.push({
        source: "/god-mode/:path*",
        destination: `${GOD_MODE_BASE_URL}/:path*`,
      });
    }
    return rewrites;
  },
  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },
};

export default nextConfig;
