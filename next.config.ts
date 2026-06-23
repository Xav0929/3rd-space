import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["sharp"],
  // Sharp's native libvips binary (.so file) is loaded via dlopen() at
  // runtime, not a static require/import — so Next.js's output file
  // tracer doesn't know to bundle it into the deployed function. Works
  // fine locally (nothing gets pruned), but on Vercel the binary gets
  // left out of the function, causing ERR_DLOPEN_FAILED. This forces
  // it to be included.
  outputFileTracingIncludes: {
    "/api/upload": ["./node_modules/@img/**/*"],
  },
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
