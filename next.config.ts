import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        // CycleCare landing visuals (lib/landing/cyclecare.ts) until they
        // are self-hosted in public/lp/cyclecare/.
        protocol: "https",
        hostname: "biodfert.vercel.app",
        pathname: "/images/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
