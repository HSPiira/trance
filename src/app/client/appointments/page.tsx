'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataPagination } from '@/components/ui/data-pagination'
import {
    Calendar,
    Video,
    Phone,
    Users,
    Clock,
    Calendar as CalendarIcon,
    Plus,
    Search,
    Filter,
    ChevronDown,
    AlertCircle
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { format, parseISO, isToday, isPast, differenceInDays } from 'date-fns'
import { SessionStatus, SessionType } from '@/lib/db/schema'

export default function ClientAppointmentsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('upcoming')
    const [searchQuery, setSearchQuery] = useState('')
    const [appointments, setAppointments] = useState<any[]>([])
    const [filteredAppointments, setFilteredAppointments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [totalItems, setTotalItems] = useState(0)

    // Fetch appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setIsLoading(true)

                // Define query parameters
                const params = new URLSearchParams({
                    page: currentPage.toString(),
                    limit: itemsPerPage.toString(),
                })

                // Add status filter if on upcoming or past tab
                if (activeTab === 'upcoming') {
                    params.append('status', SessionStatus.SCHEDULED)
                } else if (activeTab === 'past') {
                    params.append('status', SessionStatus.COMPLETED)
                }

                const response = await fetch(`/api/client/sessions?${params.toString()}`)

                if (!response.ok) {
                    throw new Error('Failed to fetch appointments')
                }

                const data = await response.json()
                setAppointments(data.sessions || [])
                setTotalItems(data.pagination?.total || 0)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching appointments:', error)
                setError('Failed to load appointments')
                setIsLoading(false)
            }
        }

        if (user) {
            fetchAppointments()
        } else {
            router.push('/login')
        }
    }, [user, router, currentPage, itemsPerPage, activeTab])

    // Filter appointments based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredAppointments(appointments)
            return
        }

        const query = searchQuery.toLowerCase()
        const filtered = appointments.filter(appointment =>
            appointment.counsellor?.user?.firstName?.toLowerCase().includes(query) ||
            appointment.counsellor?.user?.lastName?.toLowerCase().includes(query) ||
            (appointment.notes && appointment.notes.toLowerCase().includes(query))
        )

        setFilteredAppointments(filtered)
    }, [appointments, searchQuery])

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Handle items per page change
    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value)
        setCurrentPage(1)
    }

    // Get session type icon
    const getSessionTypeIcon = (type: string) => {
        switch (type) {
            case SessionType.VIDEO:
                return <Video className="h-4 w-4 text-blue-500" />
            case SessionType.PHONE:
                return <Phone className="h-4 w-4 text-green-500" />
            case SessionType.IN_PERSON:
                return <Users className="h-4 w-4 text-purple-500" />
            default:
                return <Calendar className="h-4 w-4" />
        }
    }

    // Format session date/time
    const formatSessionDateTime = (dateTimeStr: string) => {
        const dateTime = parseISO(dateTimeStr)
        const dateFormatted = isToday(dateTime)
            ? 'Today'
            : format(dateTime, 'MMM d, yyyy')
        const timeFormatted = format(dateTime, 'h:mm a')

        return {
            date: dateFormatted,
            time: timeFormatted,
            isPast: isPast(dateTime),
            isToday: isToday(dateTime),
            daysAway: differenceInDays(dateTime, new Date())
        }
    }

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case SessionStatus.SCHEDULED:
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Scheduled</Badge>
            case SessionStatus.COMPLETED:
                return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Completed</Badge>
            case SessionStatus.CANCELLED:
                return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Cancelled</Badge>
            case SessionStatus.NO_SHOW:
                return <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">No Show</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    if (!user) {
        return null
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Sessions</h1>
                        <p className="text-muted-foreground">
                            View, manage and schedule your counselling sessions
                        </p>
                    </div>
                    <Button onClick={() => router.push('/client/appointments/book')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Book New Session
                    </Button>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Tabs
                        defaultValue="upcoming"
                        className="w-full"
                        onValueChange={setActiveTab}
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <TabsList>
                                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                                <TabsTrigger value="past">Past Sessions</TabsTrigger>
                                <TabsTrigger value="all">All Sessions</TabsTrigger>
                            </TabsList>

                            <div className="relative flex-1 sm:max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by counsellor name or notes..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <TabsContent value="upcoming" className="mt-6">
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <div className="animate-pulse text-center">
                                        <p>Loading upcoming sessions...</p>
                                    </div>
                                </div>
                            ) : filteredAppointments.length === 0 ? (
                                <Alert className="bg-blue-50">
                                    <CalendarIcon className="h-4 w-4" />
                                    <AlertTitle>No upcoming sessions</AlertTitle>
                                    <AlertDescription>
                                        You don't have any upcoming sessions scheduled. Click the 'Book New Session' button to schedule one.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="space-y-4">
                                    {filteredAppointments.map((appointment) => {
                                        const { date, time, isToday, daysAway } = formatSessionDateTime(appointment.dateTime)
                                        return (
                                            <Card key={appointment.id} className={isToday ? 'border-blue-200 shadow-sm' : ''}>
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage src={appointment.counsellor?.user?.avatar} />
                                                                <AvatarFallback className="bg-primary/10">
                                                                    {`${appointment.counsellor?.user?.firstName?.[0]}${appointment.counsellor?.user?.lastName?.[0]}`}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <h3 className="font-medium">
                                                                    {appointment.counsellor?.user?.firstName} {appointment.counsellor?.user?.lastName}
                                                                </h3>
                                                                <div className="flex items-center text-sm text-muted-foreground">
                                                                    {getSessionTypeIcon(appointment.type)}
                                                                    <span className="ml-1">{appointment.type === SessionType.IN_PERSON ? 'In Person' : appointment.type.charAt(0) + appointment.type.slice(1).toLowerCase()} Session</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-1">
                                                            <div className="flex items-center">
                                                                <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                                                                <span className={isToday ? 'font-medium text-blue-600' : ''}>
                                                                    {date} • {time}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <Clock className="mr-1 h-4 w-4" />
                                                                <span>{appointment.duration} minutes</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {getStatusBadge(appointment.status)}
                                                            {isToday && (
                                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                                                    Join Session
                                                                </Button>
                                                            )}
                                                            {daysAway > 0 && daysAway < 3 && (
                                                                <Button variant="outline" size="sm">
                                                                    Reschedule
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {appointment.notes && (
                                                        <div className="mt-4 rounded bg-muted p-3 text-sm">
                                                            {appointment.notes}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        )
                                    })}

                                    <DataPagination
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                        showItemsInfo
                                    />
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="past" className="mt-6">
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <div className="animate-pulse text-center">
                                        <p>Loading past sessions...</p>
                                    </div>
                                </div>
                            ) : filteredAppointments.length === 0 ? (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>No past sessions</AlertTitle>
                                    <AlertDescription>
                                        You don't have any past sessions yet.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="space-y-4">
                                    {filteredAppointments.map((appointment) => {
                                        const { date, time } = formatSessionDateTime(appointment.dateTime)
                                        return (
                                            <Card key={appointment.id}>
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage src={appointment.counsellor?.user?.avatar} />
                                                                <AvatarFallback className="bg-primary/10">
                                                                    {`${appointment.counsellor?.user?.firstName?.[0]}${appointment.counsellor?.user?.lastName?.[0]}`}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <h3 className="font-medium">
                                                                    {appointment.counsellor?.user?.firstName} {appointment.counsellor?.user?.lastName}
                                                                </h3>
                                                                <div className="flex items-center text-sm text-muted-foreground">
                                                                    {getSessionTypeIcon(appointment.type)}
                                                                    <span className="ml-1">{appointment.type === SessionType.IN_PERSON ? 'In Person' : appointment.type.charAt(0) + appointment.type.slice(1).toLowerCase()} Session</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-1">
                                                            <div className="flex items-center">
                                                                <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                                                                <span>{date} • {time}</span>
                                                            </div>
                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <Clock className="mr-1 h-4 w-4" />
                                                                <span>{appointment.duration} minutes</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {getStatusBadge(appointment.status)}
                                                            <Button variant="outline" size="sm">
                                                                View Details
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}

                                    <DataPagination
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                        showItemsInfo
                                    />
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="all" className="mt-6">
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <div className="animate-pulse text-center">
                                        <p>Loading all sessions...</p>
                                    </div>
                                </div>
                            ) : filteredAppointments.length === 0 ? (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>No sessions found</AlertTitle>
                                    <AlertDescription>
                                        No sessions match your search criteria.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="space-y-4">
                                    {filteredAppointments.map((appointment) => {
                                        const { date, time, isToday, isPast } = formatSessionDateTime(appointment.dateTime)
                                        return (
                                            <Card key={appointment.id} className={isToday ? 'border-blue-200 shadow-sm' : ''}>
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarImage src={appointment.counsellor?.user?.avatar} />
                                                                <AvatarFallback className="bg-primary/10">
                                                                    {`${appointment.counsellor?.user?.firstName?.[0]}${appointment.counsellor?.user?.lastName?.[0]}`}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <h3 className="font-medium">
                                                                    {appointment.counsellor?.user?.firstName} {appointment.counsellor?.user?.lastName}
                                                                </h3>
                                                                <div className="flex items-center text-sm text-muted-foreground">
                                                                    {getSessionTypeIcon(appointment.type)}
                                                                    <span className="ml-1">{appointment.type === SessionType.IN_PERSON ? 'In Person' : appointment.type.charAt(0) + appointment.type.slice(1).toLowerCase()} Session</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-end gap-1">
                                                            <div className="flex items-center">
                                                                <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                                                                <span className={isToday ? 'font-medium text-blue-600' : ''}>
                                                                    {date} • {time}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <Clock className="mr-1 h-4 w-4" />
                                                                <span>{appointment.duration} minutes</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            {getStatusBadge(appointment.status)}
                                                            {isToday && appointment.status === SessionStatus.SCHEDULED && (
                                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                                                    Join Session
                                                                </Button>
                                                            )}
                                                            {!isPast && appointment.status === SessionStatus.SCHEDULED && (
                                                                <Button variant="outline" size="sm">
                                                                    Reschedule
                                                                </Button>
                                                            )}
                                                            {isPast && (
                                                                <Button variant="outline" size="sm">
                                                                    View Details
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}

                                    <DataPagination
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                        showItemsInfo
                                    />
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardLayout>
    )
} 