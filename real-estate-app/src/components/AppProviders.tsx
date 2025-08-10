"use client";

import { AppSettingsProvider } from "@/context/AppSettingsProvider";
import { AuthProvider } from "@/context/AuthProvider";
import TermsGate from "@/components/TermsGate";
import FloatingRegister from "@/components/FloatingRegister";
import TopNav from "@/components/TopNav";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppSettingsProvider>
      <AuthProvider>
        <TopNav />
        {children}
        <TermsGate />
        <FloatingRegister />
      </AuthProvider>
    </AppSettingsProvider>
  );
}