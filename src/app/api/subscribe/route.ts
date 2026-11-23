import { createHash } from "node:crypto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (status: number, message: string) => Response.json({ message }, { status });

export async function POST(req: Request) {
  let body: { email?: unknown; website?: unknown };
  try {
    body = await req.json();
  } catch {
    return json(400, "Something went wrong. Please try again.");
  }

  // Honeypot: bots fill every field. Pretend it worked so they move on.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json(200, "You’re on the list! See you late night.");
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json(400, "Please enter a valid email address, like name@example.com.");
  }

  const { MAILCHIMP_API_KEY: key, MAILCHIMP_LIST_ID: list, MAILCHIMP_SERVER_PREFIX: dc } = process.env;
  if (!key || !list || !dc) {
    console.error("[subscribe] Mailchimp env vars are missing");
    return json(503, "Signups are temporarily unavailable. Please try again soon.");
  }

  const hash = createHash("md5").update(email).digest("hex");
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${encodeURIComponent(list)}/members/${hash}`;

  try {
    // PUT = add-or-update. Single opt-in: new people are subscribed immediately
    // (no confirmation email). Existing members keep their status, so anyone who
    // unsubscribed is never re-added without their consent.
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(`kingbomb:${key}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email, status_if_new: "subscribed" }),
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as { status?: string; title?: string; detail?: string };

    if (res.ok) {
      if (data.status === "pending") return json(200, "Almost there! Check your inbox for the link we sent earlier.");
      return json(200, "You’re on the list! See you late night.");
    }

    console.error("[subscribe] Mailchimp error", res.status, data.title, data.detail);
    if (data.title === "Forgotten Email Not Subscribed" || data.title === "Member In Compliance State") {
      return json(400, "That address previously unsubscribed. Use a different email, or resubscribe from an old KINGBOMB email.");
    }
    if (data.title === "Invalid Resource") {
      return json(400, "That email doesn’t look right. Please double-check it.");
    }
    return json(502, "We couldn’t add you just now. Please try again in a minute.");
  } catch (err) {
    console.error("[subscribe] network error", err);
    return json(502, "We couldn’t add you just now. Please try again in a minute.");
  }
}
