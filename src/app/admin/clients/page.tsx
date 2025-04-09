'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
    Download,
    Plus,
    FileSpreadsheet,
    CheckCircle2,
    XCircle,
    Search,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Building2,
    Users,
    User,
    Users2,
    Eye,
    Edit,
    Trash2,
    MessageSquare,
    Calendar,
    FileText,
    Info,
    UserPlus,
    BarChart3,
    ArrowUp,
    ArrowDown,
    MoreHorizontal,
    FileJson,
    User2,
    AlertCircle,
    UserCircle,
    Activity,
    Loader2,
    Upload,
    ClipboardCheck,
    UploadCloud,
    AlertTriangle,
    FileUp,
    RefreshCw,
    Clock,
    Phone,
    Filter,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import Papa from 'papaparse'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'

// Import mock data
import { Client, clients } from './mock-data'

// Client type icon
const getClientTypeIcon = (clientType: string) => {
    switch (clientType) {
        case 'COMPANY':
            return <div className="flex justify-center"><Building2 className="h-4 w-4 text-blue-400" /></div>;
        case 'INDIVIDUAL':
            return <div className="flex justify-center"><User className="h-4 w-4 text-purple-400" /></div>;
        default:
            return <div className="flex justify-center"><UserCircle className="h-4 w-4" /></div>;
    }
}

// Calculate beneficiaries count
const getBeneficiariesCount = (client: Client) => {
    if (client.clientType !== 'COMPANY' || !client.beneficiaries) return 0;
    return client.beneficiaries.length;
}

// Calculate total dependants count
const getDependantsCount = (client: Client) => {
    if (client.clientType === 'COMPANY' && client.beneficiaries) {
        return client.beneficiaries.reduce((total: number, beneficiary: any) => {
            return total + (beneficiary.dependants?.length || 0);
        }, 0);
    } else if (client.clientType === 'INDIVIDUAL' && client.dependants) {
        return client.dependants.length;
    }
    return 0;
}

// Add these helper types for the import process
type ImportRecord = {
    recordType: 'CLIENT' | 'BENEFICIARY' | 'DEPENDANT';
    clientId: string;
    referenceId: string;
    name: string;
    email?: string;
    phone?: string;
    status?: string;
    joinDate?: string;
    lastActive?: string;
    clientType?: 'COMPANY' | 'INDIVIDUAL';
    counsellor?: string;
    notes?: string;
    relationToId?: string;
    relation?: string;
    department?: string;
    role?: string;
}

// Define expected column data types
const columnDataTypes: Record<string, string> = {
    recordType: 'string',
    clientId: 'string',
    referenceId: 'string',
    name: 'string',
    email: 'email',
    phone: 'phone',
    status: 'string',
    joinDate: 'date',
    lastActive: 'date',
    clientType: 'string',
    counsellor: 'string',
    notes: 'string',
    relationToId: 'string',
    relation: 'string',
    department: 'string',
    role: 'string',
}

// Define required fields by record type
const requiredFields: Record<string, string[]> = {
    CLIENT: ['recordType', 'referenceId', 'name', 'email', 'clientType'],
    BENEFICIARY: ['recordType', 'referenceId', 'name', 'clientId', 'department', 'role'],
    DEPENDANT: ['recordType', 'referenceId', 'name', 'relationToId', 'relation']
}

export default function AdminClientsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [clientTypeFilter, setClientTypeFilter] = useState('ALL')
    const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    // Import related states
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
    const [importMethod, setImportMethod] = useState('file')
    const [csvFile, setCsvFile] = useState<File | null>(null)
    const [importProgress, setImportProgress] = useState(0)
    const [isImporting, setIsImporting] = useState(false)
    const [isProcessingFile, setIsProcessingFile] = useState(false)
    const [previewData, setPreviewData] = useState<any[]>([])
    const [headerRow, setHeaderRow] = useState<string[]>([])
    const [importComplete, setImportComplete] = useState(false)
    const [importResults, setImportResults] = useState({ success: 0, errors: 0, total: 0 })
    const [hasHeaderRow, setHasHeaderRow] = useState(true)
    const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({})
    const [validationWarnings, setValidationWarnings] = useState<string[]>([])
    const [rowErrors, setRowErrors] = useState<Record<number, string[]>>({})
    const fileInputRef = useRef<HTMLInputElement>(null)
    const dropZoneRef = useRef<HTMLDivElement>(null)

    // New state for storing all records
    const [csvRecords, setCsvRecords] = useState<ImportRecord[]>([])

    // State for sorting
    const [sortColumn, setSortColumn] = useState<keyof Client>('name')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    // State for quick filters
    const [filter, setFilter] = useState<'ALL' | 'COMPANIES' | 'INDIVIDUALS' | 'ACTIVE' | 'INACTIVE' | 'RECENT'>('ALL')

    // Bulk actions state
    const [selectedClients, setSelectedClients] = useState<string[]>([])
    const [selectAll, setSelectAll] = useState(false)

    // Advanced filters state
    const [advancedFilters, setAdvancedFilters] = useState({
        status: '',
        clientType: '',
        dateRange: {
            from: '',
            to: ''
        }
    })

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/unauthorized')
        }
    }, [router, user])

    // Filter and search functionality
    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            // Quick filter
            if (filter !== 'ALL') {
                switch (filter) {
                    case 'COMPANY':
                        if (client.clientType !== 'COMPANY') return false
                        break
                    case 'INDIVIDUAL':
                        if (client.clientType !== 'INDIVIDUAL') return false
                        break
                    case 'ACTIVE':
                        if (client.status !== 'ACTIVE') return false
                        break
                    case 'INACTIVE':
                        if (client.status !== 'INACTIVE') return false
                        break
                    case 'RECENT':
                        const lastActive = new Date(client.lastActive)
                        const thirtyDaysAgo = new Date()
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                        if (lastActive < thirtyDaysAgo) return false
                        break
                }
            }

            // Advanced filters
            if (advancedFilters.status && client.status !== advancedFilters.status) {
                return false
            }
            if (advancedFilters.clientType && client.clientType !== advancedFilters.clientType) {
                return false
            }
            if (advancedFilters.dateRange.from || advancedFilters.dateRange.to) {
                const joinDate = new Date(client.joinDate)
                const fromDate = advancedFilters.dateRange.from ? new Date(advancedFilters.dateRange.from) : null
                const toDate = advancedFilters.dateRange.to ? new Date(advancedFilters.dateRange.to) : null

                if (fromDate && joinDate < fromDate) return false
                if (toDate && joinDate > toDate) return false
            }

            // Search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                const searchableFields = [
                    client.name,
                    client.email,
                    client.phone,
                    client.status,
                    client.clientType
                ].map(field => (field || '').toLowerCase())

                return searchableFields.some(field => field.includes(query))
            }

            return true
        })
    }, [clients, filter, searchQuery, advancedFilters])

    // Pagination
    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredClients.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredClients, currentPage, itemsPerPage])

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage)

    // Handle bulk selection
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedClients([])
        } else {
            setSelectedClients(filteredClients.map(client => client.id))
        }
        setSelectAll(!selectAll)
    }

    const toggleClientSelection = (id: string) => {
        if (selectedClients.includes(id)) {
            setSelectedClients(selectedClients.filter(clientId => clientId !== id))
            setSelectAll(false)
        } else {
            setSelectedClients([...selectedClients, id])
            // If all clients are now selected, update selectAll state
            if (selectedClients.length + 1 === filteredClients.length) {
                setSelectAll(true)
            }
        }
    }

    const handleBulkAction = async (action: string) => {
        if (selectedClients.length === 0) {
            toast({
                title: "No clients selected",
                description: "Please select at least one client to perform this action",
                variant: "destructive"
            })
            return
        }

        try {
            switch (action) {
                case 'activate':
                    // Update client status to ACTIVE
                    const updatedClients = clients.map(client =>
                        selectedClients.includes(client.id)
                            ? { ...client, status: 'ACTIVE' }
                            : client
                    )
                    setClients(updatedClients)
                    toast({
                        title: `${selectedClients.length} clients activated`,
                        description: "The selected clients have been activated",
                        variant: "default"
                    })
                    break

                case 'deactivate':
                    // Update client status to INACTIVE
                    const deactivatedClients = clients.map(client =>
                        selectedClients.includes(client.id)
                            ? { ...client, status: 'INACTIVE' }
                            : client
                    )
                    setClients(deactivatedClients)
                    toast({
                        title: `${selectedClients.length} clients deactivated`,
                        description: "The selected clients have been deactivated",
                        variant: "default"
                    })
                    break

                case 'export':
                    // Generate CSV content for selected clients
         case 'export': {
             const selectedClientsData = clients.filter(client =>
                 selectedClients.includes(client.id)
             )
             const csvContent = generateCSVContent(selectedClientsData)
             break;
         }
                    downloadCSV(csvContent, 'selected-clients.csv')
                    toast({
                        title: "Export successful",
                        description: `Exported ${selectedClients.length} clients to CSV`,
                        variant: "default"
                    })
                    break

                case 'assign':
                    // Open assign dialog
// ... other imports
import { useState } from 'react'

function ClientsPage() {
  // Define the missing dialog state
  const [showAssignDialog, setShowAssignDialog] = useState(false)

  // ... other code

                    setShowAssignDialog(true)

  // ... rest of the component
}

export default ClientsPage
                    break

                case 'delete':
                    // Remove selected clients
                    const remainingClients = clients.filter(client =>
                        !selectedClients.includes(client.id)
                    )
                    setClients(remainingClients)
                    toast({
                        title: `${selectedClients.length} clients deleted`,
                        description: "The selected clients have been deleted",
                        variant: "destructive"
                    })
                    break

                default:
                    toast({
                        title: "Unknown action",
                        description: "The selected action is not supported",
                        variant: "destructive"
                    })
                    break
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while performing the action",
                variant: "destructive"
            })
        }

        // Clear selection after action is performed
        setSelectedClients([])
        setSelectAll(false)
    }

    // Helper function to generate CSV content
    const generateCSVContent = (clients: Client[]) => {
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Status', 'Type', 'Join Date', 'Last Active']
        const rows = clients.map(client => [
            client.id,
            client.name,
            client.email,
            client.phone,
            client.status,
            client.clientType,
            client.joinDate,
            client.lastActive
        ])
        return [headers, ...rows].map(row => row.join(',')).join('\n')
    }

    // Helper function to download CSV
    const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <div className="flex justify-center"><CheckCircle2 className="h-4 w-4 text-green-500" /></div>;
            case 'PENDING':
                return <div className="flex justify-center"><Calendar className="h-4 w-4 text-amber-400" /></div>;
            case 'INACTIVE':
                return <div className="flex justify-center"><XCircle className="h-4 w-4 text-muted-foreground" /></div>;
            case 'SUSPENDED':
                return <div className="flex justify-center"><AlertCircle className="h-4 w-4 text-destructive" /></div>;
            default:
                return <div className="flex justify-center"><AlertCircle className="h-4 w-4" /></div>;
        }
    }

    // Calculate updated client statistics
    const clientStats = {
        total: clients.length,
        active: clients.filter(u => u.status === 'ACTIVE').length,
        inactive: clients.filter(u => u.status === 'INACTIVE').length,
        suspended: clients.filter(u => u.status === 'SUSPENDED').length,
        companies: clients.filter(u => u.clientType === 'COMPANY').length,
        individuals: clients.filter(u => u.clientType === 'INDIVIDUAL').length
    }

    // Import related functions
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                toast({
                    title: "Invalid file format",
                    description: "Please upload a CSV file",
                    variant: "destructive"
                })
                return
            }

            setCsvFile(file)
            setIsProcessingFile(true)
            readCSVFile(file)
        }
    }

    const readCSVFile = (file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const content = e.target?.result as string
            if (content) {
                parseCSVData(content)
            } else {
                setIsProcessingFile(false)
                toast({
                    title: "Error reading file",
                    description: "Could not read the file content",
                    variant: "destructive"
                })
            }
        }
        reader.onerror = () => {
            setIsProcessingFile(false)
            toast({
                title: "Error reading file",
                description: "Failed to read the CSV file",
                variant: "destructive"
            })
        }
        reader.readAsText(file)
    }

    // Handle drag and drop functionality
    useEffect(() => {
        const dropZone = dropZoneRef.current;
        if (!dropZone) return;

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('border-primary');
            dropZone.classList.add('bg-primary/5');
        };

        const handleDragLeave = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('border-primary');
            dropZone.classList.remove('bg-primary/5');
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('border-primary');
            dropZone.classList.remove('bg-primary/5');

            if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
                    setCsvFile(file);
                    setIsProcessingFile(true);
                    readCSVFile(file);
                } else {
                    toast({
                        title: "Invalid file format",
                        description: "Please upload a CSV file",
                        variant: "destructive"
                    });
                }
            }
        };

        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);

        return () => {
            dropZone.removeEventListener('dragover', handleDragOver);
            dropZone.removeEventListener('dragleave', handleDragLeave);
            dropZone.removeEventListener('drop', handleDrop);
        };
    }, []);

    // Advanced CSV handling
    const parseCSVData = (csvContent: string) => {
        // Parse the CSV to get records
        const parsedResult = Papa.parse<ImportRecord>(csvContent, {
            header: hasHeaderRow,
            skipEmptyLines: true,
            transformHeader: (header: string) => header.trim()
        });

        if (parsedResult.errors.length > 0) {
            console.error('CSV parsing errors:', parsedResult.errors);
            toast({
                title: "CSV parsing error",
                description: "The file contains invalid data",
                variant: "destructive"
            });
            setIsProcessingFile(false);
            return;
        }

        const records = parsedResult.data as ImportRecord[];
        setHeaderRow(parsedResult.meta.fields || []);

        // Validation
        const warnings: string[] = [];
        const dataErrors: Record<number, string[]> = {};

        // Check for required columns
        if (hasHeaderRow) {
            const allRequiredColumns = ['recordType', 'referenceId', 'name'];
            const missingColumns = allRequiredColumns.filter(
                col => !parsedResult.meta.fields?.includes(col)
            );

            if (missingColumns.length > 0) {
                warnings.push(`Missing required columns: ${missingColumns.join(', ')}`);
            }
        }

        // Check each record for data type and required field errors
        if (records.length > 0) {
            records.forEach((record, index) => {
                const rowErrors: string[] = [];

                // Check record type
                if (!record.recordType) {
                    rowErrors.push('Missing recordType');
                } else if (!['CLIENT', 'BENEFICIARY', 'DEPENDANT'].includes(record.recordType)) {
                    rowErrors.push(`Invalid recordType "${record.recordType}"`);
                } else {
                    // Check required fields for this record type
                    const requiredForType = requiredFields[record.recordType] || [];
                    requiredForType.forEach(field => {
                        if (!record[field as keyof ImportRecord]) {
                            rowErrors.push(`Missing required field "${field}" for ${record.recordType}`);
                        }
                    });
                }

                // Validate data types
                Object.entries(record).forEach(([key, value]) => {
                    if (value && columnDataTypes[key]) {
                        const type = columnDataTypes[key];
                        const isValid = validateDataType(value, type);
                        if (!isValid) {
                            rowErrors.push(`Invalid data type for "${key}": expected ${type}, got "${value}"`);
                        }
                    }
                });

                // Add row errors to warnings
                if (rowErrors.length > 0) {
                    dataErrors[index] = rowErrors;
                    warnings.push(`Row ${index + 2}: ${rowErrors[0]}${rowErrors.length > 1 ? ` (+${rowErrors.length - 1} more)` : ''}`);
                }
            });
        }

        setValidationWarnings(warnings);

        // Preview first 5 rows
        setPreviewData(records.slice(0, 5));

        // Store all records and errors for processing on import
        setCsvRecords(records);
        setRowErrors(dataErrors);
        setIsProcessingFile(false);
    }

    // Validate data types
    const validateDataType = (value: string, type: string): boolean => {
        if (!value) return true; // Allow empty values, required fields are checked separately

        switch (type) {
            case 'string':
                return typeof value === 'string';
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case 'phone':
                return /^[0-9+\-\s()]{7,15}$/.test(value);
            case 'date':
                return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
            default:
                return true;
        }
    }

    const handleImport = async () => {
        if (!csvFile) {
            toast({
                title: "No file selected",
                description: "Please select a CSV file to import",
                variant: "destructive"
            })
            return
        }

        try {
            setIsProcessingFile(true)
            const reader = new FileReader()

            reader.onload = (e) => {
                const content = e.target?.result as string
                const records = parseCSVData(content)

                if (records.length === 0) {
                    toast({
                        title: "No valid records found",
                        description: "The CSV file does not contain any valid records",
                        variant: "destructive"
                    })
                    return
                }

                // Validate records
                const validRecords = records.filter(record => {
                    return validateCsvData(record)
                })

                if (validRecords.length === 0) {
                    toast({
                        title: "Validation failed",
                        description: "No valid records found after validation",
                        variant: "destructive"
                    })
                    return
                }

                setImportData(validRecords)
                setImportStep(2)
            }

            reader.onerror = () => {
                toast({
                    title: "Error reading file",
                    description: "There was an error reading the CSV file",
                    variant: "destructive"
                })
            }

            reader.readAsText(csvFile)
        } catch (error) {
            toast({
                title: "Import failed",
                description: "There was an error processing the file",
                variant: "destructive"
            })
        } finally {
            setIsProcessingFile(false)
        }
    }

    const validateCsvData = (record: ImportRecord): boolean => {
        // Required fields
        if (!record.name || !record.clientType) {
            return false
        }

        // Email format
        if (record.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) {
            return false
        }

        // Phone format
        if (record.phone && !/^\+?[\d\s-]{10,}$/.test(record.phone)) {
            return false
        }

        // Date formats
        if (record.joinDate && !isValidDate(record.joinDate)) {
            return false
        }
        if (record.lastActive && !isValidDate(record.lastActive)) {
            return false
        }

        // Client type validation
        if (!['COMPANY', 'INDIVIDUAL'].includes(record.clientType)) {
            return false
        }

        // Status validation
        if (record.status && !['ACTIVE', 'INACTIVE'].includes(record.status)) {
            return false
        }

        return true
    }

    const isValidDate = (dateString: string): boolean => {
        const date = new Date(dateString)
        return date instanceof Date && !isNaN(date.getTime())
    }

    const handleConfirmImport = async () => {
        try {
            // Process import data and create new clients
            const newClients = importData.map(record => ({
                id: generateId(),
                name: record.name,
                email: record.email || '',
                phone: record.phone || '',
                status: record.status || 'ACTIVE',
                joinDate: record.joinDate || new Date().toISOString(),
                lastActive: record.lastActive || new Date().toISOString(),
                clientType: record.clientType,
                counsellor: record.counsellor || '',
                notes: record.notes || ''
            }))

            // Update clients state
            setClients(prevClients => [...prevClients, ...newClients])

            // Reset import state
            resetImport()

            toast({
                title: "Import successful",
                description: `Successfully imported ${newClients.length} clients`,
                variant: "default"
            })
        } catch (error) {
            toast({
                title: "Import failed",
                description: "There was an error importing the clients",
                variant: "destructive"
            })
        }
    }

    // Helper to generate IDs
    const generateId = () => {
        return 'id-' + Math.random().toString(36).substring(2, 9);
    }

    // Update template button
    const downloadTemplate = () => {
        const template = `recordType,clientId,referenceId,name,email,phone,status,joinDate,lastActive,clientType,counsellor,notes,relationToId,relation,department,role
CLIENT,C001,CL001,ACME Corp,hr@acme.com,0700123456,ACTIVE,2023-01-10,2024-04-01,COMPANY,John Doe,Top client,,,
BENEFICIARY,C001,BF001,Jane Smith,jane@acme.com,0700345678,ACTIVE,,,,,,,,HR,Manager
DEPENDANT,C001,DP001,Tom Smith,,,ACTIVE,,,,,,BF001,Son,,
CLIENT,C002,CL002,Peter Solo,peter@gmail.com,0770654321,ACTIVE,2023-02-15,2024-03-10,INDIVIDUAL,Mary Anne,Interested in therapy,,,
DEPENDANT,C002,DP002,Lucy Solo,,,ACTIVE,,,,,,CL002,Daughter,,`;

        const blob = new Blob([template], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'client_import_template.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    const resetImport = () => {
        setCsvFile(null);
        setPreviewData([]);
        setHeaderRow([]);
        setCsvRecords([]);
        setImportComplete(false);
        setImportProgress(0);
        setImportResults({ success: 0, errors: 0, total: 0 });
        setValidationWarnings([]);
        setRowErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!user) {
        return null
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                    <p className="text-muted-foreground">
                        Manage client accounts and view client information
                    </p>
                </div>
            </div>

            {/* Client Import Dialog */}
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-hidden flex flex-col">
                    {isImporting && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                            <div className="relative h-20 w-20 mb-4">
                                <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-950/40"></div>
                                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                                    <circle
                                        className="text-blue-100 dark:text-blue-950/40"
                                        strokeWidth="8"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="44"
                                        cx="50"
                                        cy="50"
                                    />
                                    <circle
                                        className="text-blue-500 dark:text-blue-400"
                                        strokeWidth="8"
                                        strokeDasharray={44 * 2 * Math.PI}
                                        strokeDashoffset={44 * 2 * Math.PI * (1 - importProgress / 100)}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="44"
                                        cx="50"
                                        cy="50"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-400 text-lg font-semibold">{Math.round(importProgress)}%</span>
                                </div>
                            </div>
                            <p className="text-base font-medium text-blue-700 dark:text-blue-400">Importing clients...</p>
                            <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-1">
                                Processing and validating records. Please wait.
                            </p>
                        </div>
                    )}
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0 border-b mb-2">
                        <div>
                            <DialogTitle className="text-xl flex items-center gap-2">
                                <FileSpreadsheet className="h-5 w-5 text-primary" />
                                Import Clients
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                {importComplete ? (
                                    <span className="flex items-center text-sm">
                                        <span className="text-muted-foreground">Step 2 of 2:</span>
                                        <span className="ml-1 font-medium">Confirm Import</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center text-sm">
                                        <span className="text-muted-foreground">Step 1 of 2:</span>
                                        <span className="ml-1 font-medium">Select Data Source</span>
                                    </span>
                                )}
                            </DialogDescription>
                        </div>
                        <div className="flex items-center h-9">
                            <TooltipProvider>
                                <Tooltip delayDuration={150}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 rounded-full"
                                            onClick={downloadTemplate}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="end" sideOffset={5}>
                                        Download Template
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </DialogHeader>

                    <div className="flex items-center justify-between px-1 mb-4">
                        <div className="flex flex-col items-center w-full">
                            <div className="flex items-center gap-3 w-full">
                                <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-medium ${!importComplete ? "bg-primary text-white" : "bg-primary/20 text-primary"}`}>
                                    1
                                </div>
                                <div className={`h-0.5 flex-1 ${importComplete ? "bg-primary" : "bg-primary/20"}`}></div>
                                <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-medium ${importComplete ? "bg-primary text-white" : "bg-gray-200 text-gray-400 dark:bg-gray-800"}`}>
                                    2
                                </div>
                            </div>
                            <div className="flex justify-between w-full text-xs mt-1">
                                <span className={`${!importComplete ? "text-primary font-medium" : "text-muted-foreground"}`}>Upload & Validate</span>
                                <span className={`${importComplete ? "text-primary font-medium" : "text-muted-foreground"}`}>Review & Confirm</span>
                            </div>
                        </div>
                    </div>

                    {!importComplete ? (
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <Tabs defaultValue="file" className="w-full flex flex-col flex-1 overflow-hidden" value={importMethod} onValueChange={setImportMethod}>
                                <TabsList className="grid w-full grid-cols-2 mb-3 flex-shrink-0">
                                    <TabsTrigger value="file" className="flex items-center gap-1.5">
                                        <FileUp className="h-3.5 w-3.5" />
                                        Upload CSV File
                                    </TabsTrigger>
                                    <TabsTrigger value="paste" className="flex items-center gap-1.5">
                                        <ClipboardCheck className="h-3.5 w-3.5" />
                                        Paste Data
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="file" className="pt-2 flex-1 overflow-hidden flex flex-col">
                                    <div className="space-y-4 overflow-y-auto pr-1 flex-1">
                                        <div
                                            ref={dropZoneRef}
                                            className="border-2 border-dashed border-border rounded-lg p-4 text-center transition-colors duration-200 cursor-pointer hover:border-primary hover:bg-primary/5"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".csv"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="csv-file-input"
                                            />
                                            {!csvFile ? (
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                                        <UploadCloud className="h-10 w-10 text-primary" />
                                                    </div>
                                                    <div className="text-center max-w-sm">
                                                        <p className="text-sm font-medium text-muted-foreground mb-1">
                                                            Drag and drop a CSV file here or click to browse
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Supports CSV files with client, beneficiary, and dependant data
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-4">
                                                    {isProcessingFile ? (
                                                        <>
                                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/5 flex items-center justify-center">
                                                                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="font-medium text-sm">Processing file...</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Analyzing and validating data
                                                                </p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/5 flex items-center justify-center">
                                                                <FileText className="h-8 w-8 text-green-500" />
                                                            </div>
                                                            <div className="text-left flex-1">
                                                                <p className="font-medium text-sm">{csvFile.name}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {(csvFile.size / 1024).toFixed(2)} KB • {csvRecords.length} records found
                                                                </p>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevent triggering the parent onClick
                                                                    setCsvFile(null);
                                                                    setPreviewData([]);
                                                                    setHeaderRow([]);
                                                                    setCsvRecords([]);
                                                                    setValidationWarnings([]);
                                                                    if (fileInputRef.current) {
                                                                        fileInputRef.current.value = '';
                                                                    }
                                                                }}
                                                            >
                                                                Change
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {validationWarnings.length > 0 && (
                                            <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Warning</p>
                                                </div>
                                                <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1 pl-6 list-disc">
                                                    {validationWarnings.slice(0, 3).map((warning, index) => (
                                                        <li key={index}>{warning}</li>
                                                    ))}
                                                    {validationWarnings.length > 3 && (
                                                        <li>And {validationWarnings.length - 3} more warnings...</li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 flex-wrap p-2 rounded-md bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="checkbox"
                                                    id="has-header"
                                                    checked={hasHeaderRow}
                                                    onChange={(e) => setHasHeaderRow(e.target.checked)}
                                                    className="h-3.5 w-3.5"
                                                />
                                                <label htmlFor="has-header" className="text-xs">First row is header</label>
                                            </div>
                                            <div className="h-4 w-[1px] bg-blue-200 dark:bg-blue-800"></div>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="flex items-center gap-1">
                                                            <Info className="h-3 w-3 text-blue-500" />
                                                            <span className="text-xs text-blue-600 dark:text-blue-400">Format help</span>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-[300px]">
                                                        <p className="text-xs">CSV should contain recordType, referenceId, and name columns. Valid recordTypes are CLIENT, BENEFICIARY, and DEPENDANT.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>

                                        {previewData.length > 0 && (
                                            <div className="space-y-2 flex-1 flex flex-col min-h-0">
                                                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-2 rounded-t-md border border-border">
                                                    <h3 className="text-sm font-medium flex items-center">
                                                        <FileSpreadsheet className="h-4 w-4 mr-1.5 text-primary" />
                                                        Preview (first 5 rows)
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 w-7 p-0 relative"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();

                                                                if (!csvFile || isProcessingFile) return;

                                                                // Start fresh - clear current state
                                                                setIsProcessingFile(true);

                                                                // Reread the file directly
                                                                const reader = new FileReader();

                                                                reader.onload = (event) => {
                                                                    const content = event.target?.result as string;
                                                                    if (content) {
                                                                        // Reset data
                                                                        setPreviewData([]);
                                                                        setHeaderRow([]);
                                                                        setCsvRecords([]);
                                                                        setValidationWarnings([]);
                                                                        setRowErrors({});

                                                                        // Parse with a slight delay to ensure reset completes
                                                                        setTimeout(() => {
                                                                            parseCSVData(content);

                                                                            toast({
                                                                                title: "Data refreshed",
                                                                                description: "CSV data has been reloaded",
                                                                                variant: "default"
                                                                            });
                                                                        }, 0);
                                                                    } else {
                                                                        setIsProcessingFile(false);
                                                                        toast({
                                                                            title: "Refresh failed",
                                                                            description: "Could not read file content",
                                                                            variant: "destructive"
                                                                        });
                                                                    }
                                                                };

                                                                reader.onerror = () => {
                                                                    setIsProcessingFile(false);
                                                                    toast({
                                                                        title: "Refresh failed",
                                                                        description: "Error reading the file",
                                                                        variant: "destructive"
                                                                    });
                                                                };

                                                                // Read the existing file directly
                                                                reader.readAsText(csvFile);
                                                            }}
                                                            disabled={!csvFile || isProcessingFile}
                                                        >
                                                            {isProcessingFile ? (
                                                                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                                                            ) : (
                                                                <RefreshCw className="h-4 w-4 text-primary" />
                                                            )}
                                                            <span className="sr-only">Refresh CSV data</span>
                                                        </Button>
                                                        <p className="text-xs text-muted-foreground">
                                                            All rows will be imported when you click Import
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="rounded-b-md border-x border-b overflow-auto flex-1">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow className="bg-gray-50/80 dark:bg-gray-900/40">
                                                                {headerRow.map((header, index) => (
                                                                    <TableHead key={index} className="py-1.5 px-2 text-xs whitespace-nowrap sticky top-0 bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-sm">
                                                                        {header}
                                                                        {requiredFields['CLIENT']?.includes(header) &&
                                                                            <span className="text-red-500 ml-0.5">*</span>
                                                                        }
                                                                    </TableHead>
                                                                ))}
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {previewData.map((record, rowIndex) => (
                                                                <TableRow
                                                                    key={rowIndex}
                                                                    className={rowErrors[rowIndex]
                                                                        ? "bg-red-50 dark:bg-red-900/20 hover:bg-red-100/70 dark:hover:bg-red-900/30"
                                                                        : (rowIndex % 2 === 0 ? "bg-white dark:bg-transparent" : "bg-gray-50/50 dark:bg-gray-900/20")}
                                                                >
                                                                    {headerRow.map((header, colIndex) => {
                                                                        // Check if this cell has an error
                                                                        const errorInCell = rowErrors[rowIndex]?.some(err =>
                                                                            err.includes(`"${header}"`) ||
                                                                            (header === 'recordType' && err.includes('recordType'))
                                                                        );

                                                                        // For type checking
                                                                        const recordType = record['recordType'];
                                                                        const requiredForThisType = recordType && requiredFields[recordType] ?
                                                                            requiredFields[recordType] : [];
                                                                        const isRequired = requiredForThisType.includes(header);
                                                                        const isEmpty = !record[header];

                                                                        return (
                                                                            <TableCell
                                                                                key={colIndex}
                                                                                className={`py-1 px-2 text-xs whitespace-nowrap ${errorInCell ? "text-red-600 dark:text-red-400 font-medium" : ""
                                                                                    } ${isRequired && isEmpty ? "bg-red-100 dark:bg-red-900/30" : ""
                                                                                    }`}
                                                                            >
                                                                                {record[header]}
                                                                                {isRequired && isEmpty && (
                                                                                    <span className="text-red-500 ml-1">
                                                                                        (Required)
                                                                                    </span>
                                                                                )}
                                                                            </TableCell>
                                                                        );
                                                                    })}
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="paste" className="pt-2 flex-1 overflow-hidden flex flex-col">
                                    <div className="space-y-4 flex-1 overflow-y-auto">
                                        <div className="space-y-2 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="csv-paste" className="flex items-center gap-1.5">
                                                    <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground" />
                                                    Paste CSV data
                                                </Label>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="checkbox"
                                                            id="has-header-paste"
                                                            checked={hasHeaderRow}
                                                            onChange={(e) => setHasHeaderRow(e.target.checked)}
                                                            className="h-3.5 w-3.5"
                                                        />
                                                        <label htmlFor="has-header-paste" className="text-xs">First row is header</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <textarea
                                                id="csv-paste"
                                                className="w-full flex-1 min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                                                placeholder="recordType,clientId,referenceId,name,email,phone,status,joinDate,lastActive,clientType,counsellor,notes,relationToId,relation,department,role
CLIENT,C001,CL001,ACME Corp,hr@acme.com,0700123456,ACTIVE,2023-01-10,2024-04-01,COMPANY,John Doe,Top client,,,,"
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        setIsProcessingFile(true);
                                                        parseCSVData(e.target.value);
                                                    } else {
                                                        setPreviewData([]);
                                                        setHeaderRow([]);
                                                        setCsvRecords([]);
                                                        setValidationWarnings([]);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Info className="h-3 w-3 text-muted-foreground" />
                                            <p className="text-xs text-muted-foreground">
                                                Data should be in CSV format with column headers in the first row.
                                                Required columns: recordType, referenceId, name, clientType (for CLIENT records).
                                            </p>
                                        </div>

                                        {validationWarnings.length > 0 && (
                                            <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                    <p className="text-sm font-medium text-amber-700">Warning</p>
                                                </div>
                                                <ul className="text-xs text-amber-700 space-y-1 pl-6 list-disc">
                                                    {validationWarnings.slice(0, 3).map((warning, index) => (
                                                        <li key={index}>{warning}</li>
                                                    ))}
                                                    {validationWarnings.length > 3 && (
                                                        <li>And {validationWarnings.length - 3} more warnings...</li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        {previewData.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-medium">Preview (first 5 rows)</h3>
                                                </div>
                                                <div className="rounded-md border overflow-auto max-h-[200px]">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                {headerRow.map((header, index) => (
                                                                    <TableHead key={index} className="py-1.5 px-2 text-xs whitespace-nowrap sticky top-0 bg-background">
                                                                        {header}
                                                                    </TableHead>
                                                                ))}
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {previewData.map((record, rowIndex) => (
                                                                <TableRow key={rowIndex}>
                                                                    {headerRow.map((header, colIndex) => {
                                                                        // Add special handling for the name column
                                                                        if (header === 'name' || fieldMapping[colIndex] === 'name') {
                                                                            return (
                                                                                <TableCell key={colIndex} className={cn(
                                                                                    "py-1 px-2 text-xs",
                                                                                    rowErrors[rowIndex]?.includes(header) ? "bg-red-50 text-red-600 dark:bg-red-900/20" : ""
                                                                                )}>
                                                                                    <div
                                                                                        className="cursor-pointer select-none"
                                                                                        onDoubleClick={() => {
                                                                                            // Only navigate if this is an existing client with an ID
                                                                                            if (record.id) {
                                                                                                router.push(`/admin/clients/${record.id}`);
                                                                                            }
                                                                                        }}
                                                                                        title={record.id ? "Double-click to view client details" : ""}
                                                                                    >
                                                                                        {record[header] || ''}
                                                                                    </div>
                                                                                </TableCell>
                                                                            );
                                                                        }

                                                                        // For other columns, keep the original rendering
                                                                        return (
                                                                            <TableCell key={colIndex} className={cn(
                                                                                "py-1 px-2 text-xs",
                                                                                rowErrors[rowIndex]?.includes(header) ? "bg-red-50 text-red-600 dark:bg-red-900/20" : ""
                                                                            )}>
                                                                                {record[header] || ''}
                                                                            </TableCell>
                                                                        );
                                                                    })}
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <DialogFooter className="mt-5 flex-shrink-0">
                                <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleImport}
                                    disabled={(!csvFile && !csvRecords.length) || isImporting}
                                    className="gap-1.5 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700"
                                >
                                    {isImporting ? (
                                        <>
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <ChevronRight className="h-3.5 w-3.5" />
                                            Continue to Review
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </div>
                    ) : (
                        <div className="py-4">
                            <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0 border-b mb-4">
                                <div>
                                    <DialogTitle className="text-xl flex items-center gap-2">
                                        {importResults.errors === 0 ? (
                                            <>
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                Ready to Import
                                            </>
                                        ) : (
                                            <>
                                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                                Import Review
                                            </>
                                        )}
                                    </DialogTitle>
                                    <DialogDescription className="mt-1">
                                        {importResults.total} total records processed
                                    </DialogDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setImportComplete(false);
                                        }}
                                        className="gap-1.5"
                                    >
                                        <ChevronLeft className="h-3.5 w-3.5" />
                                        Back
                                    </Button>
                                    <Button
                                        variant="default"
                                        onClick={() => {
                                            toast({
                                                title: "Import successful",
                                                description: `${importResults.success} records successfully imported to the database`,
                                                variant: "default"
                                            });
                                            setIsImportDialogOpen(false);
                                        }}
                                        disabled={importResults.success === 0}
                                        className="gap-1.5 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700"
                                    >
                                        <UploadCloud className="h-3.5 w-3.5" />
                                        Confirm Import
                                    </Button>
                                </div>
                            </DialogHeader>

                            <div className="flex justify-center mb-4">
                                {importResults.errors === 0 ? (
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/5 flex items-center justify-center">
                                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                                    </div>
                                ) : (
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/5 flex items-center justify-center">
                                        <AlertTriangle className="h-16 w-16 text-amber-500" />
                                    </div>
                                )}
                            </div>

                            <div className="max-w-sm mx-auto bg-card border rounded-lg p-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Total records:</p>
                                        <p className="text-sm">{importResults.total}</p>
                                    </div>
                                    <div className="h-px bg-border" />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                            <p className="text-sm font-medium text-green-700 dark:text-green-500">Valid records:</p>
                                        </div>
                                        <p className="text-sm font-semibold text-green-700 dark:text-green-500">{importResults.success}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                            <p className="text-sm font-medium text-red-700 dark:text-red-500">Invalid records:</p>
                                        </div>
                                        <p className="text-sm font-semibold text-red-700 dark:text-red-500">{importResults.errors}</p>
                                    </div>
                                    <div className="h-px bg-border" />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                            <p className="text-sm font-medium">Validation rate:</p>
                                        </div>
                                        <p className="text-sm font-semibold">{importResults.total > 0 ? Math.round((importResults.success / importResults.total) * 100) : 0}%</p>
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="flex flex-row gap-3 justify-center mt-4">
                                <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={resetImport}
                                    className="gap-1.5"
                                >
                                    <Upload className="h-3.5 w-3.5" />
                                    Start Over
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Client Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <Card className="bg-gradient-to-br from-background via-background/95 to-blue-500/5 border-blue-500/10 overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex">
                            <div className="h-16 w-16 min-w-[4rem] rounded-full bg-primary/10 flex items-center justify-center mr-4 border border-primary/20">
                                <UserCircle className="h-8 w-8 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-lg font-bold mb-2 flex items-center">
                                    Total Clients: <span className="ml-1.5 text-primary">{clientStats.total}</span>
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-start">
                                        <div className="h-5 w-5 min-w-[1.25rem] rounded-full bg-blue-500/10 flex items-center justify-center mr-2 mt-0.5">
                                            <Building2 className="h-3 w-3 text-blue-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <p className="text-sm font-medium whitespace-nowrap">
                                                    Org: <span className="text-blue-500 min-w-[2rem] inline-block">{clientStats.companies}</span>
                                                </p>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center whitespace-nowrap">
                                                                <Users className="h-3 w-3 mr-1 flex-shrink-0 text-blue-400" />
                                                                <span className="text-xs truncate max-w-[7rem]">{clients.reduce((sum, client) => client.clientType === 'COMPANY' ? sum + (getBeneficiariesCount(client) || 0) : sum, 0)} staff</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Total Staff (Beneficiaries)</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center whitespace-nowrap">
                                                                <User className="h-3 w-3 mr-1 flex-shrink-0 text-purple-400" />
                                                                <span className="text-xs truncate max-w-[7rem]">{clients.reduce((sum, client) => client.clientType === 'COMPANY' ? sum + getDependantsCount(client) : sum, 0)} deps</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Total Company Dependants</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="h-5 w-5 min-w-[1.25rem] rounded-full bg-purple-500/10 flex items-center justify-center mr-2 mt-0.5">
                                            <User className="h-3 w-3 text-purple-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <p className="text-sm font-medium whitespace-nowrap">
                                                    Ind: <span className="text-purple-500 min-w-[2rem] inline-block">{clientStats.individuals}</span>
                                                </p>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center whitespace-nowrap">
                                                                <User className="h-3 w-3 mr-1 flex-shrink-0 text-purple-400" />
                                                                <span className="text-xs truncate max-w-[7rem]">{clients.reduce((sum, client) => client.clientType === 'INDIVIDUAL' ? sum + getDependantsCount(client) : sum, 0)} deps</span>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Total Individual Dependants</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-background via-background/95 to-green-500/5 border-green-500/10 overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex">
                            <div className="h-16 w-16 min-w-[4rem] rounded-full bg-blue-500/10 flex items-center justify-center mr-4 border border-blue-500/20">
                                <Activity className="h-8 w-8 text-blue-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <p className="text-lg font-bold mb-2 flex items-center">
                                                Status Summary: <span className="ml-1.5 text-blue-500">{clientStats.total}</span>
                                            </p>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Total Client Accounts</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="space-y-2">
                                    <div className="flex items-start">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="h-5 w-5 min-w-[1.25rem] rounded-full bg-green-500/10 flex items-center justify-center mr-2 mt-0.5">
                                                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Active Clients</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <p className="text-sm font-medium whitespace-nowrap">
                                                    Active: <span className="text-green-500 min-w-[2rem] inline-block">{clientStats.active}</span>
                                                </p>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {Math.round((clientStats.active / clientStats.total) * 100)}% of clients
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="h-5 w-5 min-w-[1.25rem] rounded-full bg-red-500/10 flex items-center justify-center mr-2 mt-0.5">
                                                        <XCircle className="h-3 w-3 text-red-500" />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Inactive & Suspended Clients</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <p className="text-sm font-medium whitespace-nowrap">
                                                    Inactive: <span className="text-red-500 min-w-[2rem] inline-block">{clientStats.inactive + clientStats.suspended}</span>
                                                </p>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {Math.round(((clientStats.inactive + clientStats.suspended) / clientStats.total) * 100)}% of clients
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-background via-background/95 to-purple-500/5 border-purple-500/10 overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex">
                            <div className="h-16 w-16 min-w-[4rem] rounded-full bg-purple-500/10 flex items-center justify-center mr-4 border border-purple-500/20">
                                <MessageSquare className="h-8 w-8 text-purple-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <p className="text-lg font-bold mb-2 flex items-center">
                                                Sessions: <span className="ml-1.5 text-purple-500">{clients.reduce((sum, client) => sum + client.appointments, 0)}</span>
                                            </p>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Total Counseling Sessions</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <div className="space-y-2">
                                    <div className="flex items-start">
                                        <div className="h-5 w-5 min-w-[1.25rem] rounded-full bg-blue-500/10 flex items-center justify-center mr-2 mt-0.5">
                                            <Building2 className="h-3 w-3 text-blue-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <p className="text-sm font-medium whitespace-nowrap">
                                                    Org: <span className="text-blue-500 min-w-[2rem] inline-block">{clients.filter(c => c.clientType === 'COMPANY').reduce((sum, client) => sum + client.appointments, 0)}</span>
                                                </p>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {Math.round((clients.filter(c => c.clientType === 'COMPANY').reduce((sum, client) => sum + client.appointments, 0) / clients.reduce((sum, client) => sum + client.appointments, 0)) * 100)}% of sessions
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="h-5 w-5 min-w-[1.25rem] rounded-full bg-purple-500/10 flex items-center justify-center mr-2 mt-0.5">
                                            <User className="h-3 w-3 text-purple-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <p className="text-sm font-medium whitespace-nowrap">
                                                    Ind: <span className="text-purple-500 min-w-[2rem] inline-block">{clients.filter(c => c.clientType === 'INDIVIDUAL').reduce((sum, client) => sum + client.appointments, 0)}</span>
                                                </p>
                                                <div className="h-4 w-[1px] bg-border"></div>
                                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {Math.round((clients.filter(c => c.clientType === 'INDIVIDUAL').reduce((sum, client) => sum + client.appointments, 0) / clients.reduce((sum, client) => sum + client.appointments, 0)) * 100)}% of sessions
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
                <Button
                    variant={filter === 'ALL' ? "default" : "outline"}
                    size="sm"
                    className={`h-8 px-3 rounded-full ${filter === 'ALL' ? "shadow-sm" : ""}`}
                    onClick={() => setFilter('ALL')}
                >
                    All Clients
                    <Badge variant="secondary" className="ml-2 rounded-full px-1.5 py-0.5">
                        {clients.length}
                    </Badge>
                </Button>
                <Button
                    variant={filter === 'COMPANIES' ? "default" : "outline"}
                    size="sm"
                    className={`h-8 px-3 rounded-full ${filter === 'COMPANIES' ? "shadow-sm" : ""}`}
                    onClick={() => setFilter('COMPANIES')}
                >
                    Companies
                    <Badge variant="secondary" className="ml-2 rounded-full px-1.5 py-0.5">
                        {clients.filter(c => c.clientType === 'COMPANY').length}
                    </Badge>
                </Button>
                <Button
                    variant={filter === 'INDIVIDUALS' ? "default" : "outline"}
                    size="sm"
                    className={`h-8 px-3 rounded-full ${filter === 'INDIVIDUALS' ? "shadow-sm" : ""}`}
                    onClick={() => setFilter('INDIVIDUALS')}
                >
                    Individuals
                    <Badge variant="secondary" className="ml-2 rounded-full px-1.5 py-0.5">
                        {clients.filter(c => c.clientType === 'INDIVIDUAL').length}
                    </Badge>
                </Button>
                <Button
                    variant={filter === 'ACTIVE' ? "default" : "outline"}
                    size="sm"
                    className={`h-8 px-3 rounded-full ${filter === 'ACTIVE' ? "shadow-sm" : ""}`}
                    onClick={() => setFilter('ACTIVE')}
                >
                    Active
                    <Badge variant="secondary" className="ml-2 rounded-full px-1.5 py-0.5">
                        {clients.filter(c => c.status === 'ACTIVE').length}
                    </Badge>
                </Button>
                <Button
                    variant={filter === 'INACTIVE' ? "default" : "outline"}
                    size="sm"
                    className={`h-8 px-3 rounded-full ${filter === 'INACTIVE' ? "shadow-sm" : ""}`}
                    onClick={() => setFilter('INACTIVE')}
                >
                    Inactive
                    <Badge variant="secondary" className="ml-2 rounded-full px-1.5 py-0.5">
                        {clients.filter(c => c.status === 'INACTIVE').length}
                    </Badge>
                </Button>
                <Button
                    variant={filter === 'RECENT' ? "default" : "outline"}
                    size="sm"
                    className={`h-8 px-3 rounded-full ${filter === 'RECENT' ? "shadow-sm" : ""}`}
                    onClick={() => setFilter('RECENT')}
                >
                    Recent
                    <Badge variant="secondary" className="ml-2 rounded-full px-1.5 py-0.5">
                        {clients.filter(c => {
                            const lastActive = new Date(c.lastActive);
                            const now = new Date();
                            const diffDays = Math.ceil((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
                            return diffDays <= 30;
                        }).length}
                    </Badge>
                </Button>
            </div>

            {/* Advanced Search Accordion */}
            <Collapsible className="mb-4">
                <CollapsibleTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs rounded-full flex items-center gap-1"
                    >
                        <Search className="h-3 w-3" />
                        <span>Advanced Search</span>
                        <ChevronDown className="h-3 w-3" />
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 border rounded-md p-3 bg-card">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        <div className="space-y-1">
                            <Label htmlFor="client-type" className="text-xs">Client Type</Label>
                            <Select>
                                <SelectTrigger id="client-type" className="h-8 text-xs">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="company">Companies</SelectItem>
                                    <SelectItem value="individual">Individuals</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="status" className="text-xs">Status</Label>
                            <Select>
                                <SelectTrigger id="status" className="h-8 text-xs">
                                    <SelectValue placeholder="Any Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="counsellor" className="text-xs">Counsellor</Label>
                            <Select>
                                <SelectTrigger id="counsellor" className="h-8 text-xs">
                                    <SelectValue placeholder="Any Counsellor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Counsellor</SelectItem>
                                    <SelectItem value="john">John Doe</SelectItem>
                                    <SelectItem value="mary">Mary Anne</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="join-date" className="text-xs">Join Date</Label>
                            <Select>
                                <SelectTrigger id="join-date" className="h-8 text-xs">
                                    <SelectValue placeholder="Any Time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Time</SelectItem>
                                    <SelectItem value="30days">Last 30 Days</SelectItem>
                                    <SelectItem value="60days">Last 60 Days</SelectItem>
                                    <SelectItem value="90days">Last 90 Days</SelectItem>
                                    <SelectItem value="custom">Custom Range</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="last-active" className="text-xs">Last Active</Label>
                            <Select>
                                <SelectTrigger id="last-active" className="h-8 text-xs">
                                    <SelectValue placeholder="Any Time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Time</SelectItem>
                                    <SelectItem value="7days">Last 7 Days</SelectItem>
                                    <SelectItem value="30days">Last 30 Days</SelectItem>
                                    <SelectItem value="inactive">Inactive 30+ Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="search-term" className="text-xs">Search Term</Label>
                            <Input id="search-term" placeholder="Name, email, phone..." className="h-8 text-xs" />
                        </div>
                    </div>
                    <div className="flex justify-end mt-3 gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs">Reset</Button>
                        <Button size="sm" className="h-7 text-xs">Apply Filters</Button>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {/* Bulk Actions */}
            {selectedClients.length > 0 && (
                <div className="flex justify-between items-center">
                    <div className="text-gray-500 text-sm">
                        {selectedClients.length} clients selected
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="default" size="sm" className="h-8 px-3 gap-1 rounded-full shadow-sm">
                                Bulk Actions
                                <ChevronDown className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => handleBulkAction('activate')} className="flex items-center gap-2 cursor-pointer">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <span>Activate Clients</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBulkAction('deactivate')} className="flex items-center gap-2 cursor-pointer">
                                <XCircle className="h-4 w-4 text-amber-500" />
                                <span>Deactivate Clients</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleBulkAction('export')} className="flex items-center gap-2 cursor-pointer">
                                <Download className="h-4 w-4 text-blue-500" />
                                <span>Export Selected</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleBulkAction('assign')} className="flex items-center gap-2 cursor-pointer">
                                <UserPlus className="h-4 w-4 text-purple-500" />
                                <span>Assign Counsellor</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="text-destructive flex items-center gap-2 cursor-pointer">
                                <Trash2 className="h-4 w-4" />
                                <span>Delete Clients</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <Card className="lg:col-span-3">
                    <CardHeader className="py-3">
                        <div className="flex justify-between items-center">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search clients..."
                                    className="w-[220px] pl-8 h-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[130px] h-9">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Statuses</SelectItem>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
                                    <SelectTrigger className="w-[130px] h-9">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Types</SelectItem>
                                        <SelectItem value="COMPANY">Companies</SelectItem>
                                        <SelectItem value="INDIVIDUAL">Individuals</SelectItem>
                                    </SelectContent>
                                </Select>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-9 w-9 rounded-full"
                                                onClick={() => setIsImportDialogOpen(true)}
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Import Clients</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                className="h-9 w-9 rounded-full"
                                                onClick={() => setIsAddClientDialogOpen(true)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Add Client</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 pb-4">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-10">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={toggleSelectAll}
                                                    className="h-4 w-4 rounded"
                                                />
                                            </div>
                                        </TableHead>
                                        <TableHead className="w-[180px] py-2 px-2">Name</TableHead>
                                        <TableHead className="w-[40px] py-2 px-1 text-center">Type</TableHead>
                                        <TableHead className="w-[180px] py-2 px-2">Email</TableHead>
                                        <TableHead className="w-[50px] py-2 px-1 text-center">Sessions</TableHead>
                                        <TableHead className="w-[80px] py-2 px-1 text-center">Beneficiaries</TableHead>
                                        <TableHead className="w-[40px] py-2 px-1 text-center">Status</TableHead>
                                        <TableHead className="w-[50px] py-2 px-1">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedClients.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell className="py-1 px-2">
                                                <div className="flex items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedClients.includes(client.id)}
                                                        onChange={() => toggleClientSelection(client.id)}
                                                        className="h-4 w-4 rounded"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-1 px-2">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-7 w-7">
                                                        <AvatarImage src="" />
                                                        <AvatarFallback className={client.clientType === 'COMPANY' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}>
                                                            {client.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex flex-col">
                                                        <div
                                                            className="font-medium truncate max-w-[120px] cursor-pointer select-none"
                                                            onDoubleClick={() => router.push(`/admin/clients/${client.id}`)}
                                                            title="Double-click to view client details"
                                                        >
                                                            {client.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-1 px-1 text-center">
                                                {getClientTypeIcon(client.clientType)}
                                            </TableCell>
                                            <TableCell className="py-1 px-2">
                                                <span className="text-sm whitespace-nowrap">{client.email}</span>
                                            </TableCell>
                                            <TableCell className="py-1 px-1 text-center">
                                                <span className="text-xs font-normal">{client.appointments}</span>
                                            </TableCell>
                                            <TableCell className="py-1 px-1 text-center">
                                                {client.clientType === 'COMPANY' ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Link
                                                                        href={`/admin/clients/${client.id}/beneficiaries`}
                                                                        className="text-blue-600 text-xs flex items-center hover:underline"
                                                                    >
                                                                        <Users className="h-3.5 w-3.5" />
                                                                        <span className="ml-1">{getBeneficiariesCount(client)}</span>
                                                                    </Link>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>{getBeneficiariesCount(client)} Beneficiaries</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>

                                                        {getDependantsCount(client) > 0 && (
                                                            <>
                                                                <span className="text-muted-foreground">|</span>
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Link
                                                                                href={`/admin/clients/${client.id}/${client.clientType === 'COMPANY' ? 'company-dependants' : 'dependants'}`}
                                                                                className="text-purple-600 text-xs flex items-center hover:underline"
                                                                            >
                                                                                <User className="h-3.5 w-3.5" />
                                                                                <span className="ml-1">{getDependantsCount(client)}</span>
                                                                            </Link>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>{getDependantsCount(client)} Dependants</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-center">
                                                        {getDependantsCount(client) > 0 ? (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Link
                                                                            href={`/admin/clients/${client.id}/dependants`}
                                                                            className="text-purple-600 text-xs flex items-center hover:underline"
                                                                        >
                                                                            <User className="h-3.5 w-3.5" />
                                                                            <span className="ml-1">{getDependantsCount(client)}</span>
                                                                        </Link>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{getDependantsCount(client)} Dependants</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">N/A</span>
                                                        )}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-1 px-1 text-center">
                                                {getStatusIcon(client.status)}
                                            </TableCell>
                                            <TableCell className="py-1 px-1">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-6 w-6 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                                            <MoreVertical className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-[160px]">
                                                        <DropdownMenuItem onClick={() => router.push(`/admin/clients/${client.id}`)} className="cursor-pointer">
                                                            <Eye className="mr-2 h-3.5 w-3.5 text-blue-500" />
                                                            <span className="text-xs">View Profile</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <Edit className="mr-2 h-3.5 w-3.5 text-amber-500" />
                                                            <span className="text-xs">Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <MessageSquare className="mr-2 h-3.5 w-3.5 text-indigo-500" />
                                                            <span className="text-xs">Message</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer">
                                                            <FileText className="mr-2 h-3.5 w-3.5 text-green-500" />
                                                            <span className="text-xs">Notes</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive cursor-pointer">
                                                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                            <span className="text-xs">Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between mt-2 px-4 text-sm">
                            <div className="text-muted-foreground text-xs">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} clients
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0 rounded-full"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let pageNumber;
                                    if (totalPages <= 5) {
                                        pageNumber = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNumber = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNumber = totalPages - 4 + i;
                                    } else {
                                        pageNumber = currentPage - 2 + i;
                                    }
                                    return (
                                        <Button
                                            key={pageNumber}
                                            variant={currentPage === pageNumber ? "default" : "outline"}
                                            size="sm"
                                            className={`h-7 w-7 p-0 text-xs ${currentPage === pageNumber ? "shadow-sm" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                                            onClick={() => handlePageChange(pageNumber)}
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                })}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0 rounded-full"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                                <SelectTrigger className="w-[100px] h-7 text-xs">
                                    <SelectValue placeholder="Rows per page" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 per page</SelectItem>
                                    <SelectItem value="10">10 per page</SelectItem>
                                    <SelectItem value="15">15 per page</SelectItem>
                                    <SelectItem value="25">25 per page</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Card */}
                <Card className="lg:col-span-1">
                    <CardHeader className="py-3 px-4">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-sm">Recent Activity</CardTitle>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                        <CardDescription className="text-xs">Client interactions & updates</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 py-0">
                        <div className="space-y-4">
                            {/* Activity Item 1 */}
                            <div className="flex gap-2">
                                <div className="relative mt-0.5">
                                    <div className="flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                        <MessageSquare className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="absolute top-7 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-border"></div>
                                </div>
                                <div className="space-y-0.5 flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium">Session Completed</p>
                                        <p className="text-[10px] text-muted-foreground">2h ago</p>
                                    </div>
                                    <p className="text-xs truncate">
                                        <span className="font-medium text-blue-600 dark:text-blue-400">ACME Corp</span> completed a session with <span className="font-medium">John</span>
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">Company</Badge>
                                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">45 min</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Item 2 */}
                            <div className="flex gap-2">
                                <div className="relative mt-0.5">
                                    <div className="flex items-center justify-center h-7 w-7 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                        <UserPlus className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="absolute top-7 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-border"></div>
                                </div>
                                <div className="space-y-0.5 flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium">New Beneficiary</p>
                                        <p className="text-[10px] text-muted-foreground">Yesterday</p>
                                    </div>
                                    <p className="text-xs truncate">
                                        <span className="font-medium text-blue-600 dark:text-blue-400">TechStart Inc</span> added <span className="font-medium">Sarah</span>
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">Company</Badge>
                                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800">HR</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Item 3 */}
                            <div className="flex gap-2">
                                <div className="relative mt-0.5">
                                    <div className="flex items-center justify-center h-7 w-7 rounded-full bg-amber-100 dark:bg-amber-900/30">
                                        <Calendar className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="absolute top-7 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-border"></div>
                                </div>
                                <div className="space-y-0.5 flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium">Session Scheduled</p>
                                        <p className="text-[10px] text-muted-foreground">2d ago</p>
                                    </div>
                                    <p className="text-xs truncate">
                                        <span className="font-medium text-purple-600 dark:text-purple-400">Peter Solo</span> scheduled a session
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">Individual</Badge>
                                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800">May 27</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Item 4 */}
                            <div className="flex gap-2">
                                <div className="relative mt-0.5">
                                    <div className="flex items-center justify-center h-7 w-7 rounded-full bg-green-100 dark:bg-green-900/30">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="absolute top-7 bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 bg-border h-0"></div>
                                </div>
                                <div className="space-y-0.5 flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium">Client Activated</p>
                                        <p className="text-[10px] text-muted-foreground">3d ago</p>
                                    </div>
                                    <p className="text-xs truncate">
                                        <span className="font-medium text-blue-600 dark:text-blue-400">Global Services Ltd</span> activated
                                    </p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">Company</Badge>
                                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">Active</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 pt-2 border-t text-center">
                            <Button variant="link" size="sm" className="text-[10px] h-auto p-0">
                                View all activity <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Analytics & Features Section */}
            <div className="mt-6 space-y-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium tracking-tight">Analytics & Insights</h2>
                    <Select defaultValue="30">
                        <SelectTrigger className="w-[120px] h-7">
                            <SelectValue placeholder="Time period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 days</SelectItem>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                            <SelectItem value="365">Last year</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Client Engagement Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm">Client Engagement</CardTitle>
                                <div className="flex items-center gap-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                                                    <Info className="h-3.5 w-3.5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-xs">Client engagement metrics based on recent activity</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-full">
                                        <RefreshCw className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <div className="h-[180px] w-full relative">
                                {/* Interactive Chart */}
                                <div className="w-full h-full rounded-md bg-gradient-to-b from-transparent to-blue-50 dark:to-blue-950/20 overflow-hidden">
                                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4">
                                        {Array.from({ length: 7 }).map((_, index) => {
                                            // Create varied heights for chart bars
                                            const height = 30 + Math.floor(Math.random() * 120);
                                            return (
                                                <div key={index} className="flex flex-col items-center">
                                                    <div
                                                        className={`w-8 bg-gradient-to-t from-blue-500 to-blue-400 dark:from-blue-600 dark:to-blue-500 rounded-t transition-all duration-500 hover:from-blue-600 hover:to-blue-500 cursor-pointer group relative`}
                                                        style={{ height: `${height}px` }}
                                                    >
                                                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                            {height > 100 ? 'High engagement' : height > 70 ? 'Medium engagement' : 'Low engagement'}
                                                        </div>
                                                    </div>
                                                    <div className="text-[9px] text-muted-foreground mt-1">
                                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">Session Attendance</p>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                                                        <Info className="h-3 w-3 text-muted-foreground" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    <p className="text-xs">Percentage of scheduled sessions attended</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <p className="text-lg font-semibold">82%</p>
                                    <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="h-4 px-1 text-[9px] bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                                            <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                                            5.2%
                                        </Badge>
                                        <span className="text-[9px] text-muted-foreground">vs last {30} days</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">No-show Rate</p>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                                                        <Info className="h-3 w-3 text-muted-foreground" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    <p className="text-xs">Percentage of scheduled sessions missed without cancellation</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <p className="text-lg font-semibold">7.3%</p>
                                    <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="h-4 px-1 text-[9px] bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
                                            <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                                            1.2%
                                        </Badge>
                                        <span className="text-[9px] text-muted-foreground">vs last {30} days</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">Active Clients</p>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                                                        <Info className="h-3 w-3 text-muted-foreground" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    <p className="text-xs">Percentage of clients with at least one session in the last 30 days</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <p className="text-lg font-semibold">
                                        {clients.filter(c => c.status === 'ACTIVE').length > 0 ?
                                            Math.round((clients.filter(c => c.status === 'ACTIVE').length / clients.length) * 100) : 0}%
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="h-4 px-1 text-[9px] bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
                                            <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                                            3.8%
                                        </Badge>
                                        <span className="text-[9px] text-muted-foreground">vs last {30} days</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">Retention Rate</p>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                                                        <Info className="h-3 w-3 text-muted-foreground" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    <p className="text-xs">Percentage of clients who remain active after their initial sessions</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <p className="text-lg font-semibold">93.1%</p>
                                    <div className="flex items-center gap-1">
                                        <Badge variant="outline" className="h-4 px-1 text-[9px] bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                                            <ArrowDown className="h-2.5 w-2.5 mr-0.5" />
                                            0.7%
                                        </Badge>
                                        <span className="text-[9px] text-muted-foreground">vs last {30} days</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Client Sessions */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm">Upcoming Sessions</CardTitle>
                                <div className="flex items-center">
                                    <Badge variant="outline" className="mr-2 text-xs h-5 px-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                                        Today: {clients.slice(0, 4).length}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="sm" variant="outline" className="h-7 w-7 p-0 rounded-full">
                                                <Calendar className="h-3.5 w-3.5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[200px]">
                                            <DropdownMenuLabel className="text-xs">View Schedule</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-xs cursor-pointer">
                                                <Calendar className="h-3.5 w-3.5 mr-2 text-blue-500" />
                                                Today's Sessions
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs cursor-pointer">
                                                <Calendar className="h-3.5 w-3.5 mr-2 text-purple-500" />
                                                This Week
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs cursor-pointer">
                                                <Calendar className="h-3.5 w-3.5 mr-2 text-green-500" />
                                                All Upcoming
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-xs cursor-pointer">
                                                <Plus className="h-3.5 w-3.5 mr-2 text-blue-500" />
                                                Add New Session
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="px-2 py-1">
                            <div className="space-y-1">
                                {/* Generate sessions dynamically from client data */}
                                {clients.slice(0, 4).map((client, index) => {
                                    // Generate random session times and counselors
                                    const times = ['09:00', '10:30', '13:15', '15:00', '16:30'];
                                    const counselors = ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Rebecca Lee', 'Dr. James Wilson'];
                                    const statuses = ['Confirmed', 'Pending', 'Confirmed', 'Confirmed'];
                                    const statusColors = [
                                        'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
                                        'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
                                        'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
                                        'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                                    ];

                                    return (
                                        <div key={client.id} className="flex items-center p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md transition-colors cursor-pointer group">
                                            <div className="flex-shrink-0 flex flex-col items-center justify-center mr-3">
                                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{times[index]}</span>
                                                <span className="text-[10px] text-muted-foreground">{index === 0 || index === 1 ? 'AM' : 'PM'}</span>
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-medium truncate">{client.name}{client.clientType === 'COMPANY' ? ` - ${['HR', 'Marketing', 'Executive', 'IT'][index % 4]} Team` : ''}</p>
                                                    <Badge variant="outline" className={`text-[9px] h-4 px-1 ${statusColors[index]} ml-1`}>
                                                        {statuses[index]}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center mt-0.5">
                                                    <User2 className="h-3 w-3 text-muted-foreground mr-1" />
                                                    <p className="text-[10px] text-muted-foreground truncate">{counselors[index]}</p>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full ml-2">
                                                        <MoreHorizontal className="h-3.5 w-3.5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                    <DropdownMenuItem className="text-xs cursor-pointer">
                                                        <Eye className="h-3.5 w-3.5 mr-2 text-blue-500" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-xs cursor-pointer">
                                                        <Edit className="h-3.5 w-3.5 mr-2 text-amber-500" />
                                                        Reschedule
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-xs cursor-pointer">
                                                        <MessageSquare className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                                                        Send Reminder
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-xs text-red-500 cursor-pointer">
                                                        <XCircle className="h-3.5 w-3.5 mr-2" />
                                                        Cancel Session
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="pt-2 mt-2 border-t flex items-center justify-between">
                                <Button variant="link" size="sm" className="text-[10px] h-auto p-0">
                                    View all sessions <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                                <Button variant="outline" size="sm" className="h-6 px-2 rounded-full text-[10px] gap-1">
                                    <Plus className="h-3 w-3" />
                                    <span>New Session</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Client Onboarding Progress */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm">Onboarding Progress</CardTitle>
                                <Button variant="outline" size="sm" className="h-7 px-2 rounded-full text-xs gap-1">
                                    <Plus className="h-3.5 w-3.5" />
                                    Add Client
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {/* Recently added clients with onboarding status */}
                                {clients.slice(0, 3).map((client, index) => {
                                    // Simulate different onboarding stages
                                    const stages = ['Profile Complete', 'Needs Setup', 'Session Scheduled'];
                                    const progress = [100, 35, 65];
                                    const colors = [
                                        'bg-green-500 dark:bg-green-500',
                                        'bg-amber-500 dark:bg-amber-500',
                                        'bg-blue-500 dark:bg-blue-500'
                                    ];

                                    return (
                                        <div key={client.id} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <div className="flex items-center">
                                                    <Avatar className="h-5 w-5 mr-2">
                                                        <AvatarFallback className={client.clientType === 'COMPANY' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}>
                                                            {client.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium truncate max-w-[120px]">{client.name}</span>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[9px] px-1 h-3.5 ${index === 0
                                                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                                                        : index === 1
                                                            ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                                                            : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                                                        }`}
                                                >
                                                    {stages[index]}
                                                </Badge>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${colors[index]} transition-all duration-500`}
                                                    style={{ width: `${progress[index]}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                                                <span>Added {index === 0 ? 'Today' : index === 1 ? 'Yesterday' : '3 days ago'}</span>
                                                <span>{progress[index]}% Complete</span>
                                            </div>
                                        </div>
                                    );
                                })}

                                <Separator className="my-1" />

                                {/* Client type distribution */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-medium">Client Distribution</span>
                                        <span className="text-[10px] text-muted-foreground">Last 30 days</span>
                                    </div>

                                    {/* Company clients */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[10px]">
                                            <div className="flex items-center">
                                                <div className="h-2.5 w-2.5 rounded-sm bg-blue-500 mr-1.5"></div>
                                                <span>Companies</span>
                                            </div>
                                            <span className="font-medium">{clients.filter(c => c.clientType === 'COMPANY').length}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 dark:bg-blue-500"
                                                style={{
                                                    width: `${Math.round((clients.filter(c => c.clientType === 'COMPANY').length / clients.length) * 100)}%`
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Individual clients */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[10px]">
                                            <div className="flex items-center">
                                                <div className="h-2.5 w-2.5 rounded-sm bg-purple-500 mr-1.5"></div>
                                                <span>Individuals</span>
                                            </div>
                                            <span className="font-medium">{clients.filter(c => c.clientType === 'INDIVIDUAL').length}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-purple-500 dark:bg-purple-500"
                                                style={{
                                                    width: `${Math.round((clients.filter(c => c.clientType === 'INDIVIDUAL').length / clients.length) * 100)}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 mt-1 border-t text-center">
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="text-[10px] h-auto p-0"
                                        onClick={() => setIsAddClientDialogOpen(true)}
                                    >
                                        View onboarding pipeline <ChevronRight className="h-3 w-3 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 