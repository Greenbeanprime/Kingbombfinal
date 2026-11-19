"use client";

import { useId, useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function SignupForm({ compact = false }: { compact?: boolean }) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();

    if (!EMAIL_RE.test(email)) {
      setStatus({ kind: "error", message: "Please enter a valid email address, like name@example.com." });
      form.querySelector<HTMLInputElement>("input[name=email]")?.focus();
      return;
    }

    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: data.get("website") || "" }),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (res.ok) {
        setStatus({ kind: "success", message: json.message || "Check your inbox to confirm." });
        form.reset();
      } else {
        setStatus({ kind: "error", message: json.message || "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ kind: "error", message: "Network hiccup. Check your connection and try again." });
    }
  }

  const invalid = status.kind === "error";

  return (
    <form onSubmit={onSubmit} noValidate className="w-full" aria-describedby={`${id}-status`}>
      <div className={`flex flex-col gap-3 ${compact ? "" : "sm:flex-row"}`}>
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
          required
          maxLength={254}
          placeholder="you@email.com"
          aria-invalid={invalid || undefined}
          className={`h-14 w-full min-w-0 shrink-0 ${compact ? "" : "sm:flex-1"} rounded-lg border-2 border-gold/70 bg-ink/70 px-4 text-base text-cream placeholder:text-cream/50 focus:border-gold-hi focus:outline-none`}
        />
        {/* Spam trap: humans never see or fill this. */}
        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-website`}>Leave this empty</label>
          <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <button
          type="submit"
          disabled={status.kind === "loading"}
          className="h-14 w-full shrink-0 rounded-lg bg-gold-hi px-6 font-display text-base font-bold uppercase tracking-[0.14em] text-ink shadow-[inset_0_-3px_0_rgb(0_0_0/0.18)] transition active:translate-y-px disabled:opacity-70 sm:w-auto"
        >
          {status.kind === "loading" ? "Joining…" : "Join the List"}
        </button>
      </div>
      <p
        id={`${id}-status`}
        role="status"
        aria-live="polite"
        className={`mt-3 text-base empty:mt-0 ${status.kind === "success" ? "text-gold-hi" : "text-[#ff9aa9]"}`}
      >
        {status.kind === "success" || status.kind === "error" ? status.message : ""}
      </p>
    </form>
  );
}
