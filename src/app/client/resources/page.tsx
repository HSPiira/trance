'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
    Search,
    BookOpen,
    FileText,
    Video,
    Headphones,
    Download,
    ExternalLink,
    Bookmark,
    Share2,
    Filter,
    ChevronDown,
    Star,
    Clock,
    ThumbsUp,
    MessageSquare,
    MoreVertical,
    Eye,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { useTheme } from 'next-themes'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuGroup
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { DataPagination } from '@/components/ui/data-pagination'

// Mock data for resources
const resources = [
    {
        id: 1,
        title: 'Understanding Anxiety',
        description: 'A comprehensive guide to understanding anxiety, its causes, and coping mechanisms.',
        category: 'articles',
        type: 'article',
        author: 'Dr. Sarah Johnson',
        authorAvatar: 'https://avatar.vercel.sh/1.png',
        date: 'May 15, 2023',
        readTime: '8 min read',
        tags: ['anxiety', 'mental health', 'coping'],
        likes: 124,
        comments: 18,
        bookmarked: true,
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        views: 1250
    },
    {
        id: 2,
        title: 'Mindfulness Meditation Techniques',
        description: 'Learn effective mindfulness meditation techniques to reduce stress and improve focus.',
        category: 'videos',
        type: 'video',
        author: 'Dr. Michael Chen',
        authorAvatar: 'https://avatar.vercel.sh/2.png',
        date: 'April 28, 2023',
        duration: '15:32',
        tags: ['meditation', 'mindfulness', 'stress'],
        likes: 89,
        comments: 12,
        bookmarked: false,
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        views: 980
    },
    {
        id: 3,
        title: 'Sleep Hygiene Guide',
        description: 'Improve your sleep quality with these evidence-based sleep hygiene practices.',
        category: 'articles',
        type: 'article',
        author: 'Dr. Emily Rodriguez',
        authorAvatar: 'https://avatar.vercel.sh/3.png',
        date: 'April 10, 2023',
        readTime: '6 min read',
        tags: ['sleep', 'health', 'wellness'],
        likes: 156,
        comments: 23,
        bookmarked: true,
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        views: 1450
    },
    {
        id: 4,
        title: 'Managing Depression',
        description: 'A comprehensive guide to understanding and managing depression symptoms.',
        category: 'articles',
        type: 'article',
        author: 'Dr. Sarah Johnson',
        authorAvatar: 'https://avatar.vercel.sh/1.png',
        date: 'March 22, 2023',
        readTime: '10 min read',
        tags: ['depression', 'mental health', 'treatment'],
        likes: 98,
        comments: 15,
        bookmarked: false,
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        views: 1100
    },
    {
        id: 5,
        title: 'Stress Management Podcast',
        description: 'Listen to our expert panel discuss effective stress management techniques.',
        category: 'audio',
        type: 'audio',
        author: 'Dr. Michael Chen',
        authorAvatar: 'https://avatar.vercel.sh/2.png',
        date: 'March 15, 2023',
        duration: '32:15',
        tags: ['stress', 'podcast', 'management'],
        likes: 67,
        comments: 9,
        bookmarked: false,
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        views: 750
    },
    {
        id: 6,
        title: 'Coping with Grief',
        description: 'Strategies for navigating the grieving process and finding support.',
        category: 'articles',
        type: 'article',
        author: 'Dr. Emily Rodriguez',
        authorAvatar: 'https://avatar.vercel.sh/3.png',
        date: 'March 5, 2023',
        readTime: '7 min read',
        tags: ['grief', 'loss', 'coping'],
        likes: 112,
        comments: 17,
        bookmarked: true,
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        views: 920
    }
]

// Add more mock resources to test pagination
for (let i = 7; i <= 30; i++) {
    resources.push({
        id: i,
        title: `Resource ${i}`,
        description: `This is a sample resource description for resource ${i}.`,
        category: i % 3 === 0 ? 'articles' : i % 3 === 1 ? 'videos' : 'audio',
        type: i % 3 === 0 ? 'article' : i % 3 === 1 ? 'video' : 'audio',
        author: `Author ${i % 5 + 1}`,
        authorAvatar: `https://avatar.vercel.sh/${i % 5 + 1}.png`,
        date: new Date(Date.now() - i * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: i % 3 === 0 ? `${i % 5 + 3} min read` : undefined,
        duration: i % 3 !== 0 ? `${i % 10 + 5}:${i % 60 < 10 ? '0' + (i % 60) : i % 60}` : undefined,
        tags: ['sample', 'test', `tag${i % 5 + 1}`],
        likes: i * 5,
        comments: i * 2,
        bookmarked: i % 4 === 0,
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        views: i * 10
    })
}

export default function ClientResourcesPage() {
    const router = useRouter()
    const { user } = useAuth()
    const { theme } = useTheme()
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredResources, setFilteredResources] = useState(resources)
    const [sortBy, setSortBy] = useState('recent')
    const [currentPage, setCurrentPage] = useState(1)
    const resourcesPerPage = 9

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [router, user])

    useEffect(() => {
        // Filter resources based on search query and active category
        let filtered = resources

        // Filter by category
        if (activeCategory !== 'all') {
            filtered = filtered.filter(resource => resource.category === activeCategory)
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                resource =>
                    resource.title.toLowerCase().includes(query) ||
                    resource.description.toLowerCase().includes(query) ||
                    resource.tags.some(tag => tag.toLowerCase().includes(query))
            )
        }

        // Sort resources
        if (sortBy === 'recent') {
            filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        } else if (sortBy === 'popular') {
            filtered.sort((a, b) => b.views - a.views)
        } else if (sortBy === 'likes') {
            filtered.sort((a, b) => b.likes - a.likes)
        }

        setFilteredResources(filtered)
        // Reset to first page when filters change
        setCurrentPage(1)
    }, [activeCategory, searchQuery, sortBy])

    const handleBookmark = (id: number) => {
        setFilteredResources(
            filteredResources.map(resource =>
                resource.id === id ? { ...resource, bookmarked: !resource.bookmarked } : resource
            )
        )
    }

    // Calculate pagination
    const totalPages = Math.ceil(filteredResources.length / resourcesPerPage)
    const startIndex = (currentPage - 1) * resourcesPerPage
    const endIndex = startIndex + resourcesPerPage
    const currentResources = filteredResources.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        // Scroll to top of resources
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!user) {
        return null
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
                    <p className="text-muted-foreground">
                        Access helpful resources to support your mental health journey
                    </p>
                </div>

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search resources..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Filter className="h-4 w-4" />
                                    Sort by
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSortBy('recent')}>
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span>Most Recent</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('popular')}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>Most Viewed</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('likes')}>
                                    <ThumbsUp className="mr-2 h-4 w-4" />
                                    <span>Most Liked</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
                    <TabsList className="w-full justify-start">
                        <TabsTrigger value="all" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>All</span>
                        </TabsTrigger>
                        <TabsTrigger value="articles" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Articles</span>
                        </TabsTrigger>
                        <TabsTrigger value="videos" className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            <span>Videos</span>
                        </TabsTrigger>
                        <TabsTrigger value="audio" className="flex items-center gap-2">
                            <Headphones className="h-4 w-4" />
                            <span>Audio</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-6">
                        <div className="space-y-4">
                            {currentResources.map((resource) => (
                                <ClientResourceListItem
                                    key={resource.id}
                                    resource={resource}
                                    onBookmark={handleBookmark}
                                />
                            ))}
                        </div>
                        <DataPagination
                            totalItems={filteredResources.length}
                            itemsPerPage={resourcesPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </TabsContent>

                    <TabsContent value="articles" className="mt-6">
                        <div className="space-y-4">
                            {currentResources
                                .filter(resource => resource.category === 'articles')
                                .map((resource) => (
                                    <ClientResourceListItem
                                        key={resource.id}
                                        resource={resource}
                                        onBookmark={handleBookmark}
                                    />
                                ))}
                        </div>
                        <DataPagination
                            totalItems={filteredResources.filter(r => r.category === 'articles').length}
                            itemsPerPage={resourcesPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </TabsContent>

                    <TabsContent value="videos" className="mt-6">
                        <div className="space-y-4">
                            {currentResources
                                .filter(resource => resource.category === 'videos')
                                .map((resource) => (
                                    <ClientResourceListItem
                                        key={resource.id}
                                        resource={resource}
                                        onBookmark={handleBookmark}
                                    />
                                ))}
                        </div>
                        <DataPagination
                            totalItems={filteredResources.filter(r => r.category === 'videos').length}
                            itemsPerPage={resourcesPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </TabsContent>

                    <TabsContent value="audio" className="mt-6">
                        <div className="space-y-4">
                            {currentResources
                                .filter(resource => resource.category === 'audio')
                                .map((resource) => (
                                    <ClientResourceListItem
                                        key={resource.id}
                                        resource={resource}
                                        onBookmark={handleBookmark}
                                    />
                                ))}
                        </div>
                        <DataPagination
                            totalItems={filteredResources.filter(r => r.category === 'audio').length}
                            itemsPerPage={resourcesPerPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}

interface ClientResourceCardProps {
    resource: {
        id: number
        title: string
        description: string
        category: string
        type: string
        author: string
        authorAvatar: string
        date: string
        readTime?: string
        duration?: string
        tags: string[]
        likes: number
        comments: number
        bookmarked: boolean
        url: string
        thumbnail: string
        views: number
    }
    onBookmark: (id: number) => void
}

function ClientResourceCard({ resource, onBookmark }: ClientResourceCardProps) {
    return (
        <Card className="overflow-hidden">
            <div className="relative h-48 w-full">
                <img
                    src={resource.thumbnail}
                    alt={resource.title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute right-2 top-2 flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm ${resource.bookmarked ? 'text-primary' : 'text-muted-foreground'
                            }`}
                        onClick={() => onBookmark(resource.id)}
                    >
                        <Bookmark className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                <span>Open</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Share2 className="mr-2 h-4 w-4" />
                                <span>Share</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {resource.type === 'video' && (
                    <div className="absolute bottom-2 right-2 rounded bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
                        {resource.duration}
                    </div>
                )}
                {resource.type === 'audio' && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-background/80 px-2 py-1 text-xs backdrop-blur-sm">
                        <Headphones className="h-3 w-3" />
                        {resource.duration}
                    </div>
                )}
            </div>
            <CardHeader className="space-y-1 p-4">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                        {resource.category}
                    </Badge>
                    {resource.readTime && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {resource.readTime}
                        </div>
                    )}
                </div>
                <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-1">
                    {resource.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={resource.authorAvatar} />
                        <AvatarFallback>{resource.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{resource.author}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {resource.views}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        {resource.likes}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        {resource.comments}
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

function ClientResourceListItem({ resource, onBookmark }: ClientResourceCardProps) {
    return (
        <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
                <div className="relative h-32 w-full md:w-36">
                    <img
                        src={resource.thumbnail}
                        alt={resource.title}
                        className="h-full w-full object-cover"
                    />
                    {resource.type === 'video' && (
                        <div className="absolute bottom-1 right-1 rounded bg-background/80 px-1.5 py-0.5 text-xs backdrop-blur-sm">
                            {resource.duration}
                        </div>
                    )}
                    {resource.type === 'audio' && (
                        <div className="absolute bottom-1 right-1 flex items-center gap-1 rounded bg-background/80 px-1.5 py-0.5 text-xs backdrop-blur-sm">
                            <Headphones className="h-3 w-3" />
                            {resource.duration}
                        </div>
                    )}
                </div>
                <div className="flex flex-1 flex-col">
                    <CardHeader className="space-y-1 p-2">
                        <div className="flex items-center gap-1">
                            <Badge variant="outline" className="capitalize text-xs">
                                {resource.category}
                            </Badge>
                            {resource.readTime && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {resource.readTime}
                                </div>
                            )}
                        </div>
                        <CardTitle className="line-clamp-1 text-base">{resource.title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-xs">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 pt-0">
                        <div className="flex flex-wrap gap-1">
                            {resource.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                    <Separator />
                    <CardFooter className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-1">
                            <Avatar className="h-5 w-5">
                                <AvatarImage src={resource.authorAvatar} />
                                <AvatarFallback>{resource.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{resource.author}</span>
                            <span className="text-xs text-muted-foreground">{resource.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-6 w-6 ${resource.bookmarked ? 'text-primary' : 'text-muted-foreground'}`}
                                onClick={() => onBookmark(resource.id)}
                            >
                                <Bookmark className="h-3 w-3" />
                            </Button>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                {resource.views}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <ThumbsUp className="h-3 w-3" />
                                {resource.likes}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MessageSquare className="h-3 w-3" />
                                {resource.comments}
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                    >
                                        <MoreVertical className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Download className="mr-2 h-4 w-4" />
                                        <span>Download</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        <span>Open</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Share2 className="mr-2 h-4 w-4" />
                                        <span>Share</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardFooter>
                </div>
            </div>
        </Card>
    )
} 