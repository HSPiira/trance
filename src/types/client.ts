export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED'
export type ClientType = 'COMPANY' | 'INDIVIDUAL'

export interface Client {
    id: string
    name: string
    email: string
    phone?: string
    status: ClientStatus
    joinDate: string
    lastActive: string
    clientType: ClientType
    counsellor?: string
    avatar?: string
    appointments: number
    sessions: number
    beneficiaries?: Beneficiary[]
    dependants?: Dependant[]
    notes?: string
    department?: string
    role?: string
}

export interface Beneficiary {
    id: string
    name: string
    email: string
    department: string
    role: string
    dependants?: Dependant[]
}

export interface Dependant {
    id: string
    name: string
    relation: string
}

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