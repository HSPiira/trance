import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, generateToken, createAuditLog } from '@/lib/server-auth'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'
import type { UserRole, UserStatus, ClientType } from '@prisma/client'

// Registration schema
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phoneNumber: z.string().nullable(),
    role: z.enum(['CLIENT', 'COUNSELLOR', 'ADMIN'] as [UserRole, UserRole, UserRole]),
    clientType: z.enum(['PRIMARY', 'SECONDARY'] as [ClientType, ClientType]).optional(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const data = registerSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                role: data.role,
                status: 'ACTIVE' as UserStatus,
            },
        })

        // Create profile based on role
        if (data.role === 'CLIENT') {
            if (!data.clientType) {
                return NextResponse.json(
                    { error: 'Client type is required' },
                    { status: 400 }
                )
            }

            await prisma.clientProfile.create({
                data: {
                    userId: user.id,
                    clientType: data.clientType,
                },
            })
        } else if (data.role === 'COUNSELLOR') {
            await prisma.counsellorProfile.create({
                data: {
                    userId: user.id,
                },
            })
        } else if (data.role === 'ADMIN') {
            await prisma.adminProfile.create({
                data: {
                    userId: user.id,
                },
            })
        }

        // Generate token
        const token = await generateToken(user)

        // Create audit log
        await createAuditLog(user.id, 'REGISTER')

        // Remove sensitive information
        const { password: _, ...userWithoutPassword } = user

        // Set cookie and return response
        const response = NextResponse.json({ user: userWithoutPassword })
        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        })

        return response
    } catch (error) {
        console.error('Registration error:', error)
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 