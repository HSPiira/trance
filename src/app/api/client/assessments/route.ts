import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getUserFromRequest } from '@/lib/server-auth'
import { UserRole, AssessmentStatus } from '@/lib/db/schema'

// GET - Fetch client assessments (assigned to them)
export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only clients can view their assessments
        if (user.role !== UserRole.CLIENT) {
            return NextResponse.json({ error: 'Access forbidden' }, { status: 403 })
        }

        // Parse query parameters
        const url = new URL(req.url)
        const status = url.searchParams.get('status') as AssessmentStatus | null
        const limit = parseInt(url.searchParams.get('limit') || '10')
        const page = parseInt(url.searchParams.get('page') || '1')
        const offset = (page - 1) * limit

        // Get client profile
        const clientProfile = await prisma.clientProfile.findUnique({
            where: { userId: user.id }
        })

        if (!clientProfile) {
            return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
        }

        // Create filter based on params
        const filter: any = {
            clientId: clientProfile.id
        }

        if (status) {
            filter.status = status
        }

        // Get total count for pagination
        const totalCount = await prisma.assessment.count({
            where: filter
        })

        // Get assessments
        const assessments = await prisma.assessment.findMany({
            where: filter,
            include: {
                assessment: true,
                counsellor: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                assignedDate: 'desc'
            },
            skip: offset,
            take: limit
        })

        // Filter out responses if not shared with client
        const filteredAssessments = assessments.map(assessment => {
            if (!assessment.shareWithClient) {
                return {
                    ...assessment,
                    responses: null,
                    score: null
                }
            }
            return assessment
        })

        return NextResponse.json({
            assessments: filteredAssessments,
            pagination: {
                total: totalCount,
                pages: Math.ceil(totalCount / limit),
                page,
                limit
            }
        }, { status: 200 })
    } catch (error) {
        console.error('Error fetching client assessments:', error)
        return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 })
    }
}

// POST - Submit an assessment response
export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req)

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only clients can submit assessments
        if (user.role !== UserRole.CLIENT) {
            return NextResponse.json({ error: 'Access forbidden' }, { status: 403 })
        }

        // Get client profile
        const clientProfile = await prisma.clientProfile.findUnique({
            where: { userId: user.id }
        })

        if (!clientProfile) {
            return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
        }

        // Parse request data
        const data = await req.json()
        const { assessmentId, responses } = data

        if (!assessmentId || !responses) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Find the client assessment
        const clientAssessment = await prisma.assessment.findFirst({
            where: {
                id: assessmentId,
                clientId: clientProfile.id,
                status: {
                    in: [AssessmentStatus.ASSIGNED, AssessmentStatus.IN_PROGRESS]
                }
            },
            include: {
                assessment: true
            }
        })

        if (!clientAssessment) {
            return NextResponse.json({
                error: 'Assessment not found or not available for completion'
            }, { status: 404 })
        }

        // Validate responses against assessment questions
        const assessmentQuestions = clientAssessment.assessment.questions
        const validQuestionIds = new Set(assessmentQuestions.map(q => q.id))

        // Check if all required questions are answered
        for (const question of assessmentQuestions) {
            if (question.required && !responses[question.id]) {
                return NextResponse.json({
                    error: `Question "${question.text}" is required`
                }, { status: 400 })
            }
        }

        // Calculate score if needed (for certain assessment types)
        // This would be assessment-specific logic that could be extended
        let score = null

        // Update the client assessment
        const updatedAssessment = await prisma.assessment.update({
            where: { id: assessmentId },
            data: {
                status: AssessmentStatus.COMPLETED,
                completedDate: new Date(),
                responses,
                score
            }
        })

        return NextResponse.json({
            assessment: {
                id: updatedAssessment.id,
                status: updatedAssessment.status,
                completedDate: updatedAssessment.completedDate
            }
        }, { status: 200 })
    } catch (error) {
        console.error('Error submitting assessment:', error)
        return NextResponse.json({ error: 'Failed to submit assessment' }, { status: 500 })
    }
} 