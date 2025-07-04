/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['randomuser.me', 'localhost', 'mapacultural.gestorcultural.com.br', 'mapacultural.saojosedobonfim.pb.gov.br', 'teste.mapadacultura.com'],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mapacultural.gestorcultural.com.br',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'mapacultural.saojosedobonfim.pb.gov.br',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'teste.mapadacultura.com',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig