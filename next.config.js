/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['randomuser.me', 'localhost', 'mapacultural.gestorcultural.com.br'],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mapacultural.gestorcultural.com.br',
        pathname: '/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig