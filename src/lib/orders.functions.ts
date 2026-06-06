import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const OrderItem = z.object({
  product_id: z.string().uuid(),
  slug: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  size: z.string().min(1).max(20),
  color: z.string().min(1).max(30),
  qty: z.number().int().min(1).max(20),
  unit_price: z.number().int().min(0).max(10_000_000),
});

const CreateOrderInput = z.object({
  customer_name: z.string().trim().min(2).max(120),
  customer_phone: z.string().trim().regex(/^\+?[0-9\s]{6,30}$/, "Invalid phone"),
  customer_email: z.string().email().max(200).optional().or(z.literal("")),
  wilaya: z.string().trim().min(2).max(60),
  address: z.string().trim().min(5).max(500),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  shipping: z.number().int().min(0).max(100000),
  items: z.array(OrderItem).min(1).max(50),
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((input) => CreateOrderInput.parse(input))
  .handler(async ({ data }) => {
    // Re-price server-side against the products table — never trust client prices.
    const ids = Array.from(new Set(data.items.map((i) => i.product_id)));
    const { data: rows, error: prodErr } = await supabase
      .from("products")
      .select("id,price,title,slug,stock,is_active")
      .in("id", ids);
    if (prodErr) throw new Error(prodErr.message);

    const byId = new Map((rows ?? []).map((r) => [r.id, r]));
    let subtotal = 0;
    const verifiedItems = data.items.map((i) => {
      const p = byId.get(i.product_id);
      if (!p || !p.is_active) throw new Error(`Product unavailable: ${i.name}`);
      if (p.stock < i.qty) throw new Error(`Not enough stock for ${p.title}`);
      subtotal += p.price * i.qty;
      return { ...i, name: p.title, slug: p.slug, unit_price: p.price };
    });

    const total = subtotal + data.shipping;

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email || null,
        wilaya: data.wilaya,
        address: data.address,
        notes: data.notes || null,
        items: verifiedItems,
        subtotal,
        shipping: data.shipping,
        total,
      })
      .select("id,order_number,total,subtotal,shipping")
      .single();

    if (error) throw new Error(error.message);
    return order;
  });

export const adminListOrders = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).optional(),
        page: z.number().int().min(1).max(1000).default(1),
        perPage: z.number().int().min(1).max(100).default(20),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase: sb } = context;
    const from = (data.page - 1) * data.perPage;
    const to = from + data.perPage - 1;
    let q = sb.from("orders").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (data.status) q = q.eq("status", data.status);
    const { data: rows, error, count } = await q.range(from, to);
    if (error) throw new Error(error.message);
    return { items: rows ?? [], total: count ?? 0, pageCount: Math.max(1, Math.ceil((count ?? 0) / data.perPage)) };
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });