import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server-auth'

export async function GET() {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            )
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
                isDeleted: user.isDeleted
            }
        })
    } catch (error) {
        console.error('Error in /api/auth/me:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 