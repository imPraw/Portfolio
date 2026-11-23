import type { NextConfig } from "next";

const config: NextConfig = {
  agentRules: false,
  poweredByHeader: false,
  images: { formats: ["image/webp", "image/avif"] },
  async headers() {
    return [{
      source: "/media/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
    }];
  },
};

export default config;
