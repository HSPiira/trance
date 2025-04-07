'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { UserRole } from '@/lib/db/schema'
import {
    LayoutDashboard,
    Users,
    Calendar,
    MessageSquare,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
} from 'lucide-react'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter()
    const { user, logout } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [notifications] = useState(2) // Example notification count

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    const getNavItems = (role: UserRole) => {
        const commonItems = [
            {
                title: 'Dashboard',
                href: `/${role.toLowerCase()}/dashboard`,
                icon: LayoutDashboard,
            },
            {
                title: 'Appointments',
                href: `/${role.toLowerCase()}/appointments`,
                icon: Calendar,
            },
            {
                title: 'Messages',
                href: `/${role.toLowerCase()}/messages`,
                icon: MessageSquare,
            },
        ]

        if (role === 'COUNSELLOR') {
            return [
                ...commonItems,
                {
                    title: 'Clients',
                    href: '/counsellor/clients',
                    icon: Users,
                },
            ]
        }

        if (role === 'CLIENT') {
            return [
                ...commonItems,
                {
                    title: 'My Counsellor',
                    href: '/client/counsellor',
                    icon: Users,
                },
            ]
        }

        return commonItems
    }

    if (!user) {
        return null
    }

    const navItems = getNavItems(user.role)

    return (
        <div className="min-h-screen bg-gray-50 font-poppins">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex h-16 items-center justify-between border-b px-4">
                    <Link
                        href={`/${user.role.toLowerCase()}/dashboard`}
                        className="flex items-center space-x-2 text-xl font-bold text-blue-600"
                    >
                        <span className="text-2xl">🌟</span>
                        <span>Hope</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>
                <div className="flex h-[calc(100vh-4rem)] flex-col">
                    <nav className="flex-1 space-y-1 p-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                    <div className="border-t p-4">
                        <Link
                            href={`/${user.role.toLowerCase()}/settings`}
                            className="flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                            <Settings className="mr-3 h-5 w-5" />
                            Settings
                        </Link>
                        <Button
                            variant="ghost"
                            className="mt-2 w-full justify-start px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div
                className={`flex min-h-screen flex-col transition-all duration-200 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''
                    }`}
            >
                {/* Header */}
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        <div className="ml-4 flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="h-9 rounded-full border border-gray-200 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            {notifications > 0 && (
                                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                    {notifications}
                                </span>
                            )}
                        </Button>
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                                <div className="flex h-full w-full items-center justify-center text-sm font-medium">
                                    {user.firstName[0]}
                                </div>
                            </div>
                            <span className="text-sm font-medium">
                                {user.firstName} {user.lastName}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
} 