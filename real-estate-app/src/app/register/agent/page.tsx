"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useAppSettings } from "@/context/AppSettingsProvider";

export default function AgentRegisterPage() {
  const { settings } = useAppSettings();
  const { login } = useAuth();
  const [license, setLicense] = useState<"licensed" | "unlicensed" | null>(null);

  if (license === null) {
    const licensedDisabled = !settings.registration.allowLicensedAgent;
    const unlicensedDisabled = !settings.registration.allowUnlicensedAgent;
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-xl font-semibold mb-4">Do you have a real estate license?</h1>
        <div className="grid gap-3">
          <button disabled={licensedDisabled} className={`btn ${licensedDisabled ? "btn-off" : "btn-on"}`} onClick={() => setLicense("licensed")}>Yes — Licensed Agent</button>
          <button disabled={unlicensedDisabled} className={`btn ${unlicensedDisabled ? "btn-off" : "btn-on"}`} onClick={() => setLicense("unlicensed")}>No — Unlicensed Agent</button>
          {(licensedDisabled || unlicensedDisabled) && (
            <div className="rounded-lg border p-4 text-sm">
              Agent registration is temporarily closed. Please check back later or leave your email to be notified when registration opens again.
              <div className="mt-2 flex gap-2">
                <input className="input flex-1" placeholder="Enter your email" />
                <button className="btn-on">Notify Me</button>
              </div>
            </div>
          )}
        </div>
        <style jsx global>{`
          .btn { padding: 12px 14px; border-radius: 12px; }
          .btn-on { background: rgb(37 99 235); color: white; }
          .btn-off { background: rgb(229 231 235); color: rgb(113 113 122); cursor: not-allowed; }
          .input { border: 1px solid rgb(0 0 0 / .1); background: white; color: inherit; border-radius: 12px; padding: 10px 12px; }
        `}</style>
      </div>
    );
  }

  if (license === "licensed") return <LicensedForm onDone={(email, firstName, lastName) => login({ id: crypto.randomUUID(), email, firstName, lastName, role: "agent", agentType: "licensed", verified: false })} />;
  return <UnlicensedForm onDone={(email, firstName, lastName) => login({ id: crypto.randomUUID(), email, firstName, lastName, role: "agent", agentType: "unlicensed", verified: false })} />;
}

function LicensedForm({ onDone }: { onDone: (email: string, firstName: string, lastName: string) => void }) {
  const [f, setF] = useState({ first: "", second: "", third: "", last: "", companyEn: "", companyAr: "", license: "", nationality: "", nationalId: "", dob: "", gender: "", idExpiry: "", phone: "", email: "", password: "", confirm: "", accept: false });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.accept || !f.email || f.password !== f.confirm) return alert("Check inputs");
    onDone(f.email, f.first, f.last);
    alert("Your registration is pending admin approval.");
  };
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-xl font-semibold mb-4">Licensed Agent Registration</h2>
      <form onSubmit={submit} className="grid gap-3">
        <div className="grid sm:grid-cols-4 gap-3">
          <input className="input" placeholder="First" value={f.first} onChange={(e) => setF({ ...f, first: e.target.value })} />
          <input className="input" placeholder="Second" value={f.second} onChange={(e) => setF({ ...f, second: e.target.value })} />
          <input className="input" placeholder="Third (optional)" value={f.third} onChange={(e) => setF({ ...f, third: e.target.value })} />
          <input className="input" placeholder="Last" value={f.last} onChange={(e) => setF({ ...f, last: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Company Name (EN)" value={f.companyEn} onChange={(e) => setF({ ...f, companyEn: e.target.value })} />
          <input className="input" placeholder="Company Name (AR)" value={f.companyAr} onChange={(e) => setF({ ...f, companyAr: e.target.value })} />
        </div>
        <input className="input" placeholder="License Number (CR)" value={f.license} onChange={(e) => setF({ ...f, license: e.target.value })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Nationality" value={f.nationality} onChange={(e) => setF({ ...f, nationality: e.target.value })} />
          <input className="input" placeholder="National ID" value={f.nationalId} onChange={(e) => setF({ ...f, nationalId: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <input className="input" type="date" placeholder="Date of Birth" value={f.dob} onChange={(e) => setF({ ...f, dob: e.target.value })} />
          <select className="input" value={f.gender} onChange={(e) => setF({ ...f, gender: e.target.value })}>
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input className="input" type="date" placeholder="ID Expiry Date" value={f.idExpiry} onChange={(e) => setF({ ...f, idExpiry: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" type="file" placeholder="Upload License Document" />
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="input" type="file" placeholder="National ID (Front)" />
            <input className="input" type="file" placeholder="National ID (Back)" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Phone Number" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <input className="input" placeholder="Email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Password" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <input className="input" placeholder="Confirm Password" type="password" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.accept} onChange={(e) => setF({ ...f, accept: e.target.checked })} />
          Accept Terms & Conditions
        </label>
        <button className="btn-primary" type="submit">Submit</button>
      </form>
    </div>
  );
}

function UnlicensedForm({ onDone }: { onDone: (email: string, firstName: string, lastName: string) => void }) {
  const [f, setF] = useState({ first: "", second: "", third: "", last: "", nationality: "", nationalId: "", dob: "", gender: "", idExpiry: "", phone: "", email: "", password: "", confirm: "", accept: false });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.accept || !f.email || f.password !== f.confirm) return alert("Check inputs");
    onDone(f.email, f.first, f.last);
    alert("Your registration is pending admin approval.");
  };
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-xl font-semibold mb-4">Unlicensed Agent Registration</h2>
      <form onSubmit={submit} className="grid gap-3">
        <div className="grid sm:grid-cols-4 gap-3">
          <input className="input" placeholder="First" value={f.first} onChange={(e) => setF({ ...f, first: e.target.value })} />
          <input className="input" placeholder="Second" value={f.second} onChange={(e) => setF({ ...f, second: e.target.value })} />
          <input className="input" placeholder="Third (optional)" value={f.third} onChange={(e) => setF({ ...f, third: e.target.value })} />
          <input className="input" placeholder="Last" value={f.last} onChange={(e) => setF({ ...f, last: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Nationality" value={f.nationality} onChange={(e) => setF({ ...f, nationality: e.target.value })} />
          <input className="input" placeholder="National ID" value={f.nationalId} onChange={(e) => setF({ ...f, nationalId: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <input className="input" type="date" placeholder="Date of Birth" value={f.dob} onChange={(e) => setF({ ...f, dob: e.target.value })} />
          <select className="input" value={f.gender} onChange={(e) => setF({ ...f, gender: e.target.value })}>
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input className="input" type="date" placeholder="ID Expiry Date" value={f.idExpiry} onChange={(e) => setF({ ...f, idExpiry: e.target.value })} />
        </div>
        <input className="input" type="file" placeholder="Upload ID or Passport" />
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Phone Number" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <input className="input" placeholder="Email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="input" placeholder="Password" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <input className="input" placeholder="Confirm Password" type="password" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={f.accept} onChange={(e) => setF({ ...f, accept: e.target.checked })} />
          Accept Terms & Conditions
        </label>
        <button className="btn-primary" type="submit">Submit</button>
      </form>
    </div>
  );
}