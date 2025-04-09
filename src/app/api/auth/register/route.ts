import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, generateToken, createAuditLog } from '@/lib/server-auth'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'
import { UserRole } from '@prisma/client'

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
        // Log the raw request
        console.log('Registration request received')

        const body = await request.json()
        console.log('Request body:', JSON.stringify(body, null, 2))

        // Log the validation attempt
        console.log('Validating request body against schema')
        const result = registerSchema.safeParse(body)

        if (!result.success) {
            console.error('Validation failed:', JSON.stringify(result.error.issues, null, 2))
            return NextResponse.json(
                { error: 'Validation error', details: result.error.issues },
                { status: 400 }
            )
        }

        console.log('Validation successful, data:', JSON.stringify(result.data, null, 2))
        const data = result.data

        // Check if passwords match if confirmPassword is provided
        if (data.confirmPassword && data.password !== data.confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            )
        }

        // Check if user already exists
        console.log('Checking if user already exists with email:', data.email)
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        })

        if (existingUser) {
            console.log('User already exists with email:', data.email)
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            )
        }

        // Hash password
        console.log('Hashing password')
        const hashedPassword = await hashPassword(data.password)

        // Combine firstName and lastName into name
        const fullName = `${data.firstName} ${data.lastName}`

        // Create user
        console.log('Creating user with data:', JSON.stringify({
            email: data.email,
            name: fullName,
            role: data.role,
            isDeleted: false,
        }, null, 2))

        // Use a type assertion to bypass the type checking issue
        const user = await prisma.user.create({
            data: {
                email: data.email,
                name: fullName,
                role: data.role,
                password: hashedPassword,
                isDeleted: false,
            } as any,
        })

        console.log('User created successfully with ID:', user.id)

        // Generate token
        console.log('Generating token')
        const token = await generateToken(user)

        // Create audit log
        console.log('Creating audit log')
        await createAuditLog(user.id, 'REGISTER')

        // Remove sensitive information
        const { password: _, ...userWithoutPassword } = user

        // Set cookie and return response
        console.log('Registration successful, returning response')
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