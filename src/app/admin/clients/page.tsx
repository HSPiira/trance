'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
    Search,
    Filter,
    MoreVertical,
    UserCircle,
    Phone,
    Calendar,
    CheckCircle2,
    XCircle,
    AlertCircle,
    UserPlus,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit,
    Trash2,
    MessageSquare,
    FileText,
    Building2,
    Users,
    User,
    ChevronDown,
    Download,
    Plus,
    Activity,
    Loader2,
    Upload,
    ClipboardCheck,
    UploadCloud,
    CheckCircle,
    AlertTriangle,
    FileSpreadsheet,
    FileUp,
    Info,
    RefreshCw,
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

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/unauthorized')
        }
    }, [router, user])

    const filteredClients = clients.filter(client => {
        const matchesSearch =
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = statusFilter === 'ALL' || client.status === statusFilter

        const matchesClientType = clientTypeFilter === 'ALL' || client.clientType === clientTypeFilter

        return matchesSearch && matchesStatus && matchesClientType
    })

    // Pagination
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage)
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

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
        if (!csvFile && !csvRecords.length) {
            toast({
                title: "No data to import",
                description: "Please upload or paste client data",
                variant: "destructive"
            });
            return;
        }

        // Check all records for missing required fields
        let requiredFieldsErrors = 0;
        let dataTypeErrors = 0;
        let otherErrors = 0;

        // Collect detailed errors
        const recordErrors: { row: number, errors: string[] }[] = [];

        csvRecords.forEach((record, index) => {
            const errors: string[] = [];

            // Check record type
            if (!record.recordType) {
                errors.push('Missing recordType');
                requiredFieldsErrors++;
            } else if (!['CLIENT', 'BENEFICIARY', 'DEPENDANT'].includes(record.recordType)) {
                errors.push(`Invalid recordType "${record.recordType}"`);
                requiredFieldsErrors++;
            } else {
                // Check required fields based on record type
                const requiredForType = requiredFields[record.recordType] || [];
                requiredForType.forEach(field => {
                    if (!record[field as keyof ImportRecord]) {
                        errors.push(`Missing required field "${field}" for ${record.recordType}`);
                        requiredFieldsErrors++;
                    }
                });
            }

            // Validate data types
            Object.entries(record).forEach(([key, value]) => {
                if (value && columnDataTypes[key]) {
                    const type = columnDataTypes[key];
                    const isValid = validateDataType(value, type);
                    if (!isValid) {
                        errors.push(`Invalid data type for "${key}": expected ${type}, got "${value}"`);
                        dataTypeErrors++;
                    }
                }
            });

            if (errors.length > 0) {
                recordErrors.push({ row: index + 2, errors });
            }
        });

        const totalErrors = requiredFieldsErrors + dataTypeErrors + otherErrors;

        // Prevent import if any required fields are missing
        if (requiredFieldsErrors > 0) {
            toast({
                title: "Cannot import with missing required fields",
                description: `${requiredFieldsErrors} required field errors found. Please fix them before importing.`,
                variant: "destructive"
            });

            // Log detailed errors for debugging
            console.error('Import validation errors:', recordErrors);
            return;
        }

        // Warn about data type errors but allow import to proceed
        if (dataTypeErrors > 0) {
            const shouldProceed = window.confirm(
                `${dataTypeErrors} data type errors found. These may cause issues with the imported data. Do you want to proceed anyway?`
            );

            if (!shouldProceed) {
                return;
            }
        }

        setIsImporting(true);
        setImportProgress(0);

        try {
            // First pass: Validate the data and collect all reference IDs
            const referenceIds = new Set<string>();
            const validationErrors: string[] = [];

            csvRecords.forEach((record, index) => {
                // Store reference IDs
                if (record.referenceId) {
                    if (referenceIds.has(record.referenceId)) {
                        validationErrors.push(`Duplicate referenceId '${record.referenceId}' at row ${index + 2}`);
                        otherErrors++;
                    } else {
                        referenceIds.add(record.referenceId);
                    }
                } else {
                    validationErrors.push(`Missing referenceId at row ${index + 2}`);
                    requiredFieldsErrors++;
                }
            });

            // Second pass: Validate relationToIds exist
            csvRecords.forEach((record, index) => {
                if (record.relationToId && !referenceIds.has(record.relationToId)) {
                    validationErrors.push(`Invalid relationToId '${record.relationToId}' at row ${index + 2} - referenced ID not found`);
                    otherErrors++;
                }
            });

            // If validation errors exist, show them and abort
            if (validationErrors.length > 0) {
                const errorMsg = validationErrors.length > 3
                    ? `${validationErrors.slice(0, 3).join('\n')}\n... and ${validationErrors.length - 3} more errors`
                    : validationErrors.join('\n');

                toast({
                    title: `${validationErrors.length} validation errors`,
                    description: errorMsg,
                    variant: "destructive"
                });

                setIsImporting(false);
                return;
            }

            // Third pass: Build hierarchical data structure
            const clientsMap = new Map();
            const beneficiariesMap = new Map();

            // Process in order: clients, beneficiaries, dependants
            // First, create all clients
            csvRecords.filter(r => r.recordType === 'CLIENT').forEach(record => {
                clientsMap.set(record.referenceId, {
                    id: record.clientId || generateId(),
                    name: record.name,
                    email: record.email || '',
                    phone: record.phone || '',
                    status: record.status || 'ACTIVE',
                    joinDate: record.joinDate || new Date().toISOString().split('T')[0],
                    lastActive: record.lastActive || new Date().toISOString().split('T')[0],
                    clientType: record.clientType || 'INDIVIDUAL',
                    counsellor: record.counsellor || '',
                    notes: record.notes || '',
                    beneficiaries: [],
                    dependants: [],
                    avatar: '',
                    appointments: 0,
                    messages: 0,
                    resources: 0
                });
            });

            // Next, create and link beneficiaries
            csvRecords.filter(r => r.recordType === 'BENEFICIARY').forEach(record => {
                const clientRef = record.clientId;
                const client = clientsMap.get(clientRef);

                if (client && client.clientType === 'COMPANY') {
                    const beneficiary = {
                        id: generateId(),
                        name: record.name,
                        email: record.email || '',
                        department: record.department || '',
                        role: record.role || '',
                        status: record.status || 'ACTIVE',
                        dependants: []
                    };

                    beneficiariesMap.set(record.referenceId, beneficiary);
                    client.beneficiaries.push(beneficiary);
                }
            });

            // Finally, process dependants
            csvRecords.filter(r => r.recordType === 'DEPENDANT').forEach(record => {
                const dependant = {
                    id: generateId(),
                    name: record.name,
                    relation: record.relation || '',
                    status: record.status || 'ACTIVE'
                };

                // Find where this dependant belongs - to a client or beneficiary
                const client = clientsMap.get(record.clientId);

                if (!client) return;

                if (client.clientType === 'INDIVIDUAL' && record.relationToId === record.clientId) {
                    // This is a dependant of an individual client
                    client.dependants.push(dependant);
                } else {
                    // This might be a dependant of a beneficiary
                    const beneficiary = beneficiariesMap.get(record.relationToId);
                    if (beneficiary) {
                        beneficiary.dependants.push(dependant);
                    }
                }
            });

            // Convert to array of clients to import
            const clientsToImport = Array.from(clientsMap.values());

            // Simulate API call with progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 5;
                setImportProgress(Math.min(progress, 95)); // Cap at 95% until completion

                if (progress >= 95) {
                    clearInterval(progressInterval);
                }
            }, 200);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Clients to import:', clientsToImport);

            // In a real app, you would send clientsToImport to your API
            // For now, we'll just simulate success

            setImportProgress(100);
            clearInterval(progressInterval);

            setImportComplete(true);
            setImportResults({
                total: clientsToImport.length +
                    clientsToImport.reduce((sum, c) => sum + c.beneficiaries.length, 0) +
                    clientsToImport.reduce((sum, c) => {
                        const individualDeps = c.dependants.length;
                        const beneficiaryDeps = c.beneficiaries.reduce((s: number, b: any) => s + b.dependants.length, 0);
                        return sum + individualDeps + beneficiaryDeps;
                    }, 0),
                success: clientsToImport.length +
                    clientsToImport.reduce((sum, c) => sum + c.beneficiaries.length, 0) +
                    clientsToImport.reduce((sum, c) => {
                        const individualDeps = c.dependants.length;
                        const beneficiaryDeps = c.beneficiaries.reduce((s: number, b: any) => s + b.dependants.length, 0);
                        return sum + individualDeps + beneficiaryDeps;
                    }, 0),
                errors: 0
            });

        } catch (error) {
            console.error('Error importing clients:', error);
            toast({
                title: "Import failed",
                description: "An unexpected error occurred during import",
                variant: "destructive"
            });
            setImportProgress(0);
        }

        setIsImporting(false);
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
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9"
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
                                    className="h-9 w-9"
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
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3"
                            onClick={downloadTemplate}
                        >
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            Download Template
                        </Button>
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
                                                            {previewData.map((row, rowIndex) => (
                                                                <TableRow
                                                                    key={rowIndex}
                                                                    className={rowErrors[rowIndex]
                                                                        ? "bg-red-50 dark:bg-red-900/20 hover:bg-red-100/70 dark:hover:bg-red-900/30"
                                                                        : (rowIndex % 2 === 0 ? "bg-white dark:bg-transparent" : "bg-gray-50/50 dark:bg-gray-900/20")}
                                                                >
                                                                    {headerRow.map((header, cellIndex) => {
                                                                        // Check if this cell has an error
                                                                        const errorInCell = rowErrors[rowIndex]?.some(err =>
                                                                            err.includes(`"${header}"`) ||
                                                                            (header === 'recordType' && err.includes('recordType'))
                                                                        );

                                                                        // For type checking
                                                                        const recordType = row['recordType'];
                                                                        const requiredForThisType = recordType && requiredFields[recordType] ?
                                                                            requiredFields[recordType] : [];
                                                                        const isRequired = requiredForThisType.includes(header);
                                                                        const isEmpty = !row[header];

                                                                        return (
                                                                            <TableCell
                                                                                key={cellIndex}
                                                                                className={`py-1 px-2 text-xs whitespace-nowrap ${errorInCell ? "text-red-600 dark:text-red-400 font-medium" : ""
                                                                                    } ${isRequired && isEmpty ? "bg-red-100 dark:bg-red-900/30" : ""
                                                                                    }`}
                                                                            >
                                                                                {row[header]}
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
                                                            {previewData.map((row, rowIndex) => (
                                                                <TableRow key={rowIndex}>
                                                                    {headerRow.map((header, cellIndex) => (
                                                                        <TableCell key={cellIndex} className="py-1 px-2 text-xs whitespace-nowrap">
                                                                            {row[header]}
                                                                        </TableCell>
                                                                    ))}
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
                                                <CheckCircle className="h-5 w-5 text-green-500" />
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
                                        <CheckCircle className="h-16 w-16 text-green-500" />
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

            {/* Main Content Area */}
            <Card>
                <CardHeader>
                    <CardTitle>Client Management</CardTitle>
                    <CardDescription>
                        View and manage all client accounts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search clients..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-8"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px] h-8">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
                                <SelectTrigger className="w-[150px] h-8">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Types</SelectItem>
                                    <SelectItem value="COMPANY">Companies</SelectItem>
                                    <SelectItem value="INDIVIDUAL">Individuals</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[240px] py-2 px-3">Name</TableHead>
                                        <TableHead className="w-[60px] py-2 px-3 text-center">Type</TableHead>
                                        <TableHead className="w-[200px] py-2 px-3">Email</TableHead>
                                        <TableHead className="w-[90px] py-2 px-3 text-center">Sessions</TableHead>
                                        <TableHead className="w-[100px] py-2 px-3 text-center">Beneficiaries</TableHead>
                                        <TableHead className="w-[60px] py-2 px-3 text-center">Status</TableHead>
                                        <TableHead className="w-[60px] py-2 px-3">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedClients.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell className="py-1.5 px-3">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={client.avatar} />
                                                        <AvatarFallback className="text-[10px]">
                                                            {client.name.split(' ').map((n: string) => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm whitespace-nowrap">{client.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-1.5 px-3 text-center">
                                                {getClientTypeIcon(client.clientType)}
                                            </TableCell>
                                            <TableCell className="py-1.5 px-3">
                                                <span className="text-sm whitespace-nowrap">{client.email}</span>
                                            </TableCell>
                                            <TableCell className="py-1.5 px-3 text-center">
                                                <span className="text-xs font-normal">{client.appointments}</span>
                                            </TableCell>
                                            <TableCell className="py-1.5 px-3 text-center">
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
                                            <TableCell className="py-1.5 px-3 text-center">
                                                {getStatusIcon(client.status)}
                                            </TableCell>
                                            <TableCell className="py-1.5 px-3">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-7 w-7 p-0">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => router.push(`/admin/clients/${client.id}`)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <MessageSquare className="mr-2 h-4 w-4" />
                                                            Message
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <FileText className="mr-2 h-4 w-4" />
                                                            Notes
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-between mt-4 text-sm">
                            <div className="text-muted-foreground">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} clients
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0"
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
                                            className="h-7 w-7 p-0"
                                            onClick={() => handlePageChange(pageNumber)}
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                })}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                                <SelectTrigger className="w-[110px] h-7">
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
                    </div>
                </CardContent>
            </Card>
        </div >
    );
} 