'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { checkAuth } from '@/lib/auth'
import { Calendar, MessageSquare, BookOpen, Clock, ArrowUpRight, ChevronRight } from 'lucide-react'

export default function ClientDashboard() {
    const router = useRouter()
    const { user, setUser } = useAuth()

    useEffect(() => {
        const initAuth = async () => {
            try {
                const userData = await checkAuth()
                if (!userData) {
                    router.push('/login')
                    return
                }
                setUser(userData)
            } catch (error) {
                console.error('Dashboard auth check failed:', error)
                router.push('/login')
            }
        }

        if (!user) {
            initAuth()
        }
    }, [router, setUser, user])

    if (!user) {
        return null
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.firstName}!</h1>
                    <p className="text-sm text-gray-500">Last login: Today at 9:30 AM</p>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-blue-50 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-600">Next Session</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">Tomorrow</p>
                                    <p className="text-sm text-gray-500">10:00 AM</p>
                                </div>
                                <Calendar className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-purple-50 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-purple-600">Unread Messages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">3</p>
                                    <p className="text-sm text-gray-500">From your counselor</p>
                                </div>
                                <MessageSquare className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-green-50 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-600">Resources</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">12</p>
                                    <p className="text-sm text-gray-500">Available materials</p>
                                </div>
                                <BookOpen className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-orange-50 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-orange-600">Hours Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">8.5</p>
                                    <p className="text-sm text-gray-500">This month</p>
                                </div>
                                <Clock className="h-8 w-8 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity & Upcoming Sessions */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Activity</CardTitle>
                            <button className="flex items-center text-sm text-blue-600 hover:underline">
                                View all
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">Session completed</p>
                                            <p className="text-sm text-gray-500">with Dr. Sarah Johnson</p>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="mr-1 h-4 w-4" />
                                            2 days ago
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Upcoming Sessions</CardTitle>
                            <button className="flex items-center text-sm text-blue-600 hover:underline">
                                Schedule new
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                                        <div>
                                            <p className="font-medium">Individual Session</p>
                                            <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
                                        </div>
                                        <button className="flex items-center text-sm text-blue-600 hover:underline">
                                            Join
                                            <ArrowUpRight className="ml-1 h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
} 