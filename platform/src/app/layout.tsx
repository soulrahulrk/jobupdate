import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
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
          <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur">
            <nav className="container flex h-14 items-center justify-between">
              <Link href="/" className="font-bold tracking-tight">
                Tech<span className="gradient-text">Hire</span>
              </Link>
              <div className="flex items-center gap-1 text-sm">
                <Link href="/jobs" className="rounded-md px-3 py-2 text-muted hover:bg-surface-2 hover:text-ink">Jobs</Link>
                <Link href="/dashboard" className="rounded-md px-3 py-2 text-muted hover:bg-surface-2 hover:text-ink">Dashboard</Link>
                <Link href="/login" className="rounded-md bg-primary px-3.5 py-2 font-semibold text-primary-fg">Sign in</Link>
              </div>
            </nav>
          </header>
          <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
          <footer className="border-t border-border py-8 text-center text-xs text-muted">
            Built with Next.js · Prisma · Auth.js · Tailwind — verified job data, no candidate fees ever.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
