import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow all hostnames
        pathname: "/**", // allow all paths
      },
      {
        protocol: "http",
        hostname: "**", // also allow non-HTTPS if needed
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
