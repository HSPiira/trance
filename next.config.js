/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
            allowedOrigins: ['localhost:3000'],
        },
        turbo: {
            rules: {
                // Opt-out of the default rules
                '**/*': [],
            },
        },
    },
    output: 'standalone',
    // Add logging to debug environment variables
    webpack: (config, { isServer }) => {
        if (isServer) {
            console.log('Next.js Environment Variables:')
            console.log('JWT_SECRET:', process.env.JWT_SECRET)
            console.log('DATABASE_URL:', process.env.DATABASE_URL)
        }
        return config
    },
}

// Log environment variables during config load
console.log('Loading Next.js config with environment variables:')
console.log('JWT_SECRET:', process.env.JWT_SECRET)
console.log('DATABASE_URL:', process.env.DATABASE_URL)

module.exports = nextConfig 