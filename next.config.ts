import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/webp", "image/avif"] },
};

export default config;
