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
import { Inter } from 'next/font/google'
import { useTheme } from 'next-themes'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { theme, setTheme } = useTheme()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!email || !password) {
            setError('Please enter both email and password')
            setLoading(false)
            return
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to login')
            }

            router.push(data.redirectUrl)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during login')
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
                    <h1 className="text-4xl font-medium tracking-tight">Welcome back</h1>
                </div>

                <Card className="border-none shadow-lg bg-white/80 dark:bg-[#2A2A2A]/80 backdrop-blur-sm">
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4 pt-6">
                            {error && (
                                <Alert variant="destructive" className="bg-red-50/50 dark:bg-red-950/50 backdrop-blur-sm">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white/50 dark:bg-[#1F1F1F]/50 backdrop-blur-sm border-black/5 dark:border-white/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm hover:text-black/60 dark:hover:text-white/60 transition-colors"
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
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                            <div className="flex flex-col sm:flex-row justify-center gap-4 text-center text-sm">
                                <div>
                                    Don't have an account?{' '}
                                    <Link
                                        href="/register"
                                        className="hover:text-black/60 dark:hover:text-white/60 transition-colors"
                                    >
                                        Register
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