import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getUserFromRequest } from '@/lib/server-auth'
import { UserRole, ClientType, sessionBookingSchema, SessionStatus } from '@/lib/db/schema'

// GET - Fetch client sessions (upcoming and past)
export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only clients can view their sessions
        if (user.role !== UserRole.CLIENT) {
            return NextResponse.json({ error: 'Access forbidden' }, { status: 403 })
        }

        // Parse query parameters
        const url = new URL(req.url)
        const status = url.searchParams.get('status') as SessionStatus | null
        const limit = parseInt(url.searchParams.get('limit') || '10')
        const page = parseInt(url.searchParams.get('page') || '1')
        const offset = (page - 1) * limit

        // Get client profile
        const clientProfile = await prisma.clientProfile.findUnique({
            where: { userId: user.id }
        })

        if (!clientProfile) {
            return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
        }

        // Create filter based on params
        const filter: any = {
            clientId: clientProfile.id
        }

        if (status) {
            filter.status = status
        }

        // Get total count for pagination
        const totalCount = await prisma.sessionBooking.count({
            where: filter
        })

        // Get sessions
        const sessions = await prisma.sessionBooking.findMany({
            where: filter,
            include: {
                counsellor: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                dateTime: 'desc'
            },
            skip: offset,
            take: limit
        })

        return NextResponse.json({
            sessions,
            pagination: {
                total: totalCount,
                pages: Math.ceil(totalCount / limit),
                page,
                limit
            }
        }, { status: 200 })
    } catch (error) {
        console.error('Error fetching client sessions:', error)
        return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
    }
}

// POST - Book a new session
export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only clients can book sessions
        if (user.role !== UserRole.CLIENT) {
            return NextResponse.json({ error: 'Access forbidden' }, { status: 403 })
        }

        // Get client profile
        const clientProfile = await prisma.clientProfile.findUnique({
            where: { userId: user.id }
        })

        if (!clientProfile) {
            return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
        }

        // Parse request data
        const data = await req.json()

        // Validate the booking data
        try {
            sessionBookingSchema.omit({ id: true, status: true, createdAt: true, updatedAt: true }).parse(data)
        } catch (validationError) {
            return NextResponse.json({ error: 'Invalid data', details: validationError }, { status: 400 })
        }

        // If booking for a dependent (secondary client), verify that the current user 
        // is the primary client for that dependent
        if (data.clientId !== clientProfile.id) {
            // Check if current user is allowed to book for the target client
            const targetClient = await prisma.clientProfile.findUnique({
                where: { id: data.clientId }
            })

            if (!targetClient || targetClient.primaryClientId !== clientProfile.id) {
                return NextResponse.json({
                    error: 'You are not authorized to book sessions for this client'
                }, { status: 403 })
            }
        }

        // Check counsellor availability
        const counsellor = await prisma.counsellorProfile.findUnique({
            where: { id: data.counsellorId }
        })

        if (!counsellor) {
            return NextResponse.json({ error: 'Counsellor not found' }, { status: 404 })
        }

        // Check for scheduling conflicts
        const requestedDateTime = new Date(data.dateTime)
        const endTime = new Date(requestedDateTime.getTime() + data.duration * 60000) // Add minutes

        const conflictingSession = await prisma.sessionBooking.findFirst({
            where: {
                counsellorId: data.counsellorId,
                status: SessionStatus.SCHEDULED,
                OR: [
                    // New session starts during an existing session
                    {
                        dateTime: {
                            lte: requestedDateTime
                        },
                        AND: {
                            dateTime: {
                                gt: new Date(endTime.getTime() - data.duration * 60000)
                            }
                        }
                    },
                    // New session ends during an existing session
                    {
                        dateTime: {
                            gte: requestedDateTime
                        },
                        AND: {
                            dateTime: {
                                lt: endTime
                            }
                        }
                    }
                ]
            }
        })

        if (conflictingSession) {
            return NextResponse.json({
                error: 'The counsellor is not available at the requested time'
            }, { status: 400 })
        }

        // Create the session booking
        const sessionBooking = await prisma.sessionBooking.create({
            data: {
                clientId: data.clientId || clientProfile.id,
                counsellorId: data.counsellorId,
                dateTime: requestedDateTime,
                duration: data.duration,
                type: data.type,
                status: SessionStatus.SCHEDULED,
                notes: data.notes,
                bookedById: user.id,
            }
        })

        return NextResponse.json({ session: sessionBooking }, { status: 201 })
    } catch (error) {
        console.error('Error booking session:', error)
        return NextResponse.json({ error: 'Failed to book session' }, { status: 500 })
    }
} 