import { AssessmentStatus } from '@/lib/db/schema'

interface AssessmentOption {
    id: string
    text: string
    value: number
}

interface AssessmentQuestion {
    id: string
    text: string
    type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TEXT' | 'SCALE' | 'BOOLEAN'
    options?: AssessmentOption[]
    required: boolean
}

interface AssessmentResponseItem {
    id: string
    questionId: string
    questionType: string
    selectedOption?: string
    selectedOptions?: string[]
    textValue?: string
    numericValue?: number
    booleanValue?: boolean
}

interface AssessmentData {
    id?: string
    title: string
    description: string
    type: string
    questions: AssessmentQuestion[]
}

interface UserInfo {
    firstName: string
    lastName: string
}

interface CounsellorInfo {
    user: UserInfo
}

export interface Assessment {
    id: string
    title: string
    description: string
    status: AssessmentStatus
    assignedDate: string
    dueDate?: string
    completedDate?: string
    shareWithClient?: boolean
    score?: number
    notes?: string
    counsellor: CounsellorInfo
    assessment: AssessmentData
    responses?: AssessmentResponseItem[]
}

export interface AssessmentListResponse {
    assessments: Assessment[]
    pagination: {
        total: number
        pages: number
        page: number
        limit: number
    }
}

export interface AssessmentResponse {
    assessment: Assessment
    error?: never
}

export interface AssessmentErrorResponse {
    assessment?: never
    error: string
}

// Mock data for client assessments
export const mockAssessments: Assessment[] = [
    {
        id: '1',
        title: 'Depression Assessment (PHQ-9)',
        description: 'A standard screening tool for depression',
        status: AssessmentStatus.ASSIGNED,
        assignedDate: '2023-04-01T10:00:00Z',
        dueDate: '2023-04-10T23:59:59Z',
        counsellor: {
            user: {
                firstName: 'Michael',
                lastName: 'Chen'
            }
        },
        assessment: {
            title: 'Depression Assessment (PHQ-9)',
            description: 'A standard screening tool for depression',
            type: 'DEPRESSION',
            questions: [
                {
                    id: 'q1',
                    text: 'Little interest or pleasure in doing things',
                    type: 'SCALE',
                    required: true,
                    options: [
                        { id: '0', text: 'Not at all', value: 0 },
                        { id: '1', text: 'Several days', value: 1 },
                        { id: '2', text: 'More than half the days', value: 2 },
                        { id: '3', text: 'Nearly every day', value: 3 }
                    ]
                },
                {
                    id: 'q2',
                    text: 'Feeling down, depressed, or hopeless',
                    type: 'SCALE',
                    required: true,
                    options: [
                        { id: '0', text: 'Not at all', value: 0 },
                        { id: '1', text: 'Several days', value: 1 },
                        { id: '2', text: 'More than half the days', value: 2 },
                        { id: '3', text: 'Nearly every day', value: 3 }
                    ]
                },
                {
                    id: 'q3',
                    text: 'Trouble falling or staying asleep, or sleeping too much',
                    type: 'SCALE',
                    required: true,
                    options: [
                        { id: '0', text: 'Not at all', value: 0 },
                        { id: '1', text: 'Several days', value: 1 },
                        { id: '2', text: 'More than half the days', value: 2 },
                        { id: '3', text: 'Nearly every day', value: 3 }
                    ]
                },
                {
                    id: 'q4',
                    text: 'Feeling tired or having little energy',
                    type: 'SCALE',
                    required: true,
                    options: [
                        { id: '0', text: 'Not at all', value: 0 },
                        { id: '1', text: 'Several days', value: 1 },
                        { id: '2', text: 'More than half the days', value: 2 },
                        { id: '3', text: 'Nearly every day', value: 3 }
                    ]
                },
                {
                    id: 'q5',
                    text: 'Poor appetite or overeating',
                    type: 'SCALE',
                    required: true,
                    options: [
                        { id: '0', text: 'Not at all', value: 0 },
                        { id: '1', text: 'Several days', value: 1 },
                        { id: '2', text: 'More than half the days', value: 2 },
                        { id: '3', text: 'Nearly every day', value: 3 }
                    ]
                }
            ]
        }
    },
    {
        id: '2',
        title: 'Anxiety Assessment (GAD-7)',
        description: 'A screening tool for anxiety disorders',
        status: AssessmentStatus.IN_PROGRESS,
        assignedDate: '2023-04-02T14:30:00Z',
        dueDate: '2023-04-12T23:59:59Z',
        counsellor: {
            user: {
                firstName: 'Sarah',
                lastName: 'Johnson'
            }
        },
        assessment: {
            title: 'Anxiety Assessment (GAD-7)',
            description: 'A screening tool for anxiety disorders',
            type: 'ANXIETY',
            questions: [
                {
                    id: 'q1',
                    text: 'Feeling nervous, anxious, or on edge',
                    type: 'SCALE',
                    required: true,
                    options: [
                        { id: '0', text: 'Not at all', value: 0 },
                        { id: '1', text: 'Several days', value: 1 },
                        { id: '2', text: 'More than half the days', value: 2 },
                        { id: '3', text: 'Nearly every day', value: 3 }
                    ]
                },
                {
                    id: 'q2',
                    text: 'Not being able to stop or control worrying',
                    type: 'SCALE',
                    required: true,
                    options: [
                        { id: '0', text: 'Not at all', value: 0 },
                        { id: '1', text: 'Several days', value: 1 },
                        { id: '2', text: 'More than half the days', value: 2 },
                        { id: '3', text: 'Nearly every day', value: 3 }
                    ]
                },
                {
                    id: 'q3',
                    text: 'Worrying too much about different things',
                    type: 'SCALE',
                    required: true,
                    options: [
                        { id: '0', text: 'Not at all', value: 0 },
                        { id: '1', text: 'Several days', value: 1 },
                        { id: '2', text: 'More than half the days', value: 2 },
                        { id: '3', text: 'Nearly every day', value: 3 }
                    ]
                },
                {
                    id: 'q4',
                    text: 'Trouble relaxing',
                    type: 'SCALE',
                    required: true,
                    options: [
                        { id: '0', text: 'Not at all', value: 0 },
                        { id: '1', text: 'Several days', value: 1 },
                        { id: '2', text: 'More than half the days', value: 2 },
                        { id: '3', text: 'Nearly every day', value: 3 }
                    ]
                }
            ]
        }
    },
    {
        id: '3',
        title: 'Well-being Assessment',
        description: 'A general assessment of your current well-being',
        status: AssessmentStatus.COMPLETED,
        assignedDate: '2023-03-15T09:00:00Z',
        completedDate: '2023-03-20T16:45:00Z',
        shareWithClient: true,
        score: 72,
        notes: 'You\'re showing good progress in most areas, but we should focus on stress management techniques in our next sessions.',
        counsellor: {
            user: {
                firstName: 'Michael',
                lastName: 'Chen'
            }
        },
        assessment: {
            title: 'Well-being Assessment',
            description: 'A general assessment of your current well-being',
            type: 'WELL_BEING',
            questions: [
                {
                    id: 'q1',
                    text: 'How would you rate your overall mental health?',
                    type: 'SCALE',
                    required: true,
                    options: [
                        { id: '1', text: 'Poor', value: 1 },
                        { id: '2', text: 'Fair', value: 2 },
                        { id: '3', text: 'Good', value: 3 },
                        { id: '4', text: 'Very Good', value: 4 },
                        { id: '5', text: 'Excellent', value: 5 }
                    ]
                },
                {
                    id: 'q2',
                    text: 'Do you currently have any concerns about your mental health?',
                    type: 'BOOLEAN',
                    required: true
                },
                {
                    id: 'q3',
                    text: 'Please describe any specific concerns or issues you\'d like to address:',
                    type: 'TEXT',
                    required: false
                },
                {
                    id: 'q4',
                    text: 'Which areas would you like to focus on improving? (Select all that apply)',
                    type: 'MULTIPLE_CHOICE',
                    required: true,
                    options: [
                        { id: 'a', text: 'Stress management', value: 1 },
                        { id: 'b', text: 'Sleep quality', value: 1 },
                        { id: 'c', text: 'Anxiety reduction', value: 1 },
                        { id: 'd', text: 'Mood improvement', value: 1 },
                        { id: 'e', text: 'Relationship skills', value: 1 },
                        { id: 'f', text: 'Work-life balance', value: 1 }
                    ]
                }
            ]
        },
        responses: [
            {
                id: 'r1',
                questionId: 'q1',
                questionType: 'SCALE',
                numericValue: 4
            },
            {
                id: 'r2',
                questionId: 'q2',
                questionType: 'BOOLEAN',
                booleanValue: true
            },
            {
                id: 'r3',
                questionId: 'q3',
                questionType: 'TEXT',
                textValue: 'I\'ve been feeling more stressed lately and having trouble sleeping some nights.'
            },
            {
                id: 'r4',
                questionId: 'q4',
                questionType: 'MULTIPLE_CHOICE',
                selectedOptions: ['a', 'b']
            }
        ]
    },
    {
        id: '4',
        title: 'Stress Assessment',
        description: 'An assessment to measure your current stress levels',
        status: AssessmentStatus.COMPLETED,
        assignedDate: '2023-02-10T11:00:00Z',
        completedDate: '2023-02-15T13:20:00Z',
        shareWithClient: false,
        counsellor: {
            user: {
                firstName: 'Lisa',
                lastName: 'Brown'
            }
        },
        assessment: {
            title: 'Stress Assessment',
            description: 'An assessment to measure your current stress levels',
            type: 'STRESS',
            questions: [
                {
                    id: 'q1',
                    text: 'How often have you been upset because of something that happened unexpectedly?',
                    type: 'SCALE',
                    required: true,
                    options: [
                        { id: '0', text: 'Never', value: 0 },
                        { id: '1', text: 'Almost never', value: 1 },
                        { id: '2', text: 'Sometimes', value: 2 },
                        { id: '3', text: 'Fairly often', value: 3 },
                        { id: '4', text: 'Very often', value: 4 }
                    ]
                },
                {
                    id: 'q2',
                    text: 'How often have you felt that you were unable to control the important things in your life?',
                    type: 'SCALE',
                    required: true,
                    options: [
                        { id: '0', text: 'Never', value: 0 },
                        { id: '1', text: 'Almost never', value: 1 },
                        { id: '2', text: 'Sometimes', value: 2 },
                        { id: '3', text: 'Fairly often', value: 3 },
                        { id: '4', text: 'Very often', value: 4 }
                    ]
                }
            ]
        },
        responses: [
            {
                id: 'r1',
                questionId: 'q1',
                questionType: 'SCALE',
                numericValue: 3
            },
            {
                id: 'r2',
                questionId: 'q2',
                questionType: 'SCALE',
                numericValue: 2
            }
        ]
    }
]

// Function to simulate API calls
export async function fetchAssessments(status?: string): Promise<AssessmentListResponse> {
    return new Promise(resolve => {
        setTimeout(() => {
            try {
                let filteredAssessments = [...mockAssessments]

                if (status) {
                    filteredAssessments = mockAssessments.filter(
                        assessment => assessment.status === status
                    )
                }

                // Make a deep copy to avoid reference issues
                const assessmentsCopy = JSON.parse(JSON.stringify(filteredAssessments))

                resolve({
                    assessments: assessmentsCopy,
                    pagination: {
                        total: assessmentsCopy.length,
                        pages: 1,
                        page: 1,
                        limit: 10
                    }
                })
            } catch (error) {
                console.error('Error retrieving assessments:', error)
                resolve({
                    assessments: [],
                    pagination: {
                        total: 0,
                        pages: 0,
                        page: 1,
                        limit: 10
                    }
                })
            }
        }, 500) // Simulate network delay
    })
}

export async function fetchAssessmentById(id: string): Promise<AssessmentResponse | AssessmentErrorResponse> {
    return new Promise(resolve => {
        setTimeout(() => {
            try {
                console.log(`Fetching assessment with ID: ${id}`)
                const assessment = mockAssessments.find(a => a.id === id)

                if (assessment) {
                    console.log('Assessment found, creating deep copy')
                    // Make a deep copy to avoid reference issues
                    try {
                        const assessmentCopy = JSON.parse(JSON.stringify(assessment))
                        console.log('Deep copy successful')

                        // Validate date formats before returning
                        if (assessmentCopy.assignedDate) {
                            console.log(`Assigned date format: ${assessmentCopy.assignedDate}`)
                            // Make sure it's parseable
                            const testDate = new Date(assessmentCopy.assignedDate)
                            if (isNaN(testDate.getTime())) {
                                console.warn('Invalid assigned date format detected')
                            }
                        }

                        resolve({ assessment: assessmentCopy })
                    } catch (jsonError) {
                        console.error('Error creating deep copy:', jsonError)
                        resolve({ error: 'Error processing assessment data' })
                    }
                } else {
                    console.log('Assessment not found')
                    resolve({ error: 'Assessment not found' })
                }
            } catch (error) {
                console.error('Error retrieving assessment:', error)
                resolve({ error: 'Failed to retrieve assessment data' })
            }
        }, 500) // Simulate network delay
    })
} 