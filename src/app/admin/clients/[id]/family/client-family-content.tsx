'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import {
    ArrowLeft,
    User,
    Heart,
    Search,
    Plus,
    Edit,
    Trash2,
    MoreHorizontal,
    CheckCircle2,
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

interface Dependant {
    id: string;
    name: string;
    relation: string;
    status: string;
}

interface Client {
    id: string;
    name: string;
    email: string;
    status: string;
    joinDate: string;
    avatar?: string;
    clientType: string;
    dependants?: Dependant[];
    [key: string]: any;
}

// Client Component that takes the client data directly
export default function ClientFamilyContent({ client }: { client: Client }) {
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

    // Get dependants
    const dependants = client.dependants || []

    // Filter dependants based on search
    const filteredDependants = dependants.filter((dependant: Dependant) =>
        dependant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dependant.relation.toLowerCase().includes(searchQuery.toLowerCase())
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
                        <BreadcrumbPage>Family</BreadcrumbPage>
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
                            <User className="h-6 w-6 text-purple-400" />
                            {client.name} - Family Members
                        </h1>
                        <p className="text-muted-foreground">
                            Manage family members and dependants for this client
                        </p>
                    </div>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Family Member
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-background to-background/80 border-border">
                    <CardContent className="pt-6 px-6 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Total Family Members</p>
                                <div className="text-2xl font-bold">{dependants.length}</div>
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
                                <p className="text-sm font-medium text-muted-foreground mb-1">Active Members</p>
                                <div className="text-2xl font-bold">
                                    {dependants.filter((d: Dependant) => d.status === 'ACTIVE').length}
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
                                <p className="text-sm font-medium text-muted-foreground mb-1">Family Plan</p>
                                <div className="text-2xl font-bold">
                                    {client.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Heart className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Client Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Primary Client</CardTitle>
                    <CardDescription>
                        Main client information and coverage details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={client.avatar} />
                            <AvatarFallback className="bg-purple-400/10 text-purple-600">
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
                            <h4 className="font-medium">Family Counseling Plan</h4>
                            <Badge variant="outline">
                                {client.name} + {dependants.length} dependant{dependants.length !== 1 ? 's' : ''}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            This plan covers the primary client and all registered family members
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Family Members Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Family Members</CardTitle>
                    <CardDescription>
                        Dependants covered under the family plan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search family members..."
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
                                        <TableHead className="py-2 px-3 text-center">Relation</TableHead>
                                        <TableHead className="py-2 px-3 text-center">Status</TableHead>
                                        <TableHead className="text-right py-2 px-3">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDependants.length > 0 ? (
                                        filteredDependants.map((dependant: Dependant) => (
                                            <TableRow key={dependant.id}>
                                                <TableCell className="py-1.5 px-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-7 w-7">
                                                            <AvatarFallback className="bg-purple-400/10 text-purple-600 text-xs">
                                                                {dependant.name.split(' ').map((n: string) => n[0]).join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="font-medium text-sm">{dependant.name}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-1.5 px-3 text-sm text-center">{dependant.relation}</TableCell>
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
                                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                {dependant.status === "ACTIVE" ? "Deactivate" : "Activate"}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-20 text-center">
                                                No family members found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
                {filteredDependants.length === 0 && !searchQuery && (
                    <CardFooter className="flex justify-center p-6 border-t bg-muted/10">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add First Family Member
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
} 