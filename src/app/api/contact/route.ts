import { Resend } from "resend";
import { esc } from "@/lib/emails";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const reply = (status: number, message: string) => Response.json({ message }, { status });

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b-\u001f\u007f]+/g, " ").trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return reply(400, "Something went wrong. Please try again.");
  }

  // Honeypot: real people never fill this hidden field. Pretend success for bots.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return reply(200, "Thanks! Your message is on its way.");
  }

  const name = clean(body.name, 80);
  const email = clean(body.email, 254).toLowerCase();
  const phone = clean(body.phone, 30);
  const message = clean(body.message, 3000);

  if (name.length < 2) return reply(400, "Please enter your name.");
  if (!EMAIL_RE.test(email)) return reply(400, "Please enter a valid email address, like name@example.com.");
  if (message.length < 5) return reply(400, "Please write a short message.");

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL || process.env.ORDER_NOTIFICATION_EMAIL;
  const from = process.env.ORDER_FROM_EMAIL || "KINGBOMB <orders@kingbomb.food>";
  if (!key || !to) {
    console.error("[contact] RESEND_API_KEY or CONTACT_EMAIL/ORDER_NOTIFICATION_EMAIL is not set");
    return reply(503, "Messages can't be sent right now. Please try again soon.");
  }

  const gold = "#dabe7f";
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;font-family:Georgia,serif;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:${gold};width:90px;vertical-align:top;">${label}</td><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#f0e9d8;">${value}</td></tr>`;
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:16px 8px;background:#0a0a08;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#0e3325;border:2px solid #b09b63;border-radius:14px;">
<tr><td style="padding:24px 24px 8px;font-family:Georgia,serif;font-size:22px;letter-spacing:2px;color:${gold};text-transform:uppercase;">New website message</td></tr>
<tr><td style="padding:8px 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row("From", esc(name))}
${row("Email", `<a href="mailto:${esc(email)}" style="color:${gold};">${esc(email)}</a>`)}
${phone ? row("Phone", `<a href="tel:${esc(phone.replace(/[^\d+]/g, ""))}" style="color:${gold};">${esc(phone)}</a>`) : ""}
</table></td></tr>
<tr><td style="padding:8px 24px 24px;"><div style="background:#134e3a;border:1px solid #b09b63;border-radius:10px;padding:14px 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#f0e9d8;">${esc(message).replace(/\n/g, "<br>")}</div>
<p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#f0e9d8;opacity:.8;">Hit Reply to answer ${esc(name.split(" ")[0])} directly.</p></td></tr>
</table></td></tr></table></body></html>`;

  try {
    const { error } = await new Resend(key).emails.send({
      from,
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      replyTo: email,
      subject: `New message from ${name} (kingbomb.food)`,
      html,
      text: `From: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}\n\n${message}`,
    });
    if (error) throw new Error(`${error.name ?? ""} ${error.message}`);
    return reply(200, "Thanks! Your message is on its way. We’ll get back to you soon.");
  } catch (err) {
    console.error("[contact] send failed", err);
    return reply(502, "We couldn’t send your message just now. Please try again in a minute.");
  }
}
