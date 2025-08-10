"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";

function VerifyInner() {
  const params = useSearchParams();
  const { verifyByToken } = useAuth();
  const [status, setStatus] = useState<"checking" | "ok" | "fail">("checking");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("fail");
      return;
    }
    const ok = verifyByToken(token);
    setStatus(ok ? "ok" : "fail");
  }, [params, verifyByToken]);

  if (status === "checking") return <div className="p-8">Verifying...</div>;
  if (status === "fail") return <div className="p-8">Invalid or expired verification link.</div>;
  return <div className="p-8">Your email has been verified. You can now use all features.</div>;
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <VerifyInner />
    </Suspense>
  );
}