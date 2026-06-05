import tshirts from "@/assets/cat-tshirts.jpg";
import shirts from "@/assets/cat-shirts.jpg";
import pants from "@/assets/cat-pants.jpg";
import hoodies from "@/assets/cat-hoodies.jpg";
import jackets from "@/assets/cat-jackets.jpg";
import sneakers from "@/assets/cat-sneakers.jpg";
import sandals from "@/assets/cat-sandals.jpg";
import hats from "@/assets/cat-hats.jpg";

export type Category =
  | "t-shirts" | "shirts" | "pants" | "hoodies"
  | "jackets" | "sneakers" | "sandals" | "hats";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;        // DZD
  compareAt?: number;
  image: string;
  colors: string[];     // hex
  sizes: string[];
  tagline?: string;
  isNew?: boolean;
}

export const CATEGORIES: { slug: Category; label: string; image: string }[] = [
  { slug: "t-shirts", label: "T-Shirts", image: tshirts },
  { slug: "shirts",   label: "Shirts",   image: shirts },
  { slug: "pants",    label: "Pants",    image: pants },
  { slug: "hoodies",  label: "Hoodies",  image: hoodies },
  { slug: "jackets",  label: "Jackets",  image: jackets },
  { slug: "sneakers", label: "Sneakers", image: sneakers },
  { slug: "sandals",  label: "Sandals",  image: sandals },
  { slug: "hats",     label: "Caps",     image: hats },
];

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOE_SIZES = ["40", "41", "42", "43", "44", "45"];
const HAT_SIZE = ["One Size"];

const C = {
  black: "#0A0A0A",
  white: "#FAFAFA",
  red: "#E8192C",
  gold: "#C9A84C",
  stone: "#A8A29E",
  navy: "#1E293B",
  olive: "#556B2F",
  cream: "#EFE9DD",
};

const mk = (
  slug: string, name: string, category: Category, price: number,
  image: string, colors: string[], sizes: string[],
  extra: Partial<Product> = {},
): Product => ({
  id: slug, slug, name, category, price, image, colors, sizes, ...extra,
});

export const PRODUCTS: Product[] = [
  // T-Shirts
  mk("essential-noir-tee", "Essential Noir Tee", "t-shirts", 3500, tshirts,
     [C.black, C.white, C.stone], APPAREL_SIZES, { tagline: "Heavyweight cotton 240gsm", isNew: true }),
  mk("box-fit-tee", "Box-Fit Boxy Tee", "t-shirts", 3900, tshirts,
     [C.black, C.cream, C.olive], APPAREL_SIZES, { compareAt: 4500 }),
  mk("monogram-tee", "Monogram Embroidered Tee", "t-shirts", 4200, tshirts,
     [C.black, C.white, C.red], APPAREL_SIZES),

  // Shirts
  mk("linen-overshirt", "Linen Overshirt", "shirts", 7800, shirts,
     [C.black, C.cream, C.navy], APPAREL_SIZES, { tagline: "Italian linen", isNew: true }),
  mk("camp-collar-shirt", "Camp Collar Shirt", "shirts", 6900, shirts,
     [C.black, C.olive], APPAREL_SIZES),

  // Pants
  mk("wide-leg-trouser", "Wide-Leg Trouser", "pants", 8900, pants,
     [C.black, C.navy, C.stone], APPAREL_SIZES, { isNew: true }),
  mk("cargo-pant", "Tactical Cargo Pant", "pants", 9500, pants,
     [C.black, C.olive], APPAREL_SIZES),
  mk("tapered-jogger", "Tapered Jogger", "pants", 6500, pants,
     [C.black, C.navy], APPAREL_SIZES, { compareAt: 7500 }),

  // Hoodies
  mk("oversized-hoodie", "Oversized Heavyweight Hoodie", "hoodies", 8500, hoodies,
     [C.black, C.cream, C.red], APPAREL_SIZES, { tagline: "500gsm fleece", isNew: true }),
  mk("zip-hoodie", "Full-Zip Tech Hoodie", "hoodies", 9200, hoodies,
     [C.black, C.navy], APPAREL_SIZES),

  // Jackets
  mk("bomber-classic", "Classic MA-1 Bomber", "jackets", 18500, jackets,
     [C.black, C.olive], APPAREL_SIZES, { tagline: "Water-repellent shell", isNew: true }),
  mk("trucker-jacket", "Workwear Trucker Jacket", "jackets", 14500, jackets,
     [C.black, C.navy], APPAREL_SIZES, { compareAt: 16500 }),

  // Sneakers
  mk("court-low", "Court Low Leather Sneaker", "sneakers", 16900, sneakers,
     [C.black, C.white], SHOE_SIZES, { isNew: true }),
  mk("runner-protocol", "Runner Protocol", "sneakers", 19500, sneakers,
     [C.black, C.red], SHOE_SIZES),

  // Sandals
  mk("double-strap-sandal", "Double-Strap Leather Sandal", "sandals", 8900, sandals,
     [C.black, C.cream], SHOE_SIZES),
  mk("slide-mono", "Mono Slide", "sandals", 5500, sandals,
     [C.black, C.white], SHOE_SIZES),

  // Hats
  mk("six-panel-cap", "Six-Panel Cap", "hats", 3200, hats,
     [C.black, C.cream, C.red], HAT_SIZE),
  mk("trucker-cap", "Mesh Trucker Cap", "hats", 2900, hats,
     [C.black, C.white], HAT_SIZE, { tagline: "Snapback" }),
];

export const byCategory = (cat: Category) => PRODUCTS.filter(p => p.category === cat);
export const findBySlug = (slug: string) => PRODUCTS.find(p => p.slug === slug);
export const featured = () => PRODUCTS.filter(p => p.isNew).slice(0, 8);