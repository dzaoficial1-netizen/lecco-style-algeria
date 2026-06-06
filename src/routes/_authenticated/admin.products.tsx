import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListAllProducts, adminUpsertProduct, adminDeleteProduct } from "@/lib/admin.functions";
import { formatDZD } from "@/lib/format";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: AdminProducts,
});

type Row = Awaited<ReturnType<typeof adminListAllProducts>>[number];

function AdminProducts() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({ queryKey: ["admin", "products"], queryFn: () => adminListAllProducts() });
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      await adminDeleteProduct({ data: { id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow text-muted-foreground">Catalog</p>
          <h1 className="font-display text-4xl mt-2">Products</h1>
        </div>
        <button onClick={() => setEditing({ category: "t-shirts", price: 0, stock: 0, sizes: [], colors: [], image_urls: [], is_active: true, is_new: false })} className="bg-ink text-paper px-4 py-2.5 eyebrow inline-flex items-center gap-2 hover:bg-brand">
          <Plus size={14} /> New
        </button>
      </div>
      <div className="mt-8 overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left">
            <tr>
              <th className="px-3 py-2 eyebrow text-xs font-normal">Product</th>
              <th className="px-3 py-2 eyebrow text-xs font-normal">Category</th>
              <th className="px-3 py-2 eyebrow text-xs font-normal">Price</th>
              <th className="px-3 py-2 eyebrow text-xs font-normal">Stock</th>
              <th className="px-3 py-2 eyebrow text-xs font-normal">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-3 py-3"><p className="font-display">{p.title}</p><p className="text-xs text-muted-foreground font-mono">{p.slug}</p></td>
                <td className="px-3 py-3">{p.category}</td>
                <td className="px-3 py-3">{formatDZD(p.price)}</td>
                <td className="px-3 py-3"><span className={p.stock < 5 ? "text-brand" : ""}>{p.stock}</span></td>
                <td className="px-3 py-3">{p.is_active ? "Active" : "Hidden"}</td>
                <td className="px-3 py-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(p as any)} className="p-2 hover:text-brand" aria-label="Edit"><Edit size={14} /></button>
                  <button onClick={() => remove(p.id)} className="p-2 hover:text-brand" aria-label="Delete"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <EditDrawer initial={editing} onClose={() => setEditing(null)} onSaved={() => { qc.invalidateQueries({ queryKey: ["admin", "products"] }); setEditing(null); }} />}
    </div>
  );
}

function EditDrawer({ initial, onClose, onSaved }: { initial: Partial<Row>; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>({
    id: initial.id, slug: initial.slug ?? "", title: initial.title ?? "",
    description: "", category: initial.category ?? "t-shirts",
    price: initial.price ?? 0, compare_at_price: null, stock: initial.stock ?? 0,
    image_urls: initial.image_urls ?? [], colors: [], sizes: [],
    tagline: "", is_new: initial.is_new ?? false, is_active: initial.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await adminUpsertProduct({ data: { ...form } });
      toast.success("Saved");
      onSaved();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-[80] bg-ink/60" onClick={onClose}>
      <div onClick={(e)=>e.stopPropagation()} className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-paper p-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">{form.id ? "Edit product" : "New product"}</h2>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="mt-6 space-y-4">
          <L label="Title"><input className="input" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} /></L>
          <L label="Slug (lowercase-hyphens)"><input className="input" value={form.slug} onChange={(e)=>setForm({...form, slug: e.target.value})} /></L>
          <L label="Category">
            <select className="input" value={form.category} onChange={(e)=>setForm({...form, category: e.target.value})}>
              {["t-shirts","shirts","pants","hoodies","jackets","sneakers","sandals","hats"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </L>
          <div className="grid grid-cols-2 gap-3">
            <L label="Price (DA)"><input type="number" className="input" value={form.price} onChange={(e)=>setForm({...form, price: Number(e.target.value)})} /></L>
            <L label="Stock"><input type="number" className="input" value={form.stock} onChange={(e)=>setForm({...form, stock: Number(e.target.value)})} /></L>
          </div>
          <L label="Sizes (comma-separated)"><input className="input" value={(form.sizes ?? []).join(", ")} onChange={(e)=>setForm({...form, sizes: e.target.value.split(",").map((s:string)=>s.trim()).filter(Boolean)})} /></L>
          <L label="Colors (hex, comma-separated)"><input className="input" value={(form.colors ?? []).join(", ")} onChange={(e)=>setForm({...form, colors: e.target.value.split(",").map((s:string)=>s.trim()).filter(Boolean)})} /></L>
          <L label="Image URLs (comma-separated)"><input className="input" value={(form.image_urls ?? []).join(", ")} onChange={(e)=>setForm({...form, image_urls: e.target.value.split(",").map((s:string)=>s.trim()).filter(Boolean)})} /></L>
          <L label="Description"><textarea className="input" rows={3} value={form.description ?? ""} onChange={(e)=>setForm({...form, description: e.target.value})} /></L>
          <L label="Tagline"><input className="input" value={form.tagline ?? ""} onChange={(e)=>setForm({...form, tagline: e.target.value})} /></L>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_new} onChange={(e)=>setForm({...form, is_new: e.target.checked})} /> New</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e)=>setForm({...form, is_active: e.target.checked})} /> Active</label>
          </div>
          <button onClick={save} disabled={saving} className="w-full bg-ink text-paper py-3 eyebrow hover:bg-brand disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="eyebrow text-muted-foreground text-xs">{label}</span><div className="mt-1.5">{children}</div></label>;
}