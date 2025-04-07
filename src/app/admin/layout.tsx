'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    Menu,
    X,
    LogOut,
    Bell,
    Search,
    ChevronDown,
    User,
    Shield,
    Moon,
    Sun,
    UserCircle,
    Calendar,
    CreditCard,
    MessageSquare,
    HeartHandshake
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useTheme } from 'next-themes'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, signOut } = useAuth()
    const { theme, setTheme } = useTheme()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New counsellor application', time: '5 minutes ago', read: false },
        { id: 2, title: 'System update completed', time: '1 hour ago', read: false },
        { id: 3, title: 'New resource published', time: '2 hours ago', read: true },
    ])

    useEffect(() => {
        // Wait a bit for auth to initialize
        setIsLoading(false);
    }, [user])

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        )
    }

    // Show nothing while checking auth
    if (!user) {
        return null
    }

    const unreadCount = notifications.filter(n => !n.read).length

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Clients', href: '/admin/clients', icon: UserCircle },
        { name: 'Counsellors', href: '/admin/counsellors', icon: HeartHandshake },
        { name: 'Sessions', href: '/admin/sessions', icon: MessageSquare },
        { name: 'Calendar', href: '/admin/calendar', icon: Calendar },
        { name: 'Payments', href: '/admin/payments', icon: CreditCard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Resources', href: '/admin/resources', icon: BookOpen },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-48 transform bg-card transition-transform duration-200 ease-in-out',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <span className="text-lg font-semibold">Admin Panel</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <Separator />
                <nav className="space-y-1 p-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Button
                                key={item.name}
                                variant={isActive ? 'secondary' : 'ghost'}
                                className="w-full justify-start gap-2"
                                onClick={() => router.push(item.href)}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Button>
                        )
                    })}
                </nav>
            </div>

            {/* Main content */}
            <div
                className={cn(
                    'flex min-h-screen flex-col transition-all duration-200 ease-in-out',
                    isSidebarOpen ? 'pl-48' : 'pl-0'
                )}
            >
                {/* Header */}
                <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-1 items-center gap-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-8"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <Badge
                                            variant="destructive"
                                            className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                                        >
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {notifications.map((notification) => (
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className={cn(
                                            'flex flex-col items-start gap-1',
                                            !notification.read && 'bg-muted/50'
                                        )}
                                    >
                                        <span className="font-medium">
                                            {notification.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {notification.time}
                                        </span>
                                    </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="justify-center text-center">
                                    View all notifications
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="h-8 w-8"
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {user.firstName.charAt(0)}
                                            {user.lastName.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden md:inline">
                                        {user.firstName} {user.lastName}
                                    </span>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
} 