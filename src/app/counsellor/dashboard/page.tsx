'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CounsellorDashboard() {
    const router = useRouter()
    const { user, setUser } = useAuth()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/me')
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch user')
                }

                setUser(data.user)
            } catch (error) {
                console.error('Auth check failed:', error)
                router.push('/login')
            }
        }

        checkAuth()
    }, [router, setUser])

    if (!user) {
        return null
    }

    return (
        <DashboardLayout>
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Welcome, {user.firstName}!</h1>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Today's Appointments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">No appointments scheduled</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Active Clients</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">No active clients</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Messages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-500">No recent messages</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
} 