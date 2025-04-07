'use client'

import { useEffect, useState } from 'react'
import { useAuth, checkAuth } from '@/lib/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser } = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            try {
                const user = await checkAuth()
                setUser(user)
            } catch (error) {
                console.error('Auth initialization error:', error)
            } finally {
                setIsLoading(false)
            }
        }
        initAuth()
    }, [setUser])

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    return children
} 