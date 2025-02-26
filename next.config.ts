import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { 
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arbeits-cafe.b-cdn.net',
      },
      {
        protocol: 'https',
        hostname: 'twelve.tools',
      },
      {
        protocol: 'https',
        hostname: 'startupfa.me',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/stats/:match*',
        destination: 'https://umami.mathias.rocks/:match*'
      },
    ]
  },
};

export default nextConfig;
