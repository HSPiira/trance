'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
    BookOpen,
    Search,
    Filter,
    MoreVertical,
    Plus,
    FileText,
    Video,
    Headphones,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Edit,
    Trash2
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

// Mock data for resources
const resources = [
    {
        id: '1',
        title: 'Understanding Anxiety',
        description: 'A comprehensive guide to understanding and managing anxiety.',
        type: 'ARTICLE',
        status: 'PUBLISHED',
        author: {
            name: 'Dr. Michael Chen',
            avatar: 'https://avatar.vercel.sh/3.png'
        },
        publishDate: '2023-06-01',
        views: 1250,
        likes: 45,
        comments: 12
    },
    {
        id: '2',
        title: 'Mindfulness Meditation',
        description: 'Learn the basics of mindfulness meditation in this video guide.',
        type: 'VIDEO',
        status: 'PUBLISHED',
        author: {
            name: 'Dr. Sarah Wilson',
            avatar: 'https://avatar.vercel.sh/4.png'
        },
        publishDate: '2023-06-05',
        views: 980,
        likes: 32,
        comments: 8
    },
    {
        id: '3',
        title: 'Stress Management Techniques',
        description: 'Audio guide for effective stress management techniques.',
        type: 'AUDIO',
        status: 'DRAFT',
        author: {
            name: 'Dr. Michael Chen',
            avatar: 'https://avatar.vercel.sh/3.png'
        },
        publishDate: '2023-06-10',
        views: 0,
        likes: 0,
        comments: 0
    },
    {
        id: '4',
        title: 'Depression Recovery',
        description: 'A detailed article about depression recovery and treatment options.',
        type: 'ARTICLE',
        status: 'PUBLISHED',
        author: {
            name: 'Dr. Sarah Wilson',
            avatar: 'https://avatar.vercel.sh/4.png'
        },
        publishDate: '2023-06-15',
        views: 2100,
        likes: 78,
        comments: 25
    },
    {
        id: '5',
        title: 'Sleep Hygiene Tips',
        description: 'Video guide for improving sleep hygiene and quality.',
        type: 'VIDEO',
        status: 'REVIEW',
        author: {
            name: 'Dr. Michael Chen',
            avatar: 'https://avatar.vercel.sh/3.png'
        },
        publishDate: '2023-06-20',
        views: 0,
        likes: 0,
        comments: 0
    }
]

export default function AdminResourcesPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState('ALL')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false)

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/unauthorized')
        }
    }, [router, user])

    const filteredResources = resources.filter(resource => {
        const matchesSearch =
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesType = typeFilter === 'ALL' || resource.type === typeFilter
        const matchesStatus = statusFilter === 'ALL' || resource.status === statusFilter

        return matchesSearch && matchesType && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return <Badge variant="default">Published</Badge>
            case 'DRAFT':
                return <Badge variant="secondary">Draft</Badge>
            case 'REVIEW':
                return <Badge variant="outline">Under Review</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'ARTICLE':
                return <Badge variant="outline">Article</Badge>
            case 'VIDEO':
                return <Badge variant="secondary">Video</Badge>
            case 'AUDIO':
                return <Badge variant="default">Audio</Badge>
            default:
                return <Badge variant="outline">{type}</Badge>
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'ARTICLE':
                return <FileText className="h-4 w-4" />
            case 'VIDEO':
                return <Video className="h-4 w-4" />
            case 'AUDIO':
                return <Headphones className="h-4 w-4" />
            default:
                return <FileText className="h-4 w-4" />
        }
    }

    if (!user) {
        return null
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
                    <p className="text-muted-foreground">
                        Manage and publish resources for clients and counsellors
                    </p>
                </div>
                <Dialog open={isAddResourceDialogOpen} onOpenChange={setIsAddResourceDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Resource
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Resource</DialogTitle>
                            <DialogDescription>
                                Create a new resource with specific type and content.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Resource title"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Resource description"
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">
                                    Type
                                </Label>
                                <Select>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ARTICLE">Article</SelectItem>
                                        <SelectItem value="VIDEO">Video</SelectItem>
                                        <SelectItem value="AUDIO">Audio</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                    Status
                                </Label>
                                <Select>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                        <SelectItem value="REVIEW">Under Review</SelectItem>
                                        <SelectItem value="PUBLISHED">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddResourceDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Create Resource</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Resource Management</CardTitle>
                    <CardDescription>
                        View and manage all resources in the system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search resources..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Types</SelectItem>
                                    <SelectItem value="ARTICLE">Articles</SelectItem>
                                    <SelectItem value="VIDEO">Videos</SelectItem>
                                    <SelectItem value="AUDIO">Audio</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Statuses</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="REVIEW">Under Review</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Resource</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Publish Date</TableHead>
                                    <TableHead>Engagement</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredResources.map((resource) => (
                                    <TableRow key={resource.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <div className="font-medium">{resource.title}</div>
                                                <div className="text-sm text-muted-foreground line-clamp-1">
                                                    {resource.description}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(resource.type)}
                                                {getTypeBadge(resource.type)}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(resource.status)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={resource.author.avatar} />
                                                    <AvatarFallback>
                                                        {resource.author.name.split(' ').map((n) => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">{resource.author.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{resource.publishDate}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span>{resource.views} views</span>
                                                <span>{resource.likes} likes</span>
                                                <span>{resource.comments} comments</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                        Publish
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <AlertCircle className="mr-2 h-4 w-4" />
                                                        Review
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
                </CardContent>
            </Card>
        </div>
    )
} 