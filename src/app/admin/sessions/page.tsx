'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
    Search,
    Filter,
    MoreVertical,
    MessageSquare,
    Clock,
    Calendar,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit,
    Video,
    Phone as PhoneIcon,
    Users,
    Clock8,
    FileText,
    BarChart,
    Download,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

// Mock data for sessions
const sessions = [
    {
        id: '1',
        title: 'Initial Assessment',
        client: {
            id: '1',
            name: 'John Doe',
            avatar: 'https://avatar.vercel.sh/1.png',
        },
        counsellor: {
            id: '1',
            name: 'Dr. Michael Chen',
            avatar: 'https://avatar.vercel.sh/3.png',
        },
        date: '2023-06-15',
        time: '09:00 AM',
        duration: 60,
        status: 'COMPLETED',
        type: 'VIDEO',
        notes: 'Initial assessment session with new client. Client presented with symptoms of anxiety.',
        attended: true,
        paymentStatus: 'PAID',
        paymentAmount: 120
    },
    {
        id: '2',
        title: 'Follow-up Session',
        client: {
            id: '1',
            name: 'John Doe',
            avatar: 'https://avatar.vercel.sh/1.png',
        },
        counsellor: {
            id: '1',
            name: 'Dr. Michael Chen',
            avatar: 'https://avatar.vercel.sh/3.png',
        },
        date: '2023-06-22',
        time: '09:00 AM',
        duration: 60,
        status: 'COMPLETED',
        type: 'VIDEO',
        notes: 'Follow-up session. Client reported reduced anxiety symptoms.',
        attended: true,
        paymentStatus: 'PAID',
        paymentAmount: 120
    },
    {
        id: '3',
        title: 'Weekly Session',
        client: {
            id: '2',
            name: 'Jane Smith',
            avatar: 'https://avatar.vercel.sh/2.png',
        },
        counsellor: {
            id: '3',
            name: 'Dr. Lisa Brown',
            avatar: 'https://avatar.vercel.sh/8.png',
        },
        date: '2023-06-15',
        time: '02:00 PM',
        duration: 45,
        status: 'COMPLETED',
        type: 'IN_PERSON',
        notes: 'Weekly therapy session. Discussed coping mechanisms for stress.',
        attended: true,
        paymentStatus: 'PAID',
        paymentAmount: 90
    },
    {
        id: '4',
        title: 'Emergency Session',
        client: {
            id: '5',
            name: 'Robert Johnson',
            avatar: 'https://avatar.vercel.sh/5.png',
        },
        counsellor: {
            id: '2',
            name: 'Dr. Sarah Wilson',
            avatar: 'https://avatar.vercel.sh/4.png',
        },
        date: '2023-06-10',
        time: '04:30 PM',
        duration: 30,
        status: 'COMPLETED',
        type: 'PHONE',
        notes: 'Emergency session requested by client. Discussed immediate coping strategies.',
        attended: true,
        paymentStatus: 'UNPAID',
        paymentAmount: 60
    },
    {
        id: '5',
        title: 'Weekly Session',
        client: {
            id: '6',
            name: 'Emily Davis',
            avatar: 'https://avatar.vercel.sh/6.png',
        },
        counsellor: {
            id: '4',
            name: 'Dr. Patricia Lee',
            avatar: 'https://avatar.vercel.sh/10.png',
        },
        date: '2023-06-16',
        time: '11:00 AM',
        duration: 60,
        status: 'SCHEDULED',
        type: 'VIDEO',
        notes: 'Regular weekly session.',
        attended: false,
        paymentStatus: 'PENDING',
        paymentAmount: 120
    },
    {
        id: '6',
        title: 'Initial Assessment',
        client: {
            id: '9',
            name: 'James Wilson',
            avatar: 'https://avatar.vercel.sh/9.png',
        },
        counsellor: {
            id: '1',
            name: 'Dr. Michael Chen',
            avatar: 'https://avatar.vercel.sh/3.png',
        },
        date: '2023-06-18',
        time: '10:00 AM',
        duration: 90,
        status: 'SCHEDULED',
        type: 'IN_PERSON',
        notes: 'Initial assessment for new client.',
        attended: false,
        paymentStatus: 'PENDING',
        paymentAmount: 150
    },
    {
        id: '7',
        title: 'Crisis Intervention',
        client: {
            id: '2',
            name: 'Jane Smith',
            avatar: 'https://avatar.vercel.sh/2.png',
        },
        counsellor: {
            id: '3',
            name: 'Dr. Lisa Brown',
            avatar: 'https://avatar.vercel.sh/8.png',
        },
        date: '2023-06-12',
        time: '03:15 PM',
        duration: 45,
        status: 'COMPLETED',
        type: 'VIDEO',
        notes: 'Crisis intervention session. Client reported acute anxiety.',
        attended: true,
        paymentStatus: 'PAID',
        paymentAmount: 90
    },
    {
        id: '8',
        title: 'Weekly Session',
        client: {
            id: '1',
            name: 'John Doe',
            avatar: 'https://avatar.vercel.sh/1.png',
        },
        counsellor: {
            id: '1',
            name: 'Dr. Michael Chen',
            avatar: 'https://avatar.vercel.sh/3.png',
        },
        date: '2023-06-29',
        time: '09:00 AM',
        duration: 60,
        status: 'SCHEDULED',
        type: 'VIDEO',
        notes: 'Regular weekly session.',
        attended: false,
        paymentStatus: 'PENDING',
        paymentAmount: 120
    },
    {
        id: '9',
        title: 'Rescheduled Session',
        client: {
            id: '5',
            name: 'Robert Johnson',
            avatar: 'https://avatar.vercel.sh/5.png',
        },
        counsellor: {
            id: '2',
            name: 'Dr. Sarah Wilson',
            avatar: 'https://avatar.vercel.sh/4.png',
        },
        date: '2023-06-14',
        time: '01:00 PM',
        duration: 60,
        status: 'CANCELLED',
        type: 'IN_PERSON',
        notes: 'Session cancelled by client due to illness. Rescheduled for next week.',
        attended: false,
        paymentStatus: 'REFUNDED',
        paymentAmount: 120
    },
    {
        id: '10',
        title: 'Group Session',
        client: {
            id: 'group1',
            name: 'Anxiety Support Group',
            avatar: '',
        },
        counsellor: {
            id: '4',
            name: 'Dr. Patricia Lee',
            avatar: 'https://avatar.vercel.sh/10.png',
        },
        date: '2023-06-17',
        time: '05:00 PM',
        duration: 90,
        status: 'SCHEDULED',
        type: 'VIDEO',
        notes: 'Weekly anxiety support group session.',
        attended: false,
        paymentStatus: 'PREPAID',
        paymentAmount: 200
    }
]

export default function AdminSessionsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [typeFilter, setTypeFilter] = useState('ALL')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [dateRangeFilter, setDateRangeFilter] = useState('UPCOMING')

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/unauthorized')
        }
    }, [router, user])

    const filteredSessions = sessions.filter(session => {
        const matchesSearch =
            session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.counsellor.name.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'ALL' || session.status === statusFilter
        const matchesType = typeFilter === 'ALL' || session.type === typeFilter

        let matchesDateRange = true
        const sessionDate = new Date(session.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (dateRangeFilter === 'TODAY') {
            const todayString = today.toISOString().split('T')[0]
            matchesDateRange = session.date === todayString
        } else if (dateRangeFilter === 'PAST') {
            matchesDateRange = sessionDate < today
        } else if (dateRangeFilter === 'UPCOMING') {
            matchesDateRange = sessionDate >= today
        }

        return matchesSearch && matchesStatus && matchesType && matchesDateRange
    })

    // Pagination
    const totalPages = Math.ceil(filteredSessions.length / itemsPerPage)
    const paginatedSessions = filteredSessions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>
            case 'SCHEDULED':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Scheduled</Badge>
            case 'CANCELLED':
                return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Cancelled</Badge>
            case 'NO_SHOW':
                return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">No Show</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getSessionTypeIcon = (type: string) => {
        switch (type) {
            case 'VIDEO':
                return <Video className="h-4 w-4 text-blue-500" />
            case 'PHONE':
                return <PhoneIcon className="h-4 w-4 text-green-500" />
            case 'IN_PERSON':
                return <Users className="h-4 w-4 text-purple-500" />
            default:
                return <MessageSquare className="h-4 w-4" />
        }
    }

    // Calculate session statistics
    const sessionStats = {
        totalScheduled: sessions.filter(s => s.status === 'SCHEDULED').length,
        totalCompleted: sessions.filter(s => s.status === 'COMPLETED').length,
        totalCancelled: sessions.filter(s => s.status === 'CANCELLED' || s.status === 'NO_SHOW').length,
        totalDuration: sessions.reduce((sum, s) => sum + s.duration, 0),
        avgDuration: Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length),
        totalRevenue: sessions.filter(s => s.paymentStatus === 'PAID').reduce((sum, s) => sum + s.paymentAmount, 0)
    }

    if (!user) {
        return null
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
                    <p className="text-muted-foreground">
                        Manage counselling sessions and appointments
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button>
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Session
                    </Button>
                </div>
            </div>

            {/* Session Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-primary/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Scheduled Sessions</p>
                            <h3 className="text-2xl font-bold">{sessionStats.totalScheduled}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-green-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-green-500/10 p-2 rounded-full">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Completed Sessions</p>
                            <h3 className="text-2xl font-bold">{sessionStats.totalCompleted}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-amber-500/10 p-2 rounded-full">
                            <Clock8 className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Avg. Duration</p>
                            <h3 className="text-2xl font-bold">{sessionStats.avgDuration} min</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-blue-500/10 p-2 rounded-full">
                            <BarChart className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                            <h3 className="text-2xl font-bold">${sessionStats.totalRevenue}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <Card>
                <CardHeader>
                    <CardTitle>Session Management</CardTitle>
                    <CardDescription>
                        View and manage all counselling sessions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <Input
                                    placeholder="Search sessions, clients, or counsellors..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-8"
                                />
                            </div>
                            <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                                <SelectTrigger className="w-[150px] h-8">
                                    <SelectValue placeholder="Date range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Dates</SelectItem>
                                    <SelectItem value="TODAY">Today</SelectItem>
                                    <SelectItem value="UPCOMING">Upcoming</SelectItem>
                                    <SelectItem value="PAST">Past</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px] h-8">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    <SelectItem value="NO_SHOW">No Show</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[150px] h-8">
                                    <SelectValue placeholder="Session type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Types</SelectItem>
                                    <SelectItem value="VIDEO">Video</SelectItem>
                                    <SelectItem value="PHONE">Phone</SelectItem>
                                    <SelectItem value="IN_PERSON">In Person</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px] px-4">Session</TableHead>
                                        <TableHead className="w-[170px] px-4">Client</TableHead>
                                        <TableHead className="w-[170px] px-4">Counsellor</TableHead>
                                        <TableHead className="w-[120px] px-4">Date & Time</TableHead>
                                        <TableHead className="w-[80px] px-4">Type</TableHead>
                                        <TableHead className="w-[100px] px-4">Status</TableHead>
                                        <TableHead className="w-[60px] px-4">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedSessions.map((session) => (
                                        <TableRow key={session.id}>
                                            <TableCell className="px-4 py-2">
                                                <span className="text-sm font-medium whitespace-nowrap">{session.title}</span>
                                                <div className="text-xs text-muted-foreground">
                                                    {session.duration} minutes
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={session.client.avatar} />
                                                        <AvatarFallback className="text-[10px]">
                                                            {session.client.name.split(' ').map((n: string) => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm whitespace-nowrap">{session.client.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={session.counsellor.avatar} />
                                                        <AvatarFallback className="text-[10px]">
                                                            {session.counsellor.name.split(' ').map((n: string) => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm whitespace-nowrap">{session.counsellor.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                <div className="flex flex-col">
                                                    <span className="text-sm whitespace-nowrap">{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <span className="text-xs text-muted-foreground">{session.time}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-center">
                                                <div className="flex justify-center">
                                                    {getSessionTypeIcon(session.type)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                {getStatusBadge(session.status)}
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-7 w-7 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit Session
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            View Notes
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Cancel Session
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between mt-4 text-sm">
                            <div className="text-muted-foreground">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredSessions.length)} of {filteredSessions.length} sessions
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNumber;
                                    if (totalPages <= 5) {
                                        pageNumber = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNumber = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNumber = totalPages - 4 + i;
                                    } else {
                                        pageNumber = currentPage - 2 + i;
                                    }
                                    return (
                                        <Button
                                            key={pageNumber}
                                            variant={currentPage === pageNumber ? "default" : "outline"}
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() => handlePageChange(pageNumber)}
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                })}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                                <SelectTrigger className="w-[110px] h-7">
                                    <SelectValue placeholder="Rows per page" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 per page</SelectItem>
                                    <SelectItem value="10">10 per page</SelectItem>
                                    <SelectItem value="15">15 per page</SelectItem>
                                    <SelectItem value="25">25 per page</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 