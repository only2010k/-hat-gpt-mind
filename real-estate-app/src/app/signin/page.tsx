"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";

export default function SignInPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return alert("Please enter email and password");
    login({ id: crypto.randomUUID(), email, role: "general", verified: false });
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">Sign In</h1>
      <form onSubmit={submit} className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email address</label>
          <input className="input w-full" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input className="input w-full" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="text-xs text-zinc-500 mt-1">For demo, any email/password works.</p>
        </div>
        <button className="btn-primary" type="submit">Sign In</button>
      </form>
      <p className="text-sm text-zinc-600 mt-4">New here? <Link href="/register" className="text-blue-600 underline">Create an account</Link></p>

      <style jsx global>{`
        .input { border: 1px solid rgb(0 0 0 / .1); background: white; color: inherit; border-radius: 12px; padding: 10px 12px; }
        .btn-primary { background: rgb(37 99 235); color: white; padding: 10px 14px; border-radius: 10px; }
      `}</style>
    </div>
  );
}