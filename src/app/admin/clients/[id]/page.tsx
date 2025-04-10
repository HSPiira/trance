// This is a Server Component
import { notFound } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Mail, Phone, Building2, User, Clock, MessageSquare, FileText, Users, ArrowLeft, BarChart } from "lucide-react"
import Link from "next/link"
import { prisma } from '@/lib/db'

async function getClient(id: string) {
    const client = await prisma.client.findUnique({
        where: { id },
        include: {
            company: true,
            documents: true,
            messages: true,
            notes: true,
            sessions: true,
        },
    });

    if (!client) {
        return null;
    }

    return client;
}

export default async function ClientPage({ params }: { params: { id: string } }) {
    const client = await getClient(params.id);

    // If client not found, return 404
    if (!client) {
        notFound()
    }

    // Format date to readable string
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    // Calculate days since last active
    const getDaysSinceActive = (date: Date) => {
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-background to-primary/5 border-b">
                <div className="container mx-auto py-8">
                    {/* Back button */}
                    <Link href="/admin/clients" className="inline-flex mb-6">
                        <Button variant="ghost" size="sm" className="group">
                            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            Back to Clients
                        </Button>
                    </Link>

                    {/* Client Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold tracking-tight">{client.name}</h1>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <span>Client since {formatDate(client.joinDate)}</span>
                                <span>•</span>
                                <span>ID: {client.id.slice(0, 8)}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" className="shadow-sm">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send Message
                            </Button>
                            <Button className="shadow-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                                <CalendarDays className="mr-2 h-4 w-4" />
                                Schedule Session
                            </Button>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-2 mt-6">
                        <Badge variant={client.status === 'ACTIVE' ? 'default' : 'secondary'}
                            className={client.status === 'ACTIVE' ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : ''}>
                            {client.status}
                        </Badge>
                        <Badge variant="outline" className="border-primary/20 bg-primary/5">
                            {client.clientType}
                        </Badge>
                        {getDaysSinceActive(client.lastActive) <= 7 && (
                            <Badge variant="outline" className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 border-green-200">
                                Recently Active
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto py-8">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="company">Company</TabsTrigger>
                        <TabsTrigger value="sessions">Sessions</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/10">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{client.sessions.length}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Last session {client.sessions.length > 0 && client.sessions.at(-1)?.date ?
                                            formatDate(client.sessions.at(-1)!.date) : 'Never'}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/10">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Messages</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{client.messages.length}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {client.messages.length > 0 && client.messages.at(-1)?.sentAt ?
                                            `Last message ${formatDate(client.messages.at(-1)!.sentAt)}` : 'No messages'}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-purple-500/10">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Documents</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{client.documents.length}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {client.documents.length > 0 && client.documents.at(-1)?.uploadedAt ?
                                            `Last upload ${formatDate(client.documents.at(-1)!.uploadedAt)}` : 'No documents'}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/10">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Resources Used</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{client.resources}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Total resources accessed</p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Client Info Card */}
                            <Card className="bg-card/50 backdrop-blur-sm overflow-hidden border-primary/10 hover:border-primary/20 transition-all duration-300">
                                <div className="h-1 bg-gradient-to-r from-primary/80 to-primary/40" />
                                <CardHeader className="py-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <User className="h-4 w-4 text-primary" />
                                        Client Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="grid gap-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4 text-blue-500" />
                                            <span className="text-foreground">{client.email || 'No email provided'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-4 w-4 text-green-500" />
                                            <span className="text-foreground">{client.phone || 'No phone provided'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Building2 className="h-4 w-4 text-purple-500" />
                                            <span className="text-foreground">{client.clientType === 'COMPANY' ? 'Company Client' : 'Individual Client'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <User className="h-4 w-4 text-amber-500" />
                                            <span className="text-foreground">{client.counsellor || 'No counselor assigned'}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Activity Card */}
                            <Card className="bg-card/50 backdrop-blur-sm overflow-hidden border-blue-500/10 hover:border-blue-500/20 transition-all duration-300">
                                <div className="h-1 bg-gradient-to-r from-blue-500/80 to-blue-500/40" />
                                <CardHeader className="py-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <BarChart className="h-4 w-4 text-blue-500" />
                                        Activity Timeline
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative pl-6 space-y-6 text-sm">
                                        <div className="relative flex items-start group">
                                            {/* Line segment */}
                                            <div className="absolute left-[3px] top-3 h-[calc(100%+1.5rem)] w-px bg-blue-500/20 group-last:hidden" />
                                            {/* Circle */}
                                            <div className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full bg-cyan-500 ring-4 ring-cyan-500/10 z-10" />
                                            <div className="pl-6">
                                                <span className="block text-sm font-medium text-muted-foreground">Last Active</span>
                                                <span className="block mt-1">{formatDate(client.lastActive)}</span>
                                            </div>
                                        </div>

                                        <div className="relative flex items-start group">
                                            {/* Line segment */}
                                            <div className="absolute left-[3px] top-3 h-[calc(100%+1.5rem)] w-px bg-blue-500/20 group-last:hidden" />
                                            {/* Circle */}
                                            <div className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full bg-teal-500 ring-4 ring-teal-500/10 z-10" />
                                            <div className="pl-6">
                                                <span className="block text-sm font-medium text-muted-foreground">Messages</span>
                                                <span className="block mt-1">{client.messages.length} Messages</span>
                                                {client.messages.length > 0 && client.messages.at(-1)?.sentAt && (
                                                    <span className="block text-xs text-muted-foreground mt-0.5">
                                                        Last: {formatDate(client.messages.at(-1)!.sentAt)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="relative flex items-start group">
                                            {/* Line segment */}
                                            <div className="absolute left-[3px] top-3 h-[calc(100%+1.5rem)] w-px bg-blue-500/20 group-last:hidden" />
                                            {/* Circle */}
                                            <div className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10 z-10" />
                                            <div className="pl-6">
                                                <span className="block text-sm font-medium text-muted-foreground">Resources</span>
                                                <span className="block mt-1">{client.resources} Resources accessed</span>
                                            </div>
                                        </div>

                                        <div className="relative flex items-start group">
                                            {/* Circle */}
                                            <div className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/10 z-10" />
                                            <div className="pl-6">
                                                <span className="block text-sm font-medium text-muted-foreground">Joined</span>
                                                <span className="block mt-1">{formatDate(client.joinDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Company Card */}
                            <Card className="bg-card/50 backdrop-blur-sm overflow-hidden border-purple-500/10 hover:border-purple-500/20 transition-all duration-300">
                                <div className="h-1 bg-gradient-to-r from-purple-500/80 to-purple-500/40" />
                                <CardHeader className="py-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Building2 className="h-4 w-4 text-purple-500" />
                                        Company Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {client.company ? (
                                        <div className="grid gap-2 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Building2 className="h-4 w-4 text-violet-500" />
                                                <span className="text-foreground">{client.company.registrationNumber}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Users className="h-4 w-4 text-fuchsia-500" />
                                                <span className="text-foreground">{client.company.size || 'Not specified'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Building2 className="h-4 w-4 text-pink-500" />
                                                <span className="text-foreground">{client.company.industry || 'Not specified'}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-muted-foreground py-2">
                                            <Building2 className="h-4 w-4 text-muted-foreground/50" />
                                            <span>No company information available</span>
                                        </div>
                                    )}
                                    <div className="mt-3 pt-3 border-t">
                                        <Link href={`/admin/clients/${client.id}/company`} className="text-xs text-purple-500 hover:text-purple-600 transition-colors">
                                            View Full Company Details →
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Notes Section */}
                        <Card className="bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                    Recent Notes
                                </CardTitle>
                                <CardDescription>Latest updates and information about the client</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {client.notes.length > 0 ? (
                                    <div className="space-y-4">
                                        {client.notes.map((note) => (
                                            <div key={note.id} className="p-4 rounded-lg bg-muted/50 border border-border/50">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                    <span className="text-sm text-muted-foreground">
                                                        {formatDate(note.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="text-sm leading-relaxed">{note.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg">
                                        <p className="text-muted-foreground">No notes available for this client</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="company">
                        {/* Company details content */}
                    </TabsContent>

                    <TabsContent value="sessions">
                        {/* Sessions content */}
                    </TabsContent>

                    <TabsContent value="documents">
                        {/* Documents content */}
                    </TabsContent>

                    <TabsContent value="notes">
                        {/* Notes content */}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
} 