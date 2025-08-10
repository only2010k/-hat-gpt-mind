"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Create your account</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/register/general" className="block rounded-2xl border border-black/10 dark:border-white/15 p-5 hover:shadow-md bg-white dark:bg-zinc-900">
          <div className="text-lg font-semibold mb-1">General User</div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">For buyers, sellers, renters, or browsers.</p>
        </Link>
        <Link href="/register/agent" className="block rounded-2xl border border-black/10 dark:border-white/15 p-5 hover:shadow-md bg-white dark:bg-zinc-900">
          <div className="text-lg font-semibold mb-1">Agent</div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">For professionals working in real estate.</p>
        </Link>
      </div>
    </div>
  );
}