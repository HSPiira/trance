import Image from "next/image"
import Link from "next/link"
import {
  BarChart3,
  Calendar,
  ChevronRight,
  Home,
  LineChart,
  MessageSquare,
  PieChart,
  ShoppingCart,
  Briefcase,
  BookOpen,
  Building,
  DollarSign,
  TrendingUp,
  FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-gray-50">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-black"></div>
            <span className="text-xl font-semibold">Origin</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <NavItem icon={<Home className="h-5 w-5" />} label="Home" />
          <NavItem icon={<ShoppingCart className="h-5 w-5" />} label="Spending" />
          <NavItem icon={<Briefcase className="h-5 w-5" />} label="Portfolio" />
          <NavItem icon={<TrendingUp className="h-5 w-5" />} label="Invest" />
          <NavItem icon={<MessageSquare className="h-5 w-5" />} label="Advice" active />
          <NavItem icon={<FileText className="h-5 w-5" />} label="Estate Planning" />
          <NavItem icon={<DollarSign className="h-5 w-5" />} label="Compensation" />
          <NavItem icon={<PieChart className="h-5 w-5" />} label="Equity" />
          <NavItem icon={<Building className="h-5 w-5" />} label="Tax" />
          <NavItem icon={<BookOpen className="h-5 w-5" />} label="Learning" />
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Profile"
                width={40}
                height={40}
                className="absolute inset-0 h-full w-full rounded-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">YOUR PLANNER</p>
              <p className="font-medium">Jane</p>
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="text-sm text-muted-foreground uppercase tracking-wide">YOUR FINANCIAL PLANNER</div>
            <div className="mt-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt="Jane Planner"
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold">Jane Planner</h1>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">ABOUT YOUR PLANNER</p>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">
                  Jane is a Certified Financial Planner with 10+ years of experience in comprehensive financial
                  planning, portfolio management, and generational wealth building for individuals and families across
                  a...
                </p>
                <Button variant="outline" className="mt-2 h-8 px-3 text-xs" size="sm">
                  DETAILS <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              </div>

              <div className="flex flex-col gap-4">
                <Card className="bg-sky-50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-sky-100 p-2">
                        <Calendar className="h-5 w-5 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-xs text-sky-600 font-medium">NEXT MEETING</p>
                        <p>None scheduled</p>
                      </div>
                    </div>
                    <Button className="bg-black text-white hover:bg-gray-800">SCHEDULE</Button>
                  </CardContent>
                </Card>

                <Card className="bg-sky-50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-sky-100 p-2">
                        <MessageSquare className="h-5 w-5 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-xs text-sky-600 font-medium">INBOX</p>
                        <p>No new messages</p>
                      </div>
                    </div>
                    <Button className="bg-black text-white hover:bg-gray-800">CHAT</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* AI Planning Section */}
          <div className="mb-8">
            <h2 className="text-sm text-muted-foreground uppercase tracking-wide mb-4">PLAN WITH AI</h2>
            <p className="mb-6 text-gray-700">
              Get real-time financial guidance powered by AI, designed by Origin's team of financial experts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Emergency Fund */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
                        <Building className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">EMERGENCY FUND</div>
                    <p className="text-sm mb-4 flex-grow">
                      Analyze your accounts to build a tailored emergency fund with a detailed plan to reach your target
                      fund amount.
                    </p>
                    <div className="mt-auto">
                      <Button variant="outline" className="w-full justify-center">
                        IN PROGRESS
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Retirement Readiness */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
                        <LineChart className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                      RETIREMENT READINESS
                    </div>
                    <p className="text-sm mb-4 flex-grow">
                      Forecast your savings and get personalized strategies to ensure your golden years are truly
                      golden.
                    </p>
                    <div className="mt-auto">
                      <Button variant="outline" className="w-full justify-center">
                        IN PROGRESS
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio Analysis */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">PORTFOLIO ANALYSIS</div>
                    <p className="text-sm mb-4 flex-grow">
                      Identify fees you pay across your portfolio, flag risks from any large positions, and see if your
                      portfolio is on the right track.
                    </p>
                    <div className="mt-auto">
                      <Button variant="outline" className="w-full justify-center">
                        IN PROGRESS
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cash Management */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">CASH MANAGEMENT</div>
                    <p className="text-sm mb-4 flex-grow">
                      Get insights into your spending and create a strategy to optimize your cash flow.
                    </p>
                    <div className="mt-auto">
                      <Button variant="outline" className="w-full justify-center text-gray-400">
                        COMING SOON
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recommendations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm text-muted-foreground uppercase tracking-wide">RECOMMENDATIONS</h2>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                  SEE ALL
                </Button>
              </div>
              <Card className="mb-3">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-100 p-2 rounded-md">
                      <MessageSquare className="h-5 w-5 text-sky-600" />
                    </div>
                    <span>Review concentrated investment position</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-100 p-2 rounded-md">
                      <MessageSquare className="h-5 w-5 text-sky-600" />
                    </div>
                    <span>Ask your planner</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>

            {/* Latest Chats */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm text-muted-foreground uppercase tracking-wide">LATEST CHATS</h2>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                  SEE ALL
                </Button>
              </div>
              <div className="mb-2 text-sm font-medium">Today</div>
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div>Check my investment portfolio</div>
                    <div className="text-sm text-muted-foreground">[Data visual]</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function NavItem({ icon, label, active = false }) {
  return (
    <Link
      href="#"
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm ${active ? "bg-gray-100 font-medium" : "text-muted-foreground hover:bg-gray-100"
        }`}
    >
      {icon}
      {label}
    </Link>
  )
}

