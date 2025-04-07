'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
    CreditCard,
    Search,
    Filter,
    MoreVertical,
    Download,
    ChevronLeft,
    ChevronRight,
    Eye,
    FileText,
    ArrowUpRight,
    ArrowDownLeft,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Clock,
    Receipt,
    DollarSign,
    BarChart4,
    BarChart,
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
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock data for payments/transactions
const transactions = [
    {
        id: 'txn_1',
        type: 'PAYMENT',
        amount: 120,
        currency: 'USD',
        status: 'COMPLETED',
        date: '2023-06-15',
        client: {
            id: '1',
            name: 'John Doe',
            avatar: 'https://avatar.vercel.sh/1.png',
        },
        session: {
            id: 'sess_1',
            title: 'Initial Assessment',
            date: '2023-06-15',
            counsellor: 'Dr. Michael Chen'
        },
        paymentMethod: 'CARD',
        cardBrand: 'Visa',
        cardLast4: '4242',
        description: 'Payment for initial assessment session',
        refundable: true
    },
    {
        id: 'txn_2',
        type: 'PAYMENT',
        amount: 120,
        currency: 'USD',
        status: 'COMPLETED',
        date: '2023-06-22',
        client: {
            id: '1',
            name: 'John Doe',
            avatar: 'https://avatar.vercel.sh/1.png',
        },
        session: {
            id: 'sess_2',
            title: 'Follow-up Session',
            date: '2023-06-22',
            counsellor: 'Dr. Michael Chen'
        },
        paymentMethod: 'CARD',
        cardBrand: 'Visa',
        cardLast4: '4242',
        description: 'Payment for follow-up session',
        refundable: true
    },
    {
        id: 'txn_3',
        type: 'PAYMENT',
        amount: 90,
        currency: 'USD',
        status: 'COMPLETED',
        date: '2023-06-15',
        client: {
            id: '2',
            name: 'Jane Smith',
            avatar: 'https://avatar.vercel.sh/2.png',
        },
        session: {
            id: 'sess_3',
            title: 'Weekly Session',
            date: '2023-06-15',
            counsellor: 'Dr. Lisa Brown'
        },
        paymentMethod: 'CARD',
        cardBrand: 'Mastercard',
        cardLast4: '5678',
        description: 'Payment for weekly therapy session',
        refundable: true
    },
    {
        id: 'txn_4',
        type: 'PAYMENT',
        amount: 60,
        currency: 'USD',
        status: 'PENDING',
        date: '2023-06-10',
        client: {
            id: '5',
            name: 'Robert Johnson',
            avatar: 'https://avatar.vercel.sh/5.png',
        },
        session: {
            id: 'sess_4',
            title: 'Emergency Session',
            date: '2023-06-10',
            counsellor: 'Dr. Sarah Wilson'
        },
        paymentMethod: 'INVOICE',
        description: 'Payment for emergency session',
        refundable: false
    },
    {
        id: 'txn_5',
        type: 'PAYMENT',
        amount: 120,
        currency: 'USD',
        status: 'PENDING',
        date: '2023-06-16',
        client: {
            id: '6',
            name: 'Emily Davis',
            avatar: 'https://avatar.vercel.sh/6.png',
        },
        session: {
            id: 'sess_5',
            title: 'Weekly Session',
            date: '2023-06-16',
            counsellor: 'Dr. Patricia Lee'
        },
        paymentMethod: 'CARD',
        cardBrand: 'American Express',
        cardLast4: '0001',
        description: 'Payment for weekly session',
        refundable: false
    },
    {
        id: 'txn_6',
        type: 'REFUND',
        amount: 120,
        currency: 'USD',
        status: 'COMPLETED',
        date: '2023-06-14',
        client: {
            id: '5',
            name: 'Robert Johnson',
            avatar: 'https://avatar.vercel.sh/5.png',
        },
        session: {
            id: 'sess_9',
            title: 'Rescheduled Session',
            date: '2023-06-14',
            counsellor: 'Dr. Sarah Wilson'
        },
        originalTransaction: 'txn_15',
        paymentMethod: 'CARD',
        cardBrand: 'Visa',
        cardLast4: '9876',
        description: 'Refund for cancelled session',
        refundable: false
    },
    {
        id: 'txn_7',
        type: 'PAYMENT',
        amount: 150,
        currency: 'USD',
        status: 'PENDING',
        date: '2023-06-18',
        client: {
            id: '9',
            name: 'James Wilson',
            avatar: 'https://avatar.vercel.sh/9.png',
        },
        session: {
            id: 'sess_6',
            title: 'Initial Assessment',
            date: '2023-06-18',
            counsellor: 'Dr. Michael Chen'
        },
        paymentMethod: 'BANK_TRANSFER',
        description: 'Payment for initial assessment (90 min)',
        refundable: false
    },
    {
        id: 'txn_8',
        type: 'PAYMENT',
        amount: 200,
        currency: 'USD',
        status: 'COMPLETED',
        date: '2023-06-17',
        client: {
            id: 'group1',
            name: 'Anxiety Support Group',
            avatar: '',
        },
        session: {
            id: 'sess_10',
            title: 'Group Session',
            date: '2023-06-17',
            counsellor: 'Dr. Patricia Lee'
        },
        paymentMethod: 'CARD',
        cardBrand: 'Visa',
        cardLast4: '1234',
        description: 'Payment for anxiety support group session',
        refundable: true
    }
]

export default function AdminPaymentsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [typeFilter, setTypeFilter] = useState('ALL')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [dateRangeFilter, setDateRangeFilter] = useState('ALL')

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/unauthorized')
        }
    }, [router, user])

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch =
            transaction.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.session.title.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'ALL' || transaction.status === statusFilter
        const matchesType = typeFilter === 'ALL' || transaction.type === typeFilter

        let matchesDateRange = true
        const transactionDate = new Date(transaction.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (dateRangeFilter === 'TODAY') {
            const todayString = today.toISOString().split('T')[0]
            matchesDateRange = transaction.date === todayString
        } else if (dateRangeFilter === 'THIS_WEEK') {
            const weekStart = new Date(today)
            weekStart.setDate(today.getDate() - today.getDay())
            matchesDateRange = transactionDate >= weekStart
        } else if (dateRangeFilter === 'THIS_MONTH') {
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
            matchesDateRange = transactionDate >= monthStart
        }

        return matchesSearch && matchesStatus && matchesType && matchesDateRange
    })

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>
            case 'PENDING':
                return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Pending</Badge>
            case 'FAILED':
                return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Failed</Badge>
            case 'REFUNDED':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Refunded</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'PAYMENT':
                return <ArrowDownLeft className="h-4 w-4 text-green-500" />
            case 'REFUND':
                return <ArrowUpRight className="h-4 w-4 text-amber-500" />
            default:
                return <DollarSign className="h-4 w-4" />
        }
    }

    // Calculate payment statistics
    const paymentStats = {
        totalAmount: transactions.filter(t => t.type === 'PAYMENT' && t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0),
        pendingAmount: transactions.filter(t => t.type === 'PAYMENT' && t.status === 'PENDING').reduce((sum, t) => sum + t.amount, 0),
        refundedAmount: transactions.filter(t => t.type === 'REFUND' && t.status === 'COMPLETED').reduce((sum, t) => sum + t.amount, 0),
        completedCount: transactions.filter(t => t.type === 'PAYMENT' && t.status === 'COMPLETED').length,
        pendingCount: transactions.filter(t => t.status === 'PENDING').length
    }

    if (!user) {
        return null
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                    <p className="text-muted-foreground">
                        Manage payments, refunds, and financial transactions
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export Report
                    </Button>
                    <Button>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Record Payment
                    </Button>
                </div>
            </div>

            {/* Payment Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-primary/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Revenue</p>
                            <h3 className="text-2xl font-bold">${paymentStats.totalAmount}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-green-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-green-500/10 p-2 rounded-full">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Completed Payments</p>
                            <h3 className="text-2xl font-bold">{paymentStats.completedCount}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-amber-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-amber-500/10 p-2 rounded-full">
                            <Clock className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Pending</p>
                            <h3 className="text-2xl font-bold">${paymentStats.pendingAmount}</h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-red-500/5">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="bg-red-500/10 p-2 rounded-full">
                            <ArrowUpRight className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Refunded</p>
                            <h3 className="text-2xl font-bold">${paymentStats.refundedAmount}</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <Tabs defaultValue="transactions">
                <TabsList className="mb-4">
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Transactions</CardTitle>
                            <CardDescription>
                                View and manage all financial transactions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex-1 min-w-[200px]">
                                        <Input
                                            placeholder="Search clients, transactions, or sessions..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="h-8"
                                        />
                                    </div>
                                    <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                                        <SelectTrigger className="w-[150px] h-8">
                                            <SelectValue placeholder="Date range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All Time</SelectItem>
                                            <SelectItem value="TODAY">Today</SelectItem>
                                            <SelectItem value="THIS_WEEK">This Week</SelectItem>
                                            <SelectItem value="THIS_MONTH">This Month</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[150px] h-8">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All Status</SelectItem>
                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="FAILED">Failed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="w-[150px] h-8">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All Types</SelectItem>
                                            <SelectItem value="PAYMENT">Payments</SelectItem>
                                            <SelectItem value="REFUND">Refunds</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50px] px-4">Type</TableHead>
                                                <TableHead className="w-[180px] px-4">Client</TableHead>
                                                <TableHead className="w-[180px] px-4">Session</TableHead>
                                                <TableHead className="w-[100px] px-4">Amount</TableHead>
                                                <TableHead className="w-[120px] px-4">Date</TableHead>
                                                <TableHead className="w-[120px] px-4">Payment Method</TableHead>
                                                <TableHead className="w-[100px] px-4">Status</TableHead>
                                                <TableHead className="w-[60px] px-4">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedTransactions.map((transaction) => (
                                                <TableRow key={transaction.id}>
                                                    <TableCell className="px-4 py-2">
                                                        {getTypeIcon(transaction.type)}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage src={transaction.client.avatar} />
                                                                <AvatarFallback className="text-[10px]">
                                                                    {transaction.client.name.split(' ').map((n: string) => n[0]).join('')}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-sm whitespace-nowrap">{transaction.client.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2">
                                                        <span className="text-sm">
                                                            {transaction.session.title}
                                                        </span>
                                                        <div className="text-xs text-muted-foreground">
                                                            {transaction.session.counsellor}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2 font-medium">
                                                        {transaction.type === 'REFUND' ? '- ' : ''}
                                                        ${transaction.amount}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2">
                                                        <span className="text-sm whitespace-nowrap">
                                                            {new Date(transaction.date).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2">
                                                        <div className="text-sm whitespace-nowrap">
                                                            {transaction.paymentMethod === 'CARD' && (
                                                                <span className="flex items-center gap-1">
                                                                    <CreditCard className="h-3 w-3" />
                                                                    {transaction.cardBrand} •••• {transaction.cardLast4}
                                                                </span>
                                                            )}
                                                            {transaction.paymentMethod === 'BANK_TRANSFER' && 'Bank Transfer'}
                                                            {transaction.paymentMethod === 'INVOICE' && 'Invoice'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-2">
                                                        {getStatusBadge(transaction.status)}
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
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Receipt className="mr-2 h-4 w-4" />
                                                                    View Receipt
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                {transaction.type === 'PAYMENT' &&
                                                                    transaction.status === 'COMPLETED' &&
                                                                    transaction.refundable && (
                                                                        <DropdownMenuItem className="text-destructive">
                                                                            <ArrowUpRight className="mr-2 h-4 w-4" />
                                                                            Issue Refund
                                                                        </DropdownMenuItem>
                                                                    )}
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
                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
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
                </TabsContent>

                <TabsContent value="reports">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Overview</CardTitle>
                                <CardDescription>Monthly revenue analysis</CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center items-center p-6">
                                <div className="w-full h-48 flex items-center justify-center text-muted-foreground">
                                    <BarChart4 className="h-16 w-16 opacity-30" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Methods</CardTitle>
                                <CardDescription>Distribution by payment method</CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center items-center p-6">
                                <div className="w-full h-48 flex items-center justify-center text-muted-foreground">
                                    <BarChart className="h-16 w-16 opacity-30" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Financial Reports</CardTitle>
                                <CardDescription>Download detailed reports</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <Button variant="outline" className="justify-start">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Monthly Revenue Report
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Counsellor Earnings Report
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Payment Methods Analysis
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
} 