import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe config (no Prisma / bcrypt) — imported by middleware.
 * The full config in auth.ts extends this with the Prisma adapter + providers.
 */
export const authConfig = {
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAuthed = !!auth?.user;
      const role = (auth?.user as { role?: string } | undefined)?.role;
      const path = nextUrl.pathname;
      if (path.startsWith("/admin")) return role === "ADMIN";
      if (path.startsWith("/dashboard")) return isAuthed;
      return true;
    },
  },
} satisfies NextAuthConfig;
