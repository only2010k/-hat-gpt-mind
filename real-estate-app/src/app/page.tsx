"use client";

import { FormEvent, useMemo, useState } from "react";

type ApiResult = {
  ok: boolean;
  status: number;
  message: string;
  details?: unknown;
};

type FieldError = {
  field: "apiKey" | "phoneNumber" | "message";
  message: string;
};

function formatDetails(details: unknown) {
  if (details === null || details === undefined) return "";
  if (typeof details === "string") return details;
  return JSON.stringify(details, null, 2);
}

export default function InteraktToolPage() {
  const [apiKey, setApiKey] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState<ApiResult | null>(null);
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("Hi! This message was sent from the Interakt tester.");
  const [sendLoading, setSendLoading] = useState(false);
  const [sendResult, setSendResult] = useState<ApiResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);

  const verifyDisabled = verifyLoading || !apiKey.trim();
  const sendDisabled =
    sendLoading || !apiKey.trim() || !phoneNumber.trim() || !message.trim();

  const fieldErrorMap = useMemo(() => {
    return fieldErrors.reduce<Record<string, string>>((acc, item) => {
      acc[item.field] = item.message;
      return acc;
    }, {});
  }, [fieldErrors]);

  const handleVerify = async () => {
    const sanitizedKey = apiKey.trim();
    setFieldErrors((current) => {
      const others = current.filter((item) => item.field !== "apiKey");
      if (!sanitizedKey) {
        return [...others, { field: "apiKey", message: "API key is required." }];
      }
      return others;
    });

    if (!sanitizedKey) {
      setVerifyResult({
        ok: false,
        status: 0,
        message: "Please provide your Interakt API key before testing.",
      });
      return;
    }

    setVerifyLoading(true);
    setVerifyResult(null);

    try {
      const response = await fetch("/api/interakt/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: sanitizedKey }),
      });

      let payload: ApiResult | null = null;
      try {
        payload = (await response.json()) as ApiResult;
      } catch {
        payload = null;
      }

      setVerifyResult(
        payload ?? {
          ok: response.ok,
          status: response.status,
          message: response.ok
            ? "Verification request completed."
            : "Verification request failed.",
        }
      );
    } catch (error) {
      setVerifyResult({
        ok: false,
        status: 0,
        message:
          error instanceof Error
            ? error.message
            : "Unexpected error while verifying the API key.",
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors: FieldError[] = [];
    if (!apiKey.trim()) {
      errors.push({ field: "apiKey", message: "API key is required." });
    }
    if (!phoneNumber.trim()) {
      errors.push({
        field: "phoneNumber",
        message: "Enter the WhatsApp number you want to message.",
      });
    }
    if (!message.trim()) {
      errors.push({
        field: "message",
        message: "Message content cannot be empty.",
      });
    }

    setFieldErrors(errors);
    if (errors.length > 0) {
      setSendResult({
        ok: false,
        status: 0,
        message: "Fix the highlighted fields before sending.",
      });
      return;
    }

    setSendLoading(true);
    setSendResult(null);

    try {
      const response = await fetch("/api/interakt/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          countryCode: countryCode.trim() || "+91",
          phoneNumber: phoneNumber.trim(),
          message: message.trim(),
        }),
      });

      let payload: ApiResult | null = null;
      try {
        payload = (await response.json()) as ApiResult;
      } catch {
        payload = null;
      }

      setSendResult(
        payload ?? {
          ok: response.ok,
          status: response.status,
          message: response.ok
            ? "Message request submitted to Interakt."
            : "Message request failed.",
        }
      );
    } catch (error) {
      setSendResult({
        ok: false,
        status: 0,
        message:
          error instanceof Error
            ? error.message
            : "Unexpected error while sending the message.",
      });
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-12 sm:px-8">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
            <span>Interakt Toolkit</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Interakt API Key Tester
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-300">
            Paste your Interakt REST API key, validate that it works, and send a
            plain WhatsApp message without a template. Nothing is stored on the
            server; requests are proxied directly to Interakt.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-blue-500/5 backdrop-blur sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">1. Check your API key</h2>
              <p className="mt-1 text-sm text-slate-300">
                We call Interakt&apos;s template listing endpoint and report back
                whatever the API returns. HTTP 401 means the key is invalid.
              </p>
            </div>
            <button
              type="button"
              onClick={handleVerify}
              disabled={verifyDisabled}
              className="inline-flex h-10 items-center justify-center rounded-full bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 disabled:cursor-not-allowed disabled:bg-white/10"
            >
              {verifyLoading ? "Testing..." : "Test key"}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-200">
              Interakt API key
            </label>
            <input
              type="password"
              autoComplete="off"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              className={`w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm shadow-inner shadow-black/40 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${
                fieldErrorMap.apiKey ? "border-rose-400" : ""
              }`}
              placeholder="Paste the API key from your Interakt dashboard"
            />
            {fieldErrorMap.apiKey && (
              <p className="text-sm text-rose-300">{fieldErrorMap.apiKey}</p>
            )}
          </div>

          {verifyResult && (
            <div
              className={`mt-6 rounded-2xl border px-5 py-4 text-sm ${
                verifyResult.ok
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                  : "border-rose-400/40 bg-rose-400/10 text-rose-100"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.2em]">
                <span>{verifyResult.ok ? "Success" : "Error"}</span>
                <span>Status {verifyResult.status}</span>
              </div>
              <p className="mt-3 text-base font-semibold">
                {verifyResult.message}
              </p>
              {verifyResult.details && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs font-medium text-slate-200">
                    View response payload
                  </summary>
                  <pre className="mt-2 max-h-64 overflow-auto rounded-xl bg-black/40 p-4 text-xs text-slate-200">
                    {formatDetails(verifyResult.details)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-purple-500/5 backdrop-blur sm:p-8">
          <h2 className="text-xl font-semibold">2. Send a plain message</h2>
          <p className="mt-1 text-sm text-slate-300">
            Interakt needs the receiver&apos;s WhatsApp number, a country code, and
            the message text. The call will fail if the number hasn&apos;t opted in
            to receive messages from your business.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSend}>
            <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
              <div>
                <label className="block text-sm font-medium text-slate-200">
                  Country code
                </label>
                <input
                  value={countryCode}
                  onChange={(event) => setCountryCode(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/40"
                  placeholder="+91"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200">
                  WhatsApp number
                </label>
                <input
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className={`mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/40 ${
                    fieldErrorMap.phoneNumber ? "border-rose-400" : ""
                  }`}
                  placeholder="9876543210"
                />
                {fieldErrorMap.phoneNumber && (
                  <p className="mt-1 text-sm text-rose-300">
                    {fieldErrorMap.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200">
                Message text
              </label>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={4}
                className={`mt-1 w-full rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/40 ${
                  fieldErrorMap.message ? "border-rose-400" : ""
                }`}
                placeholder="Enter the WhatsApp message you want to send"
              />
              {fieldErrorMap.message && (
                <p className="mt-1 text-sm text-rose-300">
                  {fieldErrorMap.message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={sendDisabled}
                className="inline-flex h-11 items-center justify-center rounded-full bg-purple-500 px-6 text-sm font-semibold text-white transition hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-300 disabled:cursor-not-allowed disabled:bg-white/10"
              >
                {sendLoading ? "Sending..." : "Send message"}
              </button>
              <p className="text-xs text-slate-400">
                Regular (non-template) messages are allowed only during the 24
                hour session window.
              </p>
            </div>
          </form>

          {sendResult && (
            <div
              className={`mt-6 rounded-2xl border px-5 py-4 text-sm ${
                sendResult.ok
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                  : "border-rose-400/40 bg-rose-400/10 text-rose-100"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.2em]">
                <span>{sendResult.ok ? "Success" : "Error"}</span>
                <span>Status {sendResult.status}</span>
              </div>
              <p className="mt-3 text-base font-semibold">
                {sendResult.message}
              </p>
              {sendResult.details && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs font-medium text-slate-200">
                    View response payload
                  </summary>
                  <pre className="mt-2 max-h-64 overflow-auto rounded-xl bg-black/40 p-4 text-xs text-slate-200">
                    {formatDetails(sendResult.details)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
