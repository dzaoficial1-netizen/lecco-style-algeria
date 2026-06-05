import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/products";
import { useWishlist, useHydrated } from "@/lib/store";
import { formatDZD } from "@/lib/format";
import clsx from "clsx";

export function ProductCard({ p }: { p: Product }) {
  const toggle = useWishlist((s) => s.toggle);
  const has = useWishlist((s) => s.ids.includes(p.id));
  const hydrated = useHydrated();

  return (
    <div className="group relative">
      <Link to="/product/$slug" params={{ slug: p.slug }} className="block">
        <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {p.isNew && <span className="bg-ink text-paper eyebrow px-2 py-1">New</span>}
            {p.compareAt && (
              <span className="bg-brand text-paper eyebrow px-2 py-1">
                -{Math.round((1 - p.price / p.compareAt) * 100)}%
              </span>
            )}
          </div>
        </div>
        <div className="pt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-lg leading-tight truncate">{p.name}</p>
            {p.tagline && <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.tagline}</p>}
          </div>
          <div className="text-right shrink-0">
            <p className="font-display text-lg">{formatDZD(p.price)}</p>
            {p.compareAt && (
              <p className="text-xs text-muted-foreground line-through">{formatDZD(p.compareAt)}</p>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 mt-2">
          {p.colors.map((c) => (
            <span key={c} className="w-3 h-3 rounded-full border border-border" style={{ background: c }} />
          ))}
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); toggle(p.id); }}
        aria-label="Wishlist"
        className={clsx(
          "absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-paper/90 backdrop-blur transition-colors",
          hydrated && has ? "text-brand" : "text-ink hover:text-brand",
        )}
      >
        <Heart size={16} fill={hydrated && has ? "currentColor" : "none"} />
      </button>
    </div>
  );
}