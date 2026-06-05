import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart, useHydrated } from "@/lib/store";
import { formatDZD } from "@/lib/format";

export function CartDrawer() {
  const { open, setOpen, lines, setQty, remove, total } = useCart();
  const nav = useNavigate();
  const hydrated = useHydrated();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/60 z-[60]" onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full sm:w-[420px] bg-paper text-ink flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-border">
              <p className="font-display text-2xl">Your Bag</p>
              <button onClick={() => setOpen(false)} aria-label="Close"><X size={20} /></button>
            </div>

            {!hydrated || lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <p className="font-display text-3xl">Your bag is empty</p>
                <p className="text-sm text-muted-foreground mt-2">Start exploring the latest drop.</p>
                <button
                  onClick={() => { setOpen(false); nav({ to: "/shop" }); }}
                  className="mt-6 bg-ink text-paper px-6 py-3 eyebrow hover:bg-brand"
                >
                  Shop Now
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto divide-y divide-border">
                  {lines.map((l) => (
                    <li key={l.id} className="flex gap-4 p-6">
                      <img src={l.product.image} alt="" className="w-20 h-24 object-cover bg-secondary" />
                      <div className="flex-1 flex flex-col">
                        <p className="font-display text-lg leading-tight">{l.product.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Size {l.size} · <span className="inline-block w-2 h-2 rounded-full border border-border align-middle" style={{ background: l.color }} />
                        </p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-border">
                            <button className="p-1.5" onClick={() => setQty(l.id, l.qty - 1)}><Minus size={12} /></button>
                            <span className="px-3 text-sm">{l.qty}</span>
                            <button className="p-1.5" onClick={() => setQty(l.id, l.qty + 1)}><Plus size={12} /></button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-display text-lg">{formatDZD(l.product.price * l.qty)}</span>
                            <button onClick={() => remove(l.id)} aria-label="Remove"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-display text-xl">{formatDZD(total())}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Shipping calculated at checkout. Cash on delivery available.</p>
                  <button
                    onClick={() => { setOpen(false); nav({ to: "/checkout" }); }}
                    className="w-full bg-ink text-paper py-4 eyebrow hover:bg-brand transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}