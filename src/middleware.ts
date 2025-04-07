import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/server-auth'
import type { UserRole } from '@prisma/client'

// Define protected routes and their allowed roles
const protectedRoutes = [
    {
        path: '/client/dashboard',
        roles: ['CLIENT'] as UserRole[],
    },
    {
        path: '/counsellor/dashboard',
        roles: ['COUNSELLOR'] as UserRole[],
    },
    {
        path: '/admin/dashboard',
        roles: ['ADMIN'] as UserRole[],
    },
    {
        path: '/org/dashboard',
        roles: ['ORG_CONTACT'] as UserRole[],
    },
    {
        path: '/client',
        roles: ['CLIENT'] as UserRole[],
    },
    {
        path: '/counsellor',
        roles: ['COUNSELLOR'] as UserRole[],
    },
    {
        path: '/admin',
        roles: ['ADMIN'] as UserRole[],
    },
    {
        path: '/org',
        roles: ['ORG_CONTACT'] as UserRole[],
    },
]

export async function middleware(request: NextRequest) {
    try {
        const response = NextResponse.next()
        const path = request.nextUrl.pathname

        console.log('Middleware - Path:', path)

        // Add security headers
        response.headers.set('X-DNS-Prefetch-Control', 'on')
        response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
        response.headers.set('X-XSS-Protection', '1; mode=block')
        response.headers.set('X-Frame-Options', 'SAMEORIGIN')
        response.headers.set('X-Content-Type-Options', 'nosniff')
        response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

        // Skip middleware for public routes and API routes
        if (
            path === '/' ||
            path.startsWith('/login') ||
            path.startsWith('/register') ||
            path.startsWith('/unauthorized') ||
            path.startsWith('/api/') ||
            path.startsWith('/_next/') ||
            path.startsWith('/public/') ||
            path.startsWith('/favicon') ||
            path.endsWith('.png') ||
            path.endsWith('.ico') ||
            path.endsWith('.webmanifest')
        ) {
            console.log('Middleware - Skipping public route')
            return response
        }

        // Get token from cookie
        const token = request.cookies.get('token')?.value
        console.log('Middleware - Token present:', !!token)

        if (!token) {
            console.log('Middleware - No token, redirecting to login')
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Verify token
        const payload = await verifyToken(token)
        console.log('Middleware - Token payload:', payload)

        if (!payload) {
            console.log('Middleware - Invalid token, redirecting to login')
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Check if user has required role for the path
        const protectedRoute = protectedRoutes.find(route => path.startsWith(route.path))
        console.log('Middleware - Protected route:', protectedRoute)

        if (protectedRoute && !protectedRoute.roles.includes(payload.role as UserRole)) {
            console.log('Middleware - Unauthorized role, redirecting')
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }

        console.log('Middleware - Access granted')
        return response
    } catch (error) {
        console.error('Middleware error:', error)
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
} 