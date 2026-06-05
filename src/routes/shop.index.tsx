import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import clsx from "clsx";

export const Route = createFileRoute("/shop/")({
  head: () => ({
    meta: [
      { title: "Shop All — LECCO Clothes" },
      { name: "description", content: "The full LECCO drop. Filter by category, size, color and price." },
      { property: "og:title", content: "Shop All — LECCO Clothes" },
      { property: "og:description", content: "The full LECCO drop." },
    ],
  }),
  component: ShopAll,
});

const ALL_SIZES = ["XS","S","M","L","XL","XXL","40","41","42","43","44","45","One Size"];
const ALL_COLORS = Array.from(new Set(PRODUCTS.flatMap(p => p.colors)));

function ShopAll() {
  const [cat, setCat] = useState<string>("all");
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [max, setMax] = useState<number>(25000);
  const [sort, setSort] = useState<"new"|"low"|"high">("new");

  const list = useMemo(() => {
    let r = PRODUCTS.slice();
    if (cat !== "all") r = r.filter(p => p.category === cat);
    if (size) r = r.filter(p => p.sizes.includes(size));
    if (color) r = r.filter(p => p.colors.includes(color));
    r = r.filter(p => p.price <= max);
    if (sort === "low") r.sort((a,b)=>a.price-b.price);
    else if (sort === "high") r.sort((a,b)=>b.price-a.price);
    else r.sort((a,b)=> Number(!!b.isNew) - Number(!!a.isNew));
    return r;
  }, [cat, size, color, max, sort]);

  return (
    <div className="pt-24 md:pt-28">
      <div className="container-edge py-8">
        <p className="eyebrow text-muted-foreground">Catalog</p>
        <h1 className="font-display text-5xl md:text-7xl mt-2">Shop All</h1>
      </div>
      <div className="container-edge grid md:grid-cols-[260px_1fr] gap-10 pb-24">
        {/* Filters */}
        <aside className="space-y-8 md:sticky md:top-24 md:self-start">
          <Filter title="Category">
            <ul className="space-y-1.5 text-sm">
              <li><button onClick={()=>setCat("all")} className={clsx("hover:text-brand", cat==="all" && "text-brand")}>All Products</button></li>
              {CATEGORIES.map(c => (
                <li key={c.slug}><button onClick={()=>setCat(c.slug)} className={clsx("hover:text-brand", cat===c.slug && "text-brand")}>{c.label}</button></li>
              ))}
            </ul>
          </Filter>
          <Filter title="Size">
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map(s => (
                <button
                  key={s}
                  onClick={()=> setSize(size===s ? null : s)}
                  className={clsx("px-3 py-1.5 border text-xs", size===s ? "border-ink bg-ink text-paper" : "border-border hover:border-ink")}
                >{s}</button>
              ))}
            </div>
          </Filter>
          <Filter title="Color">
            <div className="flex flex-wrap gap-2">
              {ALL_COLORS.map(c => (
                <button
                  key={c}
                  onClick={()=> setColor(color===c ? null : c)}
                  aria-label={c}
                  style={{ background: c }}
                  className={clsx("w-7 h-7 rounded-full border-2", color===c ? "border-brand" : "border-border")}
                />
              ))}
            </div>
          </Filter>
          <Filter title={`Max Price · ${max.toLocaleString("fr-DZ")} DA`}>
            <input type="range" min={2000} max={25000} step={500} value={max} onChange={(e)=>setMax(Number(e.target.value))} className="w-full accent-brand" />
          </Filter>
        </aside>

        {/* Grid */}
        <div>
          <div className="flex items-center justify-between border-y border-border py-4 mb-8">
            <p className="text-sm text-muted-foreground">{list.length} products</p>
            <select value={sort} onChange={(e)=>setSort(e.target.value as any)} className="bg-transparent eyebrow border-b border-border focus:outline-none">
              <option value="new">Newest</option>
              <option value="low">Price ↑</option>
              <option value="high">Price ↓</option>
            </select>
          </div>
          {list.length === 0 ? (
            <p className="font-display text-2xl py-20 text-center">No products match those filters.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-10">
              {list.map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Filter({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-3 pb-2 border-b border-border">{title}</p>
      {children}
    </div>
  );
}