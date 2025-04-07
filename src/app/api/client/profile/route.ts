import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getUserFromRequest } from '@/lib/server-auth'
import { UserRole, clientProfileSchema } from '@/lib/db/schema'

// GET - Fetch client profile
export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if the user is a client or admin (admins can view client profiles)
        if (user.role !== UserRole.CLIENT && user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: 'Access forbidden' }, { status: 403 })
        }

        // Extract userId from query params if an admin is requesting a specific client profile
        const url = new URL(req.url)
        let userId = user.id

        if (user.role === UserRole.ADMIN) {
            const requestedUserId = url.searchParams.get('userId')
            if (requestedUserId) {
                userId = requestedUserId
            }
        }

        // Find the client profile
        const clientProfile = await prisma.clientProfile.findUnique({
            where: { userId: userId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phoneNumber: true,
                        status: true,
                        createdAt: true,
                    }
                }
            }
        })

        if (!clientProfile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }

        return NextResponse.json({ profile: clientProfile }, { status: 200 })
    } catch (error) {
        console.error('Error retrieving client profile:', error)
        return NextResponse.json({ error: 'Failed to retrieve profile' }, { status: 500 })
    }
}

// PATCH - Update client profile
export async function PATCH(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if the user is a client or admin (only they can update profiles)
        if (user.role !== UserRole.CLIENT && user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: 'Access forbidden' }, { status: 403 })
        }

        const data = await req.json()

        // Extract the target userId - if admin, they can update any user's profile
        let targetUserId = user.id
        if (user.role === UserRole.ADMIN && data.userId) {
            targetUserId = data.userId
            // Remove userId from data to prevent changing the association
            delete data.userId
        }

        // Prevent changing clientType unless an admin
        if (user.role !== UserRole.ADMIN && data.clientType) {
            delete data.clientType
        }

        // Validate the data
        try {
            // We only validate the allowed fields, not the complete schema
            const allowedFields = user.role === UserRole.ADMIN
                ? clientProfileSchema.omit({ id: true, userId: true, createdAt: true, updatedAt: true })
                : clientProfileSchema.omit({ id: true, userId: true, clientType: true, createdAt: true, updatedAt: true });

            allowedFields.parse(data);
        } catch (validationError) {
            return NextResponse.json({ error: 'Invalid data', details: validationError }, { status: 400 })
        }

        // Find the client profile
        const existingProfile = await prisma.clientProfile.findUnique({
            where: { userId: targetUserId }
        })

        if (!existingProfile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        }

        // Update the profile
        const updatedProfile = await prisma.clientProfile.update({
            where: { userId: targetUserId },
            data: {
                ...data,
                updatedAt: new Date()
            }
        })

        return NextResponse.json({ profile: updatedProfile }, { status: 200 })
    } catch (error) {
        console.error('Error updating client profile:', error)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
} 