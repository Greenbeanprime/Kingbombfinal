import type Stripe from "stripe";
import { Resend } from "resend";
import { stripe } from "@/lib/stripe";
import { customerEmail, ownerEmail, type OrderEmailData } from "@/lib/emails";
import { siteUrl } from "@/lib/site";

/**
 * Stripe → POST /api/stripe/webhook
 * Subscribe this endpoint to: checkout.session.completed
 * (and optionally checkout.session.async_payment_succeeded).
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) return new Response("Missing signature or secret", { status: 400 });

  // Signature verification needs the exact raw body.
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
    return Response.json({ received: true, ignored: event.type });
  }

  const partial = event.data.object as Stripe.Checkout.Session;
  // Card/Apple Pay/Google Pay are "paid" immediately. Delayed methods fire async_payment_succeeded later.
  if (partial.payment_status === "unpaid") return Response.json({ received: true, pending: true });

  try {
    const session = await stripe().checkout.sessions.retrieve(partial.id, {
      expand: ["line_items", "total_details.breakdown"],
    });
    const data = toEmailData(session);
    await sendEmails(data, session.id);
    return Response.json({ received: true });
  } catch (err) {
    console.error("[webhook] failed to process order", err);
    // 500 tells Stripe to retry later. Idempotency keys stop duplicate emails.
    return new Response("Processing error", { status: 500 });
  }
}

function toEmailData(s: Stripe.Checkout.Session): OrderEmailData {
  const md = s.metadata ?? {};
  // Newer API versions put shipping under collected_information.
  const loose = s as unknown as {
    shipping_details?: { name?: string; address?: Stripe.Address | null } | null;
    collected_information?: { shipping_details?: { name?: string; address?: Stripe.Address | null } | null } | null;
  };
  const ship = loose.collected_information?.shipping_details ?? loose.shipping_details ?? null;
  const a = ship?.address;
  const address = a
    ? [ship?.name, a.line1, a.line2, [a.city, a.state].filter(Boolean).join(", ") + (a.postal_code ? ` ${a.postal_code}` : "")]
        .filter((x) => x && String(x).trim())
        .join("\n")
    : "";

  const breakdown = s.total_details?.breakdown?.discounts ?? [];
  const discountLabel = breakdown
    .map((d) => {
      const disc = d.discount as unknown as { coupon?: { name?: string | null }; source?: { coupon?: { name?: string | null } | string } };
      const src = disc.source?.coupon;
      return disc.coupon?.name || (typeof src === "object" ? src?.name : "") || "";
    })
    .filter(Boolean)
    .join(", ");

  const created = new Date(s.created * 1000).toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return {
    orderNumber: md.order_number || s.client_reference_id || s.id.slice(-8).toUpperCase(),
    customerName: md.customer_name || s.customer_details?.name || "Customer",
    customerEmail: s.customer_details?.email || "",
    customerPhone: md.customer_phone || s.customer_details?.phone || "",
    fulfillment: md.fulfillment === "delivery" ? "delivery" : "pickup",
    address,
    notes: md.notes || "",
    items: (s.line_items?.data ?? []).map((li) => ({
      name: li.description || "Item",
      qty: li.quantity ?? 1,
      total: li.amount_subtotal ?? li.amount_total,
    })),
    subtotal: s.amount_subtotal ?? 0,
    discount: s.total_details?.amount_discount ?? 0,
    discountLabel,
    tax: s.total_details?.amount_tax ?? 0,
    total: s.amount_total ?? 0,
    createdAt: created,
    stripeUrl: `https://dashboard.stripe.com/${s.livemode ? "" : "test/"}payments/${
      typeof s.payment_intent === "string" ? s.payment_intent : (s.payment_intent?.id ?? "")
    }`,
    logoUrl: `${siteUrl()}/email-logo.png`,
    siteUrl: siteUrl(),
  };
}

async function sendEmails(d: OrderEmailData, sessionId: string) {
  const key = process.env.RESEND_API_KEY;
  const owner = process.env.ORDER_NOTIFICATION_EMAIL;
  const from = process.env.ORDER_FROM_EMAIL || "KINGBOMB <orders@kingbomb.food>";
  if (!key) throw new Error("RESEND_API_KEY is not set");
  const resend = new Resend(key);

  const jobs: Promise<unknown>[] = [];
  if (d.customerEmail) {
    const m = customerEmail(d);
    jobs.push(
      resend.emails
        .send(
          { from, to: d.customerEmail, subject: m.subject, html: m.html, ...(owner ? { replyTo: owner } : {}) },
          { idempotencyKey: `order-customer-${sessionId}` },
        )
        .then(check("customer")),
    );
  }
  if (owner) {
    const m = ownerEmail(d);
    jobs.push(
      resend.emails
        .send(
          {
            from,
            to: owner.split(",").map((s) => s.trim()).filter(Boolean),
            subject: m.subject,
            html: m.html,
            ...(d.customerEmail ? { replyTo: d.customerEmail } : {}),
          },
          { idempotencyKey: `order-owner-${sessionId}` },
        )
        .then(check("owner")),
    );
  } else {
    console.warn("[webhook] ORDER_NOTIFICATION_EMAIL is not set; owner email skipped");
  }
  await Promise.all(jobs);
}

const check =
  (who: string) =>
  ({ error }: { error: { message: string; name?: string } | null }) => {
    if (error) throw new Error(`Resend ${who} email failed: ${error.name ?? ""} ${error.message}`);
  };
