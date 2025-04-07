import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getUserFromRequest } from '@/lib/server-auth'
import { UserRole, AssessmentStatus } from '@/lib/db/schema'

// GET - Fetch a single assessment by ID
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromRequest(req)

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only clients can view their assessments
        if (user.role !== UserRole.CLIENT) {
            return NextResponse.json({ error: 'Access forbidden' }, { status: 403 })
        }

        const { id } = params

        // Get client profile
        const clientProfile = await prisma.clientProfile.findUnique({
            where: { userId: user.id }
        })

        if (!clientProfile) {
            return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
        }

        // Get the assessment with related data
        const assessment = await prisma.clientAssessment.findFirst({
            where: {
                id,
                clientId: clientProfile.id
            },
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
                },
                responses: true
            }
        })

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
        }

        // Filter out score and notes if not shared with client
        if (!assessment.shareWithClient && assessment.status === AssessmentStatus.COMPLETED) {
            return NextResponse.json({
                assessment: {
                    ...assessment,
                    score: null,
                    notes: null
                }
            })
        }

        return NextResponse.json({ assessment })
    } catch (error) {
        console.error('Error fetching assessment:', error)
        return NextResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 })
    }
}

// POST - Update assessment status and responses
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUserFromRequest(req)

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Only clients can submit assessments
        if (user.role !== UserRole.CLIENT) {
            return NextResponse.json({ error: 'Access forbidden' }, { status: 403 })
        }

        const { id } = params
        const data = await req.json()
        const { responses, status } = data

        // Get client profile
        const clientProfile = await prisma.clientProfile.findUnique({
            where: { userId: user.id }
        })

        if (!clientProfile) {
            return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
        }

        // Find the client assessment
        const clientAssessment = await prisma.clientAssessment.findFirst({
            where: {
                id,
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
                error: 'Assessment not found or not available for update'
            }, { status: 404 })
        }

        // Prepare update data
        const updateData: any = {
            responses: responses
        }

        // If status is being changed to COMPLETED, add completion date
        if (status === AssessmentStatus.COMPLETED) {
            updateData.status = AssessmentStatus.COMPLETED
            updateData.completedDate = new Date()

            // Validate that all required questions are answered
            const assessmentQuestions = clientAssessment.assessment.questions
            const requiredQuestions = assessmentQuestions.filter(q => q.required)

            for (const question of requiredQuestions) {
                const response = responses.find((r: any) => r.questionId === question.id)
                if (!response) {
                    return NextResponse.json({
                        error: `Required question "${question.text}" is not answered`
                    }, { status: 400 })
                }
            }
        } else if (status === AssessmentStatus.IN_PROGRESS) {
            updateData.status = AssessmentStatus.IN_PROGRESS
        }

        // Update the assessment
        const updatedAssessment = await prisma.clientAssessment.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json({
            assessment: {
                id: updatedAssessment.id,
                status: updatedAssessment.status,
                completedDate: updatedAssessment.completedDate
            }
        })
    } catch (error) {
        console.error('Error updating assessment:', error)
        return NextResponse.json({ error: 'Failed to update assessment' }, { status: 500 })
    }
} 