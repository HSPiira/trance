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
import { BackButton } from '@/components/ui/back-button'
import { Client, Beneficiary, Dependant } from '@/types/schema'

interface ClientDetailProps {
    client: Client;
}

// Add the bg-grid pattern
const bgGridPattern = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`;

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
    const companyDependantsCount = isCompany && client.beneficiaries
        ? client.beneficiaries.reduce((total: number, beneficiary: Beneficiary) => {
            return total + (beneficiary.dependants?.length || 0)
        }, 0)
        : 0

    // Individual client dependants
    const hasIndividualDependants = !isCompany && client.dependants && client.dependants.length > 0
    const individualDependantsCount = hasIndividualDependants && client.dependants ? client.dependants.length : 0

    return (
        <div className="space-y-6">
            {/* Breadcrumb Navigation */}
            <Breadcrumb className="mb-2">
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

            {/* Hero Section with Client Info */}
            <div className="relative overflow-hidden rounded-xl mb-6 border">
                <div className="relative pt-6 pb-8 px-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <BackButton
                                href="/admin/clients"
                                tooltip="Back to Clients"
                                variant="secondary"
                            />
                            <Avatar className="h-20 w-20 border-4 border-background shadow-md">
                                <AvatarImage src={client.avatar} />
                                <AvatarFallback className={isCompany ? "bg-blue-100 text-blue-600 text-xl" : "bg-purple-100 text-purple-600 text-xl"}>
                                    {client.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        {client.name}
                                    </h1>
                                    <Badge
                                        variant={client.status === 'ACTIVE' ? 'default' : 'destructive'}
                                        className={client.status === 'ACTIVE' ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}
                                    >
                                        {client.status}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                                    <span className="flex items-center">
                                        {isCompany ? (
                                            <Building2 className="h-4 w-4 mr-1 text-blue-500" />
                                        ) : (
                                            <User className="h-4 w-4 mr-1 text-purple-500" />
                                        )}
                                        {isCompany ? 'Company' : 'Individual'}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center">
                                        <Clock className="h-4 w-4 mr-1" />
                                        Client since {new Date(client.joinDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    {client.email && (
                                        <>
                                            <span>•</span>
                                            <span className="flex items-center">
                                                {client.email}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="shadow-sm">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                            <Button size="sm" variant="outline" className="shadow-sm">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Message
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline" className="shadow-sm">
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

                    {/* Client Summary Cards with improved layout */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="rounded-lg p-4 border shadow-sm flex items-center gap-4">
                            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <div>
                                <div className="text-muted-foreground text-sm">Sessions</div>
                                <div className="text-2xl font-bold">{client.appointments}</div>
                            </div>
                        </div>

                        <div className="rounded-lg p-4 border shadow-sm flex items-center gap-4">
                            <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            <div>
                                <div className="text-muted-foreground text-sm">Messages</div>
                                <div className="text-2xl font-bold">{client.messages}</div>
                            </div>
                        </div>

                        <div className="rounded-lg p-4 border shadow-sm flex items-center gap-4">
                            <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            <div>
                                <div className="text-muted-foreground text-sm">Resources</div>
                                <div className="text-2xl font-bold">{client.resources}</div>
                            </div>
                        </div>

                        <div className="rounded-lg p-4 border shadow-sm flex items-center gap-4">
                            <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                            <div>
                                <div className="text-muted-foreground text-sm">Last Activity</div>
                                <div className="font-bold">
                                    {new Date(client.lastActive).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content with Tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <div className="border-b mb-4">
                    <TabsList className="justify-start -mb-px">
                        <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Overview</TabsTrigger>
                        <TabsTrigger value="sessions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Sessions</TabsTrigger>
                        <TabsTrigger value="messages" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Messages</TabsTrigger>
                        <TabsTrigger value="resources" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">Resources</TabsTrigger>
                        {isCompany && (
                            <TabsTrigger value="members" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                                <Users className="h-4 w-4 mr-2" />
                                Members
                            </TabsTrigger>
                        )}
                        {!isCompany && (
                            <TabsTrigger value="family" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                                <User className="h-4 w-4 mr-2" />
                                Family
                            </TabsTrigger>
                        )}
                    </TabsList>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Client Information - make it more modern */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <UserCircle className="h-5 w-5 text-primary" />
                                    Client Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h4>
                                            <p className="font-medium">{client.name}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Email Address</h4>
                                            <p className="font-medium">{client.email}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone Number</h4>
                                            <p className="font-medium">{client.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Client Since</h4>
                                            <p className="font-medium">{new Date(client.joinDate).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    client.status === 'ACTIVE'
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : client.status === 'INACTIVE'
                                                            ? "bg-slate-50 text-slate-700 border-slate-200"
                                                            : client.status === 'PENDING'
                                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                : "bg-red-50 text-red-700 border-red-200"
                                                )}
                                            >
                                                {client.status}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Counsellor Assignment</h4>
                                            {client.counsellor ? (
                                                <p className="font-medium">{client.counsellor}</p>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">No counsellor assigned</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {client.notes && (
                                    <div className="mt-6 p-3 bg-muted/50 rounded-lg">
                                        <h4 className="text-sm font-medium mb-2">Notes</h4>
                                        <p className="text-sm whitespace-pre-line">{client.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Activity - move to separate card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Recent Activity
                                </CardTitle>
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
                                            <p className="text-sm font-medium">Messaged counsellor</p>
                                            <p className="text-xs text-muted-foreground">3 days ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                                        <div>
                                            <p className="text-sm font-medium">Downloaded resource</p>
                                            <p className="text-xs text-muted-foreground">Last week</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                                        <div>
                                            <p className="text-sm font-medium">Rescheduled appointment</p>
                                            <p className="text-xs text-muted-foreground">Oct 15, 2023</p>
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

                {/* Family Tab for Individual Clients */}
                {!isCompany && (
                    <TabsContent value="family" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium">Family Members</h3>
                                <p className="text-sm text-muted-foreground">
                                    Manage dependants and family coverage
                                </p>
                            </div>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Family Member
                            </Button>
                        </div>

                        <Card>
                            <CardContent className="p-0">
                                {hasIndividualDependants ? (
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
                                            {client.dependants && client.dependants.map((dependant) => (
                                                <TableRow key={dependant.id}>
                                                    <TableCell className="py-3">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarFallback className="bg-purple-400/10 text-purple-600 text-xs">
                                                                    {dependant.name.split(' ').map((n: string) => n[0]).join('')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="font-medium">{dependant.name}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-3">{dependant.relation}</TableCell>
                                                    <TableCell className="py-3">
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
                                                    <TableCell className="py-3 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p>No family members added yet</p>
                                        <Button className="mt-4">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add First Family Member
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Family Coverage</CardTitle>
                                <CardDescription>Coverage details and plan information for family members</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between border p-4 rounded-lg bg-muted/40">
                                    <div>
                                        <h4 className="font-medium">Family Counseling Plan</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {client.name} + {individualDependantsCount} dependants
                                        </p>
                                    </div>
                                    <Badge className={cn(
                                        client.status === 'ACTIVE'
                                            ? "bg-green-50 text-green-600 border-green-200"
                                            : "bg-gray-50 text-gray-600"
                                    )}>
                                        {client.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
} 