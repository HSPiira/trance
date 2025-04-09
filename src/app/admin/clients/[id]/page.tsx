// This is a Server Component
import { notFound } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Mail, Phone, Building2, User, Clock, MessageSquare, FileText, Users } from "lucide-react"
import Link from "next/link"
import ClientDetail from './client-detail'
import { clients } from '../mock-data'

export default function ClientPage({ params }: { params: { id: string } }) {
    // Find the client with the corresponding ID
    const client = clients.find(c => c.id === params.id)

    // If client not found, return 404
    if (!client) {
        notFound()
    }

    // Format date to readable string
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    // Calculate days since last active
    const getDaysSinceActive = (dateString: string) => {
        const lastActive = new Date(dateString)
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - lastActive.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header with back button and actions */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/admin/clients">
                        <Button variant="outline" size="sm">
                            ← Back to Clients
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">{client.name}</h1>
                        <p className="text-muted-foreground">Client ID: {client.id}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                    </Button>
                    <Button>
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Schedule Session
                    </Button>
                </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2">
                <Badge variant={client.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {client.status}
                </Badge>
                <Badge variant="outline">
                    {client.clientType}
                </Badge>
                {getDaysSinceActive(client.lastActive) <= 7 && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Recently Active
                    </Badge>
                )}
            </div>

            {/* Main content tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="family">Family</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Client Info Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Client Information</CardTitle>
                                <CardDescription>Basic details about the client</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{client.email || 'No email provided'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{client.phone || 'No phone provided'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <span>{client.clientType === 'COMPANY' ? 'Company Client' : 'Individual Client'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span>{client.counsellor || 'No counselor assigned'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity</CardTitle>
                                <CardDescription>Recent client activity</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>Joined: {formatDate(client.joinDate)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    <span>Last Active: {formatDate(client.lastActive)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                    <span>{client.messages} Messages</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span>{client.resources} Resources</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Family Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Family</CardTitle>
                                <CardDescription>Family members and dependants</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {client.clientType === 'COMPANY' ? (
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>{client.beneficiaries?.length || 0} Beneficiaries</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>{client.dependants?.length || 0} Dependants</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    <span>{client.appointments} Appointments</span>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-2">
                                    <Link href={`/admin/clients/${client.id}/family`}>
                                        <Button variant="outline" className="w-full">
                                            View Family Members
                                        </Button>
                                    </Link>
                                    <Link href={`/admin/clients/${client.id}/appointments`}>
                                        <Button variant="outline" className="w-full">
                                            View Appointments
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Notes Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                            <CardDescription>Important information about the client</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {client.notes || 'No notes available for this client.'}
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="family">
                    <Card>
                        <CardHeader>
                            <CardTitle>Family Members</CardTitle>
                            <CardDescription>View and manage family members</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ClientDetail client={client} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sessions">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions</CardTitle>
                            <CardDescription>View and manage client sessions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Session history will be displayed here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documents">
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents</CardTitle>
                            <CardDescription>View and manage client documents</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Client documents will be displayed here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notes">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                            <CardDescription>View and manage client notes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Client notes will be displayed here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 