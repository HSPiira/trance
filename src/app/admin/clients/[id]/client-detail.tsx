'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronDown,
    Clock,
    Edit,
    FileText,
    MessageSquare,
    MoreHorizontal,
    Phone,
    Plus,
    Trash2,
    User,
    UserCircle,
    Users,
    XCircle,
} from 'lucide-react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

// Define the client type (simplified for this example)
type Dependant = {
    id: string;
    name: string;
    relation: string;
    status: string;
}

type Beneficiary = {
    id: string;
    name: string;
    email: string;
    department: string;
    role: string;
    status: string;
    dependants?: Dependant[];
}

type Client = {
    id: string;
    name: string;
    email: string;
    status: string;
    joinDate: string;
    lastActive: string;
    avatar: string;
    phoneNumber: string;
    clientType: 'COMPANY' | 'INDIVIDUAL';
    appointments: number;
    messages: number;
    resources: number;
    counsellor: string;
    notes: string;
    beneficiaries?: Beneficiary[];
}

interface ClientDetailProps {
    client: Client;
}

export default function ClientDetail({ client }: ClientDetailProps) {
    const router = useRouter()
    const { user } = useAuth()

    // Auth check
    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/unauthorized')
        }
    }, [router, user])

    if (!user) {
        return null
    }

    // Determine if this is a company or individual client
    const isCompany = client.clientType === 'COMPANY'

    // Calculate total beneficiaries and dependants
    const beneficiariesCount = isCompany && client.beneficiaries ? client.beneficiaries.length : 0
    const dependantsCount = isCompany && client.beneficiaries
        ? client.beneficiaries.reduce((total: number, beneficiary: Beneficiary) => {
            return total + (beneficiary.dependants?.length || 0)
        }, 0)
        : 0

    return (
        <div className="space-y-6">
            {/* Breadcrumb Navigation */}
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/clients">Clients</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{client.name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push('/admin/clients')}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Clients
                    </Button>

                    <h1 className="text-2xl font-bold tracking-tight">
                        {isCompany ? (
                            <div className="flex items-center gap-2">
                                <Building2 className="h-6 w-6 text-blue-400" />
                                {client.name}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <User className="h-6 w-6 text-purple-400" />
                                {client.name}
                            </div>
                        )}
                    </h1>

                    <Badge
                        variant={client.status === 'ACTIVE' ? 'default' : 'destructive'}
                        className={client.status === 'ACTIVE' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}
                    >
                        {client.status}
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button size="sm" variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                View Counseling Notes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Client
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Client Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-white to-blue-50">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <Avatar className="h-12 w-12 border-2 border-blue-100">
                            <AvatarImage src={client.avatar} />
                            <AvatarFallback className="bg-blue-400/10 text-blue-600">
                                {client.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Counsellor</p>
                            <h3 className="font-semibold tracking-tight">{client.counsellor}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-green-50">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-green-400/10 p-3 rounded-full flex items-center justify-center h-12 w-12 border-2 border-green-100">
                            <Calendar className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Sessions</p>
                            <h3 className="font-semibold tracking-tight">{client.appointments}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-purple-50">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-purple-400/10 p-3 rounded-full flex items-center justify-center h-12 w-12 border-2 border-purple-100">
                            <MessageSquare className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Messages</p>
                            <h3 className="font-semibold tracking-tight">{client.messages}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-blue-50">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-blue-400/10 p-3 rounded-full flex items-center justify-center h-12 w-12 border-2 border-blue-100">
                            <Clock className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Last Activity</p>
                            <h3 className="font-semibold tracking-tight">{new Date(client.lastActive).toLocaleDateString()}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content with Tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    {isCompany && (
                        <TabsTrigger value="members">
                            <Users className="h-4 w-4 mr-2" />
                            Members
                        </TabsTrigger>
                    )}
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Client Details */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Client Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium">Full Name</p>
                                        <p className="text-sm text-muted-foreground">{client.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Email</p>
                                        <p className="text-sm text-muted-foreground">{client.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Phone</p>
                                        <p className="text-sm text-muted-foreground">{client.phoneNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Client Type</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            {isCompany ? (
                                                <>
                                                    <Building2 className="h-3 w-3 text-blue-500" />
                                                    Company
                                                </>
                                            ) : (
                                                <>
                                                    <User className="h-3 w-3 text-purple-500" />
                                                    Individual
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Join Date</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(client.joinDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Status</p>
                                        <Badge
                                            variant={client.status === 'ACTIVE' ? 'default' : 'destructive'}
                                            className={client.status === 'ACTIVE' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}
                                        >
                                            {client.status}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div>
                                    <p className="text-sm font-medium">Notes</p>
                                    <p className="text-sm text-muted-foreground mt-1">{client.notes}</p>
                                </div>

                                {isCompany && (
                                    <>
                                        <Separator className="my-4" />
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-medium">Client Hierarchy</p>
                                                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    {beneficiariesCount} Beneficiaries
                                                </Badge>
                                            </div>

                                            <div className="flex items-center mb-2">
                                                <div className="h-6 w-6 rounded-full bg-blue-400/20 flex items-center justify-center">
                                                    <Building2 className="h-3 w-3 text-blue-600" />
                                                </div>
                                                <div className="ml-2 text-sm font-medium">{client.name}</div>
                                                <div className="ml-auto">
                                                    <Badge variant="outline">Company</Badge>
                                                </div>
                                            </div>

                                            <div className="ml-3 pl-3 border-l border-dashed border-muted-foreground/30">
                                                <div className="flex items-center">
                                                    <div className="h-6 w-6 rounded-full bg-blue-400/20 flex items-center justify-center">
                                                        <Users className="h-3 w-3 text-blue-600" />
                                                    </div>
                                                    <div className="ml-2 text-sm font-medium">Beneficiaries ({beneficiariesCount})</div>
                                                </div>

                                                {dependantsCount > 0 && (
                                                    <div className="ml-6 mt-1">
                                                        <div className="flex items-center">
                                                            <div className="h-6 w-6 rounded-full bg-purple-400/20 flex items-center justify-center">
                                                                <User className="h-3 w-3 text-purple-600" />
                                                            </div>
                                                            <div className="ml-2 text-sm font-medium">Dependants ({dependantsCount})</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                            <CardFooter className="border-t bg-muted/50 px-6 py-3">
                                <Button variant="outline" size="sm">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Details
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 h-2 w-2 rounded-full bg-green-400" />
                                        <div>
                                            <p className="text-sm font-medium">Attended session</p>
                                            <p className="text-xs text-muted-foreground">Yesterday at 2:30 PM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                                        <div>
                                            <p className="text-sm font-medium">Sent message</p>
                                            <p className="text-xs text-muted-foreground">2 days ago at 11:15 AM</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                                        <div>
                                            <p className="text-sm font-medium">Booked new session</p>
                                            <p className="text-xs text-muted-foreground">4 days ago at 9:20 AM</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Sessions Tab */}
                <TabsContent value="sessions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions History</CardTitle>
                            <CardDescription>All past and upcoming sessions with this client</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center p-8 text-muted-foreground">
                                Session history would be displayed here
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Messages Tab */}
                <TabsContent value="messages">
                    <Card>
                        <CardHeader>
                            <CardTitle>Messages</CardTitle>
                            <CardDescription>Message history with this client</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center p-8 text-muted-foreground">
                                Message history would be displayed here
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resources</CardTitle>
                            <CardDescription>Resources shared with this client</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center p-8 text-muted-foreground">
                                Shared resources would be displayed here
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Members Tab (for Companies only) */}
                {isCompany && client.beneficiaries && (
                    <TabsContent value="members" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium">Company Beneficiaries</h3>
                                <p className="text-sm text-muted-foreground">
                                    Manage beneficiaries and their dependants
                                </p>
                            </div>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Beneficiary
                            </Button>
                        </div>

                        <Card>
                            <CardContent className="p-0">
                                {client.beneficiaries.length > 0 ? (
                                    <Accordion type="multiple" className="w-full">
                                        {client.beneficiaries.map((beneficiary) => (
                                            <AccordionItem value={beneficiary.id} key={beneficiary.id}>
                                                <AccordionTrigger className="px-4 py-2 hover:bg-muted/50">
                                                    <div className="flex items-center gap-3 text-left">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="text-xs">
                                                                {beneficiary.name.split(' ').map((n: string) => n[0]).join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium">{beneficiary.name}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {beneficiary.department} · {beneficiary.role}
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "ml-auto mr-4",
                                                                beneficiary.status === 'ACTIVE'
                                                                    ? "bg-green-50 text-green-600 border-green-200"
                                                                    : "bg-gray-50 text-gray-600"
                                                            )}
                                                        >
                                                            {beneficiary.status}
                                                        </Badge>
                                                        {beneficiary.dependants && beneficiary.dependants.length > 0 && (
                                                            <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                                                                <User className="h-3 w-3 mr-1" />
                                                                {beneficiary.dependants.length}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="px-4 py-2 space-y-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-sm font-medium">Email</p>
                                                                <p className="text-sm text-muted-foreground">{beneficiary.email}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">Department</p>
                                                                <p className="text-sm text-muted-foreground">{beneficiary.department}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">Role</p>
                                                                <p className="text-sm text-muted-foreground">{beneficiary.role}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">Status</p>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={cn(
                                                                        beneficiary.status === 'ACTIVE'
                                                                            ? "bg-green-50 text-green-600 border-green-200"
                                                                            : "bg-gray-50 text-gray-600"
                                                                    )}
                                                                >
                                                                    {beneficiary.status}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        {beneficiary.dependants && beneficiary.dependants.length > 0 && (
                                                            <div className="mt-4 pt-4 border-t">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h4 className="text-sm font-medium">Dependants</h4>
                                                                    <Button size="sm" variant="outline">
                                                                        <Plus className="h-3 w-3 mr-1" />
                                                                        Add Dependant
                                                                    </Button>
                                                                </div>
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>Name</TableHead>
                                                                            <TableHead>Relation</TableHead>
                                                                            <TableHead>Status</TableHead>
                                                                            <TableHead className="text-right">Actions</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {beneficiary.dependants.map((dependant) => (
                                                                            <TableRow key={dependant.id}>
                                                                                <TableCell className="py-2">
                                                                                    <div className="font-medium">{dependant.name}</div>
                                                                                </TableCell>
                                                                                <TableCell className="py-2">{dependant.relation}</TableCell>
                                                                                <TableCell className="py-2">
                                                                                    <Badge
                                                                                        variant="outline"
                                                                                        className={cn(
                                                                                            dependant.status === 'ACTIVE'
                                                                                                ? "bg-green-50 text-green-600 border-green-200"
                                                                                                : "bg-gray-50 text-gray-600"
                                                                                        )}
                                                                                    >
                                                                                        {dependant.status}
                                                                                    </Badge>
                                                                                </TableCell>
                                                                                <TableCell className="py-2 text-right">
                                                                                    <DropdownMenu>
                                                                                        <DropdownMenuTrigger asChild>
                                                                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                                                                <MoreHorizontal className="h-4 w-4" />
                                                                                            </Button>
                                                                                        </DropdownMenuTrigger>
                                                                                        <DropdownMenuContent align="end">
                                                                                            <DropdownMenuItem>
                                                                                                <Edit className="mr-2 h-4 w-4" />
                                                                                                Edit
                                                                                            </DropdownMenuItem>
                                                                                            <DropdownMenuSeparator />
                                                                                            <DropdownMenuItem className="text-destructive">
                                                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                                                Remove
                                                                                            </DropdownMenuItem>
                                                                                        </DropdownMenuContent>
                                                                                    </DropdownMenu>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </div>
                                                        )}

                                                        {(!beneficiary.dependants || beneficiary.dependants.length === 0) && (
                                                            <div className="mt-4 pt-4 border-t">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h4 className="text-sm font-medium">Dependants</h4>
                                                                    <Button size="sm" variant="outline">
                                                                        <Plus className="h-3 w-3 mr-1" />
                                                                        Add Dependant
                                                                    </Button>
                                                                </div>
                                                                <div className="text-center py-4 text-sm text-muted-foreground">
                                                                    No dependants registered
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-end gap-2 mt-4">
                                                            <Button size="sm" variant="outline">
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Button>
                                                            <Button size="sm" variant="destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>No beneficiaries added yet</p>
                                        <Button className="mt-4">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add First Beneficiary
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
} 