'use client'

import { create } from 'zustand'
import type { User } from '@prisma/client'

interface AuthState {
    user: User | null
    setUser: (user: User | null) => void
    logout: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            set({ user: null })
            // Redirect to login page after successful logout
            window.location.href = '/login'
        } catch (error) {
            console.error('Logout error:', error)
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

// Server-side helper to get the current auth session
export async function getAuthSession() {
    try {
        const response = await fetch('/api/auth/session')
        if (!response.ok) {
            return null
        }
        return await response.json()
    } catch (error) {
        console.error('Session check failed:', error)
        return null
    }
} 