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
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                profile: user.clientProfile || user.counsellorProfile,
            },
        })
    } catch (error) {
        console.error('Get current user error:', error)
        return NextResponse.json(
            { error: 'Failed to get user' },
            { status: 500 }
        )
    }
} 