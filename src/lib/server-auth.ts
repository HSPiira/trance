import { cookies } from 'next/headers'
import * as jose from 'jose'
import bcrypt from 'bcryptjs'
import { prisma } from './db/prisma'
import type { User } from '@prisma/client'
import { JWT_CONFIG } from './config'
import { NextRequest } from 'next/server'

// Hash a password
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

// Compare a password with a hash
export async function comparePasswords(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

// Generate a JWT token
export async function generateToken(user: User): Promise<string> {
    try {
        console.log('Generating token with secret:', JWT_CONFIG.secret)
        const secret = new TextEncoder().encode(JWT_CONFIG.secret)

        return await new jose.SignJWT({
            id: user.id,
            email: user.email,
            role: user.role,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(secret)
    } catch (error) {
        console.error('Token generation error:', error)
        throw error
    }
}

// Verify a JWT token
export async function verifyToken(token: string): Promise<any> {
    try {
        console.log('Verifying token with secret:', JWT_CONFIG.secret)
        const secret = new TextEncoder().encode(JWT_CONFIG.secret)
        const { payload } = await jose.jwtVerify(token, secret)
        return payload
    } catch (error) {
        console.error('Token verification error:', error)
        return null
    }
}

// Get user from an API request
export async function getUserFromRequest(req: NextRequest): Promise<User | null> {
    // First try to get the token from the cookie
    const cookieToken = req.cookies.get('token')?.value

    // If not in cookie, try Authorization header
    const authHeader = req.headers.get('Authorization')
    const headerToken = authHeader?.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null

    // Use whichever token we found
    const token = cookieToken || headerToken

    if (!token) {
        return null
    }

    // Verify the token
    const decoded = await verifyToken(token)
    if (!decoded || !decoded.id) {
        return null
    }

    // Get the user from the database
    const user = await prisma.user.findUnique({
        where: { id: decoded.id as string },
        include: {
            clientProfile: true,
            counsellorProfile: true,
            adminProfile: true,
        },
    })

    return user
}

// Get the current user from the request
export async function getCurrentUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
        return null
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
        return null
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.id as string },
        include: {
            clientProfile: true,
            counsellorProfile: true,
            adminProfile: true,
        },
    })

    return user
}

// Create an audit log entry
export async function createAuditLog(userId: string, action: string) {
    return prisma.auditLog.create({
        data: {
            action,
            entityType: 'USER',
            entityId: userId,
            createdById: userId,
        },
    })
} 