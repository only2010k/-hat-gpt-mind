"use client";

import { useEffect, useState } from "react";
import { useAppSettings } from "@/context/AppSettingsProvider";
import { useAuth } from "@/context/AuthProvider";

const ACCEPT_KEY_PREFIX = "demo_terms_accept_v";

export default function TermsGate() {
  const { settings } = useAppSettings();
  const { user } = useAuth();
  const [accepted, setAccepted] = useState<boolean>(true);
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    const key = `${ACCEPT_KEY_PREFIX}${settings.terms.version}`;
    const hasAccepted = typeof window !== "undefined" ? localStorage.getItem(key) === "1" : true;
    setAccepted(!settings.terms.enabled || !!user || hasAccepted);
  }, [settings.terms.enabled, settings.terms.version, user]);

  const onContinue = () => {
    const key = `${ACCEPT_KEY_PREFIX}${settings.terms.version}`;
    if (typeof window !== "undefined") localStorage.setItem(key, "1");
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm grid place-items-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-2">Before you continue</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4" dangerouslySetInnerHTML={{ __html: settings.terms.text }} />
        <label className="flex items-center gap-2 text-sm mb-4">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          I agree to the Terms and Conditions
        </label>
        <button
          disabled={!checked}
          onClick={onContinue}
          className={`w-full rounded-lg px-4 py-2 text-white ${checked ? "bg-blue-600" : "bg-blue-300 cursor-not-allowed"}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}