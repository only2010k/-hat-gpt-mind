"use client";

import Link from "next/link";

export default function FloatingRegister() {
  return (
    <Link
      href="/register"
      className="fixed bottom-5 right-5 z-50 rounded-full bg-blue-600 text-white px-5 py-3 shadow-lg hover:bg-blue-700"
    >
      Register
    </Link>
  );
}