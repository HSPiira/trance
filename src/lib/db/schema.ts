import { z } from 'zod'
import { prisma } from './prisma'

// User Role Enum
export enum UserRole {
    ADMIN = 'ADMIN',
    COUNSELLOR = 'COUNSELLOR',
    STAFF = 'STAFF',
    CLIENT = 'CLIENT',
    MANAGER = 'MANAGER',
    SUPER_ADMIN = 'SUPER_ADMIN',
    HR = 'HR'
}

// Client Type Enum
export enum ClientType {
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY',
}

// User Status Enum
export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
    DELETED = 'DELETED'
}

// Session Type Enum
export enum SessionType {
    VIDEO = 'VIDEO',
    PHONE = 'PHONE',
    IN_PERSON = 'IN_PERSON',
}

// Session Status Enum
export enum SessionStatus {
    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    NO_SHOW = 'NO_SHOW',
}

// Assessment Status Enum
export enum AssessmentStatus {
    ASSIGNED = 'ASSIGNED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    EXPIRED = 'EXPIRED',
}

// Base user schema
export const userSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    role: z.nativeEnum(UserRole),
    isDeleted: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    password: z.string(),
    avatar: z.string().optional(),
})

export const clientProfileSchema = z.object({
    id: z.string().optional(),
    userId: z.string(),
    clientType: z.nativeEnum(ClientType),
    dateOfBirth: z.date().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
    emergencyPhone: z.string().optional(),
    primaryClientId: z.string().optional(), // For SECONDARY clients, reference to their PRIMARY
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export const counsellorProfileSchema = z.object({
    id: z.string().optional(),
    userId: z.string(),
    specialization: z.string().optional(),
    yearsOfExperience: z.number().optional(),
    certificationNumber: z.string().optional(),
    certificationExpiry: z.date().optional(),
    bankDetails: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export const adminProfileSchema = z.object({
    id: z.string().optional(),
    userId: z.string(),
    department: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export const orgContactProfileSchema = z.object({
    id: z.string().optional(),
    userId: z.string(),
    organizationId: z.string(),
    position: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export const sessionBookingSchema = z.object({
    id: z.string().optional(),
    clientId: z.string(),
    counsellorId: z.string(),
    dateTime: z.date(),
    duration: z.number(), // in minutes
    type: z.nativeEnum(SessionType),
    status: z.nativeEnum(SessionStatus).default(SessionStatus.SCHEDULED),
    notes: z.string().optional(),
    bookedById: z.string(), // ID of the user who booked (could be primary client booking for a dependent)
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export const sessionFeedbackSchema = z.object({
    id: z.string().optional(),
    sessionId: z.string(),
    clientId: z.string(),
    rating: z.number().min(1).max(5),
    feedback: z.string().optional(),
    issueFlagged: z.boolean().default(false),
    issueDescription: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export const assessmentSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    type: z.string(), // Type of assessment (e.g., "Anxiety", "Depression", etc.)
    questions: z.array(z.object({
        id: z.string(),
        text: z.string(),
        type: z.enum(["TEXT", "MULTIPLE_CHOICE", "SCALE", "BOOLEAN"]),
        options: z.array(z.string()).optional(),
        required: z.boolean().default(false),
    })),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export const clientAssessmentSchema = z.object({
    id: z.string().optional(),
    assessmentId: z.string(),
    clientId: z.string(),
    counsellorId: z.string(),
    status: z.nativeEnum(AssessmentStatus).default(AssessmentStatus.ASSIGNED),
    assignedDate: z.date(),
    dueDate: z.date().optional(),
    completedDate: z.date().optional(),
    responses: z.record(z.string(), z.unknown()).optional(), // Map of question ID to response
    score: z.number().optional(),
    notes: z.string().optional(),
    shareWithClient: z.boolean().default(false),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

// Export types
export type User = z.infer<typeof userSchema>
export type ClientProfile = z.infer<typeof clientProfileSchema>
export type CounsellorProfile = z.infer<typeof counsellorProfileSchema>
export type AdminProfile = z.infer<typeof adminProfileSchema>
export type OrgContactProfile = z.infer<typeof orgContactProfileSchema>
export type SessionBooking = z.infer<typeof sessionBookingSchema>
export type SessionFeedback = z.infer<typeof sessionFeedbackSchema>
export type Assessment = z.infer<typeof assessmentSchema>
export type ClientAssessment = z.infer<typeof clientAssessmentSchema> 