'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    FileCheck,
    FileClock,
    BarChart3,
    ClipboardCheck,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Loader2,
    XCircle,
    MessageSquare
} from 'lucide-react'
import { format, parseISO, isValid } from 'date-fns'
import { AssessmentStatus } from '@/lib/db/schema'
import { cn } from '@/lib/utils'
import { fetchAssessmentById } from '../../data'
import { BackButton } from '@/components/ui/back-button'

interface Question {
    id: string
    text: string
    type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT' | 'SCALE' | 'BOOLEAN'
    options?: { id: string; text: string; value: number }[]
    required: boolean
}

interface Response {
    id: string
    questionId: string
    questionType: string
    selectedOption?: string
    selectedOptions?: string[]
    textValue?: string
    numericValue?: number
    booleanValue?: boolean
}

export default function AssessmentResultsPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { user } = useAuth()
    const [assessment, setAssessment] = useState<any>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [responses, setResponses] = useState<Response[]>([])
    const [currentPage, setCurrentPage] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const questionsPerPage = 5
    const totalPages = Math.ceil(questions.length / questionsPerPage)

    // Fetch assessment data
    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                setIsLoading(true)

                // Use mock data instead of real API
                const data = await fetchAssessmentById(params.id)

                if ('error' in data) {
                    throw new Error(data.error.toString())
                }

                // Check if the assessment is completed
                if (data.assessment.status !== AssessmentStatus.COMPLETED) {
                    router.push(`/client/assessments/${params.id}`)
                    return
                }

                setAssessment(data.assessment)

                if (data.assessment.assessment?.questions) {
                    setQuestions(data.assessment.assessment.questions)
                }

                if (data.assessment.responses) {
                    setResponses(data.assessment.responses)
                }

                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching assessment results:', error)
                setError('Failed to load assessment results')
                setIsLoading(false)
            }
        }

        if (user) {
            fetchAssessment()
        } else {
            router.push('/login')
        }
    }, [params.id, user, router])

    // Format date
    const formatDate = (dateStr: string | null | undefined) => {
        try {
            if (!dateStr || typeof dateStr !== 'string') return 'N/A'
            const date = parseISO(dateStr)
            if (!isValid(date)) return 'Invalid date'
            return format(date, 'MMM d, yyyy')
        } catch (error) {
            console.error('Error formatting date:', error)
            return 'Invalid date'
        }
    }

    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case AssessmentStatus.COMPLETED:
                return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Completed</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    // Get question response
    const getQuestionResponse = (questionId: string): Response | undefined => {
        return responses.find(r => r.questionId === questionId)
    }

    // Render response for a question
    const renderResponse = (question: Question) => {
        const response = getQuestionResponse(question.id)
        if (!response) return <p className="text-muted-foreground italic">No response provided</p>

        switch (question.type) {
            case 'SINGLE_CHOICE': {
                if (!response.selectedOption) return <p className="text-muted-foreground italic">No selection made</p>

                const selectedOption = question.options?.find(o => o.id === response.selectedOption)
                return <p>{selectedOption?.text || 'Unknown option'}</p>
            }

            case 'MULTIPLE_CHOICE': {
                if (!response.selectedOptions?.length) return <p className="text-muted-foreground italic">No selections made</p>

                return (
                    <ul className="list-disc pl-5 space-y-1">
                        {response.selectedOptions.map(optionId => {
                            const option = question.options?.find(o => o.id === optionId)
                            return <li key={optionId}>{option?.text || 'Unknown option'}</li>
                        })}
                    </ul>
                )
            }

            case 'TEXT':
                return response.textValue ?
                    <p className="whitespace-pre-wrap">{response.textValue}</p> :
                    <p className="text-muted-foreground italic">No text provided</p>

            case 'SCALE':
                return response.numericValue !== undefined ? (
                    <div className="flex items-center gap-2">
                        <div className="grid grid-cols-10 gap-1 max-w-md">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                <div
                                    key={value}
                                    className={cn(
                                        "h-10 flex items-center justify-center rounded",
                                        value === response.numericValue
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    )}
                                >
                                    {value}
                                </div>
                            ))}
                        </div>
                        <span className="text-muted-foreground">({response.numericValue})</span>
                    </div>
                ) : (
                    <p className="text-muted-foreground italic">No rating provided</p>
                )

            case 'BOOLEAN':
                return response.booleanValue === undefined ? (
                    <p className="text-muted-foreground italic">No selection made</p>
                ) : (
                    <div className="flex items-center gap-2">
                        {response.booleanValue ? (
                            <>
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <span>Yes</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-5 w-5 text-red-600" />
                                <span>No</span>
                            </>
                        )}
                    </div>
                )

            default:
                return <p className="text-muted-foreground italic">Unsupported response type</p>
        }
    }

    // Render question and its response
    const renderQuestionWithResponse = (question: Question, index: number) => {
        const questionNumber = currentPage * questionsPerPage + index + 1

        return (
            <div key={question.id} className="mb-6 space-y-4">
                <div className="flex items-start gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {questionNumber}
                    </div>
                    <div>
                        <h3 className="text-base font-medium leading-tight">
                            {question.text}
                            {question.required && <span className="text-destructive ml-1">*</span>}
                        </h3>
                    </div>
                </div>

                <div className="ml-8 p-3 bg-muted/50 rounded-md">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Your Response:</p>
                    {renderResponse(question)}
                </div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    // Handle loading state
    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex h-[70vh] items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                        <p className="mt-2 text-muted-foreground">Loading assessment results...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    // Handle error state
    if (error || !assessment) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <BackButton
                        href="/client/assessments"
                        tooltip="Back to Assessments"
                    />

                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error || 'Failed to load assessment results'}
                        </AlertDescription>
                    </Alert>
                </div>
            </DashboardLayout>
        )
    }

    const currentQuestions = questions.slice(
        currentPage * questionsPerPage,
        (currentPage + 1) * questionsPerPage
    )

    // Check if results can be shown to client
    const canViewResults = assessment.shareWithClient || false

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <BackButton
                    href="/client/assessments"
                    tooltip="Back to Assessments"
                />

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-2xl">{assessment.assessment?.title}</CardTitle>
                                    {getStatusBadge(assessment.status)}
                                </div>
                                <CardDescription className="mt-1">
                                    {assessment.assessment?.description}
                                </CardDescription>
                            </div>

                            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <FileClock className="h-4 w-4" />
                                    <span>Assigned: {formatDate(assessment.assignedDate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FileCheck className="h-4 w-4" />
                                    <span>Completed: {formatDate(assessment.completedDate)}</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    {canViewResults && assessment.score !== null && (
                        <CardContent className="border-t pt-6">
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium flex items-center">
                                    <BarChart3 className="mr-2 h-5 w-5" />
                                    Results Summary
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="bg-muted/50">
                                        <CardContent className="p-6">
                                            <div className="text-center">
                                                <div className="text-5xl font-bold">{assessment.score}</div>
                                                <div className="mt-2 text-sm text-muted-foreground">Total Score</div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-muted/50 md:col-span-2">
                                        <CardContent className="p-6">
                                            <div className="space-y-2">
                                                <h4 className="font-medium flex items-center">
                                                    <MessageSquare className="mr-2 h-4 w-4" />
                                                    Counselor's Notes
                                                </h4>
                                                <p className="text-muted-foreground">
                                                    {assessment.notes || "No additional notes from your counselor."}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    )}

                    {!canViewResults && (
                        <CardContent className="border-t pt-6">
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Results not available</AlertTitle>
                                <AlertDescription>
                                    Your counselor has not shared the detailed results of this assessment with you yet.
                                    They may discuss the results with you during your next session.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    )}

                    <CardContent className={!canViewResults ? "" : "border-t pt-6"}>
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium flex items-center">
                                <ClipboardCheck className="mr-2 h-5 w-5" />
                                Your Responses
                            </h3>

                            <Separator />

                            <div className="space-y-8 mt-6">
                                {currentQuestions.map((question, index) => renderQuestionWithResponse(question, index))}
                            </div>
                        </div>
                    </CardContent>

                    {questions.length > questionsPerPage && (
                        <CardFooter className="flex items-center justify-between border-t pt-6">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className="flex items-center gap-1"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>

                            <div className="text-sm text-muted-foreground">
                                Page {currentPage + 1} of {totalPages}
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage === totalPages - 1}
                                className="flex items-center gap-1"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </DashboardLayout>
    )
} 