import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async redirects() {
    return [
      { source: '/agb',         destination: '/terms',      permanent: true },
      { source: '/datenschutz', destination: '/privacy',    permanent: true },
      { source: '/impressum',   destination: '/legal',      permanent: true },
      { source: '/widerruf',    destination: '/withdrawal', permanent: true },
    ]
  },
}

export default nextConfig
