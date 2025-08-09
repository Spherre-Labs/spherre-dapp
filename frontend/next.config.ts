import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Simple allowlist
    domains: ['coin-images.coingecko.com', 'api.dicebear.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        // Match Dicebear Avataaars with any seed query
        pathname: '/9.x/avataaars/png',
        search: '?seed=*',
      },
    ],
  },
}

export default nextConfig
