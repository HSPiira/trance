// Import types from schema
import { Client, Beneficiary, Dependant, ClientStatus, ClientType } from '@/types/schema'

// Mock clients data for admin client pages
export const clients: Client[] = [
    {
        id: "ind-001",
        name: "John Doe",
        email: "john.doe@example.com",
        status: "ACTIVE" as ClientStatus,
        joinDate: "2023-01-15",
        lastActive: "2023-06-20",
        avatar: "",
        phone: "+1 (555) 123-4567",
        clientType: "INDIVIDUAL" as ClientType,
        appointments: 12,
        messages: 5,
        resources: 3,
        isDeleted: false,
        createdAt: "2023-01-15T00:00:00Z",
        updatedAt: "2023-06-20T00:00:00Z",
        notes: "Prefers morning sessions. Has anxiety about public speaking.",
        dependants: [
            {
                id: "dep-001",
                name: "Jane Doe",
                relation: "Spouse",
                parentId: "ind-001",
                parentType: "CLIENT",
                status: "ACTIVE" as ClientStatus
            },
            {
                id: "dep-002",
                name: "Jimmy Doe",
                relation: "Child",
                parentId: "ind-001",
                parentType: "CLIENT",
                status: "ACTIVE" as ClientStatus
            }
        ]
    },
    {
        id: "ind-002",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        status: "INACTIVE" as ClientStatus,
        joinDate: "2023-02-10",
        lastActive: "2023-05-15",
        avatar: "",
        phone: "+1 (555) 987-6543",
        clientType: "INDIVIDUAL" as ClientType,
        appointments: 8,
        messages: 3,
        resources: 2,
        isDeleted: false,
        createdAt: "2023-02-10T00:00:00Z",
        updatedAt: "2023-05-15T00:00:00Z",
        notes: "Completed treatment program. No follow-up required at this time.",
        dependants: [
            {
                id: "dep-003",
                name: "John Smith",
                relation: "Spouse",
                parentId: "ind-002",
                parentType: "CLIENT",
                status: "ACTIVE" as ClientStatus
            },
            {
                id: "dep-004",
                name: "Sarah Smith",
                relation: "Child",
                parentId: "ind-002",
                parentType: "CLIENT",
                status: "ACTIVE" as ClientStatus
            },
            {
                id: "dep-005",
                name: "Michael Smith",
                relation: "Child",
                parentId: "ind-002",
                parentType: "CLIENT",
                status: "ACTIVE" as ClientStatus
            }
        ]
    },
    {
        id: "ind-003",
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        status: "INACTIVE" as ClientStatus,
        joinDate: "2023-03-05",
        lastActive: "2023-04-20",
        avatar: "",
        phone: "+1 (555) 456-7890",
        clientType: "INDIVIDUAL" as ClientType,
        appointments: 5,
        messages: 2,
        resources: 1,
        isDeleted: false,
        createdAt: "2023-03-05T00:00:00Z",
        updatedAt: "2023-04-20T00:00:00Z",
        notes: "Discontinued sessions after 5 appointments. May return in the future.",
        dependants: [
            {
                id: "dep-006",
                name: "Emily Johnson",
                relation: "Spouse",
                parentId: "ind-003",
                parentType: "CLIENT",
                status: "ACTIVE" as ClientStatus
            }
        ]
    },
    {
        id: "ind-004",
        name: "Sarah Williams",
        email: "sarah.williams@example.com",
        status: "INACTIVE" as ClientStatus,
        joinDate: "2023-01-20",
        lastActive: "2023-05-10",
        avatar: "",
        phone: "+1 (555) 234-5678",
        clientType: "INDIVIDUAL" as ClientType,
        appointments: 10,
        messages: 4,
        resources: 2,
        isDeleted: false,
        createdAt: "2023-01-20T00:00:00Z",
        updatedAt: "2023-05-10T00:00:00Z",
        notes: "Completed treatment successfully. No follow-up required.",
        dependants: [
            {
                id: "dep-007",
                name: "David Williams",
                relation: "Spouse",
                parentId: "ind-004",
                parentType: "CLIENT",
                status: "INACTIVE" as ClientStatus
            }
        ]
    },
    {
        id: "comp-001",
        name: "Acme Corporation",
        email: "hr@acmecorp.com",
        status: "INACTIVE" as ClientStatus,
        joinDate: "2023-01-05",
        lastActive: "2023-06-15",
        avatar: "",
        phone: "+1 (555) 111-2222",
        clientType: "COMPANY" as ClientType,
        appointments: 25,
        messages: 12,
        resources: 8,
        isDeleted: false,
        createdAt: "2023-01-05T00:00:00Z",
        updatedAt: "2023-06-15T00:00:00Z",
        notes: "Corporate wellness program. Regular quarterly check-ins.",
        beneficiaries: [
            {
                id: "ben-001",
                name: "Michael Brown",
                email: "michael.brown@acmecorp.com",
                department: "Sales",
                role: "Manager",
                status: "ACTIVE" as ClientStatus,
                dependants: [
                    {
                        id: "dep-008",
                        name: "Lisa Brown",
                        relation: "Spouse",
                        parentId: "ben-001",
                        parentType: "BENEFICIARY",
                        status: "ACTIVE" as ClientStatus
                    },
                    {
                        id: "dep-009",
                        name: "Tommy Brown",
                        relation: "Child",
                        parentId: "ben-001",
                        parentType: "BENEFICIARY",
                        status: "ACTIVE" as ClientStatus
                    }
                ]
            },
            {
                id: "ben-002",
                name: "Jennifer Davis",
                email: "jennifer.davis@acmecorp.com",
                department: "Marketing",
                role: "Director",
                status: "ACTIVE" as ClientStatus,
                dependants: [
                    {
                        id: "dep-010",
                        name: "Robert Davis",
                        relation: "Spouse",
                        parentId: "ben-002",
                        parentType: "BENEFICIARY",
                        status: "ACTIVE" as ClientStatus
                    }
                ]
            }
        ]
    }
] 