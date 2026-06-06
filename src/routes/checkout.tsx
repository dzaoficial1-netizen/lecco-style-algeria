import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WILAYAS } from "@/lib/wilayas";
import { useCart, useHydrated } from "@/lib/store";
import { formatDZD } from "@/lib/format";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createOrder } from "@/lib/orders.functions";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — LECCO Clothes" },
      { name: "description", content: "Cash on delivery across all 58 Wilayas." },
      { property: "og:title", content: "Checkout — LECCO Clothes" },
      { property: "og:description", content: "Cash on delivery across all 58 Wilayas." },
    ],
  }),
  component: CheckoutPage,
});

const Schema = z.object({
  fullName: z.string().min(2, "Required"),
  phone: z.string().regex(/^[0-9\s]{9,12}$/, "Enter a valid phone (digits only)"),
  email: z.string().email().optional().or(z.literal("")),
  wilaya: z.string().min(1, "Select a wilaya"),
  city: z.string().min(2, "Required"),
  address: z.string().min(4, "Required"),
  notes: z.string().optional(),
  delivery: z.enum(["home","bureau"]),
});
type FormVals = z.infer<typeof Schema>;

function CheckoutPage() {
  const { lines, total, clear } = useCart();
  const hydrated = useHydrated();
  const nav = useNavigate();
  const [done, setDone] = useState<null | { orderNumber: string; waUrl: string }>(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormVals>({
    resolver: zodResolver(Schema),
    defaultValues: { delivery: "home" },
  });

  const onSubmit = async (v: FormVals) => {
    setSubmitting(true);
    const shipping = v.delivery === "home" ? 600 : 400;
    try {
      const items = lines.map((l) => ({
        product_id: l.product.id,
        slug: l.product.slug,
        name: l.product.name,
        size: l.size,
        color: l.color,
        qty: l.qty,
        unit_price: l.product.price,
      }));
      const order = await createOrder({
        data: {
          customer_name: v.fullName,
          customer_phone: `+213${v.phone.replace(/\s/g, "")}`,
          customer_email: v.email || "",
          wilaya: v.wilaya,
          address: `${v.address}, ${v.city}`,
          notes: v.notes || "",
          shipping,
          items,
        },
      });
      const waUrl = buildWhatsAppOrderUrl({
        orderNumber: order.order_number,
        customerName: v.fullName,
        customerPhone: `+213${v.phone.replace(/\s/g, "")}`,
        wilaya: v.wilaya,
        address: `${v.address}, ${v.city}`,
        notes: v.notes,
        items: lines.map((l) => ({
          name: l.product.name, size: l.size, color: l.color, qty: l.qty, price: l.product.price,
        })),
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
      });
      clear();
      setDone({ orderNumber: order.order_number, waUrl });
      // Open WhatsApp in a new tab so the customer can also confirm directly.
      window.open(waUrl, "_blank", "noopener,noreferrer");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Order failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="pt-40 pb-24 container-edge text-center max-w-lg mx-auto">
        <CheckCircle2 size={56} className="mx-auto text-brand" />
        <h1 className="font-display text-5xl mt-6">Order Confirmed</h1>
        <p className="font-display text-2xl mt-3">#{done.orderNumber}</p>
        <p className="text-muted-foreground mt-3">We'll WhatsApp you shortly to confirm delivery. If WhatsApp didn't open automatically, tap the button below.</p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a href={done.waUrl} target="_blank" rel="noopener noreferrer" className="bg-brand text-paper px-6 py-3 eyebrow hover:opacity-90">Open WhatsApp</a>
          <Link to="/" className="border border-ink text-ink px-6 py-3 eyebrow hover:bg-ink hover:text-paper">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (hydrated && lines.length === 0) {
    return (
      <div className="pt-40 pb-24 container-edge text-center">
        <h1 className="font-display text-5xl">Your bag is empty</h1>
        <button onClick={()=>nav({to:"/shop"})} className="mt-6 bg-ink text-paper px-6 py-3 eyebrow hover:bg-brand">Shop the Drop</button>
      </div>
    );
  }

  const delivery = 600;
  const sub = total();

  return (
    <div className="pt-24 md:pt-28 container-edge pb-24">
      <p className="eyebrow text-muted-foreground">Step 02</p>
      <h1 className="font-display text-5xl md:text-7xl mt-2">Checkout</h1>

      <div className="mt-10 grid md:grid-cols-[1fr_420px] gap-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <section>
            <h2 className="font-display text-2xl mb-4">Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" error={errors.fullName?.message}>
                <input {...register("fullName")} className="input" />
              </Field>
              <Field label="Phone (+213)" error={errors.phone?.message}>
                <div className="flex">
                  <span className="bg-secondary px-3 flex items-center text-sm border border-r-0 border-border">+213</span>
                  <input {...register("phone")} placeholder="776 897 923" className="input flex-1" />
                </div>
              </Field>
              <Field label="Email (optional)" error={errors.email?.message}>
                <input type="email" {...register("email")} className="input" />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Shipping Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Wilaya" error={errors.wilaya?.message}>
                <select {...register("wilaya")} className="input">
                  <option value="">Select a wilaya…</option>
                  {WILAYAS.map(w => <option key={w.code} value={w.name}>{w.code} — {w.name}</option>)}
                </select>
              </Field>
              <Field label="City / Commune" error={errors.city?.message}>
                <input {...register("city")} className="input" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Street Address" error={errors.address?.message}>
                  <input {...register("address")} className="input" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Notes (optional)">
                  <textarea {...register("notes")} rows={3} className="input" />
                </Field>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl mb-4">Delivery</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="border border-border p-4 cursor-pointer has-checked:border-ink">
                <input type="radio" value="home" {...register("delivery")} className="accent-brand" />
                <span className="ml-3 font-display text-lg">Home Delivery</span>
                <p className="text-xs text-muted-foreground mt-1">2–5 business days · 600 DA</p>
              </label>
              <label className="border border-border p-4 cursor-pointer has-checked:border-ink">
                <input type="radio" value="bureau" {...register("delivery")} className="accent-brand" />
                <span className="ml-3 font-display text-lg">Bureau Pickup</span>
                <p className="text-xs text-muted-foreground mt-1">Stop desk · 400 DA</p>
              </label>
            </div>
          </section>

          <button type="submit" disabled={submitting} className="w-full md:w-auto md:px-12 bg-ink text-paper py-4 eyebrow hover:bg-brand transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? "Placing Order…" : "Place Order · Cash on Delivery"}
          </button>
        </form>

        {/* Summary */}
        <aside className="bg-secondary p-6 self-start md:sticky md:top-24">
          <h2 className="font-display text-2xl mb-4">Your Bag</h2>
          <ul className="divide-y divide-border">
            {lines.map(l => (
              <li key={l.id} className="py-3 flex gap-3">
                <img src={l.product.image} className="w-14 h-16 object-cover bg-paper" alt="" />
                <div className="flex-1 text-sm">
                  <p className="font-display text-base leading-tight">{l.product.name}</p>
                  <p className="text-xs text-muted-foreground">Size {l.size} · Qty {l.qty}</p>
                </div>
                <p className="font-display text-sm">{formatDZD(l.product.price * l.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="border-t border-border mt-4 pt-4 space-y-1 text-sm">
            <Row label="Subtotal" value={formatDZD(sub)} />
            <Row label="Delivery" value={formatDZD(delivery)} />
            <div className="flex justify-between pt-3 mt-2 border-t border-border">
              <span className="eyebrow">Total</span>
              <span className="font-display text-2xl">{formatDZD(sub + delivery)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="text-xs text-brand mt-1 block">{error}</span>}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}