'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { Button } from './button'
import { LayoutDashboard } from 'lucide-react'

export function DashboardLink() {
    const { user } = useAuth()
    const router = useRouter()

    if (!user) {
        return null
    }

    const handleClick = () => {
        const role = user.role.toLowerCase()
        router.push(`/${role}/dashboard`)
    }

    return (
        <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={handleClick}
        >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
        </Button>
    )
} 