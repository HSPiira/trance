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
} from 'lucide-react'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter()
    const { user, logout } = useAuth()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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
            {
                title: 'Settings',
                href: `/${role.toLowerCase()}/settings`,
                icon: Settings,
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
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex h-16 items-center justify-between px-4">
                    <Link href={`/${user.role.toLowerCase()}/dashboard`} className="text-xl font-bold">
                        Hope
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
                <nav className="mt-4 space-y-1 px-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.title}
                        </Link>
                    ))}
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                    </Button>
                </nav>
            </aside>

            {/* Main content */}
            <div
                className={`flex min-h-screen flex-col transition-all duration-200 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : ''
                    }`}
            >
                {/* Header */}
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-4 shadow-sm">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">
                            {user.firstName} {user.lastName}
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4">{children}</main>
            </div>
        </div>
    )
} 