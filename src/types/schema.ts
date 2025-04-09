/**
 * Schema definitions for the Hope project
 * This file contains all the type definitions used throughout the application
 */

// Client types
export type ClientType = 'COMPANY' | 'INDIVIDUAL';
export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'TERMINATED' | 'ARCHIVED' | 'DELETED' | 'BLOCKED' | 'ON_HOLD';

// Base client model
export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: ClientStatus;
    joinDate: string;
    lastActive: string;
    clientType: ClientType;
    counsellor?: string;
    avatar?: string;
    appointments: number;
    resources: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    notes?: string;
    messages?: number;
    beneficiaries?: Beneficiary[];
    dependants?: Dependant[];
}

// Beneficiary model (for company clients)
export interface Beneficiary {
    id: string;
    name: string;
    email?: string;
    department?: string;
    role?: string;
    status: ClientStatus;
    dependants?: Dependant[];
}

// Dependant model (for individual clients or beneficiaries)
export interface Dependant {
    id: string;
    name: string;
    relation: string;
    parentId: string;
    parentType: 'CLIENT' | 'BENEFICIARY';
    status: ClientStatus;
}

// Import record types
export type RecordType = 'CLIENT' | 'BENEFICIARY' | 'DEPENDANT';

export interface ImportRecord {
    recordType: RecordType;
    clientId: string;
    referenceId: string;
    name: string;
    email?: string;
    phone?: string;
    status?: string;
    joinDate?: string;
    lastActive?: string;
    clientType?: ClientType;
    counsellor?: string;
    notes?: string;
    relationToId?: string;
    relation?: string;
    department?: string;
    role?: string;
}

// User model
export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export type UserRole = 'ADMIN' | 'COUNSELOR' | 'STAFF';

// Session model
export interface Session {
    id: string;
    clientId: string;
    counselorId: string;
    date: string;
    duration: number; // in minutes
    status: SessionStatus;
    notes?: string;
    type: SessionType;
}

export type SessionStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type SessionType = 'INITIAL' | 'FOLLOW_UP' | 'EMERGENCY' | 'GROUP';

// Document model
export interface Document {
    id: string;
    clientId: string;
    title: string;
    type: DocumentType;
    url: string;
    uploadedAt: string;
    uploadedBy: string;
    size: number;
}

export type DocumentType = 'CONSENT' | 'ASSESSMENT' | 'REPORT' | 'OTHER';

// Note model
export interface Note {
    id: string;
    clientId: string;
    authorId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    isPrivate: boolean;
}

// Message model
export interface Message {
    id: string;
    clientId: string;
    senderId: string;
    content: string;
    sentAt: string;
    readAt?: string;
    attachments?: string[];
}

// Resource model
export interface Resource {
    id: string;
    title: string;
    description: string;
    type: ResourceType;
    url: string;
    createdAt: string;
    createdBy: string;
}

export type ResourceType = 'ARTICLE' | 'VIDEO' | 'WORKSHOP' | 'TOOL';

// Filter types
export type FilterType = 'ALL' | 'COMPANIES' | 'INDIVIDUALS' | 'ACTIVE' | 'INACTIVE' | 'RECENT';

// Advanced filter interface
export interface AdvancedFilters {
    status: string;
    clientType: string;
    dateRange: {
        from: string;
        to: string;
    };
} 