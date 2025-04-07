'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Video,
    Phone as PhoneIcon,
    Users,
    MessageSquare,
    Clock,
    MoreVertical,
    Activity,
    ArrowLeft,
    ArrowRight,
    LayoutGrid,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data for sessions/appointments
const events = [
    {
        id: '1',
        title: 'Initial Assessment - John Doe',
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
        type: 'VIDEO',
    },
    {
        id: '2',
        title: 'Follow-up Session - John Doe',
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
        type: 'VIDEO',
    },
    {
        id: '3',
        title: 'Weekly Session - Jane Smith',
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
        type: 'IN_PERSON',
    },
    {
        id: '4',
        title: 'Emergency Session - Robert Johnson',
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
        date: '2023-06-16',
        time: '04:30 PM',
        duration: 30,
        type: 'PHONE',
    },
    {
        id: '5',
        title: 'Weekly Session - Emily Davis',
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
        type: 'VIDEO',
    },
    {
        id: '6',
        title: 'Initial Assessment - James Wilson',
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
        type: 'IN_PERSON',
    },
    {
        id: '7',
        title: 'Group Session - Anxiety Support Group',
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
        type: 'VIDEO',
    }
]

export default function AdminCalendarPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedView, setSelectedView] = useState('month')

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/unauthorized')
        }
    }, [router, user])

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

    // Calendar related functions
    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const startOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1)
    }

    const endOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0)
    }

    const getPreviousMonthDays = (date: Date) => {
        const firstDay = startOfMonth(date).getDay()
        const result = []

        if (firstDay === 0) return result // Sunday, no previous month days needed

        const prevMonthLastDate = new Date(date.getFullYear(), date.getMonth(), 0).getDate()

        for (let i = firstDay - 1; i >= 0; i--) {
            result.push(prevMonthLastDate - i)
        }

        return result
    }

    const getNextMonthDays = (date: Date) => {
        const lastDay = endOfMonth(date).getDay()
        const result = []

        if (lastDay === 6) return result // Saturday, no next month days needed

        for (let i = 1; i <= 6 - lastDay; i++) {
            result.push(i)
        }

        return result
    }

    const getDaysArray = () => {
        const totalDays = daysInMonth(currentDate)
        return Array.from({ length: totalDays }, (_, i) => i + 1)
    }

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const isCurrentMonth = (date: Date) => {
        const today = new Date()
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
    }

    const isToday = (day: number) => {
        const today = new Date()
        return day === today.getDate() && isCurrentMonth(currentDate)
    }

    const getEventsForDay = (day: number) => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

        return events.filter(event => event.date === dateStr)
    }

    const upcomingEvents = events
        .filter(event => {
            const eventDate = new Date(event.date)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            return eventDate >= today
        })
        .sort((a, b) => {
            const dateA = new Date(a.date + 'T' + a.time)
            const dateB = new Date(b.date + 'T' + b.time)
            return dateA.getTime() - dateB.getTime()
        })
        .slice(0, 5)

    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    if (!user) {
        return null
    }

    // Render days of the week
    const renderDaysOfWeek = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return (
            <div className="grid grid-cols-7 gap-1 mb-1">
                {days.map((day) => (
                    <div key={day} className="text-center py-2 text-xs font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}
            </div>
        )
    }

    // Render calendar grid
    const renderCalendarGrid = () => {
        const days = getDaysArray()
        const prevMonthDays = getPreviousMonthDays(currentDate)
        const nextMonthDays = getNextMonthDays(currentDate)

        return (
            <div className="grid grid-cols-7 gap-1">
                {/* Previous month days */}
                {prevMonthDays.map((day) => (
                    <div
                        key={`prev-${day}`}
                        className="min-h-[100px] p-1 border rounded text-muted-foreground opacity-50"
                    >
                        <div className="text-xs">{day}</div>
                    </div>
                ))}

                {/* Current month days */}
                {days.map((day) => {
                    const dayEvents = getEventsForDay(day)
                    return (
                        <div
                            key={day}
                            className={`min-h-[100px] p-1 border rounded hover:bg-muted/50 cursor-pointer ${isToday(day) ? 'bg-primary/5 border-primary/20' : ''
                                }`}
                            onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                        >
                            <div className="flex justify-between items-center">
                                <div className={`text-xs font-medium ${isToday(day) ? 'text-primary' : ''}`}>
                                    {day}
                                </div>
                                {dayEvents.length > 0 && (
                                    <Badge variant="outline" className="text-[9px] h-4 px-1">
                                        {dayEvents.length}
                                    </Badge>
                                )}
                            </div>
                            <div className="mt-1 space-y-1">
                                {dayEvents.slice(0, 2).map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center gap-1 text-[9px] p-1 rounded bg-primary/10 truncate"
                                        title={event.title}
                                    >
                                        {getSessionTypeIcon(event.type)}
                                        <span className="truncate">{event.time} {event.title.split('-')[0]}</span>
                                    </div>
                                ))}
                                {dayEvents.length > 2 && (
                                    <div className="text-[9px] text-muted-foreground pl-1">
                                        + {dayEvents.length - 2} more
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}

                {/* Next month days */}
                {nextMonthDays.map((day) => (
                    <div
                        key={`next-${day}`}
                        className="min-h-[100px] p-1 border rounded text-muted-foreground opacity-50"
                    >
                        <div className="text-xs">{day}</div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                    <p className="text-muted-foreground">
                        View and manage counselling sessions and appointments
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Event
                    </Button>
                </div>
            </div>

            {/* Calendar and Upcoming Events */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Calendar */}
                <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle>Calendar</CardTitle>
                            <div className="flex items-center space-x-2">
                                <Tabs defaultValue="month" className="w-[200px]">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="month">Month</TabsTrigger>
                                        <TabsTrigger value="week">Week</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={previousMonth}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="font-medium">
                                    {formatMonthYear(currentDate)}
                                </div>
                                <Button variant="outline" size="sm" onClick={nextMonth}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                                Today
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {renderDaysOfWeek()}
                        {renderCalendarGrid()}
                    </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Sessions</CardTitle>
                        <CardDescription>Next 5 scheduled sessions</CardDescription>
                    </CardHeader>
                    <CardContent className="px-2">
                        <div className="space-y-2">
                            {upcomingEvents.map((event) => (
                                <div key={event.id} className="p-3 rounded-lg hover:bg-muted">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {getSessionTypeIcon(event.type)}
                                            <h4 className="font-medium text-sm">{event.title.split('-')[0].trim()}</h4>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Edit Session</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    Cancel Session
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={event.client.avatar} />
                                            <AvatarFallback className="text-[10px]">
                                                {event.client.name.split(' ').map((n: string) => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{event.client.name}</span>
                                    </div>
                                    <div className="flex items-center text-muted-foreground mt-2 text-xs">
                                        <CalendarIcon className="h-3 w-3 mr-1" />
                                        <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                        <Clock className="h-3 w-3 ml-2 mr-1" />
                                        <span>{event.time} ({event.duration} min)</span>
                                    </div>
                                </div>
                            ))}
                            {upcomingEvents.length === 0 && (
                                <div className="py-8 text-center text-muted-foreground">
                                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No upcoming sessions</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}