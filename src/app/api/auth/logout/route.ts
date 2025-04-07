import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, createAuditLog } from '@/lib/auth'

export async function POST(request: NextRequest) {
    try {
        // Get current user
        const user = await getCurrentUser()

        if (user) {
            // Create audit log
            await createAuditLog(user.id, 'LOGOUT')
        }

        // Clear token cookie
        const response = NextResponse.json(
            { message: 'Logged out successfully' },
            { status: 200 }
        )

        response.cookies.delete('token')

        return response
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json(
            { error: 'Failed to logout' },
            { status: 500 }
        )
    }
} 