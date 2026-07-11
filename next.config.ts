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
      { protocol: "https", hostname: "www.google.com", pathname: "/s2/favicons**" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "unavatar.io" },
    ],
  },
};

export default nextConfig;
