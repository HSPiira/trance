'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { UserRole } from '@/lib/db/schema'
import { useTheme } from 'next-themes'
import { ModeToggle } from '@/components/mode-toggle'
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
    ChevronDown,
    HelpCircle,
    BookOpen,
    FileText,
    BarChart,
    Shield,
    User,
    Plus,
    Clock,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Info
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuGroup
} from '@/components/ui/dropdown-menu'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const { theme } = useTheme()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New message from Dr. Johnson', time: '5m ago', read: false },
        { id: 2, title: 'Appointment reminder', time: '1h ago', read: false },
        { id: 3, title: 'Session notes available', time: '2h ago', read: true },
    ])
    const [unreadCount, setUnreadCount] = useState(0)
    const [showHelp, setShowHelp] = useState(false)

    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.read).length)
    }, [notifications])

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
                {
                    title: 'Resources',
                    href: '/counsellor/resources',
                    icon: BookOpen,
                },
                {
                    title: 'Reports',
                    href: '/counsellor/reports',
                    icon: BarChart,
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
                {
                    title: 'Resources',
                    href: '/client/resources',
                    icon: BookOpen,
                },
                {
                    title: 'Documents',
                    href: '/client/documents',
                    icon: FileText,
                },
            ]
        }

        return commonItems
    }

    if (!user) {
        return null
    }

    const navItems = getNavItems(user.role as UserRole)

    return (
        <div className="min-h-screen bg-background font-montserrat">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-lg transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex h-16 items-center justify-between border-b px-4">
                    <Link
                        href={`/${user.role.toLowerCase()}/dashboard`}
                        className="flex items-center space-x-2 text-xl font-bold text-primary"
                    >
                        <span className="text-2xl">🌟</span>
                        <span>Hope</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex h-[calc(100vh-4rem)] flex-col justify-between p-4">
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center space-x-2 rounded-lg px-3 py-2 transition-colors ${isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.title}</span>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="space-y-2">
                        <Link
                            href={`/${user.role.toLowerCase()}/settings`}
                            className="flex items-center space-x-2 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                        </Link>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-5 w-5" />
                            Logout
                        </Button>
                        <div className="px-3 py-2">
                            <ModeToggle />
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div
                className={`flex min-h-screen flex-col transition-all duration-200 ${isSidebarOpen ? 'lg:pl-64' : ''
                    }`}
            >
                {/* Header */}
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="h-9 w-[240px] rounded-md border bg-background px-3 pl-9 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="relative"
                                        onClick={() => setShowHelp(!showHelp)}
                                    >
                                        <HelpCircle className="h-5 w-5" />
                                        {showHelp && (
                                            <span className="absolute -right-1 -top-1 flex h-3 w-3">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                                            </span>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Help & Support</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80">
                                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <ScrollArea className="h-[300px]">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <DropdownMenuItem
                                                key={notification.id}
                                                className={`flex flex-col items-start p-4 ${!notification.read ? 'bg-accent/50' : ''}`}
                                                onClick={() => {
                                                    setNotifications(notifications.map(n =>
                                                        n.id === notification.id ? { ...n, read: true } : n
                                                    ))
                                                }}
                                            >
                                                <div className="flex w-full items-start justify-between">
                                                    <div className="flex items-start gap-2">
                                                        {!notification.read && (
                                                            <div className="mt-1 h-2 w-2 rounded-full bg-primary"></div>
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-medium">{notification.title}</p>
                                                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                                                        </div>
                                                    </div>
                                                    {!notification.read && (
                                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-4 text-center">
                                            <Bell className="h-8 w-8 text-muted-foreground" />
                                            <p className="mt-2 text-sm text-muted-foreground">No notifications</p>
                                        </div>
                                    )}
                                </ScrollArea>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="justify-center">
                                    Mark all as read
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://avatar.vercel.sh/${user.id}.png`} />
                                        <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="hidden text-left md:block">
                                        <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-muted-foreground">{user.role}</p>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Shield className="mr-2 h-4 w-4" />
                                    <span>Security</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Help Panel */}
                {showHelp && (
                    <div className="border-b bg-muted/50 p-4">
                        <div className="mx-auto flex max-w-5xl items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <Info className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium">Need help?</h3>
                                    <p className="text-sm text-muted-foreground">Check out our resources or contact support</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Resources
                                </Button>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Contact Support
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowHelp(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 p-6">{children}</main>

                {/* Footer */}
                <footer className="border-t bg-background/50 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="mx-auto flex max-w-5xl items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Last updated: {new Date().toLocaleDateString()}
                                </span>
                            </div>
                            <Separator orientation="vertical" className="h-4" />
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-muted-foreground">System Status: Operational</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-xs">
                                Privacy Policy
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs">
                                Terms of Service
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs">
                                Help Center
                            </Button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
} 