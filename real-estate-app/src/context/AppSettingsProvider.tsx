"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type RegistrationToggles = {
  allowLicensedAgent: boolean;
  allowUnlicensedAgent: boolean;
};

type TermsConfig = {
  enabled: boolean;
  version: number; // bump to require re-consent
  text: string;
};

type AppSettings = {
  registration: RegistrationToggles;
  terms: TermsConfig;
};

type AppSettingsContextValue = {
  settings: AppSettings;
  updateSettings: (next: Partial<AppSettings>) => void;
};

const DEFAULTS: AppSettings = {
  registration: { allowLicensedAgent: true, allowUnlicensedAgent: true },
  terms: { enabled: false, version: 1, text: "Before you view this property, you must accept the Terms and Conditions." },
};

const STORAGE_KEY = "demo_app_settings";

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
      } catch {
        // ignore
      }
    }
  }, []);

  const updateSettings = (next: Partial<AppSettings>) => {
    setSettings((prev) => {
      const nextRegistration = (next.registration ?? {}) as Partial<RegistrationToggles>;
      const nextTerms = (next.terms ?? {}) as Partial<TermsConfig>;
      const merged: AppSettings = {
        registration: { ...prev.registration, ...nextRegistration },
        terms: { ...prev.terms, ...nextTerms },
      };
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
  };

  const value = useMemo<AppSettingsContextValue>(() => ({ settings, updateSettings }), [settings]);

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used within AppSettingsProvider");
  return ctx;
}