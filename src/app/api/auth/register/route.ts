import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, generateToken, createAuditLog } from '@/lib/server-auth'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'
import { Prisma, UserRole } from '@prisma/client'

// Registration schema with strict validation
const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().optional(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phoneNumber: z.string().optional(),
    role: z.nativeEnum(UserRole),
    clientType: z.string().optional(),
}).strict()

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const result = registerSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation error', details: result.error.issues },
                { status: 400 }
            )
        }

        const data = result.data

        // Check if passwords match if confirmPassword is provided
        if (data.confirmPassword && data.password !== data.confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            )
        }

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

        // Create user data with proper typing
        const userData: Prisma.UserCreateInput = {
            email: data.email,
            password: hashedPassword,
            role: data.role,
            name: `${data.firstName} ${data.lastName}`,
            isDeleted: false // Ensure required field is included
        }

        // Create user
        const user = await prisma.user.create({ data: userData })

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