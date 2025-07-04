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
      {
        protocol: 'https',
        hostname: 'mapacultural.saojosedobonfim.pb.gov.br',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'teste.mapadacultura.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
    domains: ['localhost', 'mapacultural.saojosedobonfim.pb.gov.br', 'teste.mapadacultura.com'],
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
