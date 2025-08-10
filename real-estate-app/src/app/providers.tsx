"use client";

import AppProviders from "@/components/AppProviders";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}