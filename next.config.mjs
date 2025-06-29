/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
    ],
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/city-api/:path*',
        destination: 'https://mapadacultura.com/city-api/:path*',
      },
    ];
  },
};

export default nextConfig;
