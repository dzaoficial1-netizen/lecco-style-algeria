import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const Cat = z.enum(["t-shirts", "shirts", "pants", "hoodies", "jackets", "sneakers", "sandals", "hats"]);

const ProductInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/, "lowercase, digits, hyphens only"),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  category: Cat,
  price: z.number().int().min(0).max(10_000_000),
  compare_at_price: z.number().int().min(0).max(10_000_000).nullable().optional(),
  stock: z.number().int().min(0).max(1_000_000),
  image_urls: z.array(z.string().url().max(2000)).max(8).default([]),
  colors: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).max(12).default([]),
  sizes: z.array(z.string().min(1).max(20)).max(20).default([]),
  tagline: z.string().trim().max(200).optional().or(z.literal("")),
  is_new: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export const isAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { isAdmin: !!data };
  });

export const adminUpsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => ProductInput.parse(input))
  .handler(async ({ data, context }) => {
    const payload = {
      ...data,
      description: data.description || null,
      tagline: data.tagline || null,
    };
    const q = data.id
      ? context.supabase.from("products").update(payload).eq("id", data.id).select("id").single()
      : context.supabase.from("products").insert(payload).select("id").single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return { id: row?.id };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListAllProducts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("products")
      .select("id,slug,title,category,price,stock,is_active,is_new,image_urls")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });