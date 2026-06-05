import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Search, ShoppingBag, Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/products";
import { useCart, useHydrated } from "@/lib/store";
import clsx from "clsx";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const setCartOpen = useCart((s) => s.setOpen);
  const count = useCart((s) => s.count());
  const hydrated = useHydrated();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || megaOpen || mobileOpen;

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        solid ? "bg-paper text-ink border-b border-border" : "bg-transparent text-paper",
      )}
      onMouseLeave={() => setMegaOpen(false)}
    >
      <div className="container-edge flex items-center justify-between h-16 md:h-20">
        <button
          className="md:hidden -ml-2 p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="font-display font-black tracking-tight text-2xl md:text-3xl">
          LECCO<span className="text-brand">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 eyebrow">
          {[
            { to: "/shop", label: "Shop All" },
            { to: "/shop/jackets", label: "Jackets" },
            { to: "/shop/hoodies", label: "Hoodies" },
            { to: "/shop/sneakers", label: "Sneakers" },
            { to: "/shop/sale" as any, label: "Sale" },
          ].map((l) => (
            <Link
              key={l.label}
              to={l.to as any}
              onMouseEnter={() => setMegaOpen(true)}
              className="hover:text-brand transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <button className="p-2 hover:text-brand" aria-label="Search">
            <Search size={18} />
          </button>
          <Link to="/wishlist" className="p-2 hover:text-brand" aria-label="Wishlist">
            <Heart size={18} />
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 hover:text-brand"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {hydrated && count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand text-paper text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mega menu */}
      <div
        className={clsx(
          "hidden md:block absolute inset-x-0 top-full bg-paper text-ink border-b border-border overflow-hidden transition-all duration-300",
          megaOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0",
        )}
        onMouseEnter={() => setMegaOpen(true)}
      >
        <div className="container-edge grid grid-cols-4 gap-10 py-10">
          <div>
            <p className="eyebrow text-muted-foreground mb-4">Apparel</p>
            <ul className="space-y-2 font-display text-xl">
              {CATEGORIES.filter(c => !["sneakers","sandals","hats"].includes(c.slug)).map(c => (
                <li key={c.slug}>
                  <Link to="/shop/$category" params={{ category: c.slug }} className="hover:text-brand">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-muted-foreground mb-4">Footwear & Acc.</p>
            <ul className="space-y-2 font-display text-xl">
              {CATEGORIES.filter(c => ["sneakers","sandals","hats"].includes(c.slug)).map(c => (
                <li key={c.slug}>
                  <Link to="/shop/$category" params={{ category: c.slug }} className="hover:text-brand">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-muted-foreground mb-4">Collections</p>
            <ul className="space-y-2 font-display text-xl">
              <li><Link to="/shop" className="hover:text-brand">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-brand">Bestsellers</Link></li>
              <li><Link to="/shop" className="hover:text-brand">All Black</Link></li>
            </ul>
          </div>
          <Link to="/shop" className="relative group block overflow-hidden bg-secondary aspect-[4/5]">
            <img src={CATEGORIES[4].image} alt="Featured" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-paper">
              <p className="eyebrow">Editorial</p>
              <p className="font-display text-2xl italic">FW / 26 Drop</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-paper text-ink border-t border-border">
          <ul className="container-edge py-6 space-y-3 font-display text-2xl">
            <li><Link to="/shop" onClick={() => setMobileOpen(false)}>Shop All</Link></li>
            {CATEGORIES.map(c => (
              <li key={c.slug}>
                <Link to="/shop/$category" params={{ category: c.slug }} onClick={() => setMobileOpen(false)}>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}