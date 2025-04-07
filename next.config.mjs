/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Modern output configuration
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  // Turbopack optimizations
  experimental: {
    // Performance improvements
    webpackBuildWorker: true,
    // Modern features
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
    },
    // Turbopack specific optimizations
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  // Server external packages (moved from experimental)
  serverExternalPackages: [],
}

export default nextConfig
