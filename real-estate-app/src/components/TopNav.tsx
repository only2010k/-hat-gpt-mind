"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { useSession, signOut } from "next-auth/react";

export default function TopNav() {
  const { user: legacyUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const isDark = theme === "dark";
  const role = (session?.user as { role?: string } | undefined)?.role || (legacyUser?.role ?? "user");
  const displayName = session?.user?.email || legacyUser?.firstName || legacyUser?.email || "";

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 dark:bg-zinc-900/70 border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-2 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-blue-600 text-white grid place-items-center font-bold shadow-sm">RE</div>
          <span className="text-lg md:text-xl font-semibold tracking-tight">Real Estate Finder</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800">
            {isDark ? "Light" : "Dark"}
          </button>
          {!session ? (
            <>
              <Link href="/signin" className="rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Sign In
              </Link>
              <Link href="/register" className="rounded-md bg-blue-600 text-white px-2.5 py-1.5 text-xs sm:text-sm font-medium hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-zinc-700 dark:text-zinc-200">Hi, {displayName}{role === "admin" && <span className="ml-2 rounded bg-amber-100 text-amber-800 px-2 py-0.5">Admin</span>}</span>
              <button onClick={() => signOut()} className="rounded-md px-2.5 py-1.5 border border-black/10 dark:border-white/15 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}