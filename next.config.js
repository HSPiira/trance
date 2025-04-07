/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
    },
    experimental: {
        serverActions: true,
    },
    output: 'standalone',
}

module.exports = nextConfig 