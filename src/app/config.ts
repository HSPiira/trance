export const siteConfig = {
  name: "Hope",
  description: "A modern Next.js application",
  url: process.env["NEXT_PUBLIC_APP_URL"] || "http://localhost:3000",
  ogImage: "https://your-domain.com/og.jpg",
  links: {
    twitter: "https://twitter.com/yourusername",
    github: "https://github.com/yourusername/hope",
  },
  creator: "Your Name",
  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Modern Web Development",
  ],
  authors: [
    {
      name: "Your Name",
      url: "https://your-website.com",
    },
  ],
  defaultLanguage: "en",
  defaultTheme: "system",
  metadata: {
    title: {
      default: "Hope",
      template: "%s | Hope",
    },
    description: "A modern Next.js application",
    authors: [{ name: "Your Name", url: "https://your-website.com" }],
    creator: "Your Name",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://your-domain.com",
      title: "Hope",
      description: "A modern Next.js application",
      siteName: "Hope",
    },
    twitter: {
      card: "summary_large_image",
      title: "Hope",
      description: "A modern Next.js application",
      images: ["https://your-domain.com/og.jpg"],
      creator: "@yourusername",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  },
} as const;

export type SiteConfig = typeof siteConfig;
