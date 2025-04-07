import React from 'react';
import { notFound } from 'next/navigation';
import { clients } from '../../mock-data';
import ClientFamilyContent from './client-family-content';

export default function ClientFamilyPage({ params }: { params: { id: string } }) {
    // Safely access the id parameter
    const id = params.id;

    // Find the client with the corresponding ID
    const client = clients.find(c => c.id === id);

    // If client not found, return 404
    if (!client) {
        notFound();
    }

    // Ensure client is an individual
    if (client.clientType !== 'INDIVIDUAL') {
        // In a server component we can't use router.push, so we'll return a 404
        // The UI can handle redirecting to the appropriate view
        return <div>This client is not an individual. Please view company clients differently.</div>;
    }

    // Render the client family content with the client data
    return <ClientFamilyContent client={client} />;
} 