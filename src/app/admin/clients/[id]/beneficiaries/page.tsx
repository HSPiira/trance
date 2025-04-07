import React from 'react';
import { notFound } from 'next/navigation';
import { clients } from '../../mock-data';
import BeneficiariesContent from './beneficiaries-content';

export default function ClientBeneficiariesPage({ params }: { params: { id: string } }) {
    // Safely access the id parameter
    const id = params.id;

    // Find the client with the corresponding ID
    const client = clients.find(c => c.id === id);

    // If client not found, return 404
    if (!client) {
        notFound();
    }

    // Ensure client is a company
    if (client.clientType !== 'COMPANY') {
        // In a server component we can't use router.push, so we'll return a message
        return <div>This client is not a company. Only company clients have beneficiaries.</div>;
    }

    // Render the beneficiaries content with the client data
    return <BeneficiariesContent client={client} />;
} 