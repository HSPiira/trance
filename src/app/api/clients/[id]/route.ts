import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Authenticate the request
        const session = await getAuthSession();
        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Validate the ID parameter
        if (!params.id || !/^[0-9a-fA-F-]+$/.test(params.id)) {
            return NextResponse.json(
                { error: 'Invalid client ID format' },
                { status: 400 }
            );
        }

        // Get query parameters to determine what data to include
        const { searchParams } = new URL(request.url);
        const include = {
            company: searchParams.has('includeCompany'),
            documents: searchParams.has('includeDocuments'),
            messages: searchParams.has('includeMessages'),
            notes: searchParams.has('includeNotes'),
            sessions: searchParams.has('includeSessions'),
        };

        const client = await prisma.client.findUnique({
            where: { id: params.id },
            include,
        });

        if (!client) {
            return NextResponse.json(
                { error: 'Client not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(client);
    } catch (error) {
        console.error(`Error fetching client ${params.id}:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch client' },
            { status: 500 }
        );
    }
}