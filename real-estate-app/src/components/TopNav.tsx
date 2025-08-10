"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";

export default function TopNav() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 dark:bg-zinc-900/70 border-b border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600 text-white grid place-items-center font-bold shadow-sm">RE</div>
          <span className="text-xl font-semibold tracking-tight">Real Estate Finder</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800">
            {isDark ? "Light" : "Dark"}
          </button>
          {!user ? (
            <>
              <Link href="/signin" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Sign In
              </Link>
              <Link href="/register" className="rounded-lg bg-blue-600 text-white px-3 py-2 text-sm font-medium hover:bg-blue-700 shadow">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-zinc-700 dark:text-zinc-200">Hi, {user.firstName || user.email}</span>
              <button onClick={logout} className="rounded-lg px-3 py-2 border border-black/10 dark:border-white/15 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}