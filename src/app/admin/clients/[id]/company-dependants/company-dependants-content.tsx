'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import {
    ArrowLeft,
    Building2,
    User,
    Users,
    Search,
    Plus,
    Edit,
    Trash2,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Filter,
} from 'lucide-react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BackButton } from '@/components/ui/back-button'

// Import from mock-data
import { Dependant, Beneficiary } from '@/app/admin/clients/mock-data'

interface Client {
    id: string;
    name: string;
    email: string;
    status: string;
    joinDate: string;
    lastActive?: string;
    avatar?: string;
    clientType: string;
    appointments: number;
    beneficiaries?: Beneficiary[];
    [key: string]: any;
}

// Component to display all dependants for a company client
export default function CompanyDependantsContent({ client }: { client: Client }) {
    const router = useRouter()
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [beneficiaryFilter, setBeneficiaryFilter] = useState('ALL')
    const [statusFilter, setStatusFilter] = useState('ALL')

    // Auth check
    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/unauthorized')
        }
    }, [router, user])

    if (!user) {
        return null
    }

    // Get beneficiaries
    const beneficiaries = client.beneficiaries || []

    // Flatten all dependants from all beneficiaries
    const allDependants = beneficiaries.reduce((acc: any[], beneficiary: Beneficiary) => {
        if (beneficiary.dependants && beneficiary.dependants.length > 0) {
            // Add beneficiary information to each dependant for context
            const dependantsWithContext = beneficiary.dependants.map((dependant: Dependant) => ({
                ...dependant,
                beneficiaryId: beneficiary.id,
                beneficiaryName: beneficiary.name,
                department: beneficiary.department,
                role: beneficiary.role,
            }));
            acc.push(...dependantsWithContext);
            return acc;
        }
        return acc;
    }, []);

    // Filter dependants based on search, beneficiary, and status
    const filteredDependants = allDependants.filter((dependant: any) => {
        const matchesSearch =
            dependant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dependant.relation.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dependant.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesBeneficiary = beneficiaryFilter === 'ALL' || dependant.beneficiaryId === beneficiaryFilter;
        const matchesStatus = statusFilter === 'ALL' || dependant.status === statusFilter;

        return matchesSearch && matchesBeneficiary && matchesStatus;
    });

    // Get total count of dependants and count by status
    const totalDependants = allDependants.length;
    const activeDependants = allDependants.filter(d => d.status === 'ACTIVE').length;
    const inactiveDependants = totalDependants - activeDependants;

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
                        <BreadcrumbLink href={`/admin/clients/${client.id}`}>{client.name}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Dependants</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <BackButton
                        href={`/admin/clients/${client.id}`}
                        tooltip="Back to Client"
                    />

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-blue-400" />
                            {client.name} - All Dependants
                        </h1>
                        <p className="text-muted-foreground">
                            Manage all dependants across all beneficiaries for this company
                        </p>
                    </div>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Dependant
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-background to-background/80 border-border">
                    <CardContent className="pt-6 px-6 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Total Dependants</p>
                                <div className="text-2xl font-bold">{totalDependants}</div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <User className="h-6 w-6 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-background to-background/80 border-border">
                    <CardContent className="pt-6 px-6 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Active Dependants</p>
                                <div className="text-2xl font-bold">{activeDependants}</div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-background to-background/80 border-border">
                    <CardContent className="pt-6 px-6 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Beneficiaries</p>
                                <div className="text-2xl font-bold">
                                    {beneficiaries.length}
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Company Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>
                        Main company details and coverage summary
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={client.avatar} />
                            <AvatarFallback className="bg-blue-400/10 text-blue-600">
                                {client.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-medium">{client.name}</h3>
                            <p className="text-sm text-muted-foreground">{client.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        client.status === 'ACTIVE'
                                            ? "bg-green-50 text-green-600 border-green-200"
                                            : "bg-gray-50 text-gray-600"
                                    )}
                                >
                                    {client.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    Since {new Date(client.joinDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 border p-4 rounded-lg bg-muted/40">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Corporate Coverage Summary</h4>
                            <Badge variant="outline">
                                {beneficiaries.length} beneficiaries, {totalDependants} dependants
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            This corporate plan covers all registered beneficiaries and their dependants
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Dependants Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Dependants</CardTitle>
                    <CardDescription>
                        All dependants across all beneficiaries for this company
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search dependants or beneficiaries..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 h-9"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Select value={beneficiaryFilter} onValueChange={setBeneficiaryFilter}>
                                    <SelectTrigger className="w-[180px] h-9">
                                        <SelectValue placeholder="Filter by Beneficiary" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Beneficiaries</SelectItem>
                                        {beneficiaries.map((beneficiary: Beneficiary) => (
                                            <SelectItem key={beneficiary.id} value={beneficiary.id}>
                                                {beneficiary.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[150px] h-9">
                                        <SelectValue placeholder="Filter by Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Statuses</SelectItem>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="py-2 px-3">Name</TableHead>
                                        <TableHead className="py-2 px-3">Beneficiary</TableHead>
                                        <TableHead className="py-2 px-3">Department/Role</TableHead>
                                        <TableHead className="py-2 px-3">Relation</TableHead>
                                        <TableHead className="py-2 px-3 text-center">Status</TableHead>
                                        <TableHead className="text-right py-2 px-3">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDependants.length > 0 ? (
                                        filteredDependants.map((dependant: any) => (
                                            <TableRow key={dependant.id}>
                                                <TableCell className="py-1.5 px-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-7 w-7">
                                                            <AvatarFallback className="bg-purple-400/10 text-purple-600 text-xs">
                                                                {dependant.name.split(' ').map((n: string) => n[0]).join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="font-medium text-sm">{dependant.name}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-1.5 px-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <Avatar className="h-5 w-5">
                                                            <AvatarFallback className="bg-blue-400/10 text-blue-600 text-[10px]">
                                                                {dependant.beneficiaryName.split(' ').map((n: string) => n[0]).join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm">{dependant.beneficiaryName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-1.5 px-3 text-sm">
                                                    {dependant.department && dependant.role ? (
                                                        <span>{dependant.department} - {dependant.role}</span>
                                                    ) : dependant.department ? (
                                                        <span>{dependant.department}</span>
                                                    ) : dependant.role ? (
                                                        <span>{dependant.role}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">Not specified</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-1.5 px-3 text-sm">{dependant.relation}</TableCell>
                                                <TableCell className="py-1.5 px-3 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "mx-auto px-2 py-0.5 text-xs",
                                                            dependant.status === "ACTIVE"
                                                                ? "bg-green-50 text-green-700 border-green-200"
                                                                : "bg-amber-50 text-amber-700 border-amber-200"
                                                        )}
                                                    >
                                                        {dependant.status === "ACTIVE" ? "Active" : "Inactive"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-1.5 px-3 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => router.push(`/admin/clients/${client.id}/beneficiaries/${dependant.beneficiaryId}`)}>
                                                                View Beneficiary
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>Edit Dependant</DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                {dependant.status === "ACTIVE" ? "Deactivate" : "Activate"}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">Remove Dependant</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-20 text-center">
                                                {searchQuery || beneficiaryFilter !== 'ALL' || statusFilter !== 'ALL' ? (
                                                    <div>
                                                        <p>No dependants found with the current filters</p>
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSearchQuery('');
                                                                setBeneficiaryFilter('ALL');
                                                                setStatusFilter('ALL');
                                                            }}
                                                        >
                                                            Clear all filters
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <p>No dependants found for any beneficiaries</p>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
                {filteredDependants.length === 0 && !searchQuery && beneficiaryFilter === 'ALL' && statusFilter === 'ALL' && (
                    <CardFooter className="flex justify-center p-6 border-t bg-muted/10">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Dependant
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
} 