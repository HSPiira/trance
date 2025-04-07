// This is a Server Component
import { notFound } from 'next/navigation'
import ClientDetail from './client-detail'
import { clients } from '../mock-data'

export default function ClientPage({ params }: { params: { id: string } }) {
    // Find the client with the corresponding ID
    const client = clients.find(c => c.id === params.id)

    // If client not found, return 404
    if (!client) {
        notFound()
    }

    // Render the client detail component, passing client data as props
    return <ClientDetail client={client} />
} 