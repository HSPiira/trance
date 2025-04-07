'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Bell, Mail, Lock, Globe, Moon, Sun } from 'lucide-react'

export default function SettingsPage() {
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
            <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" defaultValue={user.firstName} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" defaultValue={user.lastName} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex gap-2">
                                <Input id="email" defaultValue={user.email} />
                                <Button variant="outline">Change</Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="flex gap-2">
                                <Input id="password" type="password" defaultValue="********" />
                                <Button variant="outline">Change</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notification Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <p className="text-sm text-gray-500">
                                    Receive notifications about your appointments and messages
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Appointment Reminders</Label>
                                <p className="text-sm text-gray-500">
                                    Get reminded about upcoming appointments
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Message Notifications</Label>
                                <p className="text-sm text-gray-500">
                                    Receive notifications when you get new messages
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                {/* Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Language</Label>
                                <p className="text-sm text-gray-500">Select your preferred language</p>
                            </div>
                            <select className="rounded-md border border-gray-200 px-3 py-2">
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Time Zone</Label>
                                <p className="text-sm text-gray-500">Set your local time zone</p>
                            </div>
                            <select className="rounded-md border border-gray-200 px-3 py-2">
                                <option>Pacific Time (PT)</option>
                                <option>Mountain Time (MT)</option>
                                <option>Central Time (CT)</option>
                                <option>Eastern Time (ET)</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Theme</Label>
                                <p className="text-sm text-gray-500">Choose your preferred theme</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon">
                                    <Sun className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Moon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </div>
        </DashboardLayout>
    )
} 