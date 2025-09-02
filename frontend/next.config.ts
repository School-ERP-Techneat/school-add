import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Matches any HTTPS domain
        pathname: "/**", // Matches any path
      },
    ],
  },
};

export default nextConfig;
