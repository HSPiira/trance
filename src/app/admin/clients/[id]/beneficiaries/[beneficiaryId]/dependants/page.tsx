import React from 'react';
import { notFound } from 'next/navigation';
import { clients } from '../../../../mock-data';
import DependantsContent from './dependants-content';

// Server component that handles the params correctly
export default function BeneficiaryDependantsPage({ params }: { params: { id: string, beneficiaryId: string } }) {
    // Safely access the params
    const { id, beneficiaryId } = params;

    // Find the client with the corresponding ID
    const client = clients.find(c => c.id === id);

    // If client not found, return 404
    if (!client) {
        notFound();
    }

    // Ensure client is a company
    if (client.clientType !== 'COMPANY') {
        // In a server component we can't use router.push, so we'll return a message
        return <div>This client is not a company. Only company clients have beneficiaries with dependants.</div>;
    }

    // Find the beneficiary
    const beneficiary = client.beneficiaries?.find(b => b.id === beneficiaryId);

    // If beneficiary not found, return 404
    if (!beneficiary) {
        notFound();
    }

    // Render the dependants content with the client and beneficiary data
    return <DependantsContent client={client} beneficiary={beneficiary} />;
} 