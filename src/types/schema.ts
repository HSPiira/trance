/**
 * Schema definitions for the Hope project
 * This file contains all the type definitions used throughout the application
 */

// Client types
export type ClientType = 'COMPANY' | 'INDIVIDUAL';
export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'TERMINATED' | 'ARCHIVED' | 'DELETED' | 'BLOCKED' | 'ON_HOLD';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';

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
    counsellor: string | null;
    avatar: string | null;
    appointments: number;
    resources: number;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    company: Company | null;
    sessions: Session[];
    documents: Document[];
    notes: Note[];
    messages: Message[];
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
    relationship: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    personId: string;
    employeeId: string;
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
    date: string;
    duration: number;
    status: SessionStatus;
    notes?: string;
    type: SessionType;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    clientId: string;
    counselorId: string;
}

export type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type SessionType = 'INDIVIDUAL' | 'GROUP' | 'WORKSHOP';

// Document model
export interface Document {
    id: string;
    title: string;
    type: DocumentType;
    url: string;
    size: number;
    uploadedAt: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    clientId: string;
    uploadedById: string;
}

export type DocumentType = 'PDF' | 'IMAGE' | 'DOCUMENT' | 'OTHER';

// Note model
export interface Note {
    id: string;
    content: string;
    isPrivate: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    clientId: string;
    authorId: string;
}

// Message model
export interface Message {
    id: string;
    content: string;
    sentAt: string;
    readAt?: string;
    attachments: string[];
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    clientId: string;
    senderId: string;
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

export type ResourceType = 'ARTICLE' | 'VIDEO' | 'AUDIO' | 'OTHER';

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

export interface Company {
    id: string;
    registrationNumber: string;
    industry?: string;
    size?: number;
    website?: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    clientId: string;
    employees?: Employee[];
}

export interface Employee {
    id: string;
    employeeNumber: string;
    jobTitle?: string;
    department?: string;
    hireDate: string;
    status: EmployeeStatus;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    personId: string;
    companyId: string;
    dependants?: Dependant[];
}

export type FilterStatus = ClientStatus | 'ALL';
export type FilterClientType = ClientType | 'ALL'; 