import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import editorial1 from "@/assets/editorial-1.jpg";
import editorial2 from "@/assets/editorial-2.jpg";
import { CATEGORIES, featured } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LECCO Clothes — Premium Menswear from Algiers" },
      { name: "description", content: "Editorial menswear from Algiers. Jackets, hoodies, sneakers and tailored essentials. Delivery to all 58 Wilayas." },
      { property: "og:title", content: "LECCO Clothes — FW/26 Drop" },
      { property: "og:description", content: "Editorial menswear from Algiers. Delivery to all 58 Wilayas." },
    ],
  }),
  component: Index,
});

function Index() {
  const drop = featured();
  return (
    <>
      {/* HERO */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-ink text-paper">
        <img src={hero} alt="" className="absolute inset-0 w-full h-full object-cover object-center opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/10 to-ink/80" />
        <div className="container-edge relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24">
          <p className="eyebrow text-paper/80 mb-4">FW / 26 · Drop 01</p>
          <h1 className="display-hero text-6xl sm:text-8xl md:text-[10rem] max-w-4xl">
            Engineered<br />for the<br /><span className="text-brand">modern</span> silhouette.
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="group inline-flex items-center gap-3 bg-paper text-ink px-7 py-4 eyebrow hover:bg-brand hover:text-paper transition-colors">
              Shop the Drop <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/shop/jackets" className="inline-flex items-center gap-3 border border-paper/30 text-paper px-7 py-4 eyebrow hover:border-paper">
              View Jackets
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="container-edge py-20 md:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow text-muted-foreground">01 · Categories</p>
            <h2 className="font-display text-5xl md:text-7xl mt-3">Shop the<br/>Universe.</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-2 eyebrow hover:text-brand">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/shop/$category"
              params={{ category: c.slug }}
              className="group relative aspect-[3/4] overflow-hidden bg-secondary"
            >
              <img src={c.image} alt={c.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-paper">
                <p className="font-display text-2xl md:text-3xl">{c.label}</p>
                <p className="eyebrow opacity-70 mt-1">Shop now →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* EDITORIAL SPLIT */}
      <section className="bg-ink text-paper">
        <div className="container-edge py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img src={editorial1} alt="Campaign" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div>
            <p className="eyebrow text-paper/60">02 · Manifesto</p>
            <h2 className="display-hero text-6xl md:text-8xl mt-4">
              Built<br/>in <span className="text-brand">Algiers.</span><br/>Worn anywhere.
            </h2>
            <p className="mt-6 max-w-md text-paper/70">
              We design for the streets we grew up on — heavyweight cottons,
              sharp tailoring and uncompromising silhouettes. Cash on delivery
              available across all 58 Wilayas.
            </p>
            <Link to="/shop" className="inline-flex mt-8 items-center gap-3 bg-brand text-paper px-7 py-4 eyebrow hover:bg-brand-hover">
              Discover the Drop <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="container-edge py-20 md:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow text-muted-foreground">03 · New Arrivals</p>
            <h2 className="font-display text-5xl md:text-7xl mt-3 italic">Just dropped.</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-2 eyebrow hover:text-brand">
            Shop All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
          {drop.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src={editorial2} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="relative container-edge h-full flex flex-col justify-center text-paper">
          <p className="eyebrow text-paper/70">04 · The Gold Standard</p>
          <h2 className="display-hero text-6xl md:text-9xl max-w-3xl mt-4">
            Less, but <span className="text-gold">better.</span>
          </h2>
        </div>
      </section>
    </>
  );
}
  );
}
