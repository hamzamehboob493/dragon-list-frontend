import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  darkMode: "class",
  images: {
    domains: ["images.pexels.com", "dummyjson.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
    ],
  },
};

export default nextConfig;
