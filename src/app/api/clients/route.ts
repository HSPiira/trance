import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/clients - Get all clients
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const clientType = searchParams.get('clientType');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '20', 10);
        const skip = (page - 1) * limit;

        // Build filter conditions
        const where: Record<string, unknown> = {};

        // ... existing filter logic ...

        const clients = await prisma.client.findMany({
            where,
            include: {
                beneficiaries: true,
                dependants: true,
            },
            orderBy: {
                lastActive: 'desc',
            },
            skip,
            take: limit,
        });

        // Get total count for pagination metadata
        const total = await prisma.client.count({ where });

        return NextResponse.json({
            clients,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        // ... existing error handling ...
    }
}


// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['name', 'email', 'clientType'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        const client = await prisma.client.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                status: body.status || 'ACTIVE',
                clientType: body.clientType,
                counsellor: body.counsellor,
                notes: body.notes,
                joinDate: new Date(),
                lastActive: new Date(),
            },
        });

        return NextResponse.json(client, { status: 201 });
    } catch (error) {
        console.error('Error creating client:', error);
        return NextResponse.json(
            { error: 'Failed to create client' },
            { status: 500 }
        );
    }
}