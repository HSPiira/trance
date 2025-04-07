'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function UnauthorizedPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
                    <CardDescription>
                        You don't have permission to access this page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500">
                        If you believe this is an error, please contact your administrator.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button asChild className="w-full">
                        <Link href="/login">Return to Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
} 