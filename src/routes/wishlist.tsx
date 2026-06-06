import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS, toDBProduct } from "@/lib/products";
import { useWishlist, useHydrated } from "@/lib/store";
import { ProductCard } from "@/components/product/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — LECCO Clothes" },
      { name: "description", content: "Your saved LECCO pieces." },
      { property: "og:title", content: "Wishlist — LECCO Clothes" },
      { property: "og:description", content: "Your saved LECCO pieces." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const ids = useWishlist(s => s.ids);
  const hydrated = useHydrated();
  const items = PRODUCTS.filter(p => ids.includes(p.id)).map(toDBProduct);

  return (
    <div className="pt-24 md:pt-28 container-edge pb-24">
      <p className="eyebrow text-muted-foreground">Saved</p>
      <h1 className="font-display text-5xl md:text-7xl mt-2">Wishlist</h1>

      {!hydrated || items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-3xl">Nothing saved yet.</p>
          <Link to="/shop" className="inline-block mt-6 bg-ink text-paper px-6 py-3 eyebrow hover:bg-brand">Browse the Drop</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 mt-10">
          {items.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}