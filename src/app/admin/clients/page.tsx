'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
    Search,
    Filter,
    MoreVertical,
    UserCircle,
    Phone,
    Calendar,
    CheckCircle2,
    XCircle,
    AlertCircle,
    UserPlus,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit,
    Trash2,
    MessageSquare,
    FileText,
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// Mock data for clients
const clients = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        status: 'ACTIVE',
        joinDate: '2023-01-15',
        lastActive: '2023-06-10',
        avatar: 'https://avatar.vercel.sh/1.png',
        phoneNumber: '+1 (555) 123-4567',
        clientType: 'PRIMARY',
        appointments: 12,
        messages: 45,
        resources: 8,
        counsellor: 'Dr. Michael Chen',
        notes: 'Regular client, prefers morning sessions.'
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        status: 'ACTIVE',
        joinDate: '2023-02-20',
        lastActive: '2023-06-12',
        avatar: 'https://avatar.vercel.sh/2.png',
        phoneNumber: '+1 (555) 234-5678',
        clientType: 'SECONDARY',
        appointments: 8,
        messages: 32,
        resources: 5,
        counsellor: 'Dr. Lisa Brown',
        notes: 'Prefers video sessions.'
    },
    {
        id: '5',
        name: 'Robert Johnson',
        email: 'robert@example.com',
        status: 'INACTIVE',
        joinDate: '2023-05-15',
        lastActive: '2023-05-20',
        avatar: 'https://avatar.vercel.sh/5.png',
        phoneNumber: '+1 (555) 567-8901',
        clientType: 'PRIMARY',
        appointments: 3,
        messages: 12,
        resources: 2,
        counsellor: 'Dr. Sarah Wilson',
        notes: 'Inactive for over a month, may need follow-up.'
    },
    {
        id: '6',
        name: 'Emily Davis',
        email: 'emily@example.com',
        status: 'SUSPENDED',
        joinDate: '2023-01-25',
        lastActive: '2023-04-15',
        avatar: 'https://avatar.vercel.sh/6.png',
        phoneNumber: '+1 (555) 678-9012',
        clientType: 'SECONDARY',
        appointments: 5,
        messages: 18,
        resources: 3,
        counsellor: 'Dr. Patricia Lee',
        notes: 'Account suspended due to inappropriate behavior.'
    },
    {
        id: '9',
        name: 'James Wilson',
        email: 'james@example.com',
        status: 'ACTIVE',
        joinDate: '2023-05-20',
        lastActive: '2023-06-10',
        avatar: 'https://avatar.vercel.sh/9.png',
        phoneNumber: '+1 (555) 901-2345',
        clientType: 'PRIMARY',
        appointments: 6,
        messages: 22,
        resources: 4,
        counsellor: 'Dr. Michael Chen',
        notes: 'New client, showing good progress.'
    }
]

export default function AdminClientsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/unauthorized')
        }
    }, [router, user])

    const filteredClients = clients.filter(client => {
        const matchesSearch =
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Pagination
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage)
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'PENDING':
                return <Calendar className="h-4 w-4 text-amber-500" />;
            case 'INACTIVE':
                return <XCircle className="h-4 w-4 text-muted-foreground" />;
            case 'SUSPENDED':
                return <AlertCircle className="h-4 w-4 text-destructive" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    }

    // Calculate client statistics
    const clientStats = {
        total: clients.length,
        active: clients.filter(u => u.status === 'ACTIVE').length,
        inactive: clients.filter(u => u.status === 'INACTIVE').length,
        suspended: clients.filter(u => u.status === 'SUSPENDED').length
    }

    if (!user) {
        return null
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                    <p className="text-muted-foreground">
                        Manage client accounts and view client information
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Client
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Client</DialogTitle>
                                <DialogDescription>
                                    Create a new client account with contact details and assigned counsellor.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Full name"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right">
                                        Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        placeholder="+1 (555) 123-4567"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="counsellor" className="text-right">
                                        Counsellor
                                    </Label>
                                    <Select>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Assign counsellor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="michael">Dr. Michael Chen</SelectItem>
                                            <SelectItem value="sarah">Dr. Sarah Wilson</SelectItem>
                                            <SelectItem value="lisa">Dr. Lisa Brown</SelectItem>
                                            <SelectItem value="patricia">Dr. Patricia Lee</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddClientDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create Client</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Client Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-primary/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <UserCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Clients</p>
                            <h3 className="text-2xl font-bold">{clientStats.total}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-green-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-green-500/10 p-2 rounded-full">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Active Clients</p>
                            <h3 className="text-2xl font-bold">{clientStats.active}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-amber-500/10 p-2 rounded-full">
                            <MessageSquare className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Sessions</p>
                            <h3 className="text-2xl font-bold">{clients.reduce((sum, client) => sum + client.appointments, 0)}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-red-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-red-500/10 p-2 rounded-full">
                            <XCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Inactive/Suspended</p>
                            <h3 className="text-2xl font-bold">{clientStats.inactive + clientStats.suspended}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <Card>
                <CardHeader>
                    <CardTitle>Client Management</CardTitle>
                    <CardDescription>
                        View and manage all client accounts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search clients..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-8"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px] h-8">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px] px-4">Name</TableHead>
                                        <TableHead className="w-[170px] px-4">Email</TableHead>
                                        <TableHead className="w-[180px] px-4">Counsellor</TableHead>
                                        <TableHead className="w-[90px] px-4">Sessions</TableHead>
                                        <TableHead className="w-[60px] px-4 text-center">Status</TableHead>
                                        <TableHead className="w-[60px] px-4">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedClients.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell className="px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={client.avatar} />
                                                        <AvatarFallback className="text-[10px]">
                                                            {client.name.split(' ').map((n: string) => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm whitespace-nowrap">{client.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                <span className="text-sm whitespace-nowrap">{client.email}</span>
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                <span className="text-sm whitespace-nowrap">{client.counsellor}</span>
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    {client.appointments}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-center">
                                                {getStatusIcon(client.status)}
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
                                                            View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <MessageSquare className="mr-2 h-4 w-4" />
                                                            Message
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            Notes
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
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
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} clients
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