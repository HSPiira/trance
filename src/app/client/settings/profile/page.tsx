'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, PhoneIcon, HomeIcon, User2Icon, ShieldIcon, SaveIcon } from 'lucide-react'
import { ClientType } from '@/lib/db/schema'
import { z } from 'zod'
import { format } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// Define form schema
const profileSchema = z.object({
    dateOfBirth: z.date().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
    emergencyPhone: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ClientProfileSettings() {
    const router = useRouter()
    const { user, setUser } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [profile, setProfile] = useState<any>(null)
    const [formValues, setFormValues] = useState<ProfileFormValues>({
        dateOfBirth: undefined,
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [calendarOpen, setCalendarOpen] = useState(false)

    // Load profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true)
                const response = await fetch('/api/client/profile')

                if (!response.ok) {
                    throw new Error('Failed to fetch profile')
                }

                const data = await response.json()
                setProfile(data.profile)

                // Set form values from profile
                setFormValues({
                    dateOfBirth: data.profile.dateOfBirth ? new Date(data.profile.dateOfBirth) : undefined,
                    address: data.profile.address || '',
                    emergencyContact: data.profile.emergencyContact || '',
                    emergencyPhone: data.profile.emergencyPhone || '',
                })

                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching profile:', error)
                setError('Failed to load profile data')
                setIsLoading(false)
            }
        }

        if (user) {
            fetchProfile()
        } else {
            // Redirect if not logged in
            router.push('/login')
        }
    }, [user, router])

    // Handle form input changes
    const handleChange = (field: keyof ProfileFormValues, value: any) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }))

        // Reset saved and error states
        setIsSaved(false)
        setError(null)
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setIsSubmitting(true)
            setError(null)

            // Validate form data
            const validData = profileSchema.parse(formValues)

            // Call API to update profile
            const response = await fetch('/api/client/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(validData),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to update profile')
            }

            // Success handling
            setIsSaved(true)

            // Update local profile data
            const data = await response.json()
            setProfile(data.profile)

            // Hide success message after 3 seconds
            setTimeout(() => {
                setIsSaved(false)
            }, 3000)
        } catch (error) {
            console.error('Error updating profile:', error)
            if (error instanceof z.ZodError) {
                setError('Please check the form fields and try again')
            } else if (error instanceof Error) {
                setError(error.message)
            } else {
                setError('An unknown error occurred')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!user) {
        return null
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your personal details and emergency contacts
                    </p>
                </div>

                <Separator />

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Personal Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Details</CardTitle>
                            <CardDescription>
                                Your identity information and account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Read-only fields */}
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label htmlFor="name" className="text-muted-foreground text-sm">
                                        <User2Icon className="inline-block h-4 w-4 mr-1" />
                                        Full Name
                                    </Label>
                                    <div className="text-sm font-medium" id="name">
                                        {isLoading ? 'Loading...' : `${profile?.user?.firstName} ${profile?.user?.lastName}`}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="email" className="text-muted-foreground text-sm">
                                        Email Address
                                    </Label>
                                    <div className="text-sm font-medium" id="email">
                                        {isLoading ? 'Loading...' : profile?.user?.email}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="accountType" className="text-muted-foreground text-sm">
                                        <ShieldIcon className="inline-block h-4 w-4 mr-1" />
                                        Account Type
                                    </Label>
                                    <div className="text-sm font-medium" id="accountType">
                                        {isLoading ? 'Loading...' : (
                                            profile?.clientType === ClientType.PRIMARY ? 'Primary Account' : 'Secondary Account'
                                        )}
                                        {profile?.clientType === ClientType.SECONDARY && profile?.primaryClient && (
                                            <span className="text-muted-foreground ml-1">
                                                (Linked to {profile.primaryClient.user.firstName} {profile.primaryClient.user.lastName})
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Editable Profile */}
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your profile and emergency contacts
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">
                                        <CalendarIcon className="inline-block h-4 w-4 mr-1" />
                                        Date of Birth
                                    </Label>
                                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                            >
                                                {formValues.dateOfBirth ? (
                                                    format(formValues.dateOfBirth, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={formValues.dateOfBirth}
                                                onSelect={(date) => {
                                                    handleChange('dateOfBirth', date)
                                                    setCalendarOpen(false)
                                                }}
                                                initialFocus
                                                disabled={(date) => date > new Date()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">
                                        <HomeIcon className="inline-block h-4 w-4 mr-1" />
                                        Address
                                    </Label>
                                    <Input
                                        id="address"
                                        value={formValues.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        placeholder="Your current address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                                    <Input
                                        id="emergencyContact"
                                        value={formValues.emergencyContact}
                                        onChange={(e) => handleChange('emergencyContact', e.target.value)}
                                        placeholder="Name of emergency contact"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="emergencyPhone">
                                        <PhoneIcon className="inline-block h-4 w-4 mr-1" />
                                        Emergency Contact Phone
                                    </Label>
                                    <Input
                                        id="emergencyPhone"
                                        value={formValues.emergencyPhone}
                                        onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                                        placeholder="Phone number of emergency contact"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                {error && (
                                    <div className="text-sm text-red-500">
                                        {error}
                                    </div>
                                )}
                                {isSaved && (
                                    <div className="text-sm text-green-500">
                                        Profile updated successfully!
                                    </div>
                                )}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="ml-auto"
                                >
                                    <SaveIcon className="h-4 w-4 mr-2" />
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    )
} 