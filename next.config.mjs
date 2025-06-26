/** @type {import('next').NextConfig} */
const nextConfig = {
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
