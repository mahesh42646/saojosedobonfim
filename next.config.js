/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['randomuser.me', 'localhost', 'mapacultural.saojosedobonfim.pb.gov.br', 'mapacultural.saojosedobonfim.pb.gov.br'],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mapacultural.saojosedobonfim.pb.gov.br',
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