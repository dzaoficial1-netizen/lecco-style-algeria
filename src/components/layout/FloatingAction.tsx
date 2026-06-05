import { useState } from "react";
import { MessageCircle, Mail, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function FloatingAction() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <>
            <motion.a
              key="wa"
              href="https://wa.me/213776897923"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="WhatsApp us"
              initial={{ opacity: 0, y: 12, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 bg-paper text-ink pl-4 pr-1 py-1 shadow-xl border border-border hover:text-brand"
            >
              <span className="eyebrow">WhatsApp</span>
              <span className="bg-[#25D366] text-white w-10 h-10 flex items-center justify-center rounded-full">
                <MessageCircle size={18} />
              </span>
            </motion.a>
            <motion.a
              key="mail"
              href="mailto:anesmokhati@gmail.com"
              aria-label="Email us"
              initial={{ opacity: 0, y: 12, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.8 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="flex items-center gap-3 bg-paper text-ink pl-4 pr-1 py-1 shadow-xl border border-border hover:text-brand"
            >
              <span className="eyebrow">Email</span>
              <span className="bg-ink text-paper w-10 h-10 flex items-center justify-center rounded-full">
                <Mail size={18} />
              </span>
            </motion.a>
          </>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close contact menu" : "Contact us"}
        className="relative w-14 h-14 rounded-full bg-brand hover:bg-brand-hover text-paper shadow-2xl flex items-center justify-center transition-colors"
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {open ? <X size={22} /> : <Plus size={22} />}
        </motion.span>
      </button>
    </div>
  );
}