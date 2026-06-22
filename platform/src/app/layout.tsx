import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { UserMenu } from "@/components/user-menu";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://jobupdate-ruddy.vercel.app"),
  title: { default: "TechHire — AI/ML & Fresher Job Discovery", template: "%s · TechHire" },
  description:
    "Discover verified fresher & graduate-trainee roles in AI/ML, GenAI, Computer Vision and Python across Delhi-NCR, Tricity and Bengaluru.",
  openGraph: { type: "website", title: "TechHire", description: "AI/ML & fresher job discovery platform." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <a href="#main" className="skip-link">Skip to content</a>
          <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur">
            <nav className="container flex h-14 items-center justify-between" aria-label="Primary">
              <Link href="/" className="font-bold tracking-tight">
                Tech<span className="gradient-text">Hire</span>
              </Link>
              <UserMenu />
            </nav>
          </header>
          <main id="main" className="min-h-[calc(100vh-3.5rem)]">{children}</main>
          <footer className="border-t border-border py-8 text-center text-xs text-muted">
            Built with Next.js · Prisma · Auth.js · Tailwind — verified job data, no candidate fees ever.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
