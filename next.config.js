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
  async rewrites() {
    return [
      {
        source: '/stats/:match*',
        destination: 'https://umami.mathias.rocks/:match*'
      },
    ]
  },
};

module.exports = nextConfig;
