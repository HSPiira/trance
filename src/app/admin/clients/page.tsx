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

// Import mock data
import { clients } from './mock-data'

// Client type icon
const getClientTypeIcon = (clientType: string) => {
    switch (clientType) {
        case 'COMPANY':
            return <Building2 className="h-4 w-4 text-blue-400" />;
        case 'INDIVIDUAL':
            return <User className="h-4 w-4 text-purple-400" />;
        default:
            return <UserCircle className="h-4 w-4" />;
    }
}

// Calculate beneficiaries count
const getBeneficiariesCount = (client: any) => {
    if (client.clientType !== 'COMPANY' || !client.beneficiaries) return 0;
    return client.beneficiaries.length;
}

// Calculate total dependants count
const getDependantsCount = (client: any) => {
    if (client.clientType !== 'COMPANY' || !client.beneficiaries) return 0;
    return client.beneficiaries.reduce((total: number, beneficiary: any) => {
        return total + (beneficiary.dependants?.length || 0);
    }, 0);
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
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'PENDING':
                return <Calendar className="h-4 w-4 text-amber-400" />;
            case 'INACTIVE':
                return <XCircle className="h-4 w-4 text-muted-foreground" />;
            case 'SUSPENDED':
                return <AlertCircle className="h-4 w-4 text-destructive" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-white to-slate-50 shadow-sm">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center h-12 w-12 border-2 border-primary/20">
                            <UserCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                            <h3 className="text-xl font-semibold tracking-tight">{clientStats.total}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-blue-50 shadow-sm">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-blue-400/10 p-3 rounded-full flex items-center justify-center h-12 w-12 border-2 border-blue-100">
                            <Building2 className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Companies</p>
                            <h3 className="text-xl font-semibold tracking-tight">{clientStats.companies}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-purple-50 shadow-sm">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-purple-400/10 p-3 rounded-full flex items-center justify-center h-12 w-12 border-2 border-purple-100">
                            <User className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Individuals</p>
                            <h3 className="text-xl font-semibold tracking-tight">{clientStats.individuals}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-green-50 shadow-sm">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-green-400/10 p-3 rounded-full flex items-center justify-center h-12 w-12 border-2 border-green-100">
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active</p>
                            <h3 className="text-xl font-semibold tracking-tight">{clientStats.active}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-purple-50 shadow-sm">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-purple-400/10 p-3 rounded-full flex items-center justify-center h-12 w-12 border-2 border-purple-100">
                            <MessageSquare className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Sessions</p>
                            <h3 className="text-xl font-semibold tracking-tight">{clients.reduce((sum, client) => sum + client.appointments, 0)}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-red-50 shadow-sm">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-red-400/10 p-3 rounded-full flex items-center justify-center h-12 w-12 border-2 border-red-100">
                            <XCircle className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                            <h3 className="text-xl font-semibold tracking-tight">{clientStats.inactive + clientStats.suspended}</h3>
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
                                    <TableRow>
                                        <TableHead className="w-[200px] px-4">Name</TableHead>
                                        <TableHead className="w-[60px] px-4 text-center">Type</TableHead>
                                        <TableHead className="w-[170px] px-4">Email</TableHead>
                                        <TableHead className="w-[160px] px-4">Counsellor</TableHead>
                                        <TableHead className="w-[90px] px-4">Sessions</TableHead>
                                        <TableHead className="w-[100px] px-4">Beneficiaries</TableHead>
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
                                            <TableCell className="px-4 py-2 text-center">
                                                {getClientTypeIcon(client.clientType)}
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
                                            <TableCell className="px-4 py-2">
                                                {client.clientType === 'COMPANY' ? (
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-600 text-xs font-normal border-blue-200">
                                                            <Users className="h-3 w-3 mr-1" />
                                                            {getBeneficiariesCount(client)}
                                                        </Badge>
                                                        {getDependantsCount(client) > 0 && (
                                                            <Badge variant="outline" className="bg-purple-50 text-purple-600 text-xs font-normal border-purple-200">
                                                                <User className="h-3 w-3 mr-1" />
                                                                {getDependantsCount(client)}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">N/A</span>
                                                )}
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