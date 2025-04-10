'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, HeartHandshake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ClientType } from '@/lib/db/schema'
import { UserRole } from '@prisma/client'
import { Inter } from 'next/font/google'
import { useTheme } from 'next-themes'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        role: UserRole.STAFF,
        clientType: 'PRIMARY' as ClientType,
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { theme, setTheme } = useTheme()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to register')
            }

            const userRole = data.user.role.toLowerCase()
            router.push(`/${userRole}/dashboard`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`${inter.variable} font-sans min-h-screen bg-[#F5EDE3] dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-[#F5EDE3] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8`}>
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-medium tracking-tight">
                        <HeartHandshake className="h-8 w-8" />
                        mental.me
                    </Link>
                    <h1 className="text-4xl font-medium tracking-tight">Create an account</h1>
                </div>

                <Card className="border-none shadow-lg bg-white/80 dark:bg-[#2A2A2A]/80 backdrop-blur-sm">
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4 pt-6">
                            {error && (
                                <Alert variant="destructive" className="bg-red-50/50 dark:bg-red-950/50 backdrop-blur-sm">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="bg-white/50 dark:bg-[#1F1F1F]/50 backdrop-blur-sm border-black/5 dark:border-white/5"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="bg-white/50 dark:bg-[#1F1F1F]/50 backdrop-blur-sm border-black/5 dark:border-white/5"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="bg-white/50 dark:bg-[#1F1F1F]/50 backdrop-blur-sm border-black/5 dark:border-white/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="bg-white/50 dark:bg-[#1F1F1F]/50 backdrop-blur-sm border-black/5 dark:border-white/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => handleSelectChange('role', value)}
                                >
                                    <SelectTrigger className="bg-white/50 dark:bg-[#1F1F1F]/50 backdrop-blur-sm border-black/5 dark:border-white/5">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
                                        <SelectItem value={UserRole.COUNSELOR}>Counselor</SelectItem>
                                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {formData.role === UserRole.STAFF && (
                                <div className="space-y-2">
                                    <Label htmlFor="clientType" className="text-sm font-medium">Client Type</Label>
                                    <Select
                                        value={formData.clientType}
                                        onValueChange={(value) => handleSelectChange('clientType', value)}
                                    >
                                        <SelectTrigger className="bg-white/50 dark:bg-[#1F1F1F]/50 backdrop-blur-sm border-black/5 dark:border-white/5">
                                            <SelectValue placeholder="Select your client type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PRIMARY">Primary</SelectItem>
                                            <SelectItem value="SECONDARY">Secondary</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="bg-white/50 dark:bg-[#1F1F1F]/50 backdrop-blur-sm border-black/5 dark:border-white/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="bg-white/50 dark:bg-[#1F1F1F]/50 backdrop-blur-sm border-black/5 dark:border-white/5"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4 pb-6">
                            <Button
                                type="submit"
                                className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 rounded-full"
                                disabled={loading}
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                            </Button>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 text-center text-sm">
                                <div>
                                    Already have an account?{' '}
                                    <Link
                                        href="/login"
                                        className="hover:text-black/60 dark:hover:text-white/60 transition-colors"
                                    >
                                        Login
                                    </Link>
                                </div>
                                <Link
                                    href="/"
                                    className="inline-flex items-center hover:text-black/60 dark:hover:text-white/60 transition-colors"
                                >
                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                    Back to Home
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    {theme === "dark" ? "🌞" : "🌙"}
                </Button>
            </div>
        </div>
    )
} 