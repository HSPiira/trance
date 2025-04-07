'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
    Search,
    Filter,
    MoreVertical,
    HeartHandshake,
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
    Star,
    Users,
    MessageSquare,
    FileText,
    Briefcase,
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

// Mock data for counsellors
const counsellors = [
    {
        id: '1',
        name: 'Dr. Michael Chen',
        email: 'michael@example.com',
        status: 'ACTIVE',
        joinDate: '2023-03-05',
        lastActive: '2023-06-11',
        avatar: 'https://avatar.vercel.sh/3.png',
        phoneNumber: '+1 (555) 345-6789',
        specialization: 'Anxiety, Depression',
        clients: 24,
        sessions: 156,
        rating: 4.8,
        experience: '10 years',
        qualifications: 'Ph.D. in Clinical Psychology',
        notes: 'Highly rated counsellor, specializes in cognitive behavioral therapy.'
    },
    {
        id: '2',
        name: 'Dr. Sarah Wilson',
        email: 'sarah@example.com',
        status: 'PENDING',
        joinDate: '2023-04-10',
        lastActive: '2023-06-09',
        avatar: 'https://avatar.vercel.sh/4.png',
        phoneNumber: '+1 (555) 456-7890',
        specialization: 'Trauma, PTSD',
        clients: 0,
        sessions: 0,
        rating: 0,
        experience: '8 years',
        qualifications: 'M.D., Psychiatry',
        notes: 'New counsellor, pending verification of credentials.'
    },
    {
        id: '3',
        name: 'Dr. Lisa Brown',
        email: 'lisa@example.com',
        status: 'ACTIVE',
        joinDate: '2023-03-15',
        lastActive: '2023-06-11',
        avatar: 'https://avatar.vercel.sh/8.png',
        phoneNumber: '+1 (555) 890-1234',
        specialization: 'Addiction, Recovery',
        clients: 18,
        sessions: 124,
        rating: 4.6,
        experience: '12 years',
        qualifications: 'Ph.D. in Clinical Psychology',
        notes: 'Experienced counsellor with background in addiction recovery.'
    },
    {
        id: '4',
        name: 'Dr. Patricia Lee',
        email: 'patricia@example.com',
        status: 'ACTIVE',
        joinDate: '2023-02-05',
        lastActive: '2023-06-12',
        avatar: 'https://avatar.vercel.sh/10.png',
        phoneNumber: '+1 (555) 012-3456',
        specialization: 'Family Therapy, Relationships',
        clients: 22,
        sessions: 142,
        rating: 4.9,
        experience: '15 years',
        qualifications: 'Ph.D. in Family Therapy',
        notes: 'Highly rated family therapist, specializes in relationship counseling.'
    },
    {
        id: '5',
        name: 'Dr. Robert Williams',
        email: 'robert@example.com',
        status: 'INACTIVE',
        joinDate: '2023-01-10',
        lastActive: '2023-05-01',
        avatar: 'https://avatar.vercel.sh/11.png',
        phoneNumber: '+1 (555) 234-5678',
        specialization: 'Behavioral Therapy, OCD',
        clients: 5,
        sessions: 48,
        rating: 4.2,
        experience: '5 years',
        qualifications: 'M.S. in Clinical Psychology',
        notes: 'Currently on leave of absence.'
    }
]

export default function AdminCounsellorsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [isAddCounsellorDialogOpen, setIsAddCounsellorDialogOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/unauthorized')
        }
    }, [router, user])

    const filteredCounsellors = counsellors.filter(counsellor => {
        const matchesSearch =
            counsellor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            counsellor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            counsellor.specialization.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'ALL' || counsellor.status === statusFilter

        return matchesSearch && matchesStatus
    })

    // Pagination
    const totalPages = Math.ceil(filteredCounsellors.length / itemsPerPage)
    const paginatedCounsellors = filteredCounsellors.slice(
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

    // Calculate counsellor statistics
    const counsellorStats = {
        total: counsellors.length,
        active: counsellors.filter(c => c.status === 'ACTIVE').length,
        pending: counsellors.filter(c => c.status === 'PENDING').length,
        inactive: counsellors.filter(c => c.status === 'INACTIVE' || c.status === 'SUSPENDED').length,
        totalClients: counsellors.reduce((sum, c) => sum + c.clients, 0),
        totalSessions: counsellors.reduce((sum, c) => sum + c.sessions, 0),
        averageRating: counsellors.filter(c => c.rating > 0).reduce((sum, c) => sum + c.rating, 0) /
            counsellors.filter(c => c.rating > 0).length
    }

    if (!user) {
        return null
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Counsellors</h1>
                    <p className="text-muted-foreground">
                        Manage counsellors, their specializations, and client assignments
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isAddCounsellorDialogOpen} onOpenChange={setIsAddCounsellorDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Counsellor
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Counsellor</DialogTitle>
                                <DialogDescription>
                                    Create a new counsellor profile with qualifications and specialization.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder="Dr. Full Name"
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
                                    <Label htmlFor="specialization" className="text-right">
                                        Specialization
                                    </Label>
                                    <Input
                                        id="specialization"
                                        placeholder="e.g. Anxiety, Depression"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="qualifications" className="text-right">
                                        Qualifications
                                    </Label>
                                    <Input
                                        id="qualifications"
                                        placeholder="e.g. Ph.D. in Clinical Psychology"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="experience" className="text-right">
                                        Experience
                                    </Label>
                                    <Input
                                        id="experience"
                                        placeholder="e.g. 10 years"
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddCounsellorDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create Counsellor</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Counsellor Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-primary/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <HeartHandshake className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Counsellors</p>
                            <h3 className="text-2xl font-bold">{counsellorStats.total}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-green-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-green-500/10 p-2 rounded-full">
                            <Users className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Clients</p>
                            <h3 className="text-2xl font-bold">{counsellorStats.totalClients}</h3>
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
                            <h3 className="text-2xl font-bold">{counsellorStats.totalSessions}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-blue-500/10 p-2 rounded-full">
                            <Star className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Avg. Rating</p>
                            <h3 className="text-2xl font-bold">{counsellorStats.averageRating.toFixed(1)}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <Card>
                <CardHeader>
                    <CardTitle>Counsellor Management</CardTitle>
                    <CardDescription>
                        View and manage all counsellors and their specializations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search counsellors or specializations..."
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
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px] px-4">Name</TableHead>
                                        <TableHead className="w-[170px] px-4">Email</TableHead>
                                        <TableHead className="w-[200px] px-4">Specialization</TableHead>
                                        <TableHead className="w-[80px] px-4 text-center">Clients</TableHead>
                                        <TableHead className="w-[80px] px-4 text-center">Rating</TableHead>
                                        <TableHead className="w-[60px] px-4 text-center">Status</TableHead>
                                        <TableHead className="w-[60px] px-4">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedCounsellors.map((counsellor) => (
                                        <TableRow key={counsellor.id}>
                                            <TableCell className="px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={counsellor.avatar} />
                                                        <AvatarFallback className="text-[10px]">
                                                            {counsellor.name.split(' ').map((n: string) => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm whitespace-nowrap">{counsellor.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                <span className="text-sm whitespace-nowrap">{counsellor.email}</span>
                                            </TableCell>
                                            <TableCell className="px-4 py-2">
                                                <span className="text-sm whitespace-nowrap">{counsellor.specialization}</span>
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-center">
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    {counsellor.clients}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-center">
                                                <div className="flex items-center justify-center">
                                                    <Star className="h-3 w-3 text-amber-500 mr-1" />
                                                    <span className="text-xs">{counsellor.rating > 0 ? counsellor.rating.toFixed(1) : '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-2 text-center">
                                                {getStatusIcon(counsellor.status)}
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
                                                            <Users className="mr-2 h-4 w-4" />
                                                            Manage Clients
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Briefcase className="mr-2 h-4 w-4" />
                                                            Qualifications
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
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCounsellors.length)} of {filteredCounsellors.length} counsellors
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