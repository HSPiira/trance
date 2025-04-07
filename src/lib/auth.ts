import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './db/prisma'
import { create } from 'zustand'
import type { User } from '@prisma/client'

// JWT secret should be in environment variables
const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key'
const TOKEN_EXPIRY = '7d' // 7 days

interface AuthState {
    user: User | null
    setUser: (user: User | null) => void
    logout: () => Promise<void>
}

export const useAuth = create<AuthState>()((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            })
            set({ user: null })
        } catch (error) {
            console.error('Logout failed:', error)
        }
    },
}))

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
export function generateToken(user: User): string {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        JWT_SECRET,
        { expiresIn: TOKEN_EXPIRY }
    )
}

// Verify a JWT token
export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

// Get the current user from the request
export async function getCurrentUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
        return null
    }

    const decoded = verifyToken(token)
    if (!decoded) {
        return null
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: {
            clientProfile: true,
            counsellorProfile: true,
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