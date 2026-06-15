import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["sharp"],
  async rewrites() {
    return [
      {
        source: "/cdn/:path*",
        destination:
          "https://pub-9f10feaff9e04a53b72e9a2d79b24eaa.r2.dev/:path*",
      },
    ];
  },
};

export default nextConfig;
