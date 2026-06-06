import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { listProducts } from "@/lib/products.functions";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
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

function ShopAll() {
  const [cat, setCat] = useState<string>("all");
  const [max, setMax] = useState<number>(25000);
  const [min, setMin] = useState<number>(0);
  const [q, setQ] = useState<string>("");
  const [sort, setSort] = useState<"new"|"low"|"high">("new");
  const [page, setPage] = useState<number>(1);
  const perPage = 12;

  const params = {
    category: cat === "all" ? undefined : cat,
    minPrice: min || undefined,
    maxPrice: max,
    q: q.trim() || undefined,
    sort,
    page,
    perPage,
  };
  const { data, isFetching } = useQuery({
    queryKey: ["products", params],
    queryFn: () => listProducts({ data: params }),
    placeholderData: keepPreviousData,
  });
  const list = data?.items ?? [];
  const pageCount = data?.pageCount ?? 1;
  const total = data?.total ?? 0;

  function resetPage<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); setPage(1); };
  }

  return (
    <div className="pt-24 md:pt-28">
      <div className="container-edge py-8">
        <p className="eyebrow text-muted-foreground">Catalog</p>
        <h1 className="font-display text-5xl md:text-7xl mt-2">Shop All</h1>
      </div>
      <div className="container-edge grid md:grid-cols-[260px_1fr] gap-10 pb-24">
        {/* Filters */}
        <aside className="space-y-8 md:sticky md:top-24 md:self-start">
          <Filter title="Search">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => resetPage(setQ)(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-8 pr-3 py-2 text-sm border border-border bg-transparent focus:border-ink outline-none"
              />
            </div>
          </Filter>
          <Filter title="Category">
            <ul className="space-y-1.5 text-sm">
              <li><button onClick={()=>resetPage(setCat)("all")} className={clsx("hover:text-brand", cat==="all" && "text-brand")}>All Products</button></li>
              {CATEGORIES.map(c => (
                <li key={c.slug}><button onClick={()=>resetPage(setCat)(c.slug)} className={clsx("hover:text-brand", cat===c.slug && "text-brand")}>{c.label}</button></li>
              ))}
            </ul>
          </Filter>
          <Filter title={`Min Price · ${min.toLocaleString("fr-DZ")} DA`}>
            <input type="range" min={0} max={25000} step={500} value={min} onChange={(e)=>resetPage(setMin)(Number(e.target.value))} className="w-full accent-brand" />
          </Filter>
          <Filter title={`Max Price · ${max.toLocaleString("fr-DZ")} DA`}>
            <input type="range" min={2000} max={25000} step={500} value={max} onChange={(e)=>resetPage(setMax)(Number(e.target.value))} className="w-full accent-brand" />
          </Filter>
        </aside>

        {/* Grid */}
        <div>
          <div className="flex items-center justify-between border-y border-border py-4 mb-8">
            <p className="text-sm text-muted-foreground">{total} products{isFetching && " · loading…"}</p>
            <select value={sort} onChange={(e)=>{ setSort(e.target.value as any); setPage(1); }} className="bg-transparent eyebrow border-b border-border focus:outline-none">
              <option value="new">Newest</option>
              <option value="low">Price ↑</option>
              <option value="high">Price ↓</option>
            </select>
          </div>
          {list.length === 0 ? (
            <p className="font-display text-2xl py-20 text-center">No products match those filters.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-10">
                {list.map(p => <ProductCard key={p.id} p={p} />)}
              </div>
              {pageCount > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 border border-border disabled:opacity-30 hover:border-ink"
                    aria-label="Previous page"
                  ><ChevronLeft size={16} /></button>
                  {Array.from({ length: pageCount }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={clsx("min-w-9 px-3 py-1.5 text-sm border", page === i + 1 ? "border-ink bg-ink text-paper" : "border-border hover:border-ink")}
                    >{i + 1}</button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    disabled={page >= pageCount}
                    className="p-2 border border-border disabled:opacity-30 hover:border-ink"
                    aria-label="Next page"
                  ><ChevronRight size={16} /></button>
                </div>
              )}
            </>
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