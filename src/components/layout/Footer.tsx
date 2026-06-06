import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="container-edge py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <p className="font-display text-4xl">LECCO<span className="text-brand">.</span></p>
          <p className="mt-4 max-w-xs text-paper/60 text-sm">
            Premium menswear from Algiers. Engineered for the modern silhouette.
          </p>
          <div className="flex gap-2 mt-6 eyebrow">
            <a href="#" aria-label="Instagram" className="px-3 py-2 border border-paper/20 hover:border-brand hover:text-brand">IG</a>
            <a href="#" aria-label="Facebook" className="px-3 py-2 border border-paper/20 hover:border-brand hover:text-brand">FB</a>
            <a href="#" aria-label="TikTok" className="px-3 py-2 border border-paper/20 hover:border-brand hover:text-brand">TT</a>
          </div>
        </div>
        <div>
          <p className="eyebrow text-paper/50 mb-4">Shop</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-brand">All Products</Link></li>
            <li><Link to="/shop/jackets" className="hover:text-brand">Jackets</Link></li>
            <li><Link to="/shop/sneakers" className="hover:text-brand">Sneakers</Link></li>
            <li><Link to="/wishlist" className="hover:text-brand">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-paper/50 mb-4">Support</p>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-brand">Shipping</a></li>
            <li><a href="#" className="hover:text-brand">Returns</a></li>
            <li><a href="#" className="hover:text-brand">Size Guide</a></li>
            <li><a href="#" className="hover:text-brand">FAQ</a></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow text-paper/50 mb-4">Contact</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail size={14} /><span>anesmokhati@gmail.com</span></li>
            <li className="flex items-center gap-2"><Phone size={14} /> +213 776 897 923</li>
            <li className="text-paper/60">Algiers, Algeria</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="container-edge py-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-paper/50">
          <p>© {new Date().getFullYear()} LECCO Clothes. All rights reserved.</p>
          <p>Cash on delivery available across all 58 Wilayas.</p>
        </div>
      </div>
    </footer>
  );
}