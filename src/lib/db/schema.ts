import { z } from 'zod'
import { prisma } from './prisma'

// User Role Enum
export enum UserRole {
    CLIENT = 'CLIENT',
    COUNSELLOR = 'COUNSELLOR',
    ADMIN = 'ADMIN',
    ORG_CONTACT = 'ORG_CONTACT',
}

// Client Type Enum
export enum ClientType {
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY',
}

// User Status Enum
export enum UserStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}

// Zod schemas for validation
export const userSchema = z.object({
    id: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phoneNumber: z.string().optional(),
    role: z.nativeEnum(UserRole),
    status: z.nativeEnum(UserStatus).default(UserStatus.PENDING),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})

export const clientProfileSchema = z.object({
    id: z.string().optional(),
    userId: z.string(),
    clientType: z.nativeEnum(ClientType),
    dateOfBirth: z.date().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
    emergencyPhone: z.string().optional(),
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

// Types derived from schemas
export type User = z.infer<typeof userSchema>
export type ClientProfile = z.infer<typeof clientProfileSchema>
export type CounsellorProfile = z.infer<typeof counsellorProfileSchema>
export type AdminProfile = z.infer<typeof adminProfileSchema>
export type OrgContactProfile = z.infer<typeof orgContactProfileSchema> 