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
    // Add CSP headers
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' 'inline-speculation-rules' chrome-extension://e373f487-540f-42b8-9f3c-a3d6c6ec0fc1/",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: blob:",
                            "connect-src 'self'",
                            "frame-src 'self'",
                        ].join('; ')
                    }
                ]
            }
        ];
    },
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