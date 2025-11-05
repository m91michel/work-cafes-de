import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for optimized Docker image
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
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
      },
      {
        protocol: 'https',
        hostname: 'fazier.com',
      },
    ],
  },
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ]
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
