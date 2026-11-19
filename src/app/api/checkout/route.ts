import type Stripe from "stripe";
import { DELIVERY_FEE, findItem, orderingOn, toCents } from "@/data/menu";
import { stripe } from "@/lib/stripe";
import { SITE, siteUrl } from "@/lib/site";

const fail = (status: number, message: string) => Response.json({ message }, { status });

type Body = {
  items?: { id?: unknown; qty?: unknown }[];
  fulfillment?: unknown;
  name?: unknown;
  phone?: unknown;
  notes?: unknown;
};

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max) : "";

export async function POST(req: Request) {
  if (!orderingOn()) return fail(403, "Online ordering isn’t open yet. Check back soon!");

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return fail(400, "Something went wrong. Please try again.");
  }

  const fulfillment = body.fulfillment === "delivery" ? "delivery" : body.fulfillment === "pickup" ? "pickup" : null;
  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20);
  const notes = clean(body.notes, 450);
  if (!fulfillment) return fail(400, "Please choose Pickup or Delivery.");
  if (name.length < 2) return fail(400, "Please enter your name.");
  if (phone.replace(/\D/g, "").length < 10) return fail(400, "Please enter a valid phone number.");

  // Prices always come from the menu file on the server, never from the browser.
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const summary: string[] = [];
  for (const raw of Array.isArray(body.items) ? body.items.slice(0, 50) : []) {
    const item = typeof raw?.id === "string" ? findItem(raw.id) : undefined;
    const qty = Number(raw?.qty);
    if (!item || !Number.isInteger(qty) || qty < 1 || qty > 20) {
      return fail(400, "Something in your cart is no longer available. Please review your cart.");
    }
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: "usd",
        unit_amount: toCents(item.price),
        product_data: {
          name: item.name,
          ...(item.description ? { description: item.description.slice(0, 200) } : {}),
          ...(item.image ? { images: [`${siteUrl()}${item.image}`] } : {}),
          metadata: { menu_id: item.id },
        },
      },
    });
    summary.push(`${qty}x ${item.id}`);
  }
  if (!lineItems.length) return fail(400, "Your cart is empty.");

  if (fulfillment === "delivery" && DELIVERY_FEE > 0) {
    lineItems.push({
      quantity: 1,
      price_data: { currency: "usd", unit_amount: toCents(DELIVERY_FEE), product_data: { name: "Delivery fee" } },
    });
  }

  const orderNumber = `KB-${Date.now().toString(36).toUpperCase().slice(-5)}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  const base = siteUrl();

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      allow_promotion_codes: true,
      // Apple Pay / Google Pay appear automatically when enabled in the Stripe Dashboard.
      billing_address_collection: "auto",
      ...(fulfillment === "delivery" ? { shipping_address_collection: { allowed_countries: ["US"] } } : {}),
      customer_creation: "if_required",
      client_reference_id: orderNumber,
      metadata: {
        order_number: orderNumber,
        fulfillment,
        customer_name: name,
        customer_phone: phone,
        notes,
        items: summary.join(", ").slice(0, 500),
      },
      payment_intent_data: {
        description: `${SITE.name} order ${orderNumber} (${fulfillment})`,
        metadata: { order_number: orderNumber },
      },
      success_url: `${base}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/order`,
    });
    if (!session.url) throw new Error("No Checkout URL returned");
    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Stripe error", err);
    return fail(502, "Checkout is unavailable right now. Please try again in a minute.");
  }
}
