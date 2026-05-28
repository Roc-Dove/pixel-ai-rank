import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.aicpb.com" },
      { protocol: "https", hostname: "aicpb.com" },
      { protocol: "https", hostname: "image.uisdc.com" },
      { protocol: "https", hostname: "kol.xhunt.ai" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "cdn.xhunt.ai" },
    ],
  },
  serverExternalPackages: ["@prisma/client", "prisma", "puppeteer-core", "@sparticuz/chromium"],
};

export default nextConfig;
