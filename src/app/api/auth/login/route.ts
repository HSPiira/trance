import { NextRequest, NextResponse } from 'next/server'
import { comparePasswords, generateToken, createAuditLog } from '@/lib/server-auth'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

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
            where: { email: loginData.email }
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

        // Check if user is deleted
        console.log('Checking if user is deleted:', user.isDeleted)
        if (user.isDeleted) {
            console.log('User is deleted, returning 403')
            return NextResponse.json(
                { error: 'Your account has been deleted. Please contact support.' },
                { status: 403 }
            )
        }

        // Create audit log
        console.log('Creating audit log')
        await createAuditLog(user.id, 'LOGIN')

        // Generate token
        console.log('Generating token')
        const token = await generateToken(user)
        console.log('Token generated:', token.substring(0, 20) + '...')
        console.log('JWT_SECRET is set:', !!process.env['JWT_SECRET'])

        // Set cookie
        console.log('Setting cookie and returning response')
        const redirectUrl = `/${user.role.toLowerCase()}/dashboard`
        const response = NextResponse.json(
            {
                message: 'Login successful',
                redirectUrl,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    avatar: user.avatar
                }
            },
            { status: 200 }
        )

        // Set cookie with additional options
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })

        // Verify cookie was set
        const cookies = response.cookies.getAll()
        console.log('All cookies after setting:', cookies)
        console.log('Token cookie value:', response.cookies.get('token'))

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Failed to login' },
            { status: 500 }
        )
    }
} 