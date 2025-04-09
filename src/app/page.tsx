"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  HeartHandshake,
  MessageSquare,
  Shield,
  UserCircle,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Inter } from 'next/font/google';
import { useTheme } from "next-themes";

// Load Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40">
      <CardContent className="p-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-xl shadow-md text-center hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/40 dark:hover:to-pink-900/40 transition-colors">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
}

function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 backdrop-blur-sm hover:from-teal-100 hover:to-emerald-100 dark:hover:from-teal-900/40 dark:hover:to-emerald-900/40">
      <CardContent className="p-6">
        <div className="mb-4">
          <svg
            className="h-8 w-8 text-teal-500 dark:text-teal-400"
            fill="currentColor"
            viewBox="0 0 32 32"
          >
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
        </div>
        <p className="text-muted-foreground mb-6">{quote}</p>
        <p className="font-semibold text-foreground">{author}</p>
      </CardContent>
    </Card>
  );
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className={`${inter.variable} font-sans min-h-screen bg-[#F5EDE3] dark:bg-[#1F1F1F] text-[#1F1F1F] dark:text-[#F5EDE3]`}>
      {/* Navigation */}
      <nav className="py-6 px-6 md:px-10 lg:px-20 flex items-center justify-between sticky top-0 z-50 bg-[#F5EDE3]/80 dark:bg-[#1F1F1F]/80 backdrop-blur-sm border-b border-black/5 dark:border-white/5">
        <Link href="/" className="text-xl font-medium tracking-tight">
          mental.me
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-sm font-medium tracking-tight hover:text-black/60 dark:hover:text-white/60 transition-colors">
            Home
          </Link>
          <Link href="/services" className="text-sm font-medium tracking-tight hover:text-black/60 dark:hover:text-white/60 transition-colors">
            Services
          </Link>
          <Link href="#" className="text-sm font-medium tracking-tight hover:text-black/60 dark:hover:text-white/60 transition-colors">
            Products
          </Link>
          <Link href="#" className="text-sm font-medium tracking-tight hover:text-black/60 dark:hover:text-white/60 transition-colors">
            About Us
          </Link>
          <Link href="#" className="text-sm font-medium tracking-tight hover:text-black/60 dark:hover:text-white/60 transition-colors">
            Contact
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Let's connect</span>
            <div className="flex gap-2">
              <Link href="#" aria-label="Twitter/X" className="w-6 h-6 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black text-xs">X</Link>
              <Link href="#" aria-label="LinkedIn" className="w-6 h-6 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black text-xs">In</Link>
              <Link href="#" aria-label="Telegram" className="w-6 h-6 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black text-xs">Tg</Link>
            </div>
          </div>
          <Link href="/login">
            <Button variant="outline" className="border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors">
              Login
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-6 py-4 bg-[#F5EDE3] dark:bg-[#1F1F1F] border-t border-black/5 dark:border-white/5">
          <div className="flex flex-col gap-4">
            <Link href="#" className="text-sm hover:text-black/60 dark:hover:text-white/60 transition-colors">
              Home
            </Link>
            <Link href="#" className="text-sm hover:text-black/60 dark:hover:text-white/60 transition-colors">
              Services
            </Link>
            <Link href="#" className="text-sm hover:text-black/60 dark:hover:text-white/60 transition-colors">
              Products
            </Link>
            <Link href="#" className="text-sm hover:text-black/60 dark:hover:text-white/60 transition-colors">
              About Us
            </Link>
            <Link href="#" className="text-sm hover:text-black/60 dark:hover:text-white/60 transition-colors">
              Contact
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors w-full">
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium tracking-[-0.02em] leading-[0.95]">
                YOUR MENTAL WELL-BEING
              </h1>
              <p className="text-lg text-black/60 dark:text-white/60 tracking-tight">
                We offer a wide range of services and products to cater to your specific mental health needs
              </p>
              <div className="flex gap-4">
                <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 rounded-full px-8">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 grid-rows-3 gap-4">
              <div className="col-span-2 row-span-2 rounded-[2rem] overflow-hidden bg-[#E8D5C4] dark:bg-[#2A2A2A]">
                <Image
                  src="/images/hero-1.jpg"
                  alt="Wellness"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-[2rem] bg-[#DCC1B0] dark:bg-[#333333]" />
              <div className="rounded-[2rem] bg-[#C4A494] dark:bg-[#404040]" />
              <div className="col-span-2 rounded-[2rem] bg-[#B08968] dark:bg-[#4A4A4A]" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-10 lg:px-20 bg-white dark:bg-[#2A2A2A]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-8">
              <h2 className="text-4xl font-medium tracking-tight">Individual Therapy</h2>
              <p className="text-lg text-black/60 dark:text-white/60 tracking-tight">
                Collaborate with our trained therapists who will provide personalized guidance and support tailored to your unique circumstances.
              </p>
              <div className="flex gap-4">
                <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 rounded-full px-8">
                  Book a Session
                </Button>
              </div>
            </div>
            <div className="aspect-square rounded-[2rem] overflow-hidden">
              <Image
                src="/images/therapy.jpg"
                alt="Therapy session"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="space-y-2">
              <p className="text-5xl font-medium tracking-tight">24k</p>
              <p className="text-black/60 dark:text-white/60 tracking-tight">People helped through our services</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-medium tracking-tight">98%</p>
              <p className="text-black/60 dark:text-white/60 tracking-tight">Client satisfaction rate</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-medium tracking-tight">50+</p>
              <p className="text-black/60 dark:text-white/60 tracking-tight">Professional therapists</p>
            </div>
            <div className="space-y-2">
              <p className="text-5xl font-medium tracking-tight">15+</p>
              <p className="text-black/60 dark:text-white/60 tracking-tight">Years of experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-10 lg:px-20 bg-black dark:bg-white text-white dark:text-black">
        <div className="max-w-[1200px] mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-medium">
            The first lesson is free
          </h2>
          <p className="text-lg text-white/60 dark:text-black/60 max-w-2xl mx-auto">
            Take the first step towards better mental health. Book your complimentary session today.
          </p>
          <Button className="bg-white dark:bg-black text-black dark:text-white hover:bg-white/80 dark:hover:bg-black/80 rounded-full px-8">
            Get Started
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 md:px-10 lg:px-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="space-y-4">
              <Link href="/" className="text-xl font-medium">
                mental.me
              </Link>
              <p className="text-sm text-black/60 dark:text-white/60">
                A companion for mental wellness
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Company</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">About</Link>
                <Link href="#" className="block text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">Careers</Link>
                <Link href="#" className="block text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">Contact</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Resources</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">Blog</Link>
                <Link href="#" className="block text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">Newsletter</Link>
                <Link href="#" className="block text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">Events</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Legal</h3>
              <div className="space-y-2">
                <Link href="#" className="block text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">Privacy</Link>
                <Link href="#" className="block text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">Terms</Link>
                <Link href="#" className="block text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">Cookies</Link>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-black/5 dark:border-white/5">
            <p className="text-sm text-black/60 dark:text-white/60">
              © {new Date().getFullYear()} mental.me - All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
