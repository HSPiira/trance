import type { SignOptions } from 'jsonwebtoken'

// JWT configuration
export const JWT_CONFIG = {
    secret: process.env['JWT_SECRET'] || 'hope_app_secret_key_2024',
    expiry: '7d', // 7 days in string format for jose
}

// Log configuration during module load
console.log('Loading JWT configuration:')
console.log('JWT_SECRET is set:', !!JWT_CONFIG.secret)
console.log('Using secret:', JWT_CONFIG.secret) 