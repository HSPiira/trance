'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
    Settings,
    Save,
    Bell,
    Mail,
    Shield,
    Users,
    FileText,
    Database,
    Globe,
    Lock
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export default function AdminSettingsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [settings, setSettings] = useState({
        general: {
            siteName: 'Hope',
            siteDescription: 'A platform for mental health support',
            contactEmail: 'support@hope.com',
            enableRegistration: true,
            requireEmailVerification: true
        },
        notifications: {
            emailNotifications: true,
            newUserNotifications: true,
            resourceNotifications: true,
            systemNotifications: true
        },
        security: {
            sessionTimeout: '30',
            maxLoginAttempts: '5',
            passwordMinLength: '8',
            requireStrongPassword: true,
            enableTwoFactor: false
        },
        appearance: {
            theme: 'light',
            primaryColor: '#0066cc',
            logoUrl: '/logo.png'
        }
    })

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            router.push('/unauthorized')
        }
    }, [router, user])

    const handleSettingChange = (category: string, setting: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                [setting]: value
            }
        }))
    }

    const handleSaveSettings = () => {
        // TODO: Implement settings save functionality
        console.log('Saving settings:', settings)
    }

    if (!user) {
        return null
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage system settings and configurations
                    </p>
                </div>
                <Button onClick={handleSaveSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general">
                        <Globe className="mr-2 h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Shield className="mr-2 h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="appearance">
                        <Settings className="mr-2 h-4 w-4" />
                        Appearance
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                            <CardDescription>
                                Configure basic system settings and preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="siteName" className="text-right">
                                        Site Name
                                    </Label>
                                    <Input
                                        id="siteName"
                                        value={settings.general.siteName}
                                        onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="siteDescription" className="text-right">
                                        Site Description
                                    </Label>
                                    <Textarea
                                        id="siteDescription"
                                        value={settings.general.siteDescription}
                                        onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="contactEmail" className="text-right">
                                        Contact Email
                                    </Label>
                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        value={settings.general.contactEmail}
                                        onChange={(e) => handleSettingChange('general', 'contactEmail', e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">
                                        User Registration
                                    </Label>
                                    <div className="col-span-3 flex items-center space-x-2">
                                        <Switch
                                            id="enableRegistration"
                                            checked={settings.general.enableRegistration}
                                            onCheckedChange={(checked) => handleSettingChange('general', 'enableRegistration', checked)}
                                        />
                                        <Label htmlFor="enableRegistration">Enable User Registration</Label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">
                                        Email Verification
                                    </Label>
                                    <div className="col-span-3 flex items-center space-x-2">
                                        <Switch
                                            id="requireEmailVerification"
                                            checked={settings.general.requireEmailVerification}
                                            onCheckedChange={(checked) => handleSettingChange('general', 'requireEmailVerification', checked)}
                                        />
                                        <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Settings</CardTitle>
                            <CardDescription>
                                Configure system notification preferences
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">
                                        Email Notifications
                                    </Label>
                                    <div className="col-span-3 flex items-center space-x-2">
                                        <Switch
                                            id="emailNotifications"
                                            checked={settings.notifications.emailNotifications}
                                            onCheckedChange={(checked) => handleSettingChange('notifications', 'emailNotifications', checked)}
                                        />
                                        <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">
                                        New User Notifications
                                    </Label>
                                    <div className="col-span-3 flex items-center space-x-2">
                                        <Switch
                                            id="newUserNotifications"
                                            checked={settings.notifications.newUserNotifications}
                                            onCheckedChange={(checked) => handleSettingChange('notifications', 'newUserNotifications', checked)}
                                        />
                                        <Label htmlFor="newUserNotifications">Notify on New User Registration</Label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">
                                        Resource Notifications
                                    </Label>
                                    <div className="col-span-3 flex items-center space-x-2">
                                        <Switch
                                            id="resourceNotifications"
                                            checked={settings.notifications.resourceNotifications}
                                            onCheckedChange={(checked) => handleSettingChange('notifications', 'resourceNotifications', checked)}
                                        />
                                        <Label htmlFor="resourceNotifications">Notify on New Resources</Label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">
                                        System Notifications
                                    </Label>
                                    <div className="col-span-3 flex items-center space-x-2">
                                        <Switch
                                            id="systemNotifications"
                                            checked={settings.notifications.systemNotifications}
                                            onCheckedChange={(checked) => handleSettingChange('notifications', 'systemNotifications', checked)}
                                        />
                                        <Label htmlFor="systemNotifications">Enable System Notifications</Label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>
                                Configure security and authentication settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="sessionTimeout" className="text-right">
                                        Session Timeout (minutes)
                                    </Label>
                                    <Input
                                        id="sessionTimeout"
                                        type="number"
                                        value={settings.security.sessionTimeout}
                                        onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="maxLoginAttempts" className="text-right">
                                        Max Login Attempts
                                    </Label>
                                    <Input
                                        id="maxLoginAttempts"
                                        type="number"
                                        value={settings.security.maxLoginAttempts}
                                        onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="passwordMinLength" className="text-right">
                                        Min Password Length
                                    </Label>
                                    <Input
                                        id="passwordMinLength"
                                        type="number"
                                        value={settings.security.passwordMinLength}
                                        onChange={(e) => handleSettingChange('security', 'passwordMinLength', e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">
                                        Password Requirements
                                    </Label>
                                    <div className="col-span-3 flex items-center space-x-2">
                                        <Switch
                                            id="requireStrongPassword"
                                            checked={settings.security.requireStrongPassword}
                                            onCheckedChange={(checked) => handleSettingChange('security', 'requireStrongPassword', checked)}
                                        />
                                        <Label htmlFor="requireStrongPassword">Require Strong Passwords</Label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">
                                        Two-Factor Authentication
                                    </Label>
                                    <div className="col-span-3 flex items-center space-x-2">
                                        <Switch
                                            id="enableTwoFactor"
                                            checked={settings.security.enableTwoFactor}
                                            onCheckedChange={(checked) => handleSettingChange('security', 'enableTwoFactor', checked)}
                                        />
                                        <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance Settings</CardTitle>
                            <CardDescription>
                                Customize the look and feel of the platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="theme" className="text-right">
                                        Theme
                                    </Label>
                                    <Select
                                        value={settings.appearance.theme}
                                        onValueChange={(value) => handleSettingChange('appearance', 'theme', value)}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="primaryColor" className="text-right">
                                        Primary Color
                                    </Label>
                                    <Input
                                        id="primaryColor"
                                        type="color"
                                        value={settings.appearance.primaryColor}
                                        onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                                        className="col-span-3 h-10"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="logoUrl" className="text-right">
                                        Logo URL
                                    </Label>
                                    <Input
                                        id="logoUrl"
                                        value={settings.appearance.logoUrl}
                                        onChange={(e) => handleSettingChange('appearance', 'logoUrl', e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 