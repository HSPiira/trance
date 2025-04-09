import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PrismaClient } from '@prisma/client';

// GET /api/clients - Get all clients
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status');
        const clientType = searchParams.get('clientType');

        const skip = (page - 1) * limit;

        const where = {
            AND: [
                search ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ],
                } : {},
                status && status !== 'ALL' ? { status } : {},
                clientType && clientType !== 'ALL' ? { clientType } : {},
            ],
        };

        const [clients, total] = await Promise.all([
            prisma.client.findMany({
                where,
                skip,
                take: limit,
                include: {
                    beneficiaries: {
                        include: {
                            dependants: true,
                        },
                    },
                    dependants: true,
                    sessions: true,
                    documents: true,
                    notes: true,
                    messages: true,
                    company: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.client.count({ where }),
        ]);

        return NextResponse.json({
            clients,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching clients:', error);
        return NextResponse.json(
            { error: 'Failed to fetch clients' },
            { status: 500 }
        );
    }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const client = await prisma.client.create({
            data,
            include: {
                beneficiaries: true,
                dependants: true,
            },
        });
        return NextResponse.json(client);
    } catch (error) {
        console.error('Error creating client:', error);
        return NextResponse.json(
            { error: 'Failed to create client' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, ...data } = await request.json();
        const client = await prisma.client.update({
            where: { id },
            data,
            include: {
                beneficiaries: true,
                dependants: true,
            },
        });
        return NextResponse.json(client);
    } catch (error) {
        console.error('Error updating client:', error);
        return NextResponse.json(
            { error: 'Failed to update client' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Client ID is required' },
                { status: 400 }
            );
        }

        await prisma.client.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting client:', error);
        return NextResponse.json(
            { error: 'Failed to delete client' },
            { status: 500 }
        );
    }
}