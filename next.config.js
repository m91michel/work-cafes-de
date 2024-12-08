/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { 
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arbeits-cafe.b-cdn.net',
      },
    ],
  },
};

module.exports = nextConfig;
