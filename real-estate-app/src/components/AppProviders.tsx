"use client";

import { AppSettingsProvider } from "@/context/AppSettingsProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import TermsGate from "@/components/TermsGate";
import TopNav from "@/components/TopNav";
import { SessionProvider } from "next-auth/react";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AppSettingsProvider>
          <AuthProvider>
            <TopNav />
            {children}
            <TermsGate />
          </AuthProvider>
        </AppSettingsProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}