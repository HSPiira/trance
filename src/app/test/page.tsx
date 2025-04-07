'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
    const [message, setMessage] = useState<string>('')
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const testApi = async () => {
            try {
                console.log('Testing API...')
                const response = await fetch('/api/test')
                console.log('API response:', response.status)
                const data = await response.json()
                console.log('API data:', data)
                setMessage(data.message)
            } catch (err) {
                console.error('API test error:', err)
                setError(err instanceof Error ? err.message : 'Unknown error')
            }
        }

        testApi()
    }, [])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
            {message && (
                <div className="p-4 bg-green-100 text-green-700 rounded-md mb-4">
                    {message}
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
                    Error: {error}
                </div>
            )}
        </div>
    )
} 