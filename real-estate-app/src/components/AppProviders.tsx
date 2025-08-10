"use client";

import { AppSettingsProvider } from "@/context/AppSettingsProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import TermsGate from "@/components/TermsGate";
import FloatingRegister from "@/components/FloatingRegister";
import TopNav from "@/components/TopNav";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppSettingsProvider>
        <AuthProvider>
          <TopNav />
          {children}
          <TermsGate />
          <FloatingRegister />
        </AuthProvider>
      </AppSettingsProvider>
    </ThemeProvider>
  );
}