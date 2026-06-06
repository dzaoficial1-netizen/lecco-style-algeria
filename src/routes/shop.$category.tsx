import { createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { listProducts } from "@/lib/products.functions";

export const Route = createFileRoute("/shop/$category")({
  loader: ({ params }) => {
    const cat = CATEGORIES.find(c => c.slug === params.category);
    if (!cat) throw notFound();
    return { cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.cat.label} — LECCO Clothes` },
      { name: "description", content: `Shop the LECCO ${loaderData.cat.label} collection. Premium menswear from Algiers.` },
      { property: "og:title", content: `${loaderData.cat.label} — LECCO Clothes` },
      { property: "og:description", content: `Shop ${loaderData.cat.label} from LECCO.` },
    ] : [],
  }),
  notFoundComponent: () => (
    <div className="pt-40 container-edge text-center">
      <h1 className="font-display text-5xl">Category not found</h1>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="pt-40 container-edge text-center">
      <h1 className="font-display text-5xl">Something went wrong</h1>
      <p className="text-muted-foreground mt-2">{error.message}</p>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const { data, isLoading } = useQuery({
    queryKey: ["products", "category", cat.slug],
    queryFn: () => listProducts({ data: { category: cat.slug, page: 1, perPage: 60, sort: "new" } }),
  });
  const items = data?.items ?? [];
  return (
    <div className="pt-24 md:pt-28">
      <section className="relative h-[44vh] min-h-[320px] bg-ink text-paper overflow-hidden">
        <img src={cat.image} alt={cat.label} className="absolute inset-0 w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink to-ink/20" />
        <div className="container-edge relative h-full flex flex-col justify-end pb-10">
          <p className="eyebrow text-paper/70">Collection</p>
          <h1 className="display-hero text-7xl md:text-9xl">{cat.label}</h1>
        </div>
      </section>
      <div className="container-edge py-14">
        {isLoading ? (
          <p className="font-display text-2xl text-center py-16 text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <p className="font-display text-3xl text-center py-16">Coming soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
            {items.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}