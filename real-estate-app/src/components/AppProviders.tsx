"use client";

import { AppSettingsProvider } from "@/context/AppSettingsProvider";
import { AuthProvider } from "@/context/AuthProvider";
import TermsGate from "@/components/TermsGate";
import FloatingRegister from "@/components/FloatingRegister";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppSettingsProvider>
      <AuthProvider>
        {children}
        <TermsGate />
        <FloatingRegister />
      </AuthProvider>
    </AppSettingsProvider>
  );
}