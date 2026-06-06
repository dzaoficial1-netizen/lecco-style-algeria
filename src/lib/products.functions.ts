import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { DBProduct } from "./products";

const ListInput = z.object({
  category: z.string().min(1).max(40).optional(),
  q: z.string().trim().max(80).optional(),
  minPrice: z.number().int().min(0).max(10_000_000).optional(),
  maxPrice: z.number().int().min(0).max(10_000_000).optional(),
  sort: z.enum(["new", "low", "high"]).default("new"),
  page: z.number().int().min(1).max(1000).default(1),
  perPage: z.number().int().min(1).max(60).default(12),
});

export const listProducts = createServerFn({ method: "POST" })
  .inputValidator((input) => ListInput.parse(input))
  .handler(async ({ data }) => {
    const from = (data.page - 1) * data.perPage;
    const to = from + data.perPage - 1;

    let query = supabase
      .from("products")
      .select(
        "id,slug,title,description,category,price,compare_at_price,stock,image_urls,colors,sizes,tagline,is_new,is_active",
        { count: "exact" },
      )
      .eq("is_active", true);

    if (data.category) query = query.eq("category", data.category);
    if (data.minPrice != null) query = query.gte("price", data.minPrice);
    if (data.maxPrice != null) query = query.lte("price", data.maxPrice);
    if (data.q) query = query.ilike("title", `%${data.q}%`);

    if (data.sort === "low") query = query.order("price", { ascending: true });
    else if (data.sort === "high") query = query.order("price", { ascending: false });
    else query = query.order("is_new", { ascending: false }).order("created_at", { ascending: false });

    const { data: rows, error, count } = await query.range(from, to);
    if (error) throw new Error(error.message);

    return {
      items: (rows ?? []) as DBProduct[],
      total: count ?? 0,
      page: data.page,
      perPage: data.perPage,
      pageCount: count ? Math.max(1, Math.ceil(count / data.perPage)) : 1,
    };
  });

export const getProductBySlug = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabase
      .from("products")
      .select(
        "id,slug,title,description,category,price,compare_at_price,stock,image_urls,colors,sizes,tagline,is_new,is_active",
      )
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row ?? null) as DBProduct | null;
  });

export const getRelatedProducts = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ category: z.string().min(1).max(40), excludeId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabase
      .from("products")
      .select("id,slug,title,category,price,compare_at_price,image_urls,colors,is_new,tagline")
      .eq("is_active", true)
      .eq("category", data.category)
      .neq("id", data.excludeId)
      .limit(4);
    if (error) throw new Error(error.message);
    return (rows ?? []) as DBProduct[];
  });