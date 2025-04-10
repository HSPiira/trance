import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/server-auth'
import { prisma } from '@/lib/db/prisma'
import { Prisma } from '@prisma/client'
import { z } from 'zod'
import { UserRole } from '@prisma/client'

// Registration schema with strict validation
const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phoneNumber: z.string().optional(),
    role: z.nativeEnum(UserRole, {
        errorMap: () => ({ message: 'Invalid role selected' })
    }),
    clientType: z.string().optional(),
}).strict().refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json()

        // Validate using zod schema
        const result = registerSchema.safeParse(body)
        if (!result.success) {
            console.log('Validation failed:', result.error)
            return NextResponse.json(
                { error: 'Validation error', details: result.error.issues },
                { status: 400 }
            )
        }

        const data = result.data

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (existingUser) {
            console.log('User already exists:', data.email)
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await hashPassword(data.password)
        console.log('Password hashed successfully')

        // Create user data with proper typing
        const userData: Prisma.UserCreateInput = {
            email: data.email,
            password: hashedPassword,
            role: data.role,
            name: `${data.firstName} ${data.lastName}`,
            isDeleted: false
        }

        // Use a transaction to ensure both operations succeed or fail together
        await prisma.$transaction(async (tx) => {
            // Create user
            const user = await tx.user.create({ data: userData })

            // Create audit log
            await tx.auditLog.create({
                data: {
                    userId: user.id,
                    action: 'REGISTER',
                    entityType: 'USER',
                    entityId: user.id,
                    details: Prisma.JsonNull,
                }
            });
        });

        // Return success response without setting token cookie
        return NextResponse.json({
            message: 'Registration successful. Please log in to continue.',
            redirectUrl: '/auth/login'
        }, { status: 201 });

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