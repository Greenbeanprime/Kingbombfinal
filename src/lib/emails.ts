import "server-only";

/** Phone-friendly, branded HTML emails. Table layout + inline styles for email clients. */

export type OrderEmailData = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  fulfillment: "pickup" | "delivery";
  address: string; // multi-line, delivery only
  notes: string;
  items: { name: string; qty: number; total: number }[]; // cents
  subtotal: number;
  discount: number;
  discountLabel: string;
  tax: number;
  total: number;
  createdAt: string;
  stripeUrl: string;
  logoUrl: string;
  siteUrl: string;
};

const C = {
  ink: "#0a0a08",
  green: "#0e3325",
  emerald: "#134e3a",
  gold: "#b09b63",
  goldHi: "#dabe7f",
  cream: "#f0e9d8",
  bomb: "#8f2235",
};

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

const nl2br = (s: string) => esc(s).replace(/\n/g, "<br>");

function shell(preheader: string, inner: string) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light"><meta name="supported-color-schemes" content="dark light">
<title>KINGBOMB</title>
<style>
  @media (max-width:620px){ .wrap{width:100%!important} .pad{padding:20px 16px!important} .h1{font-size:26px!important} }
</style></head>
<body style="margin:0;padding:0;background:${C.ink};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.ink};">
<tr><td align="center" style="padding:16px 8px;">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:${C.green};border:2px solid ${C.gold};border-radius:16px;">
${inner}
<tr><td class="pad" align="center" style="padding:20px 32px 28px;border-top:1px dashed ${C.gold};font-family:Georgia,'Times New Roman',serif;color:${C.cream};font-size:14px;line-height:1.5;opacity:.85;">
KINGBOMB · Ultra Late Night Delivery<br><span style="color:${C.goldHi};">kingbomb.food</span>
</td></tr>
</table></td></tr></table></body></html>`;
}

function header(logoUrl: string, title: string, sub: string) {
  return `<tr><td align="center" class="pad" style="padding:28px 32px 8px;">
<img src="${logoUrl}" width="120" height="120" alt="KINGBOMB" style="display:block;width:120px;height:120px;border:0;">
<h1 class="h1" style="margin:16px 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:30px;letter-spacing:3px;color:${C.goldHi};text-transform:uppercase;">${esc(title)}</h1>
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:${C.cream};">${sub}</p>
</td></tr>`;
}

function itemsTable(d: OrderEmailData) {
  const rows = d.items
    .map(
      (i) => `<tr>
<td style="padding:10px 0;border-bottom:1px solid rgba(176,155,99,.35);font-family:Arial,Helvetica,sans-serif;font-size:16px;color:${C.cream};">
<strong style="color:${C.goldHi};">${i.qty}×</strong> ${esc(i.name)}</td>
<td align="right" style="padding:10px 0;border-bottom:1px solid rgba(176,155,99,.35);font-family:Arial,Helvetica,sans-serif;font-size:16px;color:${C.cream};white-space:nowrap;">${money(i.total)}</td></tr>`,
    )
    .join("");
  const line = (label: string, val: string, strong = false) =>
    `<tr><td style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:${strong ? 19 : 16}px;color:${strong ? C.goldHi : C.cream};${strong ? "font-weight:bold;" : ""}">${label}</td>
<td align="right" style="padding:6px 0;font-family:Arial,Helvetica,sans-serif;font-size:${strong ? 19 : 16}px;color:${strong ? C.goldHi : C.cream};${strong ? "font-weight:bold;" : ""}white-space:nowrap;">${val}</td></tr>`;

  return `<tr><td class="pad" style="padding:20px 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
${line("Subtotal", money(d.subtotal))}
${d.discount > 0 ? line(`Discount${d.discountLabel ? ` (${esc(d.discountLabel)})` : ""}`, `−${money(d.discount)}`) : ""}
${d.tax > 0 ? line("Tax", money(d.tax)) : ""}
${line("Total", money(d.total), true)}
</table></td></tr>`;
}

function box(title: string, body: string) {
  return `<tr><td class="pad" style="padding:8px 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.emerald};border:1px solid ${C.gold};border-radius:12px;">
<tr><td style="padding:16px 18px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:${C.cream};">
<div style="font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:${C.goldHi};margin-bottom:6px;">${title}</div>
${body}</td></tr></table></td></tr>`;
}

export function customerEmail(d: OrderEmailData) {
  const how =
    d.fulfillment === "delivery"
      ? `<strong>Delivery</strong>${d.address ? `<br>${nl2br(d.address)}` : ""}`
      : `<strong>Pickup</strong><br>We’ll have it hot and ready. Watch for a text if we need you.`;
  const inner =
    header(d.logoUrl, "Order Confirmed", `Thanks, ${esc(d.customerName.split(" ")[0] || "friend")}! We’re firing it up.`) +
    box("Order Number", `<span style="font-size:22px;font-weight:bold;letter-spacing:1px;color:${C.goldHi};">${esc(d.orderNumber)}</span>`) +
    box(d.fulfillment === "delivery" ? "Delivery To" : "Pickup", how) +
    itemsTable(d) +
    (d.notes ? box("Your Notes", nl2br(d.notes)) : "") +
    `<tr><td class="pad" style="padding:8px 32px 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:${C.cream};opacity:.85;">
Questions about your order? Just reply to this email and mention order <strong>${esc(d.orderNumber)}</strong>.</td></tr>`;
  return {
    subject: `Your KINGBOMB order ${d.orderNumber} is confirmed`,
    html: shell(`Order ${d.orderNumber}: ${money(d.total)} · ${d.fulfillment}`, inner),
  };
}

export function ownerEmail(d: OrderEmailData) {
  const customer = [
    `<strong>${esc(d.customerName)}</strong>`,
    `📞 <a href="tel:${esc(d.customerPhone.replace(/[^\d+]/g, ""))}" style="color:${C.goldHi};">${esc(d.customerPhone)}</a>`,
    d.customerEmail ? `✉️ <a href="mailto:${esc(d.customerEmail)}" style="color:${C.goldHi};">${esc(d.customerEmail)}</a>` : "",
  ]
    .filter(Boolean)
    .join("<br>");
  const how =
    d.fulfillment === "delivery"
      ? `<strong style="color:${C.goldHi};font-size:18px;">DELIVERY</strong>${d.address ? `<br>${nl2br(d.address)}` : ""}`
      : `<strong style="color:${C.goldHi};font-size:18px;">PICKUP</strong>`;
  const inner =
    header(d.logoUrl, `New Order ${d.orderNumber}`, `${money(d.total)} · ${d.fulfillment === "delivery" ? "Delivery" : "Pickup"} · ${esc(d.createdAt)}`) +
    box("Fulfillment", how) +
    box("Customer", customer) +
    itemsTable(d) +
    box("Order Notes", d.notes ? nl2br(d.notes) : "<em>None</em>") +
    `<tr><td align="center" class="pad" style="padding:16px 32px 24px;">
<a href="${d.stripeUrl}" style="display:inline-block;padding:14px 24px;background:${C.bomb};border:2px solid ${C.goldHi};border-radius:10px;font-family:Georgia,serif;font-size:16px;letter-spacing:1px;color:${C.cream};text-decoration:none;text-transform:uppercase;">View in Stripe</a></td></tr>`;
  return {
    subject: `🔥 New ${d.fulfillment} order ${d.orderNumber}: ${money(d.total)} from ${d.customerName}`,
    html: shell(`${d.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}`, inner),
  };
}
