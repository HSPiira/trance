'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Mail,
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
    Shield,
    User,
    Clock,
    Activity,
    MessageSquare,
    FileText,
    Settings,
    Ban,
    Key,
    BarChart,
    PieChart,
    UserCheck,
    UserCog,
    UserX,
    Users2,
    Moon,
    Sun,
    CheckCircle,
    Clock8,
    XCircle as XIcon,
    AlertOctagon,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { DataPagination } from '@/components/ui/data-pagination'

// Mock data for users
const users = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CLIENT',
        status: 'ACTIVE',
        joinDate: '2023-01-15',
        lastActive: '2023-06-10',
        avatar: 'https://avatar.vercel.sh/1.png',
        phoneNumber: '+1 (555) 123-4567',
        clientType: 'PRIMARY',
        appointments: 12,
        messages: 45,
        resources: 8,
        notes: 'Regular client, prefers morning sessions.'
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'CLIENT',
        status: 'ACTIVE',
        joinDate: '2023-02-20',
        lastActive: '2023-06-12',
        avatar: 'https://avatar.vercel.sh/2.png',
        phoneNumber: '+1 (555) 234-5678',
        clientType: 'SECONDARY',
        appointments: 8,
        messages: 32,
        resources: 5,
        notes: 'Prefers video sessions.'
    },
    {
        id: '3',
        name: 'Dr. Michael Chen',
        email: 'michael@example.com',
        role: 'COUNSELLOR',
        status: 'ACTIVE',
        joinDate: '2023-03-05',
        lastActive: '2023-06-11',
        avatar: 'https://avatar.vercel.sh/3.png',
        phoneNumber: '+1 (555) 345-6789',
        specialization: 'Anxiety, Depression',
        clients: 24,
        sessions: 156,
        rating: 4.8,
        notes: 'Highly rated counsellor, specializes in cognitive behavioral therapy.'
    },
    {
        id: '4',
        name: 'Dr. Sarah Wilson',
        email: 'sarah@example.com',
        role: 'COUNSELLOR',
        status: 'PENDING',
        joinDate: '2023-04-10',
        lastActive: '2023-06-09',
        avatar: 'https://avatar.vercel.sh/4.png',
        phoneNumber: '+1 (555) 456-7890',
        specialization: 'Trauma, PTSD',
        clients: 0,
        sessions: 0,
        rating: 0,
        notes: 'New counsellor, pending verification of credentials.'
    },
    {
        id: '5',
        name: 'Robert Johnson',
        email: 'robert@example.com',
        role: 'CLIENT',
        status: 'INACTIVE',
        joinDate: '2023-05-15',
        lastActive: '2023-05-20',
        avatar: 'https://avatar.vercel.sh/5.png',
        phoneNumber: '+1 (555) 567-8901',
        clientType: 'PRIMARY',
        appointments: 3,
        messages: 12,
        resources: 2,
        notes: 'Inactive for over a month, may need follow-up.'
    },
    {
        id: '6',
        name: 'Emily Davis',
        email: 'emily@example.com',
        role: 'CLIENT',
        status: 'SUSPENDED',
        joinDate: '2023-01-25',
        lastActive: '2023-04-15',
        avatar: 'https://avatar.vercel.sh/6.png',
        phoneNumber: '+1 (555) 678-9012',
        clientType: 'SECONDARY',
        appointments: 5,
        messages: 18,
        resources: 3,
        notes: 'Account suspended due to inappropriate behavior.'
    },
    {
        id: '7',
        name: 'David Wilson',
        email: 'david@example.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        joinDate: '2023-01-10',
        lastActive: '2023-06-12',
        avatar: 'https://avatar.vercel.sh/7.png',
        phoneNumber: '+1 (555) 789-0123',
        permissions: ['manage_users', 'manage_resources', 'manage_settings'],
        lastLogin: '2023-06-12 09:45 AM',
        notes: 'System administrator with full access.'
    },
    {
        id: '8',
        name: 'Lisa Brown',
        email: 'lisa@example.com',
        role: 'COUNSELLOR',
        status: 'ACTIVE',
        joinDate: '2023-03-15',
        lastActive: '2023-06-11',
        avatar: 'https://avatar.vercel.sh/8.png',
        phoneNumber: '+1 (555) 890-1234',
        specialization: 'Addiction, Recovery',
        clients: 18,
        sessions: 124,
        rating: 4.6,
        notes: 'Experienced counsellor with background in addiction recovery.'
    },
    {
        id: '9',
        name: 'James Wilson',
        email: 'james@example.com',
        role: 'CLIENT',
        status: 'ACTIVE',
        joinDate: '2023-05-20',
        lastActive: '2023-06-10',
        avatar: 'https://avatar.vercel.sh/9.png',
        phoneNumber: '+1 (555) 901-2345',
        clientType: 'PRIMARY',
        appointments: 6,
        messages: 22,
        resources: 4,
        notes: 'New client, showing good progress.'
    },
    {
        id: '10',
        name: 'Patricia Lee',
        email: 'patricia@example.com',
        role: 'COUNSELLOR',
        status: 'ACTIVE',
        joinDate: '2023-02-05',
        lastActive: '2023-06-12',
        avatar: 'https://avatar.vercel.sh/10.png',
        phoneNumber: '+1 (555) 012-3456',
        specialization: 'Family Therapy, Relationships',
        clients: 22,
        sessions: 142,
        rating: 4.9,
        notes: 'Highly rated family therapist, specializes in relationship counseling.'
    }
]

export default function AdminUsersPage() {
    const router = useRouter()
    const { user } = useAuth()
    const { theme, setTheme } = useTheme()
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState('ALL')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [isEditMode, setIsEditMode] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
    const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false)
    const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/unauthorized')
        }
    }, [router, user])

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
        const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter

        return matchesSearch && matchesRole && matchesStatus
    })

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleUserSelect = (user: any) => {
        if (selectedUser?.id === user.id) {
            setSelectedUser(null);
        } else {
            setSelectedUser(user);
            setIsEditMode(false);
        }
    }

    const handleEditUser = () => {
        setIsEditMode(true)
    }

    const handleSaveUser = () => {
        // In a real app, this would save to the backend
        setIsEditMode(false)
    }

    const handleDeleteUser = () => {
        // In a real app, this would delete from the backend
        setIsDeleteDialogOpen(false)
        setSelectedUser(null)
    }

    const handleSuspendUser = () => {
        // In a real app, this would update the user status
        setIsSuspendDialogOpen(false)
        if (selectedUser) {
            setSelectedUser({ ...selectedUser, status: 'SUSPENDED' })
        }
    }

    const handleActivateUser = () => {
        // In a real app, this would update the user status
        setIsActivateDialogOpen(false)
        if (selectedUser) {
            setSelectedUser({ ...selectedUser, status: 'ACTIVE' })
        }
    }

    const handleResetPassword = () => {
        // In a real app, this would trigger a password reset
        setIsResetPasswordDialogOpen(false)
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Active</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            case 'PENDING':
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Clock8 className="h-4 w-4 text-amber-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Pending</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            case 'INACTIVE':
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <XIcon className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Inactive</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            case 'SUSPENDED':
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <AlertOctagon className="h-4 w-4 text-destructive" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Suspended</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            default:
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <AlertCircle className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{status}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'CLIENT':
                return <Badge variant="outline" className="text-[10px] h-4 px-1">Client</Badge>
            case 'COUNSELLOR':
                return <Badge variant="secondary" className="text-[10px] h-4 px-1">Counsellor</Badge>
            case 'ADMIN':
                return <Badge variant="default" className="text-[10px] h-4 px-1">Admin</Badge>
            default:
                return <Badge variant="outline" className="text-[10px] h-4 px-1">{role}</Badge>
        }
    }

    // Calculate user statistics
    const userStats = {
        total: users.length,
        active: users.filter(u => u.status === 'ACTIVE').length,
        inactive: users.filter(u => u.status === 'INACTIVE').length,
        pending: users.filter(u => u.status === 'PENDING').length,
        suspended: users.filter(u => u.status === 'SUSPENDED').length,
        clients: users.filter(u => u.role === 'CLIENT').length,
        counsellors: users.filter(u => u.role === 'COUNSELLOR').length,
        admins: users.filter(u => u.role === 'ADMIN').length
    }

    // Helper function to get user details card
    const getUserDetailsCard = () => {
        if (!selectedUser) return null;

        return (
            <>
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={selectedUser.avatar} />
                                    <AvatarFallback>
                                        {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="whitespace-nowrap text-sm">{selectedUser.name}</CardTitle>
                                    <CardDescription className="whitespace-nowrap text-xs">{selectedUser.email}</CardDescription>
                                </div>
                            </div>
                            {!isEditMode && (
                                <Button variant="outline" size="sm" onClick={handleEditUser} className="h-7">
                                    <Edit className="mr-2 h-3 w-3" />
                                    Edit
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Tabs defaultValue="details">
                            <TabsList className="grid w-full grid-cols-3 h-8 p-0 bg-muted/30">
                                <TabsTrigger value="details" className="text-xs px-0 py-1 data-[state=active]:bg-background rounded-none">Details</TabsTrigger>
                                <TabsTrigger value="activity" className="text-xs px-0 py-1 data-[state=active]:bg-background rounded-none">Activity</TabsTrigger>
                                <TabsTrigger value="notes" className="text-xs px-0 py-1 data-[state=active]:bg-background rounded-none">Notes</TabsTrigger>
                            </TabsList>
                            <div className="mt-4">
                                <TabsContent value="details" className="data-[state=active]:block">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between py-0.5">
                                            <div className="text-xs font-medium">Role</div>
                                            {isEditMode ? (
                                                <Select defaultValue={selectedUser.role}>
                                                    <SelectTrigger className="w-[180px] h-7">
                                                        <SelectValue placeholder="Select role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="CLIENT">Client</SelectItem>
                                                        <SelectItem value="COUNSELLOR">Counsellor</SelectItem>
                                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                getRoleBadge(selectedUser.role)
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between py-0.5">
                                            <div className="text-xs font-medium">Status</div>
                                            {isEditMode ? (
                                                <Select defaultValue={selectedUser.status}>
                                                    <SelectTrigger className="w-[180px] h-7">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                                        <SelectItem value="PENDING">Pending</SelectItem>
                                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    {getStatusIcon(selectedUser.status)}
                                                    <span className="text-xs">{selectedUser.status}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between py-0.5">
                                            <div className="text-xs font-medium">Phone</div>
                                            {isEditMode ? (
                                                <Input defaultValue={selectedUser.phoneNumber} className="w-[180px] h-7" />
                                            ) : (
                                                <div className="text-xs">{selectedUser.phoneNumber}</div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between py-0.5">
                                            <div className="text-xs font-medium">Join Date</div>
                                            <div className="text-xs">{selectedUser.joinDate}</div>
                                        </div>
                                        <div className="flex items-center justify-between py-0.5">
                                            <div className="text-xs font-medium">Last Active</div>
                                            <div className="text-xs">{selectedUser.lastActive}</div>
                                        </div>
                                    </div>

                                    {selectedUser.role === 'CLIENT' && (
                                        <>
                                            <Separator />
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between py-0.5">
                                                    <div className="text-xs font-medium">Client Type</div>
                                                    {isEditMode ? (
                                                        <Select defaultValue={selectedUser.clientType}>
                                                            <SelectTrigger className="w-[180px] h-7">
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="PRIMARY">Primary</SelectItem>
                                                                <SelectItem value="SECONDARY">Secondary</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <div className="text-xs">{selectedUser.clientType}</div>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between py-0.5">
                                                    <div className="text-xs font-medium">Appointments</div>
                                                    <div className="text-xs">{selectedUser.appointments}</div>
                                                </div>
                                                <div className="flex items-center justify-between py-0.5">
                                                    <div className="text-xs font-medium">Messages</div>
                                                    <div className="text-xs">{selectedUser.messages}</div>
                                                </div>
                                                <div className="flex items-center justify-between py-0.5">
                                                    <div className="text-xs font-medium">Resources</div>
                                                    <div className="text-xs">{selectedUser.resources}</div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {selectedUser.role === 'COUNSELLOR' && (
                                        <>
                                            <Separator />
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between py-0.5">
                                                    <div className="text-xs font-medium">Specialization</div>
                                                    {isEditMode ? (
                                                        <Input defaultValue={selectedUser.specialization} className="w-[180px] h-7" />
                                                    ) : (
                                                        <div className="text-xs">{selectedUser.specialization}</div>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between py-0.5">
                                                    <div className="text-xs font-medium">Clients</div>
                                                    <div className="text-xs">{selectedUser.clients}</div>
                                                </div>
                                                <div className="flex items-center justify-between py-0.5">
                                                    <div className="text-xs font-medium">Sessions</div>
                                                    <div className="text-xs">{selectedUser.sessions}</div>
                                                </div>
                                                <div className="flex items-center justify-between py-0.5">
                                                    <div className="text-xs font-medium">Rating</div>
                                                    <div className="text-xs">{selectedUser.rating}</div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {selectedUser.role === 'ADMIN' && (
                                        <>
                                            <Separator />
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between py-0.5">
                                                    <div className="text-xs font-medium">Permissions</div>
                                                    <div className="text-xs">{selectedUser.permissions?.join(', ')}</div>
                                                </div>
                                                <div className="flex items-center justify-between py-0.5">
                                                    <div className="text-xs font-medium">Last Login</div>
                                                    <div className="text-xs">{selectedUser.lastLogin}</div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {isEditMode && (
                                        <div className="flex justify-end space-x-2 pt-4">
                                            <Button variant="outline" onClick={() => setIsEditMode(false)}>
                                                Cancel
                                            </Button>
                                            <Button onClick={handleSaveUser}>
                                                Save Changes
                                            </Button>
                                        </div>
                                    )}
                                </TabsContent>
                                <TabsContent value="activity" className="data-[state=active]:block">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-muted-foreground" />
                                            <div className="text-sm font-medium">Recent Activity</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <div>Last login: {selectedUser.lastActive}</div>
                                            </div>
                                            {selectedUser.role === 'CLIENT' && (
                                                <>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <div>Last appointment: {selectedUser.lastActive}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                        <div>Last message: {selectedUser.lastActive}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                                        <div>Last resource viewed: {selectedUser.lastActive}</div>
                                                    </div>
                                                </>
                                            )}
                                            {selectedUser.role === 'COUNSELLOR' && (
                                                <>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <div>Last session: {selectedUser.lastActive}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                        <div>Last message: {selectedUser.lastActive}</div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="notes" className="data-[state=active]:block">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div className="text-sm font-medium">Admin Notes</div>
                                        </div>
                                        {isEditMode ? (
                                            <Textarea
                                                defaultValue={selectedUser.notes}
                                                className="min-h-[150px]"
                                            />
                                        ) : (
                                            <div className="text-sm">{selectedUser.notes}</div>
                                        )}
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => setIsResetPasswordDialogOpen(true)}
                        >
                            <Key className="mr-2 h-4 w-4" />
                            Reset Password
                        </Button>
                        {selectedUser.status !== 'ACTIVE' ? (
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => setIsActivateDialogOpen(true)}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Activate User
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => setIsSuspendDialogOpen(true)}
                            >
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend User
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="w-full justify-start text-destructive"
                            onClick={() => setIsDeleteDialogOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                        </Button>
                    </CardContent>
                </Card>
            </>
        );
    };

    // Helper function to get distribution cards
    const getDistributionCards = () => {
        return (
            <>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">User Distribution</CardTitle>
                        <CardDescription>Analysis of user roles and status</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Tabs defaultValue="roles">
                            <TabsList className="grid w-full grid-cols-2 h-8 p-0 bg-muted/30">
                                <TabsTrigger value="roles" className="text-xs px-0 py-1 data-[state=active]:bg-background rounded-none">By Role</TabsTrigger>
                                <TabsTrigger value="status" className="text-xs px-0 py-1 data-[state=active]:bg-background rounded-none">By Status</TabsTrigger>
                            </TabsList>
                            <div className="mt-4">
                                <TabsContent value="roles" className="data-[state=active]:block">
                                    <div className="flex justify-center pb-6">
                                        <PieChart className="h-36 w-36 text-muted-foreground" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="flex flex-col items-center">
                                            <Badge variant="outline" className="mb-1 px-2">Clients</Badge>
                                            <div className="text-lg font-bold">{userStats.clients}</div>
                                            <div className="text-xs text-muted-foreground">{Math.round(userStats.clients / userStats.total * 100)}%</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Badge variant="secondary" className="mb-1 px-2">Counsellors</Badge>
                                            <div className="text-lg font-bold">{userStats.counsellors}</div>
                                            <div className="text-xs text-muted-foreground">{Math.round(userStats.counsellors / userStats.total * 100)}%</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Badge variant="default" className="mb-1 px-2">Admins</Badge>
                                            <div className="text-lg font-bold">{userStats.admins}</div>
                                            <div className="text-xs text-muted-foreground">{Math.round(userStats.admins / userStats.total * 100)}%</div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="status" className="data-[state=active]:block">
                                    <div className="flex justify-center pb-8">
                                        <BarChart className="h-40 w-40 text-muted-foreground" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col items-center">
                                            <Badge variant="default" className="mb-1 px-2">Active</Badge>
                                            <div className="text-lg font-bold">{userStats.active}</div>
                                            <div className="text-xs text-muted-foreground">{Math.round(userStats.active / userStats.total * 100)}%</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Badge variant="secondary" className="mb-1 px-2">Pending</Badge>
                                            <div className="text-lg font-bold">{userStats.pending}</div>
                                            <div className="text-xs text-muted-foreground">{Math.round(userStats.pending / userStats.total * 100)}%</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Badge variant="outline" className="mb-1 px-2">Inactive</Badge>
                                            <div className="text-lg font-bold">{userStats.inactive}</div>
                                            <div className="text-xs text-muted-foreground">{Math.round(userStats.inactive / userStats.total * 100)}%</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Badge variant="destructive" className="mb-1 px-2">Suspended</Badge>
                                            <div className="text-lg font-bold">{userStats.suspended}</div>
                                            <div className="text-xs text-muted-foreground">{Math.round(userStats.suspended / userStats.total * 100)}%</div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Recent User Activity</CardTitle>
                        <CardDescription>Latest user registrations and logins</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="px-4 py-0">
                            {users.slice(0, 5).map((user) => (
                                <div key={user.id} className="flex items-center py-2 border-b last:border-0">
                                    <Avatar className="h-6 w-6 mr-2">
                                        <AvatarImage src={user.avatar} />
                                        <AvatarFallback className="text-[10px]">
                                            {user.name.split(' ').map((n: string) => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-medium truncate">{user.name}</div>
                                        <div className="text-xs text-muted-foreground">Last login: {user.lastActive}</div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 px-2"
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        <Eye className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </>
        );
    };

    if (!user) {
        return null
    }

    return (
        <div className="space-y-4">
            {/* Header and theme toggle */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage users and their permissions
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New User</DialogTitle>
                                <DialogDescription>
                                    Create a new user account with specific role and permissions.
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
                                    <Label htmlFor="role" className="text-right">
                                        Role
                                    </Label>
                                    <Select>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CLIENT">Client</SelectItem>
                                            <SelectItem value="COUNSELLOR">Counsellor</SelectItem>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="status" className="text-right">
                                        Status
                                    </Label>
                                    <Select>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Create User</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* User Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-primary/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Users2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Users</p>
                            <h3 className="text-2xl font-bold">{userStats.total}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-green-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-green-500/10 p-2 rounded-full">
                            <UserCheck className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Active Users</p>
                            <h3 className="text-2xl font-bold">{userStats.active}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-amber-500/10 p-2 rounded-full">
                            <Clock8 className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Pending Users</p>
                            <h3 className="text-2xl font-bold">{userStats.pending}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-red-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-red-500/10 p-2 rounded-full">
                            <AlertOctagon className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Suspended/Inactive</p>
                            <h3 className="text-2xl font-bold">{userStats.suspended + userStats.inactive}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <div className="flex gap-6">
                {/* User Table - moved to the left */}
                <div className="flex-1 overflow-x-hidden">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>
                                View and manage all users in the system
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Search users..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="h-8"
                                        />
                                    </div>
                                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                                        <SelectTrigger className="w-[150px] h-8">
                                            <SelectValue placeholder="Filter by role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All Roles</SelectItem>
                                            <SelectItem value="CLIENT">Client</SelectItem>
                                            <SelectItem value="COUNSELLOR">Counsellor</SelectItem>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                            <SelectItem value="ORG_CONTACT">Org Contact</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[150px] h-8">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All Status</SelectItem>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="PENDING">Pending</SelectItem>
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
                                                <TableHead className="w-[200px] px-4">Email</TableHead>
                                                <TableHead className="w-[80px] px-4">Role</TableHead>
                                                <TableHead className="w-[60px] px-4 text-center">Status</TableHead>
                                                <TableHead className="w-[60px] px-4">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedUsers.map((user) => (
                                                <TableRow
                                                    key={user.id}
                                                    className={cn(
                                                        "cursor-pointer hover:bg-muted/50",
                                                        selectedUser?.id === user.id && "bg-muted"
                                                    )}
                                                    onClick={() => handleUserSelect(user)}
                                                >
                                                    <TableCell className="px-4 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={user.avatar} />
                                                                <AvatarFallback className="text-[10px]">
                                                                    {user.name.split(' ').map((n: string) => n[0]).join('')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-sm whitespace-nowrap">{user.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2">
                                                        <span className="text-sm whitespace-nowrap">{user.email}</span>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2">
                                                        <Badge variant="outline" className="text-xs font-normal">
                                                            {user.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2 text-center">
                                                        {getStatusIcon(user.status)}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-7 w-7 p-0">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-destructive">
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
                                    <DataPagination
                                        totalItems={filteredUsers.length}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={setItemsPerPage}
                                        itemsPerPageOptions={[5, 10, 15, 25]}
                                        showFirstLastButtons
                                        showPageSizeSelector
                                        showItemsInfo
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right side panel - stat cards or user details */}
                <div className="w-[340px] space-y-6">
                    {selectedUser ? getUserDetailsCard() : getDistributionCards()}
                </div>
            </div>
        </div>
    );
} 