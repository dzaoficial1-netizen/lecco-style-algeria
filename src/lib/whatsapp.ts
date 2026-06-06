const MERCHANT_PHONE = "213776897923";

export interface WhatsAppOrderPayload {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  wilaya: string;
  address: string;
  notes?: string;
  items: { name: string; size: string; color: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(n) + " DA";

/** Build the wa.me URL for a placed order — opens WhatsApp with the prefilled message. */
export function buildWhatsAppOrderUrl(o: WhatsAppOrderPayload): string {
  const lines = [
    `*🛍 NEW ORDER · ${o.orderNumber}*`,
    "",
    `*Customer:* ${o.customerName}`,
    `*Phone:* +${o.customerPhone.replace(/^\+?/, "")}`,
    `*Wilaya:* ${o.wilaya}`,
    `*Address:* ${o.address}`,
    o.notes ? `*Notes:* ${o.notes}` : "",
    "",
    "*Items:*",
    ...o.items.map(
      (i, idx) =>
        `${idx + 1}. ${i.name} — Size ${i.size} · x${i.qty} — ${fmt(i.price * i.qty)}`,
    ),
    "",
    `Subtotal: ${fmt(o.subtotal)}`,
    `Shipping: ${fmt(o.shipping)}`,
    `*TOTAL: ${fmt(o.total)}*`,
    "",
    "Cash on Delivery",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${MERCHANT_PHONE}?text=${encodeURIComponent(lines)}`;
}