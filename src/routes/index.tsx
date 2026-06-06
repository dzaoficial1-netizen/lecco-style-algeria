import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, type Variants } from "framer-motion";
import { useRef } from "react";
import hero from "@/assets/hero.jpg";
import editorial1 from "@/assets/editorial-1.jpg";
import editorial2 from "@/assets/editorial-2.jpg";
import { CATEGORIES, featured, toDBProduct } from "@/lib/products";
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
  const drop = featured().map(toDBProduct);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(heroP, [0, 1], [1, 1.15]);
  const heroTextY = useTransform(heroP, [0, 1], ["0%", "-40%"]);
  const heroOpacity = useTransform(heroP, [0, 0.8], [1, 0]);

  // cursor-following spotlight on hero
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${sx}% ${sy}%, rgba(232,25,44,0.25), transparent 60%)`;

  const manifestoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: manP } = useScroll({ target: manifestoRef, offset: ["start end", "end start"] });
  const manImgY = useTransform(manP, [0, 1], ["-10%", "10%"]);
  const manImgScale = useTransform(manP, [0, 0.5, 1], [1.1, 1, 1.05]);

  const bannerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: banP } = useScroll({ target: bannerRef, offset: ["start end", "end start"] });
  const banY = useTransform(banP, [0, 1], ["-15%", "15%"]);
  const banTextX = useTransform(banP, [0, 1], ["-10%", "10%"]);

  const reveal: Variants = {
    hidden: { opacity: 0, y: 60 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.08 },
    }),
  };

  const heroLines: { text: string; accent?: string }[] = [
    { text: "Engineered" },
    { text: "for the" },
    { text: "modern silhouette.", accent: "modern" },
  ];

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width) * 100);
          my.set(((e.clientY - r.top) / r.height) * 100);
        }}
        className="relative h-screen min-h-[640px] w-full overflow-hidden bg-ink text-paper"
      >
        <motion.img
          src={hero}
          alt=""
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 w-full h-[120%] object-cover object-center opacity-90 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/10 to-ink/80" />
        <motion.div style={{ background: spotlight }} className="absolute inset-0 pointer-events-none mix-blend-screen" />
        <div className="noise-overlay" />
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="container-edge relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="eyebrow text-paper/80 mb-4"
          >
            FW / 26 · Drop 01
          </motion.p>
          <h1 className="display-hero text-6xl sm:text-8xl md:text-[10rem] max-w-4xl">
            {heroLines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%", rotate: 6 }}
                  animate={{ y: "0%", rotate: 0 }}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="block origin-bottom-left"
                >
                  {line.accent
                    ? line.text.split(" ").map((w, j) =>
                        w === line.accent ? (
                          <span key={j} className="text-brand italic">{w} </span>
                        ) : (
                          <span key={j}>{w} </span>
                        ),
                      )
                    : line.text}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link to="/shop" className="group inline-flex items-center gap-3 bg-paper text-ink px-7 py-4 eyebrow hover:bg-brand hover:text-paper transition-colors">
              Shop the Drop <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/shop/jackets" className="inline-flex items-center gap-3 border border-paper/30 text-paper px-7 py-4 eyebrow hover:border-paper">
              View Jackets
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-paper/70"
        >
          <span className="eyebrow text-[0.6rem]">Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-paper/40"
          />
        </motion.div>
      </section>

      {/* MARQUEE — true infinite loop */}
      <div className="bg-ink text-paper py-7 overflow-hidden border-y border-paper/10">
        <div className="marquee-track flex gap-12 whitespace-nowrap font-display text-4xl md:text-6xl italic w-max">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-12 items-center pr-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="flex items-center gap-12">
                  FW/26 DROP <span className="text-brand">●</span> ALGIERS ORIGIN <span className="text-gold">●</span> COD AVAILABLE <span className="text-brand">●</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY GRID */}
      <section className="container-edge py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={reveal}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="eyebrow text-muted-foreground">01 · Categories</p>
            <h2 className="font-display text-5xl md:text-7xl mt-3">Shop the<br/>Universe.</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-2 eyebrow hover:text-brand">
            View All <ArrowRight size={14} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.slug}
              custom={i % 4}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={reveal}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Link
                to="/shop/$category"
                params={{ category: c.slug }}
                className="group relative aspect-[3/4] overflow-hidden bg-secondary block"
              >
                <img src={c.image} alt={c.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-paper overflow-hidden">
                  <p className="font-display text-2xl md:text-3xl transition-transform duration-500 group-hover:-translate-y-1">{c.label}</p>
                  <p className="eyebrow opacity-0 -translate-y-2 group-hover:opacity-70 group-hover:translate-y-0 transition-all duration-500 mt-1">Shop now →</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EDITORIAL SPLIT */}
      <section ref={manifestoRef} className="bg-ink text-paper overflow-hidden">
        <div className="container-edge py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/5] overflow-hidden">
            <motion.img
              src={editorial1}
              alt="Campaign"
              style={{ y: manImgY, scale: manImgScale }}
              className="absolute inset-0 w-full h-[120%] object-cover will-change-transform"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
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
          </motion.div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="container-edge py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={reveal}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="eyebrow text-muted-foreground">03 · New Arrivals</p>
            <h2 className="font-display text-5xl md:text-7xl mt-3 italic">Just dropped.</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-2 eyebrow hover:text-brand">
            Shop All <ArrowRight size={14} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
          {drop.map((p, i) => (
            <motion.div
              key={p.id}
              custom={i % 4}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={reveal}
            >
              <ProductCard p={p} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <section ref={bannerRef} className="relative h-[80vh] min-h-[520px] overflow-hidden">
        <motion.img
          src={editorial2}
          alt=""
          style={{ y: banY }}
          className="absolute inset-0 w-full h-[130%] object-cover will-change-transform"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <motion.div
          style={{ x: banTextX }}
          className="relative container-edge h-full flex flex-col justify-center text-paper"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="eyebrow text-paper/70"
          >
            04 · The Gold Standard
          </motion.p>
          <h2 className="display-hero text-6xl md:text-9xl max-w-3xl mt-4 overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              Less, but <span className="text-gold">better.</span>
            </motion.span>
          </h2>
        </motion.div>
      </section>
    </>
  );
}
