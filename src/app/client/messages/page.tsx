'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Paperclip, Image as ImageIcon } from 'lucide-react'

export default function MessagesPage() {
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [router, user])

    if (!user) {
        return null
    }

    return (
        <DashboardLayout>
            <div className="grid h-[calc(100vh-7rem)] gap-6 lg:grid-cols-2">
                {/* Conversations List */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Messages</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4 overflow-auto">
                        {[1, 2, 3].map((_, i) => (
                            <div
                                key={i}
                                className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
                            >
                                <Avatar>
                                    <AvatarImage src={`https://avatar.vercel.sh/${i}.png`} />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium">Dr. Sarah Johnson</h3>
                                        <span className="text-sm text-gray-500">2h ago</span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Hi! I've reviewed your latest session notes...
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="flex flex-col">
                    <CardHeader className="border-b">
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src="https://avatar.vercel.sh/1.png" />
                                <AvatarFallback>SJ</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>Dr. Sarah Johnson</CardTitle>
                                <p className="text-sm text-gray-500">Online</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4 overflow-auto p-4">
                        {[1, 2, 3].map((_, i) => (
                            <div
                                key={i}
                                className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-4 ${i % 2 === 0
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    <p>
                                        {i % 2 === 0
                                            ? 'Hi Dr. Johnson, I wanted to follow up on our last session.'
                                            : 'Of course! I'm here to help. What would you like to discuss?'}
                                    </p>
                                    <span className="mt-1 block text-xs opacity-70">
                                        {i % 2 === 0 ? '10:30 AM' : '10:32 AM'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <div className="border-t p-4">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <ImageIcon className="h-5 w-5" />
                            </Button>
                            <Input
                                placeholder="Type your message..."
                                className="flex-1"
                            />
                            <Button size="icon">
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    )
} 