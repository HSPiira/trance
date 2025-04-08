import React from 'react';
import { notFound } from 'next/navigation';
import { clients } from '../../mock-data';
import CompanyDependantsContent from './company-dependants-content';

export default function CompanyDependantsPage({ params }: { params: { id: string } }) {
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
        // For individual clients, redirect to the family page which already handles dependants
        return (
            <div className="p-6 text-center">
                <p className="text-muted-foreground">This client is an individual. Please use the family page to view dependants.</p>
                <a href={`/admin/clients/${id}/family`} className="text-blue-500 hover:underline mt-2 inline-block">
                    Go to Family Page
                </a>
            </div>
        );
    }

    // Render the company dependants content with the client data
    return <CompanyDependantsContent client={client} />;
} 