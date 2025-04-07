'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataPagination } from '@/components/ui/data-pagination'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
    ClipboardCheck,
    AlertCircle,
    ClipboardList,
    Clock,
    Calendar,
    ArrowRight,
    FileText,
    Search,
    CheckCircle2,
    XCircle,
    BarChart3
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { format, parseISO, isAfter, isValid } from 'date-fns'
import { AssessmentStatus } from '@/lib/db/schema'
import { fetchAssessments } from './data'

export default function ClientAssessmentsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('assigned')
    const [searchQuery, setSearchQuery] = useState('')
    const [assessments, setAssessments] = useState<any[]>([])
    const [filteredAssessments, setFilteredAssessments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [totalItems, setTotalItems] = useState(0)

    // Fetch assessments
    useEffect(() => {
        const fetchAssessmentsData = async () => {
            try {
                setIsLoading(true)

                // Use mock data instead of real API
                let statusFilter = undefined
                if (activeTab === 'assigned') {
                    statusFilter = AssessmentStatus.ASSIGNED
                } else if (activeTab === 'completed') {
                    statusFilter = AssessmentStatus.COMPLETED
                }

                const data = await fetchAssessments(statusFilter)

                setAssessments(data.assessments || [])
                setTotalItems(data.pagination?.total || 0)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching assessments:', error)
                setError('Failed to load assessments')
                setIsLoading(false)
            }
        }

        if (user) {
            fetchAssessmentsData()
        } else {
            router.push('/login')
        }
    }, [user, router, currentPage, itemsPerPage, activeTab])

    // Filter assessments based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredAssessments(assessments)
            return
        }

        const query = searchQuery.toLowerCase()
        const filtered = assessments.filter(assessment =>
            assessment.assessment?.title?.toLowerCase().includes(query) ||
            assessment.assessment?.description?.toLowerCase().includes(query) ||
            assessment.assessment?.type?.toLowerCase().includes(query) ||
            assessment.counsellor?.user?.firstName?.toLowerCase().includes(query) ||
            assessment.counsellor?.user?.lastName?.toLowerCase().includes(query)
        )

        setFilteredAssessments(filtered)
    }, [assessments, searchQuery])

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Handle items per page change
    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value)
        setCurrentPage(1)
    }

    // Format date
    const formatDate = (dateStr: string) => {
        try {
            if (!dateStr || typeof dateStr !== 'string') return 'N/A'

            // Log for debugging
            console.log(`Formatting date: ${dateStr}`)

            // Try to parse as ISO date
            const date = parseISO(dateStr)

            // Check if date is valid
            if (!isValid(date)) {
                console.warn(`Invalid date format detected: ${dateStr}`)
                return 'Invalid date'
            }

            return format(date, 'MMM d, yyyy')
        } catch (error) {
            console.error(`Error formatting date '${dateStr}':`, error)
            return 'Invalid date'
        }
    }

    // Check if assessment is overdue
    const isOverdue = (dueDate: string) => {
        try {
            if (!dueDate || typeof dueDate !== 'string') return false

            const date = parseISO(dueDate)
            if (!isValid(date)) {
                console.warn(`Invalid due date format detected: ${dueDate}`)
                return false
            }

            return isAfter(new Date(), date)
        } catch (error) {
            console.error(`Error checking if date is overdue '${dueDate}':`, error)
            return false
        }
    }

    // Get status badge
    const getStatusBadge = (status: string, dueDate?: string) => {
        switch (status) {
            case AssessmentStatus.ASSIGNED:
                return dueDate && isOverdue(dueDate)
                    ? <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Overdue</Badge>
                    : <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Assigned</Badge>
            case AssessmentStatus.IN_PROGRESS:
                return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">In Progress</Badge>
            case AssessmentStatus.COMPLETED:
                return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Completed</Badge>
            case AssessmentStatus.EXPIRED:
                return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Expired</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    if (!user) {
        return null
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
                    <p className="text-muted-foreground">
                        Complete assigned assessments and view previous results
                    </p>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Tabs
                        defaultValue="assigned"
                        className="w-full"
                        onValueChange={setActiveTab}
                    >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <TabsList>
                                <TabsTrigger value="assigned" className="flex items-center gap-1">
                                    <ClipboardList className="h-4 w-4" />
                                    <span>Assigned</span>
                                </TabsTrigger>
                                <TabsTrigger value="completed" className="flex items-center gap-1">
                                    <ClipboardCheck className="h-4 w-4" />
                                    <span>Completed</span>
                                </TabsTrigger>
                                <TabsTrigger value="all" className="flex items-center gap-1">
                                    <FileText className="h-4 w-4" />
                                    <span>All</span>
                                </TabsTrigger>
                            </TabsList>

                            <div className="relative flex-1 sm:max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search assessments..."
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <TabsContent value="assigned" className="mt-6">
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <div className="animate-pulse text-center">
                                        <p>Loading assigned assessments...</p>
                                    </div>
                                </div>
                            ) : filteredAssessments.length === 0 ? (
                                <Alert className="bg-blue-50">
                                    <ClipboardList className="h-4 w-4" />
                                    <AlertTitle>No assigned assessments</AlertTitle>
                                    <AlertDescription>
                                        You don't have any pending assessments to complete at this time.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="space-y-4">
                                    {filteredAssessments.map((assessment) => {
                                        const isAssessmentOverdue = assessment.dueDate && isOverdue(assessment.dueDate)
                                        return (
                                            <Card
                                                key={assessment.id}
                                                className={isAssessmentOverdue ? 'border-amber-200 shadow-sm' : ''}
                                            >
                                                <CardHeader className="pb-2">
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="text-lg">
                                                            {assessment.assessment?.title}
                                                        </CardTitle>
                                                        {getStatusBadge(assessment.status, assessment.dueDate)}
                                                    </div>
                                                    <CardDescription>
                                                        {assessment.assessment?.description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="pb-2">
                                                    <div className="space-y-4">
                                                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                            <div className="flex items-center gap-4 text-sm">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                    <span>Assigned: {formatDate(assessment.assignedDate)}</span>
                                                                </div>
                                                                {assessment.dueDate && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                                        <span className={isAssessmentOverdue ? 'text-amber-700 font-medium' : ''}>
                                                                            Due: {formatDate(assessment.dueDate)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-sm">
                                                                Assigned by: {assessment.counsellor?.user?.firstName} {assessment.counsellor?.user?.lastName}
                                                            </div>
                                                        </div>

                                                        {assessment.status === AssessmentStatus.IN_PROGRESS && (
                                                            <div className="space-y-1">
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span>Progress</span>
                                                                    <span>50%</span>
                                                                </div>
                                                                <Progress value={50} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button
                                                        className="ml-auto"
                                                        onClick={() => router.push(`/client/assessments/${assessment.id}`)}
                                                    >
                                                        {assessment.status === AssessmentStatus.IN_PROGRESS ? 'Continue' : 'Start'} Assessment
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        )
                                    })}

                                    <DataPagination
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                        showItemsInfo
                                    />
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="completed" className="mt-6">
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <div className="animate-pulse text-center">
                                        <p>Loading completed assessments...</p>
                                    </div>
                                </div>
                            ) : filteredAssessments.length === 0 ? (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>No completed assessments</AlertTitle>
                                    <AlertDescription>
                                        You haven't completed any assessments yet.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="space-y-4">
                                    {filteredAssessments.map((assessment) => (
                                        <Card key={assessment.id}>
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-lg">
                                                        {assessment.assessment?.title}
                                                    </CardTitle>
                                                    {getStatusBadge(assessment.status)}
                                                </div>
                                                <CardDescription>
                                                    {assessment.assessment?.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="pb-2">
                                                <div className="space-y-4">
                                                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                <span>Completed: {formatDate(assessment.completedDate)}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm">
                                                            Assigned by: {assessment.counsellor?.user?.firstName} {assessment.counsellor?.user?.lastName}
                                                        </div>
                                                    </div>

                                                    {assessment.shareWithClient && assessment.score !== null && (
                                                        <div className="mt-4 space-y-2">
                                                            <Separator />
                                                            <div className="pt-2">
                                                                <h4 className="font-medium flex items-center">
                                                                    <BarChart3 className="mr-1 h-4 w-4" />
                                                                    Results
                                                                </h4>
                                                                <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <Card className="bg-muted/50">
                                                                        <CardContent className="p-4">
                                                                            <div className="text-center">
                                                                                <div className="text-3xl font-bold">{assessment.score}</div>
                                                                                <div className="text-sm text-muted-foreground">Score</div>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>

                                                                    <Card className="bg-muted/50 md:col-span-2">
                                                                        <CardContent className="p-4">
                                                                            <h5 className="font-medium mb-2">Summary</h5>
                                                                            <p className="text-sm text-muted-foreground">
                                                                                {assessment.notes || "No summary provided by counselor."}
                                                                            </p>
                                                                        </CardContent>
                                                                    </Card>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <Button
                                                    variant="outline"
                                                    className="ml-auto"
                                                    onClick={() => router.push(`/client/assessments/${assessment.id}/results`)}
                                                >
                                                    View Details
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}

                                    <DataPagination
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                        showItemsInfo
                                    />
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="all" className="mt-6">
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <div className="animate-pulse text-center">
                                        <p>Loading all assessments...</p>
                                    </div>
                                </div>
                            ) : filteredAssessments.length === 0 ? (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>No assessments found</AlertTitle>
                                    <AlertDescription>
                                        No assessments match your search criteria.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <div className="space-y-4">
                                    {filteredAssessments.map((assessment) => {
                                        const isAssessmentOverdue = assessment.status === AssessmentStatus.ASSIGNED &&
                                            assessment.dueDate && isOverdue(assessment.dueDate)

                                        return (
                                            <Card
                                                key={assessment.id}
                                                className={isAssessmentOverdue ? 'border-amber-200 shadow-sm' : ''}
                                            >
                                                <CardHeader className="pb-2">
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="text-lg">
                                                            {assessment.assessment?.title}
                                                        </CardTitle>
                                                        {getStatusBadge(assessment.status, assessment.dueDate)}
                                                    </div>
                                                    <CardDescription>
                                                        {assessment.assessment?.description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="pb-2">
                                                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                <span>
                                                                    {assessment.status === AssessmentStatus.COMPLETED
                                                                        ? `Completed: ${formatDate(assessment.completedDate)}`
                                                                        : `Assigned: ${formatDate(assessment.assignedDate)}`
                                                                    }
                                                                </span>
                                                            </div>
                                                            {assessment.status === AssessmentStatus.ASSIGNED && assessment.dueDate && (
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                                    <span className={isAssessmentOverdue ? 'text-amber-700 font-medium' : ''}>
                                                                        Due: {formatDate(assessment.dueDate)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-sm">
                                                            Assigned by: {assessment.counsellor?.user?.firstName} {assessment.counsellor?.user?.lastName}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter>
                                                    {assessment.status === AssessmentStatus.ASSIGNED && (
                                                        <Button
                                                            className="ml-auto"
                                                            onClick={() => router.push(`/client/assessments/${assessment.id}`)}
                                                        >
                                                            Start Assessment
                                                            <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {assessment.status === AssessmentStatus.IN_PROGRESS && (
                                                        <Button
                                                            className="ml-auto"
                                                            onClick={() => router.push(`/client/assessments/${assessment.id}`)}
                                                        >
                                                            Continue Assessment
                                                            <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {assessment.status === AssessmentStatus.COMPLETED && (
                                                        <Button
                                                            variant="outline"
                                                            className="ml-auto"
                                                            onClick={() => router.push(`/client/assessments/${assessment.id}/results`)}
                                                        >
                                                            View Results
                                                            <ArrowRight className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </CardFooter>
                                            </Card>
                                        )
                                    })}

                                    <DataPagination
                                        totalItems={totalItems}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                        showItemsInfo
                                    />
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </DashboardLayout>
    )
} 