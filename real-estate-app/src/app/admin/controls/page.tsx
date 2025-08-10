"use client";

import { useAppSettings } from "@/context/AppSettingsProvider";
import { useState } from "react";

export default function AdminControlsPage() {
  const { settings, updateSettings } = useAppSettings();
  const [termsText, setTermsText] = useState(settings.terms.text);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">Admin Controls</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Agent Registration</h2>
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.registration.allowLicensedAgent}
              onChange={(e) => updateSettings({ registration: { allowLicensedAgent: e.target.checked, allowUnlicensedAgent: settings.registration.allowUnlicensedAgent } })}
            />
            Allow Licensed Agent Registration
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.registration.allowUnlicensedAgent}
              onChange={(e) => updateSettings({ registration: { allowLicensedAgent: settings.registration.allowLicensedAgent, allowUnlicensedAgent: e.target.checked } })}
            />
            Allow Unlicensed Agent Registration
          </label>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Terms & Conditions Gate</h2>
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={settings.terms.enabled}
            onChange={(e) => updateSettings({ terms: { ...settings.terms, enabled: e.target.checked } })}
          />
          Require acceptance for unregistered users
        </label>
        <textarea
          value={termsText}
          onChange={(e) => setTermsText(e.target.value)}
          className="w-full h-40 rounded-lg border border-black/10 dark:border-white/10 p-3 bg-white dark:bg-zinc-900"
        />
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => updateSettings({ terms: { ...settings.terms, text: termsText } })}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Save Terms
          </button>
          <button
            onClick={() => updateSettings({ terms: { ...settings.terms, version: settings.terms.version + 1 } })}
            className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800"
          >
            Bump Version (force re-consent)
          </button>
        </div>
      </section>

      <p className="text-sm text-zinc-500">Note: This is a demo; settings persist in the browser only. Connect a database to make them global.</p>
    </div>
  );
}