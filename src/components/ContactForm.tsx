"use client";

import { useState } from "react";

type Status = { kind: "idle" | "loading" | "success" | "error"; message?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const field =
  "h-14 w-full rounded-lg border-2 border-gold/60 bg-ink/70 px-4 text-base text-cream placeholder:text-cream/45 focus:border-gold-hi focus:outline-none";
const labelCls = "mb-2 block font-display text-sm font-bold uppercase tracking-[0.14em] text-gold-hi";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const payload = {
      name: String(d.get("name") || "").trim(),
      email: String(d.get("email") || "").trim(),
      phone: String(d.get("phone") || "").trim(),
      message: String(d.get("message") || "").trim(),
      website: String(d.get("website") || ""),
    };
    if (payload.name.length < 2) return setStatus({ kind: "error", message: "Please enter your name." });
    if (!EMAIL_RE.test(payload.email))
      return setStatus({ kind: "error", message: "Please enter a valid email address, like name@example.com." });
    if (payload.message.length < 5) return setStatus({ kind: "error", message: "Please write a short message." });

    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (res.ok) {
        setStatus({ kind: "success", message: json.message });
        form.reset();
      } else {
        setStatus({ kind: "error", message: json.message || "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ kind: "error", message: "Network hiccup. Check your connection and try again." });
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor="c-name" className={labelCls}>
          Name
        </label>
        <input id="c-name" name="name" type="text" autoComplete="name" enterKeyHint="next" required maxLength={80} className={field} />
      </div>
      <div>
        <label htmlFor="c-email" className={labelCls}>
          Email
        </label>
        <input
          id="c-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="next"
          required
          maxLength={254}
          placeholder="you@email.com"
          className={field}
        />
      </div>
      <div>
        <label htmlFor="c-phone" className={labelCls}>
          Phone <span className="font-sans text-sm normal-case tracking-normal text-cream/60">(optional)</span>
        </label>
        <input
          id="c-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          enterKeyHint="next"
          maxLength={30}
          className={field}
        />
      </div>
      <div>
        <label htmlFor="c-message" className={labelCls}>
          Message
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={5}
          required
          maxLength={3000}
          placeholder="Questions, catering, events, feedback…"
          className={`${field} h-auto py-3`}
        />
      </div>
      {/* Spam trap: hidden from people, bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor="c-website">Leave this empty</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button
        type="submit"
        disabled={status.kind === "loading"}
        className="min-h-14 w-full rounded-lg bg-gold-hi px-6 font-display text-base font-bold uppercase tracking-[0.14em] text-ink shadow-[inset_0_-3px_0_rgb(0_0_0/0.18)] transition active:translate-y-px disabled:opacity-70"
      >
        {status.kind === "loading" ? "Sending…" : "Send Message"}
      </button>
      <p
        role="status"
        aria-live="polite"
        className={`text-base empty:hidden ${status.kind === "success" ? "text-gold-hi" : "text-[#ff9aa9]"}`}
      >
        {status.kind === "success" || status.kind === "error" ? status.message : ""}
      </p>
    </form>
  );
}
