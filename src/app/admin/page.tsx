'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
    Users,
    BookOpen,
    MessageSquare,
    Calendar,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Mock data for dashboard
const stats = {
    totalUsers: 1250,
    activeUsers: 980,
    totalCounsellors: 45,
    activeCounsellors: 38,
    totalResources: 156,
    totalAppointments: 3240,
    totalMessages: 15800,
    userGrowth: 12.5,
    counsellorGrowth: 8.3,
    resourceGrowth: 15.7,
    appointmentGrowth: 22.4
}

const recentActivities = [
    {
        id: 1,
        type: 'user',
        action: 'New user registration',
        user: 'John Doe',
        time: '5 minutes ago',
        avatar: 'https://avatar.vercel.sh/1.png'
    },
    {
        id: 2,
        type: 'counsellor',
        action: 'New counsellor application',
        user: 'Dr. Sarah Smith',
        time: '1 hour ago',
        avatar: 'https://avatar.vercel.sh/2.png'
    },
    {
        id: 3,
        type: 'resource',
        action: 'New resource published',
        user: 'Dr. Michael Chen',
        time: '2 hours ago',
        avatar: 'https://avatar.vercel.sh/3.png'
    },
    {
        id: 4,
        type: 'appointment',
        action: 'Appointment scheduled',
        user: 'Emma Wilson',
        time: '3 hours ago',
        avatar: 'https://avatar.vercel.sh/4.png'
    }
]

const counsellorApplications = [
    {
        id: 1,
        name: 'Dr. Sarah Smith',
        specialization: 'Clinical Psychology',
        experience: '8 years',
        status: 'pending',
        avatar: 'https://avatar.vercel.sh/5.png'
    },
    {
        id: 2,
        name: 'Dr. Michael Chen',
        specialization: 'Family Therapy',
        experience: '12 years',
        status: 'approved',
        avatar: 'https://avatar.vercel.sh/6.png'
    },
    {
        id: 3,
        name: 'Dr. Emily Rodriguez',
        specialization: 'Cognitive Behavioral Therapy',
        experience: '6 years',
        status: 'rejected',
        avatar: 'https://avatar.vercel.sh/7.png'
    }
]

export default function AdminDashboard() {
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.push('/unauthorized')
        }
    }, [router, user])

    if (!user) {
        return null
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your platform's performance and key metrics
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-green-500">+{stats.userGrowth}%</span>
                            <span className="ml-1">from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Counsellors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeCounsellors}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-green-500">+{stats.counsellorGrowth}%</span>
                            <span className="ml-1">from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalResources}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-green-500">+{stats.resourceGrowth}%</span>
                            <span className="ml-1">from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-green-500">+{stats.appointmentGrowth}%</span>
                            <span className="ml-1">from last month</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* User Engagement */}
                        <Card>
                            <CardHeader>
                                <CardTitle>User Engagement</CardTitle>
                                <CardDescription>Platform usage metrics</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Active Users</span>
                                        <span className="text-sm text-muted-foreground">
                                            {stats.activeUsers} / {stats.totalUsers}
                                        </span>
                                    </div>
                                    <Progress value={(stats.activeUsers / stats.totalUsers) * 100} />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Active Counsellors</span>
                                        <span className="text-sm text-muted-foreground">
                                            {stats.activeCounsellors} / {stats.totalCounsellors}
                                        </span>
                                    </div>
                                    <Progress value={(stats.activeCounsellors / stats.totalCounsellors) * 100} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest platform updates</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-4">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={activity.avatar} />
                                            <AvatarFallback>
                                                {activity.user.split(' ').map((n) => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">{activity.user}</p>
                                            <p className="text-xs text-muted-foreground">{activity.action}</p>
                                        </div>
                                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="applications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Counsellor Applications</CardTitle>
                            <CardDescription>Review and manage counsellor applications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {counsellorApplications.map((application) => (
                                    <div
                                        key={application.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={application.avatar} />
                                                <AvatarFallback>
                                                    {application.name.split(' ').map((n) => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{application.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {application.specialization} • {application.experience} experience
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    application.status === 'approved'
                                                        ? 'default'
                                                        : application.status === 'rejected'
                                                            ? 'destructive'
                                                            : 'secondary'
                                                }
                                            >
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                            </Badge>
                                            <button className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground">
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Activity</CardTitle>
                            <CardDescription>Detailed activity breakdown</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Total Messages</span>
                                        </div>
                                        <span className="text-sm font-medium">{stats.totalMessages}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Total Appointments</span>
                                        </div>
                                        <span className="text-sm font-medium">{stats.totalAppointments}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Total Users</span>
                                        </div>
                                        <span className="text-sm font-medium">{stats.totalUsers}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Total Resources</span>
                                        </div>
                                        <span className="text-sm font-medium">{stats.totalResources}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 