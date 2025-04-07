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
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    Clock,
    ClipboardCheck,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Loader2,
    Save
} from 'lucide-react'
import { format, parseISO, isAfter, isValid } from 'date-fns'
import { AssessmentStatus } from '@/lib/db/schema'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { fetchAssessmentById } from '../data'

interface Question {
    id: string
    text: string
    type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT' | 'SCALE' | 'BOOLEAN'
    options?: { id: string; text: string; value: number }[]
    required: boolean
}

export default function AssessmentDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { user } = useAuth()
    const { toast } = useToast()
    const [assessment, setAssessment] = useState<any>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [currentPage, setCurrentPage] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [progress, setProgress] = useState(0)
    const [isFormValid, setIsFormValid] = useState(false)

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

                setAssessment(data.assessment)

                // Set questions and initialize answers if they exist
                if (data.assessment.assessment?.questions) {
                    setQuestions(data.assessment.assessment.questions)

                    // Initialize answers with existing responses
                    if (data.assessment.responses) {
                        const initialAnswers: Record<string, any> = {}
                        data.assessment.responses.forEach((response: any) => {
                            if (response.questionType === 'MULTIPLE_CHOICE') {
                                initialAnswers[response.questionId] = response.selectedOptions || []
                            } else if (response.questionType === 'SCALE') {
                                initialAnswers[response.questionId] = response.numericValue
                            } else if (response.questionType === 'BOOLEAN') {
                                initialAnswers[response.questionId] = response.booleanValue
                            } else if (response.questionType === 'TEXT') {
                                initialAnswers[response.questionId] = response.textValue
                            } else {
                                initialAnswers[response.questionId] = response.selectedOption
                            }
                        })
                        setAnswers(initialAnswers)

                        // Calculate initial progress
                        calculateProgress(data.assessment.assessment.questions, initialAnswers)
                    } else {
                        // Calculate initial progress with empty answers
                        calculateProgress(data.assessment.assessment.questions, {})
                    }
                }

                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching assessment:', error)
                setError('Failed to load assessment details')
                setIsLoading(false)
            }
        }

        if (user) {
            fetchAssessment()
        } else {
            router.push('/login')
        }
    }, [params.id, user, router])

    // Calculate progress
    const calculateProgress = (questions: Question[], currentAnswers: Record<string, any>) => {
        if (!questions.length) return 0

        let answered = 0

        questions.forEach(question => {
            const answer = currentAnswers[question.id]

            if (answer !== undefined) {
                if (
                    (question.type === 'MULTIPLE_CHOICE' && Array.isArray(answer) && answer.length > 0) ||
                    (question.type === 'TEXT' && answer.trim() !== '') ||
                    (question.type === 'SINGLE_CHOICE' && answer !== null) ||
                    (question.type === 'SCALE' && answer !== null) ||
                    (question.type === 'BOOLEAN' && answer !== null)
                ) {
                    answered++
                }
            }
        })

        const newProgress = Math.round((answered / questions.length) * 100)
        setProgress(newProgress)
        return newProgress
    }

    // Check if current page questions are valid
    useEffect(() => {
        const startIdx = currentPage * questionsPerPage
        const endIdx = Math.min(startIdx + questionsPerPage, questions.length)
        const currentPageQuestions = questions.slice(startIdx, endIdx)

        let valid = true

        for (const question of currentPageQuestions) {
            if (question.required) {
                const answer = answers[question.id]

                if (answer === undefined || answer === null) {
                    valid = false
                    break
                }

                if (
                    (question.type === 'MULTIPLE_CHOICE' && Array.isArray(answer) && answer.length === 0) ||
                    (question.type === 'TEXT' && answer.trim() === '') ||
                    (question.type === 'SINGLE_CHOICE' && answer === '') ||
                    (question.type === 'SCALE' && answer === null) ||
                    (question.type === 'BOOLEAN' && answer === null)
                ) {
                    valid = false
                    break
                }
            }
        }

        setIsFormValid(valid)
    }, [answers, currentPage, questions, questionsPerPage])

    // Handle answer change
    const handleAnswerChange = (questionId: string, value: any, questionType: string) => {
        setAnswers(prev => {
            const newAnswers = { ...prev, [questionId]: value }
            calculateProgress(questions, newAnswers)
            return newAnswers
        })
    }

    // Handle multiple choice selection
    const handleMultipleChoiceChange = (questionId: string, optionId: string, checked: boolean) => {
        setAnswers(prev => {
            const currentSelection = Array.isArray(prev[questionId]) ? prev[questionId] : []

            let newSelection
            if (checked) {
                newSelection = [...currentSelection, optionId]
            } else {
                newSelection = currentSelection.filter(id => id !== optionId)
            }

            const newAnswers = { ...prev, [questionId]: newSelection }
            calculateProgress(questions, newAnswers)
            return newAnswers
        })
    }

    // Save progress
    const saveProgress = async () => {
        if (Object.keys(answers).length === 0) return

        try {
            setIsSaving(true)

            // Prepare the responses
            const responses = Object.entries(answers).map(([questionId, value]) => {
                const question = questions.find(q => q.id === questionId)

                if (!question) return null

                const response: any = {
                    questionId,
                    questionType: question.type,
                }

                if (question.type === 'MULTIPLE_CHOICE') {
                    response.selectedOptions = value
                } else if (question.type === 'SINGLE_CHOICE') {
                    response.selectedOption = value
                } else if (question.type === 'SCALE') {
                    response.numericValue = parseInt(value)
                } else if (question.type === 'BOOLEAN') {
                    response.booleanValue = value
                } else if (question.type === 'TEXT') {
                    response.textValue = value
                }

                return response
            }).filter(Boolean)

            // For demo - just pretend we sent the request
            console.log('Saving progress with responses:', responses)

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast({
                title: "Progress saved",
                description: "Your answers have been saved. You can continue later."
            })

            // Update the local assessment to IN_PROGRESS
            setAssessment((prev: any) => ({
                ...prev,
                status: AssessmentStatus.IN_PROGRESS
            }))

            setIsSaving(false)
        } catch (error) {
            console.error('Error saving progress:', error)
            setError('Failed to save progress')
            setIsSaving(false)

            toast({
                variant: "destructive",
                title: "Error saving progress",
                description: "Please try again later."
            })
        }
    }

    // Submit assessment
    const submitAssessment = async () => {
        try {
            setIsSubmitting(true)

            // Check if all required questions are answered
            const unansweredRequired = questions.filter(question => {
                if (!question.required) return false

                const answer = answers[question.id]

                if (answer === undefined || answer === null) return true

                if (
                    (question.type === 'MULTIPLE_CHOICE' && Array.isArray(answer) && answer.length === 0) ||
                    (question.type === 'TEXT' && answer.trim() === '') ||
                    (question.type === 'SINGLE_CHOICE' && answer === '') ||
                    (question.type === 'SCALE' && answer === null) ||
                    (question.type === 'BOOLEAN' && answer === null)
                ) {
                    return true
                }

                return false
            })

            if (unansweredRequired.length > 0) {
                // Find the first unanswered required question
                const firstUnansweredIdx = questions.findIndex(q =>
                    unansweredRequired.some(ur => ur.id === q.id)
                )

                // Go to the page with the first unanswered question
                const pageToGo = Math.floor(firstUnansweredIdx / questionsPerPage)
                setCurrentPage(pageToGo)

                setIsSubmitting(false)

                toast({
                    variant: "destructive",
                    title: "Incomplete assessment",
                    description: "Please answer all required questions before submitting."
                })

                return
            }

            // Prepare the responses
            const responses = Object.entries(answers).map(([questionId, value]) => {
                const question = questions.find(q => q.id === questionId)

                if (!question) return null

                const response: any = {
                    questionId,
                    questionType: question.type,
                }

                if (question.type === 'MULTIPLE_CHOICE') {
                    response.selectedOptions = value
                } else if (question.type === 'SINGLE_CHOICE') {
                    response.selectedOption = value
                } else if (question.type === 'SCALE') {
                    response.numericValue = parseInt(value)
                } else if (question.type === 'BOOLEAN') {
                    response.booleanValue = value
                } else if (question.type === 'TEXT') {
                    response.textValue = value
                }

                return response
            }).filter(Boolean)

            // For demo - just pretend we sent the request
            console.log('Submitting assessment with responses:', responses)

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500))

            toast({
                title: "Assessment submitted",
                description: "Your assessment has been successfully submitted."
            })

            // Redirect to the assessments page
            router.push('/client/assessments')

        } catch (error) {
            console.error('Error submitting assessment:', error)
            setError('Failed to submit assessment')
            setIsSubmitting(false)

            toast({
                variant: "destructive",
                title: "Error submitting assessment",
                description: "Please try again later."
            })
        }
    }

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
    const getStatusBadge = (status: string, dueDate?: string) => {
        switch (status) {
            case AssessmentStatus.ASSIGNED:
                return dueDate && isAfter(new Date(), parseISO(dueDate))
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

    // Render question
    const renderQuestion = (question: Question, index: number) => {
        const questionNumber = currentPage * questionsPerPage + index + 1

        return (
            <div key={question.id} className="mb-6 space-y-3">
                <div className="flex items-start justify-between">
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
                </div>

                <div className="ml-8">
                    {renderAnswerInput(question)}
                </div>
            </div>
        )
    }

    // Render answer input based on question type
    const renderAnswerInput = (question: Question) => {
        switch (question.type) {
            case 'SINGLE_CHOICE':
                return (
                    <RadioGroup
                        value={answers[question.id] || ''}
                        onValueChange={(value) => handleAnswerChange(question.id, value, question.type)}
                        className="space-y-2"
                    >
                        {question.options?.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                                <Label htmlFor={`${question.id}-${option.id}`}>{option.text}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                )

            case 'MULTIPLE_CHOICE':
                return (
                    <div className="space-y-2">
                        {question.options?.map((option) => {
                            const isChecked = Array.isArray(answers[question.id])
                                ? answers[question.id]?.includes(option.id)
                                : false

                            return (
                                <div key={option.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${question.id}-${option.id}`}
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                            handleMultipleChoiceChange(question.id, option.id, checked as boolean)
                                        }
                                    />
                                    <Label htmlFor={`${question.id}-${option.id}`}>{option.text}</Label>
                                </div>
                            )
                        })}
                    </div>
                )

            case 'TEXT':
                return (
                    <Textarea
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value, question.type)}
                        placeholder="Type your answer here..."
                        className="resize-none"
                        rows={4}
                    />
                )

            case 'SCALE':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-10 gap-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                                <Button
                                    key={value}
                                    type="button"
                                    variant={answers[question.id] === value ? "default" : "outline"}
                                    className={cn(
                                        "h-10 px-0",
                                        answers[question.id] === value && "bg-primary text-primary-foreground"
                                    )}
                                    onClick={() => handleAnswerChange(question.id, value, question.type)}
                                >
                                    {value}
                                </Button>
                            ))}
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Lowest</span>
                            <span>Highest</span>
                        </div>
                    </div>
                )

            case 'BOOLEAN':
                return (
                    <div className="flex space-x-4">
                        <Button
                            type="button"
                            variant={answers[question.id] === true ? "default" : "outline"}
                            className="flex items-center gap-1"
                            onClick={() => handleAnswerChange(question.id, true, question.type)}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Yes
                        </Button>
                        <Button
                            type="button"
                            variant={answers[question.id] === false ? "default" : "outline"}
                            className="flex items-center gap-1"
                            onClick={() => handleAnswerChange(question.id, false, question.type)}
                        >
                            <AlertCircle className="h-4 w-4" />
                            No
                        </Button>
                    </div>
                )

            default:
                return <p>Unsupported question type</p>
        }
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
                        <p className="mt-2 text-muted-foreground">Loading assessment...</p>
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
                    <Button
                        variant="outline"
                        onClick={() => router.push('/client/assessments')}
                        className="flex items-center gap-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Assessments
                    </Button>

                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error || 'Failed to load assessment details'}
                        </AlertDescription>
                    </Alert>
                </div>
            </DashboardLayout>
        )
    }

    // Handle completed assessments
    if (assessment.status === AssessmentStatus.COMPLETED) {
        router.push(`/client/assessments/${params.id}/results`)
        return null
    }

    const currentQuestions = questions.slice(
        currentPage * questionsPerPage,
        (currentPage + 1) * questionsPerPage
    )

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/client/assessments')}
                        className="flex items-center gap-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Assessments
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={saveProgress}
                            disabled={isSaving || isSubmitting}
                            className="flex items-center gap-1"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Progress
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-2xl">{assessment.assessment?.title}</CardTitle>
                                    {getStatusBadge(assessment.status, assessment.dueDate)}
                                </div>
                                <CardDescription className="mt-1">
                                    {assessment.assessment?.description}
                                </CardDescription>
                            </div>

                            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>Assigned: {formatDate(assessment.assignedDate)}</span>
                                </div>
                                {assessment.dueDate && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>Due: {formatDate(assessment.dueDate)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Your progress</span>
                                <span className="text-sm text-muted-foreground">{progress}%</span>
                            </div>
                            <Progress value={progress} />
                        </div>
                    </CardHeader>

                    <CardContent>
                        <Separator className="mb-6" />

                        <div className="space-y-8">
                            {currentQuestions.map((question, index) => renderQuestion(question, index))}
                        </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between">
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

                        {currentPage === totalPages - 1 ? (
                            <Button
                                onClick={submitAssessment}
                                disabled={isSubmitting || !isFormValid}
                                className="flex items-center gap-1"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <ClipboardCheck className="h-4 w-4" />
                                        Submit
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage === totalPages - 1 || !isFormValid}
                                className="flex items-center gap-1"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </DashboardLayout>
    )
} 