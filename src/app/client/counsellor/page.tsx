'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, MessageSquare, Star, Clock, Award } from 'lucide-react'

export default function CounsellorPage() {
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
                <h1 className="text-3xl font-bold tracking-tight">My Counsellor</h1>

                {/* Counsellor Profile */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center gap-6 md:flex-row">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src="https://avatar.vercel.sh/1.png" />
                                <AvatarFallback>SJ</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div>
                                    <h2 className="text-2xl font-bold">Dr. Sarah Johnson</h2>
                                    <p className="text-gray-500">Licensed Clinical Psychologist</p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Send Message
                                    </Button>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Schedule Session
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-blue-600">Sessions Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">12</p>
                                    <p className="text-sm text-gray-500">Total sessions</p>
                                </div>
                                <Clock className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-purple-600">Experience</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">8+</p>
                                    <p className="text-sm text-gray-500">Years</p>
                                </div>
                                <Award className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-green-600">Specializations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">5</p>
                                    <p className="text-sm text-gray-500">Areas</p>
                                </div>
                                <Star className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-orange-600">Availability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold">4</p>
                                    <p className="text-sm text-gray-500">Slots this week</p>
                                </div>
                                <Calendar className="h-8 w-8 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Specializations */}
                <Card>
                    <CardHeader>
                        <CardTitle>Specializations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {[
                                'Anxiety Disorders',
                                'Depression',
                                'Trauma Recovery',
                                'Relationship Issues',
                                'Stress Management',
                                'Personal Growth',
                            ].map((specialization) => (
                                <div
                                    key={specialization}
                                    className="flex items-center gap-2 rounded-lg border p-4"
                                >
                                    <Star className="h-5 w-5 text-yellow-400" />
                                    <span>{specialization}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Education & Certifications */}
                <Card>
                    <CardHeader>
                        <CardTitle>Education & Certifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h3 className="font-medium">Education</h3>
                            <ul className="list-inside list-disc space-y-1 text-gray-600">
                                <li>Ph.D. in Clinical Psychology - Stanford University</li>
                                <li>Master's in Counseling Psychology - Columbia University</li>
                                <li>Bachelor's in Psychology - Harvard University</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-medium">Certifications</h3>
                            <ul className="list-inside list-disc space-y-1 text-gray-600">
                                <li>Licensed Clinical Psychologist (LCP)</li>
                                <li>Certified Cognitive Behavioral Therapist (CBT)</li>
                                <li>EMDR Certified Therapist</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
} 