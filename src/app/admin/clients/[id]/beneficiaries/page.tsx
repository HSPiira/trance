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
import { clients } from '../../mock-data'

export default function ClientBeneficiariesPage({ params }: { params: { id: string } }) {
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

    // Find the client with the corresponding ID
    const client = clients.find(c => c.id === params.id)

    // If client not found or is not a company, redirect back to clients page
    if (!client) {
        router.push('/admin/clients')
        return null
    }

    // Ensure client is a company
    if (client.clientType !== 'COMPANY') {
        router.push(`/admin/clients/${params.id}`)
        return null
    }

    // Get beneficiaries
    const beneficiaries = client.beneficiaries || []

    // Filter beneficiaries based on search
    const filteredBeneficiaries = beneficiaries.filter(beneficiary =>
        beneficiary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beneficiary.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beneficiary.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beneficiary.role.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Calculate total dependants
    const totalDependants = beneficiaries.reduce((sum, beneficiary) =>
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/clients/${client.id}`)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Client
                    </Button>

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
                <Card className="bg-gradient-to-br from-white to-blue-50">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-blue-400/10 p-3 rounded-full flex items-center justify-center h-12 w-12 border-2 border-blue-100">
                            <Users className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Beneficiaries</p>
                            <h3 className="font-semibold tracking-tight">{beneficiaries.length}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-green-50">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-green-400/10 p-3 rounded-full flex items-center justify-center h-12 w-12 border-2 border-green-100">
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Beneficiaries</p>
                            <h3 className="font-semibold tracking-tight">
                                {beneficiaries.filter(b => b.status === 'ACTIVE').length}
                            </h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-white to-purple-50">
                    <CardContent className="p-4 flex items-center space-x-4">
                        <div className="bg-purple-400/10 p-3 rounded-full flex items-center justify-center h-12 w-12 border-2 border-purple-100">
                            <User className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Dependants</p>
                            <h3 className="font-semibold tracking-tight">{totalDependants}</h3>
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
                                        <TableHead className="py-2 px-3">Department</TableHead>
                                        <TableHead className="py-2 px-3">Role</TableHead>
                                        <TableHead className="py-2 px-3">Dependants</TableHead>
                                        <TableHead className="py-2 px-3">Status</TableHead>
                                        <TableHead className="text-right py-2 px-3">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBeneficiaries.length > 0 ? (
                                        filteredBeneficiaries.map((beneficiary) => (
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
                                                <TableCell className="py-1.5 px-3 text-sm">{beneficiary.department}</TableCell>
                                                <TableCell className="py-1.5 px-3 text-sm">{beneficiary.role}</TableCell>
                                                <TableCell className="py-1.5 px-3">
                                                    {(beneficiary.dependants?.length || 0) > 0 ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-6 px-2 bg-purple-50 text-purple-600 text-xs font-normal border-purple-200 hover:bg-purple-100"
                                                            onClick={() => router.push(`/admin/clients/${client.id}/beneficiaries/${beneficiary.id}/dependants`)}
                                                        >
                                                            <User className="h-3 w-3 mr-1" />
                                                            {beneficiary.dependants?.length || 0}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-6 px-2 text-xs font-normal"
                                                            onClick={() => router.push(`/admin/clients/${client.id}/beneficiaries/${beneficiary.id}/dependants`)}
                                                        >
                                                            <Plus className="h-3 w-3 mr-1" />
                                                            Add
                                                        </Button>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-1.5 px-3">
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