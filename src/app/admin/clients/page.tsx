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
    Building2,
    Users,
    User,
    ChevronDown,
    Download,
    Plus,
    Activity,
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
import Link from 'next/link'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

// Import mock data
import { clients } from './mock-data'

// Client type icon
const getClientTypeIcon = (clientType: string) => {
    switch (clientType) {
        case 'COMPANY':
            return <div className="flex justify-center"><Building2 className="h-4 w-4 text-blue-400" /></div>;
        case 'INDIVIDUAL':
            return <div className="flex justify-center"><User className="h-4 w-4 text-purple-400" /></div>;
        default:
            return <div className="flex justify-center"><UserCircle className="h-4 w-4" /></div>;
    }
}

// Calculate beneficiaries count
const getBeneficiariesCount = (client: Client) => {
    if (client.clientType !== 'COMPANY' || !client.beneficiaries) return 0;
    return client.beneficiaries.length;
}

// Calculate total dependants count
const getDependantsCount = (client: any) => {
    if (client.clientType === 'COMPANY' && client.beneficiaries) {
        return client.beneficiaries.reduce((total: number, beneficiary: any) => {
            return total + (beneficiary.dependants?.length || 0);
        }, 0);
    } else if (client.clientType === 'INDIVIDUAL' && client.dependants) {
        return client.dependants.length;
    }
    return 0;
}

export default function AdminClientsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [clientTypeFilter, setClientTypeFilter] = useState('ALL')
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

        const matchesClientType = clientTypeFilter === 'ALL' || client.clientType === clientTypeFilter

        return matchesSearch && matchesStatus && matchesClientType
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
                return <div className="flex justify-center"><CheckCircle2 className="h-4 w-4 text-green-500" /></div>;
            case 'PENDING':
                return <div className="flex justify-center"><Calendar className="h-4 w-4 text-amber-400" /></div>;
            case 'INACTIVE':
                return <div className="flex justify-center"><XCircle className="h-4 w-4 text-muted-foreground" /></div>;
            case 'SUSPENDED':
                return <div className="flex justify-center"><AlertCircle className="h-4 w-4 text-destructive" /></div>;
            default:
                return <div className="flex justify-center"><AlertCircle className="h-4 w-4" /></div>;
        }
    }

    // Calculate updated client statistics
    const clientStats = {
        total: clients.length,
        active: clients.filter(u => u.status === 'ACTIVE').length,
        inactive: clients.filter(u => u.status === 'INACTIVE').length,
        suspended: clients.filter(u => u.status === 'SUSPENDED').length,
        companies: clients.filter(u => u.clientType === 'COMPANY').length,
        individuals: clients.filter(u => u.clientType === 'INDIVIDUAL').length
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
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Import
                    </Button>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Client
                    </Button>
                </div>
            </div>

            {/* Client Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-background via-background/95 to-blue-500/5 border-blue-500/10 overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex">
                            <div className="h-16 w-16 min-w-[4rem] rounded-full bg-primary/10 flex items-center justify-center mr-4 border border-primary/20">
                                <UserCircle className="h-8 w-8 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-lg font-bold mb-2 flex items-center">
                                    Total Clients: <span className="ml-1.5 text-primary">{clientStats.total}</span>
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-start">
                                        <div className="h-5 w-5 min-w-[1.25rem] rounded-full bg-blue-500/10 flex items-center justify-center mr-2 mt-0.5">
                                            <Building2 className="h-3 w-3 text-blue-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <p className="text-sm font-medium whitespace-nowrap">
                                                    Org: <span className="text-blue-500 min-w-[2rem] inline-block">{clientStats.companies}</span>
                                                </p>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center whitespace-nowrap">
                                                                <Users className="h-3 w-3 mr-1 flex-shrink-0 text-blue-400" />
                                                                <span className="text-xs truncate max-w-[7rem]">{clients.reduce((sum, client) => client.clientType === 'COMPANY' ? sum + (getBeneficiariesCount(client) || 0) : sum, 0)} staff</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Total Staff (Beneficiaries)</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center whitespace-nowrap">
                                                                <User className="h-3 w-3 mr-1 flex-shrink-0 text-purple-400" />
                                                                <span className="text-xs truncate max-w-[7rem]">{clients.reduce((sum, client) => client.clientType === 'COMPANY' ? sum + getDependantsCount(client) : sum, 0)} deps</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Total Company Dependants</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="h-5 w-5 min-w-[1.25rem] rounded-full bg-purple-500/10 flex items-center justify-center mr-2 mt-0.5">
                                            <User className="h-3 w-3 text-purple-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <p className="text-sm font-medium whitespace-nowrap">
                                                    Ind: <span className="text-purple-500 min-w-[2rem] inline-block">{clientStats.individuals}</span>
                                                </p>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center whitespace-nowrap">
                                                                <User className="h-3 w-3 mr-1 flex-shrink-0 text-purple-400" />
                                                                <span className="text-xs truncate max-w-[7rem]">{clients.reduce((sum, client) => client.clientType === 'INDIVIDUAL' ? sum + getDependantsCount(client) : sum, 0)} deps</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Total Individual Dependants</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-background via-background/95 to-green-500/5 border-green-500/10 overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex">
                            <div className="h-16 w-16 min-w-[4rem] rounded-full bg-blue-500/10 flex items-center justify-center mr-4 border border-blue-500/20">
                                <Activity className="h-8 w-8 text-blue-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <p className="text-lg font-bold mb-2 flex items-center">
                                                Status Summary: <span className="ml-1.5 text-blue-500">{clientStats.total}</span>
                                            </p>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Total Client Accounts</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="space-y-2">
                                    <div className="flex items-start">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="h-5 w-5 min-w-[1.25rem] rounded-full bg-green-500/10 flex items-center justify-center mr-2 mt-0.5">
                                                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Active Clients</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <p className="text-sm font-medium whitespace-nowrap">
                                                    Active: <span className="text-green-500 min-w-[2rem] inline-block">{clientStats.active}</span>
                                                </p>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {Math.round((clientStats.active / clientStats.total) * 100)}% of clients
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="h-5 w-5 min-w-[1.25rem] rounded-full bg-red-500/10 flex items-center justify-center mr-2 mt-0.5">
                                                        <XCircle className="h-3 w-3 text-red-500" />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Inactive & Suspended Clients</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <p className="text-sm font-medium whitespace-nowrap">
                                                    Inactive: <span className="text-red-500 min-w-[2rem] inline-block">{clientStats.inactive + clientStats.suspended}</span>
                                                </p>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {Math.round(((clientStats.inactive + clientStats.suspended) / clientStats.total) * 100)}% of clients
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-background via-background/95 to-purple-500/5 border-purple-500/10 overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex">
                            <div className="h-16 w-16 min-w-[4rem] rounded-full bg-purple-500/10 flex items-center justify-center mr-4 border border-purple-500/20">
                                <MessageSquare className="h-8 w-8 text-purple-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <p className="text-lg font-bold mb-2 flex items-center">
                                                Sessions: <span className="ml-1.5 text-purple-500">{clients.reduce((sum, client) => sum + client.appointments, 0)}</span>
                                            </p>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Total Counseling Sessions</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="space-y-2">
                                    <div className="flex items-start">
                                        <div className="h-5 w-5 min-w-[1.25rem] rounded-full bg-blue-500/10 flex items-center justify-center mr-2 mt-0.5">
                                            <Building2 className="h-3 w-3 text-blue-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <p className="text-sm font-medium whitespace-nowrap">
                                                    Company: <span className="text-blue-500 min-w-[2rem] inline-block">{clients.filter(c => c.clientType === 'COMPANY').reduce((sum, client) => sum + client.appointments, 0)}</span>
                                                </p>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {Math.round((clients.filter(c => c.clientType === 'COMPANY').reduce((sum, client) => sum + client.appointments, 0) / clients.reduce((sum, client) => sum + client.appointments, 0)) * 100)}% of sessions
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="h-5 w-5 min-w-[1.25rem] rounded-full bg-purple-500/10 flex items-center justify-center mr-2 mt-0.5">
                                            <User className="h-3 w-3 text-purple-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <p className="text-sm font-medium whitespace-nowrap">
                                                    Individual: <span className="text-purple-500 min-w-[2rem] inline-block">{clients.filter(c => c.clientType === 'INDIVIDUAL').reduce((sum, client) => sum + client.appointments, 0)}</span>
                                                </p>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {Math.round((clients.filter(c => c.clientType === 'INDIVIDUAL').reduce((sum, client) => sum + client.appointments, 0) / clients.reduce((sum, client) => sum + client.appointments, 0)) * 100)}% of sessions
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                            <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
                                <SelectTrigger className="w-[150px] h-8">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Types</SelectItem>
                                    <SelectItem value="COMPANY">Companies</SelectItem>
                                    <SelectItem value="INDIVIDUAL">Individuals</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[240px] py-2 px-3">Name</TableHead>
                                        <TableHead className="w-[60px] py-2 px-3 text-center">Type</TableHead>
                                        <TableHead className="w-[200px] py-2 px-3">Email</TableHead>
                                        <TableHead className="w-[90px] py-2 px-3 text-center">Sessions</TableHead>
                                        <TableHead className="w-[100px] py-2 px-3 text-center">Beneficiaries</TableHead>
                                        <TableHead className="w-[60px] py-2 px-3 text-center">Status</TableHead>
                                        <TableHead className="w-[60px] py-2 px-3">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedClients.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell className="py-1.5 px-3">
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
                                            <TableCell className="py-1.5 px-3 text-center">
                                                {getClientTypeIcon(client.clientType)}
                                            </TableCell>
                                            <TableCell className="py-1.5 px-3">
                                                <span className="text-sm whitespace-nowrap">{client.email}</span>
                                            </TableCell>
                                            <TableCell className="py-1.5 px-3 text-center">
                                                <span className="text-xs font-normal">{client.appointments}</span>
                                            </TableCell>
                                            <TableCell className="py-1.5 px-3 text-center">
                                                {client.clientType === 'COMPANY' ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="link"
                                                                        size="sm"
                                                                        className="h-6 px-0 text-blue-600 text-xs flex items-center hover:bg-transparent hover:no-underline"
                                                                        onClick={() => router.push(`/admin/clients/${client.id}/beneficiaries`)}
                                                                    >
                                                                        <Users className="h-3.5 w-3.5" />
                                                                        <span className="-ml-1">{getBeneficiariesCount(client)}</span>
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{getBeneficiariesCount(client)} Beneficiaries</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        {getDependantsCount(client) > 0 && (
                                                            <>
                                                                <span className="text-muted-foreground">|</span>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="link"
                                                                                size="sm"
                                                                                className="h-6 px-0 text-purple-600 text-xs flex items-center hover:bg-transparent hover:no-underline"
                                                                                onClick={() => router.push(`/admin/clients/${client.id}/dependants`)}
                                                                            >
                                                                                <User className="h-3.5 w-3.5" />
                                                                                <span className="-ml-1">{getDependantsCount(client)}</span>
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>{getDependantsCount(client)} Dependants</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-center">
                                                        {getDependantsCount(client) > 0 ? (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="link"
                                                                            size="sm"
                                                                            className="h-6 px-0 text-purple-600 text-xs flex items-center hover:bg-transparent hover:no-underline"
                                                                            onClick={() => router.push(`/admin/clients/${client.id}/family`)}
                                                                        >
                                                                            <User className="h-3.5 w-3.5" />
                                                                            <span className="-ml-1">{getDependantsCount(client)}</span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{getDependantsCount(client)} Dependants</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">N/A</span>
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-1.5 px-3 text-center">
                                                {getStatusIcon(client.status)}
                                            </TableCell>
                                            <TableCell className="py-1.5 px-3">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-7 w-7 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => router.push(`/admin/clients/${client.id}`)}>
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