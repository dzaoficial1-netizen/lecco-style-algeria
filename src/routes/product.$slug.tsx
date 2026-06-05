import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { findBySlug, PRODUCTS } from "@/lib/products";
import { useCart, useWishlist, useHydrated } from "@/lib/store";
import { formatDZD } from "@/lib/format";
import { Heart, ShoppingBag, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Product3DViewer } from "@/components/product/Product3DViewer";
import { motion } from "framer-motion";
import clsx from "clsx";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = findBySlug(params.slug);
    if (!p) throw notFound();
    return { p };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.p.name} — LECCO Clothes` },
      { name: "description", content: loaderData.p.tagline ?? `${loaderData.p.name} — premium menswear from LECCO.` },
      { property: "og:title", content: `${loaderData.p.name} — LECCO Clothes` },
      { property: "og:description", content: loaderData.p.tagline ?? loaderData.p.name },
      { property: "og:image", content: loaderData.p.image },
      { name: "twitter:image", content: loaderData.p.image },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="pt-40 container-edge text-center">
      <h1 className="font-display text-5xl">Product not found</h1>
      <Link to="/shop" className="eyebrow underline mt-4 inline-block">Back to shop</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="pt-40 container-edge text-center">
      <h1 className="font-display text-5xl">Something went wrong</h1>
      <p className="text-muted-foreground mt-2">{error.message}</p>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { p } = Route.useLoaderData();
  const [size, setSize] = useState<string>(p.sizes[0]);
  const [color, setColor] = useState<string>(p.colors[0]);
  const add = useCart(s => s.add);
  const toggleWish = useWishlist(s => s.toggle);
  const wished = useWishlist(s => s.ids.includes(p.id));
  const hydrated = useHydrated();

  const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);

  return (
    <div className="pt-20 md:pt-24">
      <div className="container-edge grid md:grid-cols-2 gap-8 md:gap-14 py-10">
        <div className="bg-secondary aspect-[4/5] overflow-hidden">
          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        </div>
        <div className="md:py-6">
          <Link to="/shop/$category" params={{ category: p.category }} className="eyebrow text-muted-foreground hover:text-brand">
            ← {p.category}
          </Link>
          <h1 className="font-display text-5xl md:text-6xl mt-3">{p.name}</h1>
          {p.tagline && <p className="text-muted-foreground mt-2">{p.tagline}</p>}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-baseline gap-3 mt-5"
          >
            <p className="font-display text-4xl">{formatDZD(p.price)}</p>
            {p.compareAt && <p className="text-muted-foreground line-through">{formatDZD(p.compareAt)}</p>}
          </motion.div>

          <div className="mt-6">
            <Product3DViewer p={p} color={color} />
          </div>

          <div className="mt-8">
            <p className="eyebrow mb-3">Color · <span className="text-muted-foreground">{color}</span></p>
            <div className="flex gap-2">
              {p.colors.map((c: string) => (
                <button key={c} onClick={()=>setColor(c)} aria-label={c}
                  style={{ background: c }}
                  className={clsx("w-9 h-9 rounded-full border-2", color===c ? "border-brand" : "border-border")} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="eyebrow mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {p.sizes.map((s: string) => (
                <button key={s} onClick={()=>setSize(s)}
                  className={clsx("min-w-12 px-3 py-2.5 border text-sm", size===s ? "border-ink bg-ink text-paper" : "border-border hover:border-ink")}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={()=> add(p, size, color)}
              className="flex-1 bg-ink text-paper py-4 eyebrow hover:bg-brand transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> Add to Bag
            </button>
            <button
              onClick={()=> toggleWish(p.id)}
              aria-label="Wishlist"
              className={clsx("w-14 border border-border flex items-center justify-center", hydrated && wished ? "text-brand border-brand" : "hover:border-ink")}
            >
              <Heart size={18} fill={hydrated && wished ? "currentColor" : "none"} />
            </button>
          </div>

          <ul className="mt-10 grid grid-cols-3 gap-3 text-xs">
            <li className="flex flex-col items-center gap-2 p-4 border border-border text-center"><Truck size={18}/>Cash on Delivery</li>
            <li className="flex flex-col items-center gap-2 p-4 border border-border text-center"><RotateCcw size={18}/>14-day Returns</li>
            <li className="flex flex-col items-center gap-2 p-4 border border-border text-center"><ShieldCheck size={18}/>58 Wilayas</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-edge py-20">
          <h2 className="font-display text-4xl md:text-5xl mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
            {related.map(r => <ProductCard key={r.id} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}