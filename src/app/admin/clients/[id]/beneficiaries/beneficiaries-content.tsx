'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import {
    ArrowLeft,
    Building2,
    ChevronRight,
    Plus,
    Users,
    User,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { BackButton } from '@/components/ui/back-button'

interface Beneficiary {
    id: string;
    name: string;
    email: string;
    department: string;
    role: string;
    status: string;
    dependants?: any[];
}

interface Client {
    id: string;
    name: string;
    beneficiaries?: Beneficiary[];
    [key: string]: any;
}

// Client Component that takes the client data directly
export default function BeneficiariesContent({ client }: { client: Client }) {
    const router = useRouter()
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')

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

    // Filter beneficiaries based on search
    const filteredBeneficiaries = beneficiaries.filter((beneficiary: Beneficiary) =>
        beneficiary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beneficiary.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beneficiary.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beneficiary.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Calculate total dependants
    const totalDependants = beneficiaries.reduce((sum: number, beneficiary: Beneficiary) =>
        sum + (beneficiary.dependants?.length || 0), 0
    )

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
                        <BreadcrumbPage>Beneficiaries</BreadcrumbPage>
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
                            {client.name} - Beneficiaries
                        </h1>
                        <p className="text-muted-foreground">
                            Manage beneficiaries for this company client
                        </p>
                    </div>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Beneficiary
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-background to-background/80 border-border">
                    <CardContent className="pt-6 px-6 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Total Beneficiaries</p>
                                <div className="text-2xl font-bold">{beneficiaries.length}</div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-background to-background/80 border-border">
                    <CardContent className="pt-6 px-6 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Active Beneficiaries</p>
                                <div className="text-2xl font-bold">
                                    {beneficiaries.filter((b: Beneficiary) => b.status === 'ACTIVE').length}
                                </div>
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
                                <p className="text-sm font-medium text-muted-foreground mb-1">Total Dependants</p>
                                <div className="text-2xl font-bold">{totalDependants}</div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <User className="h-6 w-6 text-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Beneficiaries Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Beneficiaries</CardTitle>
                    <CardDescription>
                        Company employees who are beneficiaries of the counseling plan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search beneficiaries..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8 h-9"
                                />
                            </div>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="py-2 px-3">Name</TableHead>
                                        <TableHead className="py-2 px-3 text-center">Department</TableHead>
                                        <TableHead className="py-2 px-3 text-center">Role</TableHead>
                                        <TableHead className="py-2 px-3 text-center">Dependants</TableHead>
                                        <TableHead className="py-2 px-3 text-center">Status</TableHead>
                                        <TableHead className="text-right py-2 px-3">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBeneficiaries.length > 0 ? (
                                        filteredBeneficiaries.map((beneficiary: Beneficiary) => (
                                            <TableRow key={beneficiary.id}>
                                                <TableCell className="py-1.5 px-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-7 w-7">
                                                            <AvatarFallback className="bg-blue-400/10 text-blue-600 text-xs">
                                                                {beneficiary.name.split(' ').map((n: string) => n[0]).join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium text-sm">{beneficiary.name}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {beneficiary.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-1.5 px-3 text-sm text-center">{beneficiary.department}</TableCell>
                                                <TableCell className="py-1.5 px-3 text-sm text-center">{beneficiary.role}</TableCell>
                                                <TableCell className="py-1.5 px-3 text-center">
                                                    {(beneficiary.dependants?.length || 0) > 0 ? (
                                                        <div className="flex justify-center">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="link"
                                                                            size="sm"
                                                                            className="h-6 px-0 text-purple-600 text-xs flex items-center hover:bg-transparent hover:no-underline"
                                                                            onClick={() => router.push(`/admin/clients/${client.id}/beneficiaries/${beneficiary.id}/dependants`)}
                                                                        >
                                                                            <User className="h-3.5 w-3.5" />
                                                                            <span className="-ml-1">{beneficiary.dependants?.length || 0}</span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{beneficiary.dependants?.length || 0} Family Members</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    ) : (
                                                        <div className="flex justify-center">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            variant="link"
                                                                            size="sm"
                                                                            className="h-6 px-0 text-muted-foreground text-xs flex items-center hover:bg-transparent hover:no-underline"
                                                                            onClick={() => router.push(`/admin/clients/${client.id}/beneficiaries/${beneficiary.id}/dependants`)}
                                                                        >
                                                                            <Plus className="h-3.5 w-3.5" />
                                                                            <span className="-ml-1">Add</span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Add family members</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-1.5 px-3 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "mx-auto",
                                                            beneficiary.status === 'ACTIVE'
                                                                ? "bg-green-50 text-green-600 border-green-200"
                                                                : "bg-gray-50 text-gray-600"
                                                        )}
                                                    >
                                                        {beneficiary.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-1.5 px-3 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() =>
                                                                router.push(`/admin/clients/${client.id}/beneficiaries/${beneficiary.id}/dependants`)
                                                            }>
                                                                <User className="mr-2 h-4 w-4" />
                                                                View Dependants
                                                            </DropdownMenuItem>
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
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-20 text-center">
                                                No beneficiaries found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 