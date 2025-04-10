import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const client = await prisma.client.findUnique({
            where: { id: params.id },
            include: {
                company: true,
                documents: true,
                messages: true,
                notes: true,
                sessions: true,
            },
        });

        if (!client) {
            return NextResponse.json(
                { error: 'Client not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        return NextResponse.json(
            { error: 'Failed to fetch client' },
            { status: 500 }
        );
    }
} 