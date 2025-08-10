"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";

export default function GeneralRegisterPage() {
  const { login, startEmailVerification } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    phone: "",
    password: "",
    confirm: "",
    accept: false,
  });
  const [token, setToken] = useState<string | null>(null);
  const [afterRegMode, setAfterRegMode] = useState<"all" | "new" | "off">("new");
  const [idMode, setIdMode] = useState<"mandatory" | "optional" | "disabled">("optional");
  const [idForm, setIdForm] = useState({ nationality: "", nationalId: "" });
  const [idTaken, setIdTaken] = useState(false);

  const onSubmitReg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.accept) return alert("Please accept Terms & Conditions");
    if (!form.email || !form.password || form.password !== form.confirm) return alert("Check your inputs");
    login({ id: crypto.randomUUID(), email: form.email, firstName: form.firstName, lastName: form.lastName, role: "general", verified: false });
    const t = startEmailVerification(form.email);
    setToken(t);
    setStep(2);
  };

  const onCheckId = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo uniqueness check: pretend ids ending with "0" are taken
    if (idForm.nationalId.trim().endsWith("0")) {
      setIdTaken(true);
    } else {
      setIdTaken(false);
      setStep(4);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-xl font-semibold mb-4">General User Registration</h1>

      {step === 1 && (
        <form onSubmit={onSubmitReg} className="grid gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="input" placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input className="input" placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <input className="input" placeholder="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input className="input" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <input className="input sm:col-span-2" placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input className="input" placeholder="Confirm Password" type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.accept} onChange={(e) => setForm({ ...form, accept: e.target.checked })} />
            Accept Terms & Conditions
          </label>
          <button className="btn-primary" type="submit">Register</button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="font-semibold">Verify your email</h2>
          <p className="text-sm text-zinc-600">Check inbox and junk mail to verify.</p>
          {token && (
            <Link className="text-blue-600 underline" href={`/verify?token=${token}`}>Simulate clicking verification link</Link>
          )}
          <div className="pt-6">
            <h3 className="font-semibold mb-2">After Registration Page (Admin Controlled)</h3>
            <div className="flex gap-3">
              <button className={`chip ${afterRegMode === "all" ? "chip-on" : ""}`} onClick={() => setAfterRegMode("all")}>Show for all users</button>
              <button className={`chip ${afterRegMode === "new" ? "chip-on" : ""}`} onClick={() => setAfterRegMode("new")}>Show only for new users</button>
              <button className={`chip ${afterRegMode === "off" ? "chip-on" : ""}`} onClick={() => setAfterRegMode("off")}>Disable</button>
            </div>
            {afterRegMode !== "off" && <div className="mt-3 rounded-lg border p-4">Welcome! This is the after-registration page.</div>}
          </div>
          <div className="pt-6">
            <h3 className="font-semibold mb-2">National ID Submission (Configurable)</h3>
            <div className="flex gap-3">
              <button className={`chip ${idMode === "mandatory" ? "chip-on" : ""}`} onClick={() => setIdMode("mandatory")}>Mandatory</button>
              <button className={`chip ${idMode === "optional" ? "chip-on" : ""}`} onClick={() => setIdMode("optional")}>Optional</button>
              <button className={`chip ${idMode === "disabled" ? "chip-on" : ""}`} onClick={() => setIdMode("disabled")}>Disabled</button>
            </div>
            {idMode !== "disabled" && (
              <form onSubmit={onCheckId} className="mt-3 grid gap-3">
                <input className="input" placeholder="Nationality" value={idForm.nationality} onChange={(e) => setIdForm({ ...idForm, nationality: e.target.value })} />
                <input className="input" placeholder="National ID Number" value={idForm.nationalId} onChange={(e) => setIdForm({ ...idForm, nationalId: e.target.value })} />
                <button className="btn-secondary" type="submit">Submit</button>
              </form>
            )}
            {idMode === "mandatory" && <p className="text-xs text-zinc-500 mt-1">Required before proceeding.</p>}
          </div>
          {idMode !== "disabled" && !idTaken && (
            <div className="pt-6">
              <h3 className="font-semibold mb-2">Save Searching Promo</h3>
              <div className="rounded-lg border p-4">
                Verify now to unlock more features (e.g., more Save Searches)?
                <div className="mt-3 flex gap-2">
                  <button className="btn-primary">Verify Now</button>
                  <button className="btn-secondary">Skip for Now</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="font-semibold">ID accepted</h2>
          <p className="text-sm">Choose:</p>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={() => alert("Complete and verify profile")}>Complete and verify profile</button>
            <button className="btn-secondary" onClick={() => alert("Skip for now")}>Skip for now</button>
          </div>
        </div>
      )}

      {idTaken && (
        <div className="mt-8">
          <h2 className="font-semibold">Fallback Verification Form (ID taken)</h2>
          <form className="grid gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="input" placeholder="First Name" />
              <input className="input" placeholder="Second Name" />
            </div>
            <input className="input" placeholder="Third Name (optional)" />
            <input className="input" placeholder="Last Name" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="input" placeholder="Nationality" />
              <input className="input" placeholder="National ID" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input className="input" placeholder="Date of Birth" type="date" />
              <input className="input" placeholder="ID Expiry Date" type="date" />
              <select className="input"><option>Male</option><option>Female</option><option>Other</option></select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="input" placeholder="Upload National ID (Front)" type="file" />
              <input className="input" placeholder="Upload National ID (Back)" type="file" />
            </div>
            <button className="btn-primary" type="button" onClick={() => alert("Submitted for admin review")}>Submit for Review</button>
          </form>
          <p className="text-xs text-zinc-500 mt-2">System will notify 1 month before expiry with a red indicator.</p>
        </div>
      )}

      <style jsx global>{`
        .input { border: 1px solid rgb(0 0 0 / .1); background: white; color: inherit; border-radius: 12px; padding: 10px 12px; }
        .btn-primary { background: rgb(37 99 235); color: white; padding: 10px 14px; border-radius: 10px; }
        .btn-secondary { background: rgb(244 244 245); color: inherit; padding: 10px 14px; border-radius: 10px; }
        .chip { padding: 6px 10px; border-radius: 999px; background: rgb(244 244 245); }
        .chip-on { background: rgb(219 234 254); color: rgb(37 99 235); }
      `}</style>
    </div>
  );
}