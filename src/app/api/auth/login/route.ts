import { NextRequest, NextResponse } from 'next/server'
import { comparePasswords, generateToken, createAuditLog } from '@/lib/auth'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'
import { UserStatus } from '@/lib/db/schema'

// Login schema
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
})

export async function POST(request: NextRequest) {
    try {
        console.log('Login API route called')
        const body = await request.json()
        console.log('Login request body:', { email: body.email, password: '[REDACTED]' })

        // Validate login data
        const loginData = loginSchema.parse({
            email: body.email,
            password: body.password,
        })
        console.log('Login data validated')

        // Find user
        console.log('Finding user with email:', loginData.email)
        const user = await prisma.user.findUnique({
            where: { email: loginData.email },
            include: {
                clientProfile: true,
                counsellorProfile: true,
                adminProfile: true,
                orgContactProfile: true,
            },
        })
        console.log('User found:', user ? 'Yes' : 'No')

        if (!user) {
            console.log('User not found, returning 401')
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Check password
        console.log('Checking password')
        const isPasswordValid = await comparePasswords(loginData.password, user.password)
        console.log('Password valid:', isPasswordValid)

        if (!isPasswordValid) {
            console.log('Password invalid, returning 401')
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Check if user is active
        console.log('Checking user status:', user.status)
        if (user.status !== UserStatus.ACTIVE) {
            console.log('User not active, returning 403')
            return NextResponse.json(
                { error: 'Your account is not active. Please contact support.' },
                { status: 403 }
            )
        }

        // Create audit log
        console.log('Creating audit log')
        await createAuditLog(user.id, 'LOGIN')

        // Generate token
        console.log('Generating token')
        const token = generateToken(user)

        // Set cookie
        console.log('Setting cookie and returning response')
        const response = NextResponse.json(
            {
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    profile: user.clientProfile || user.counsellorProfile || user.adminProfile || user.orgContactProfile,
                }
            },
            { status: 200 }
        )

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Failed to login' },
            { status: 500 }
        )
    }
} 