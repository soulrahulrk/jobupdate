"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Building2, LayoutGrid, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Overview", icon: LayoutGrid },
  { href: "/dashboard/saved", label: "Saved jobs", icon: Bookmark },
  { href: "/dashboard/applied", label: "Applications", icon: Send },
  { href: "/dashboard/bookmarks", label: "Companies", icon: Building2 },
];

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm transition",
              active ? "bg-primary/10 font-semibold text-primary" : "text-muted hover:bg-surface-2 hover:text-ink"
            )}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
