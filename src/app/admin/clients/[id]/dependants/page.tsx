import React from 'react';
import { notFound } from 'next/navigation';
import { clients } from '../../mock-data';
import ClientFamilyContent from '../family/client-family-content';

export default function ClientDependantsPage({ params }: { params: { id: string } }) {
    // Safely access the id parameter
    const id = params.id;

    // Find the client with the corresponding ID
    const client = clients.find(c => c.id === id);

    // If client not found, return 404
    if (!client) {
        notFound();
    }

    // Render the client family content with the client data
    // We're reusing the ClientFamilyContent component since it already handles dependants display
    return <ClientFamilyContent client={client} />;
} 