'use client'

import { create } from 'zustand'
import type { User } from '@prisma/client'

interface AuthState {
    user: User | null
    setUser: (user: User | null) => void
    logout: () => Promise<void>
}

export const useAuth = create<AuthState>()((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            })
            set({ user: null })
            window.location.href = '/login'
        } catch (error) {
            console.error('Logout failed:', error)
        }
    },
}))

// Client-side helper to check if user is logged in
export async function checkAuth(): Promise<User | null> {
    try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
            return null
        }
        const data = await response.json()
        return data.user
    } catch (error) {
        console.error('Auth check failed:', error)
        return null
    }
} 