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

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-card">
      <CardContent className="p-6">
        <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
          <div className="text-primary">{icon}</div>
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
    <div className="bg-card p-6 rounded-xl shadow-md text-center">
      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
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
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-card">
      <CardContent className="p-6">
        <div className="mb-4">
          <svg
            className="h-8 w-8 text-primary/60"
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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="py-4 px-6 md:px-10 lg:px-20 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <HeartHandshake className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold text-foreground">
            Hope Counseling
          </span>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:text-primary text-foreground"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium hover:text-primary text-foreground"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium hover:text-primary text-foreground"
          >
            Testimonials
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium hover:text-primary text-foreground"
          >
            Log In
          </Link>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-6 py-4 bg-card shadow-md">
          <div className="flex flex-col gap-4">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-primary text-foreground"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-primary text-foreground"
            >
              Testimonials
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary text-foreground"
            >
              Log In
            </Link>
            <Button asChild className="w-full">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 px-6 md:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Your journey to better mental health starts here
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Connect with professional counselors, track your progress, and take
            control of your mental wellbeing with our comprehensive counseling
            platform.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden shadow-xl">
          <Image
            src="/mental-health.png"
            alt="Online counseling session"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-6 md:px-10 lg:px-20 bg-muted/30"
      >
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground">
            Comprehensive Mental Health Support
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Our platform provides everything you need for your mental health
            journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<UserCircle />}
            title="Expert Counselors"
            description="Connect with licensed and experienced mental health professionals specializing in various areas."
          />
          <FeatureCard
            icon={<Calendar />}
            title="Flexible Scheduling"
            description="Book sessions at your convenience with our easy-to-use calendar system."
          />
          <FeatureCard
            icon={<MessageSquare />}
            title="Secure Messaging"
            description="Communicate with your counselor through our encrypted messaging platform."
          />
          <FeatureCard
            icon={<Shield />}
            title="Privacy First"
            description="Your data is protected with industry-leading security measures and strict confidentiality."
          />
          <FeatureCard
            icon={<HeartHandshake />}
            title="Personalized Care"
            description="Receive customized treatment plans tailored to your specific needs and goals."
          />
          <FeatureCard
            icon={<CheckCircle2 />}
            title="Progress Tracking"
            description="Monitor your improvement with detailed progress reports and insights."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 px-6 md:px-10 lg:px-20 bg-muted/50"
      >
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Start your journey to better mental health in just a few simple
            steps.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Sign Up"
              description="Create your account and complete a brief assessment to help us understand your needs."
            />
            <StepCard
              number="2"
              title="Match with a Counselor"
              description="Get matched with a qualified professional based on your specific requirements."
            />
            <StepCard
              number="3"
              title="Begin Your Journey"
              description="Schedule your first session and start working toward better mental health."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 px-6 md:px-10 lg:px-20 bg-background"
      >
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Real stories from people who have found support and healing through
            our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            quote="Working with my counselor through this platform has completely transformed how I handle anxiety. The scheduling flexibility made it possible for me to fit therapy into my busy life."
            author="Sarah J."
          />
          <TestimonialCard
            quote="I was skeptical about online counseling at first, but the experience has been incredible. The progress tracking features help me see how far I've come in my journey."
            author="Michael T."
          />
          <TestimonialCard
            quote="The matching process connected me with exactly the right counselor for my needs. I feel heard and supported in every session."
            author="Aisha R."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-10 lg:px-20 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
          <p className="mt-6 text-xl">
            Join thousands of others who have taken the first step toward better
            mental health.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/register">Create Your Account</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 md:px-10 lg:px-20 bg-muted text-muted-foreground">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <HeartHandshake className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-foreground">
                Hope Counseling
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Providing accessible mental health support for everyone,
              everywhere.
            </p>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-sm hover:text-primary">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm hover:text-primary"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="text-sm hover:text-primary"
                >
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-primary">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-primary">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-primary">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-border mt-10 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Hope Counseling. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
