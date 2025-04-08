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
import { BackButton } from '@/components/ui/back-button'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submission prevented')
        setError('')
        setLoading(true)

        if (!email || !password) {
            console.log('Missing email or password')
            setError('Please enter both email and password')
            setLoading(false)
            return
        }

        console.log('Attempting login with email:', email)

        try {
            console.log('Preparing to send login request...')
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            })

            console.log('Login response status:', response.status)

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to login')
            }

            // Check for cookies
            const cookies = document.cookie
            console.log('Cookies after login:', cookies)

            // Use the redirect URL from the API response
            console.log('Login successful, redirecting to:', data.redirectUrl)

            // Wait a moment for the cookie to be set
            await new Promise(resolve => setTimeout(resolve, 500))

            // Check cookies again after delay
            console.log('Cookies after delay:', document.cookie)

            // Try different navigation methods
            try {
                // First try router.push
                router.push(data.redirectUrl)

                // If router.push doesn't work after 500ms, try window.location
                setTimeout(() => {
                    // Check cookies before redirect
                    console.log('Cookies before window.location redirect:', document.cookie)
                    const baseUrl = window.location.origin
                    const fullUrl = `${baseUrl}${data.redirectUrl}`
                    console.log('Router push may have failed, trying window.location:', fullUrl)
                    window.location.href = fullUrl
                }, 500)
            } catch (navErr) {
                console.error('Navigation error:', navErr)
                // Fallback to window.location
                const baseUrl = window.location.origin
                const fullUrl = `${baseUrl}${data.redirectUrl}`
                window.location.href = fullUrl
            }
        } catch (err) {
            console.error('Login error:', err)
            setError(err instanceof Error ? err.message : 'An error occurred during login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-center mb-6">
                    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
                        <HeartHandshake className="h-8 w-8" />
                        <span className="text-xl font-semibold">Hope Counseling</span>
                    </Link>
                </div>
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Login</CardTitle>
                        <CardDescription>
                            Enter your email and password to access your account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-blue-600 hover:text-blue-500"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 text-center text-sm">
                                <div>
                                    Don't have an account?{' '}
                                    <Link
                                        href="/register"
                                        className="text-blue-600 hover:text-blue-500"
                                    >
                                        Register
                                    </Link>
                                </div>
                                <div className="flex justify-center">
                                    <BackButton
                                        href="/"
                                        tooltip="Back to Home"
                                        variant="link"
                                        size="sm"
                                        className="p-0 h-auto text-blue-600 hover:text-blue-500"
                                    />
                                </div>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
} 