// Define client types
export type Dependant = {
    id: string;
    name: string;
    relation: string;
    status: string;
}

export type Beneficiary = {
    id: string;
    name: string;
    email: string;
    department: string;
    role: string;
    status: string;
    dependants?: Dependant[];
}

export type Client = {
    id: string;
    name: string;
    email: string;
    status: string;
    joinDate: string;
    lastActive: string;
    avatar: string;
    phoneNumber: string;
    clientType: 'COMPANY' | 'INDIVIDUAL';
    appointments: number;
    messages: number;
    resources: number;
    counsellor: string;
    notes: string;
    beneficiaries?: Beneficiary[];
    dependants?: Dependant[];
}

// Mock clients data for admin client pages
export const clients: Client[] = [
    {
        id: "ind-001",
        name: "John Doe",
        email: "john.doe@example.com",
        status: "ACTIVE",
        joinDate: "2023-01-15",
        lastActive: "2023-06-20",
        avatar: "",
        phoneNumber: "+1 (555) 123-4567",
        clientType: "INDIVIDUAL",
        appointments: 12,
        messages: 34,
        resources: 5,
        counsellor: "Dr. Sarah Williams",
        notes: "John has been attending regular sessions for anxiety management. He's shown significant improvement in coping mechanisms.",
        dependants: [
            {
                id: "dep-101",
                name: "Sarah Doe",
                relation: "Spouse",
                status: "ACTIVE"
            },
            {
                id: "dep-102",
                name: "Tommy Doe",
                relation: "Child",
                status: "ACTIVE"
            }
        ]
    },
    {
        id: "ind-002",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        status: "ACTIVE",
        joinDate: "2023-02-28",
        lastActive: "2023-06-18",
        avatar: "",
        phoneNumber: "+1 (555) 987-6543",
        clientType: "INDIVIDUAL",
        appointments: 8,
        messages: 16,
        resources: 3,
        counsellor: "Dr. Michael Chen",
        notes: "Jane is working through post-traumatic stress. Progress is steady and she's been very receptive to CBT techniques.",
        dependants: [
            {
                id: "dep-201",
                name: "Alex Smith",
                relation: "Child",
                status: "ACTIVE"
            }
        ]
    },
    {
        id: "ind-003",
        name: "Robert Johnson",
        email: "robert.j@example.com",
        status: "INACTIVE",
        joinDate: "2022-11-05",
        lastActive: "2023-05-01",
        avatar: "",
        phoneNumber: "+1 (555) 456-7890",
        clientType: "INDIVIDUAL",
        appointments: 4,
        messages: 7,
        resources: 2,
        counsellor: "Dr. Emma Rodriguez",
        notes: "Robert has not responded to follow-up communications since May. Last session indicated significant stress from work changes."
    },
    {
        id: "comp-001",
        name: "Acme Corporation",
        email: "hr@acmecorp.com",
        status: "ACTIVE",
        joinDate: "2022-09-15",
        lastActive: "2023-06-19",
        avatar: "",
        phoneNumber: "+1 (555) 222-3333",
        clientType: "COMPANY",
        appointments: 37,
        messages: 124,
        resources: 15,
        counsellor: "Corporate Team A",
        notes: "Large client with over 500 employees. Plan includes both individual and group sessions. Quarterly wellness seminars.",
        beneficiaries: [
            {
                id: "ben-001",
                name: "David Williams",
                email: "d.williams@acmecorp.com",
                department: "Marketing",
                role: "Director",
                status: "ACTIVE",
                dependants: [
                    {
                        id: "dep-001",
                        name: "Emma Williams",
                        relation: "Spouse",
                        status: "ACTIVE"
                    },
                    {
                        id: "dep-002",
                        name: "Michael Williams",
                        relation: "Child",
                        status: "ACTIVE"
                    }
                ]
            },
            {
                id: "ben-002",
                name: "Lisa Chen",
                email: "l.chen@acmecorp.com",
                department: "Engineering",
                role: "Senior Developer",
                status: "ACTIVE",
                dependants: []
            },
            {
                id: "ben-003",
                name: "Mark Johnson",
                email: "m.johnson@acmecorp.com",
                department: "Finance",
                role: "CFO",
                status: "ACTIVE",
                dependants: [
                    {
                        id: "dep-003",
                        name: "Sarah Johnson",
                        relation: "Spouse",
                        status: "ACTIVE"
                    }
                ]
            }
        ]
    },
    {
        id: "comp-002",
        name: "TechStart Inc.",
        email: "support@techstart.io",
        status: "ACTIVE",
        joinDate: "2023-03-10",
        lastActive: "2023-06-21",
        avatar: "",
        phoneNumber: "+1 (555) 444-5555",
        clientType: "COMPANY",
        appointments: 18,
        messages: 67,
        resources: 8,
        counsellor: "Corporate Team B",
        notes: "Startup with 50 employees. Focus on burnout prevention and work-life balance.",
        beneficiaries: [
            {
                id: "ben-004",
                name: "Alex Thompson",
                email: "a.thompson@techstart.io",
                department: "Product",
                role: "Product Manager",
                status: "ACTIVE",
                dependants: []
            },
            {
                id: "ben-005",
                name: "Jessica Lee",
                email: "j.lee@techstart.io",
                department: "Design",
                role: "UX Designer",
                status: "INACTIVE",
                dependants: [
                    {
                        id: "dep-004",
                        name: "Daniel Lee",
                        relation: "Spouse",
                        status: "INACTIVE"
                    }
                ]
            }
        ]
    },
    {
        id: "comp-003",
        name: "Global Logistics Ltd",
        email: "wellness@globallogistics.com",
        status: "INACTIVE",
        joinDate: "2022-06-01",
        lastActive: "2023-04-30",
        avatar: "",
        phoneNumber: "+1 (555) 666-7777",
        clientType: "COMPANY",
        appointments: 22,
        messages: 43,
        resources: 6,
        counsellor: "Corporate Team C",
        notes: "Account currently on hold due to restructuring. Renewal discussion scheduled for next quarter.",
        beneficiaries: [
            {
                id: "ben-006",
                name: "James Wilson",
                email: "j.wilson@globallogistics.com",
                department: "Operations",
                role: "Operations Director",
                status: "INACTIVE",
                dependants: []
            }
        ]
    },
    {
        id: "ind-004",
        name: "Maria Garcia",
        email: "maria.g@example.com",
        status: "ACTIVE",
        joinDate: "2023-05-12",
        lastActive: "2023-06-17",
        avatar: "",
        phoneNumber: "+1 (555) 888-9999",
        clientType: "INDIVIDUAL",
        appointments: 3,
        messages: 11,
        resources: 2,
        counsellor: "Dr. James Wilson",
        notes: "New client dealing with workplace stress. Initial assessment completed, starting with weekly sessions."
    }
]; 