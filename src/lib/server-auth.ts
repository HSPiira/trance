import { cookies } from 'next/headers'
import * as jose from 'jose'
import { prisma } from './db'
import type { User } from '@prisma/client'
import { JWT_CONFIG } from './config'
import { NextRequest } from 'next/server'

// Hash a password using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Buffer.from(hash).toString('base64');
}

// Compare a password with a hash
export async function comparePasswords(
    password: string,
    hash: string
): Promise<boolean> {
    const hashedPassword = await hashPassword(password);
    return hashedPassword === hash;
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
            documents: true,
            messages: true,
            notes: true,
            resources: true,
            sessions: true,
        }
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
            documents: true,
            messages: true,
            notes: true,
            resources: true,
            sessions: true,
        }
    })

    return user
}

// Create an audit log entry
export async function createAuditLog(userId: string, action: string, details?: any) {
    const data = {
        userId,
        action,
        entityType: 'USER',
        entityId: userId,
        details: details || null,
    };

    // Using raw query to insert audit log
    await prisma.$executeRaw`
        INSERT INTO "AuditLog" ("userId", "action", "entityType", "entityId", "details", "createdAt")
        VALUES (${userId}, ${action}, ${data.entityType}, ${data.entityId}, ${JSON.stringify(details)}, NOW())
    `;

    return true;
}