export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'
export type ClientType = 'COMPANY' | 'INDIVIDUAL'
export type FilterStatus = ClientStatus | 'ALL'
export type FilterClientType = ClientType | 'ALL'

export interface Session {
    id: string
    date: string
    duration: number
    status: SessionStatus
    notes?: string
    type: SessionType
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    clientId: string
    counselorId: string
}

export interface Note {
    id: string
    content: string
    isPrivate: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    clientId: string
    authorId: string
}

export interface Message {
    id: string
    content: string
    sentAt: string
    readAt?: string
    attachments: string[]
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    clientId: string
    senderId: string
}

export interface Client {
    id: string
    name: string
    email: string
    phone: string
    status: ClientStatus
    joinDate: string
    lastActive: string
    clientType: ClientType
    counsellor?: string
    avatar?: string
    appointments: number
    resources: number
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    company?: Company
    sessions?: Session[]
    documents?: Document[]
    notes?: Note[]
    messages?: Message[]
}

export interface Company {
    id: string
    registrationNumber: string
    industry?: string
    size?: number
    website?: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    clientId: string
    employees?: Employee[]
}

export interface Employee {
    id: string
    employeeNumber: string
    jobTitle?: string
    department?: string
    hireDate: string
    status: EmployeeStatus
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    personId: string
    companyId: string
    dependants?: Dependant[]
}

export interface Dependant {
    id: string
    relationship: string
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    personId: string
    employeeId: string
}

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED'
export type SessionStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type SessionType = 'INDIVIDUAL' | 'GROUP' | 'WORKSHOP'

export interface ImportRecord {
    recordType: 'CLIENT' | 'BENEFICIARY' | 'DEPENDANT'
    clientId: string
    referenceId: string
    name: string
    email?: string
    phone?: string
    status?: string
    joinDate?: string
    lastActive?: string
    clientType?: ClientType
    counsellor?: string
    notes?: string
    relationToId?: string
    relation?: string
    department?: string
    role?: string
} 