'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Send,
    Paperclip,
    Image as ImageIcon,
    Search,
    Filter,
    MoreVertical,
    Phone,
    Video,
    Star,
    Archive,
    Trash2,
    Check,
    Clock,
    Calendar,
    FileText,
    Download,
    Plus
} from 'lucide-react'
import { useTheme } from 'next-themes'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function MessagesPage() {
    const router = useRouter()
    const { user } = useAuth()
    const { theme } = useTheme()
    const [activeTab, setActiveTab] = useState('all')
    const [selectedConversation, setSelectedConversation] = useState(1)
    const [messageInput, setMessageInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [router, user])

    useEffect(() => {
        // Simulate typing indicator
        if (selectedConversation) {
            const timer = setTimeout(() => {
                setIsTyping(true)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [selectedConversation])

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            // In a real app, this would send the message to the server
            setMessageInput('')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (!user) {
        return null
    }

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border bg-background/50 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
                {/* Conversations List */}
                <div className="flex w-80 flex-col border-r">
                    <div className="border-b p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Messages</h2>
                                <p className="text-xs text-muted-foreground">Communicate with your counselor</p>
                            </div>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-b p-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search conversations..."
                                className="w-full pl-9"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="ml-2 h-8 w-8">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>All Messages</DropdownMenuItem>
                                <DropdownMenuItem>Unread Only</DropdownMenuItem>
                                <DropdownMenuItem>Archived</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Mark All as Read</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="w-full justify-start border-b px-2">
                            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                            <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                            <TabsTrigger value="archived" className="flex-1">Archived</TabsTrigger>
                        </TabsList>

                        <ScrollArea className="h-[calc(100vh-16rem)]">
                            <div className="space-y-1 p-2">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className={`group flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all hover:bg-accent hover:shadow-sm ${selectedConversation === i ? 'bg-accent shadow-sm' : ''
                                            }`}
                                        onClick={() => setSelectedConversation(i)}
                                    >
                                        <div className="relative">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={`https://avatar.vercel.sh/${i}.png`} />
                                                <AvatarFallback>JD</AvatarFallback>
                                            </Avatar>
                                            <Badge className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 p-0" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-medium">Dr. Sarah Johnson</h3>
                                                <span className="text-xs text-muted-foreground">2h ago</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    Hi! I've reviewed your latest session notes...
                                                </p>
                                                {i === 2 && (
                                                    <Badge variant="secondary" className="ml-2">2</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </Tabs>
                </div>

                {/* Chat Window */}
                <div className="flex flex-1 flex-col">
                    <div className="border-b p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://avatar.vercel.sh/1.png" />
                                    <AvatarFallback>SJ</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-lg font-semibold">Dr. Sarah Johnson</h2>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-muted-foreground">Online</p>
                                        {isTyping && (
                                            <span className="text-xs text-muted-foreground animate-pulse">typing...</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                                <Phone className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Start Voice Call</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                                <Video className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Start Video Call</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-9 w-9">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Star className="mr-2 h-4 w-4" />
                                            <span>Pin Conversation</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Archive className="mr-2 h-4 w-4" />
                                            <span>Archive</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete Conversation</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className="h-[calc(100vh-16rem)]">
                        <div className="space-y-4 p-4">
                            <div className="flex items-center justify-center">
                                <div className="rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground">
                                    Today
                                </div>
                            </div>

                            {[1, 2, 3].map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`group relative max-w-[80%] rounded-2xl p-4 ${i % 2 === 0
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                            }`}
                                    >
                                        <p className="text-sm">
                                            {i % 2 === 0
                                                ? 'Hi Dr. Johnson, I wanted to follow up on our last session.'
                                                : "Of course! I'm here to help. What would you like to discuss?"}
                                        </p>
                                        <div className="mt-1 flex items-center justify-between">
                                            <span className="text-xs opacity-70">
                                                {i % 2 === 0 ? '10:30 AM' : '10:32 AM'}
                                            </span>
                                            {i % 2 === 0 && (
                                                <span className="ml-2 text-xs opacity-70">
                                                    <Check className="h-3 w-3" />
                                                </span>
                                            )}
                                        </div>

                                        {i === 1 && (
                                            <div className="mt-3 rounded-lg border border-border/20 bg-background/50 p-3">
                                                <div className="flex items-start gap-3">
                                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-xs font-medium">Session Notes - May 15, 2023</p>
                                                        <p className="text-xs text-muted-foreground">PDF Document • 245 KB</p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex justify-end">
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                                                        <Download className="mr-1 h-3 w-3" />
                                                        Download
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="border-t p-4">
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10">
                                        <Paperclip className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem>
                                        <FileText className="mr-2 h-4 w-4" />
                                        <span>Document</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <ImageIcon className="mr-2 h-4 w-4" />
                                        <span>Image</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>Schedule</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Input
                                placeholder="Type your message..."
                                className="flex-1"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />

                            <Button size="icon" className="h-10 w-10" onClick={handleSendMessage}>
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
} 