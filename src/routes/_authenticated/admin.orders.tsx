import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListOrders, adminUpdateOrderStatus } from "@/lib/orders.functions";
import { formatDZD } from "@/lib/format";
import { StatusPill } from "./admin.index";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;

function AdminOrders() {
  const qc = useQueryClient();
  const [status, setStatus] = useState<typeof STATUSES[number] | "">("");
  const [page, setPage] = useState(1);
  const { data } = useQuery({
    queryKey: ["admin", "orders", status, page],
    queryFn: () => adminListOrders({ data: { status: status || undefined, page, perPage: 20 } }),
  });
  const [openId, setOpenId] = useState<string | null>(null);
  const items = data?.items ?? [];
  const open = items.find((o) => o.id === openId) ?? null;

  async function updateStatus(id: string, s: typeof STATUSES[number]) {
    try {
      await adminUpdateOrderStatus({ data: { id, status: s } });
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
  }

  return (
    <div>
      <p className="eyebrow text-muted-foreground">Sales</p>
      <h1 className="font-display text-4xl mt-2">Orders</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={()=>{setStatus(""); setPage(1);}} className={`px-3 py-1.5 text-xs eyebrow border ${status === "" ? "border-ink bg-ink text-paper" : "border-border"}`}>All</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={()=>{setStatus(s); setPage(1);}} className={`px-3 py-1.5 text-xs eyebrow border ${status === s ? "border-ink bg-ink text-paper" : "border-border"}`}>{s}</button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left">
            <tr>
              {["Order #","Customer","Phone","Wilaya","Total","Status","Date",""].map((h)=>(
                <th key={h} className="px-3 py-2 eyebrow text-xs font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((o) => (
              <tr key={o.id} className="border-t border-border hover:bg-secondary/40">
                <td className="px-3 py-3 font-mono">{o.order_number}</td>
                <td className="px-3 py-3">{o.customer_name}</td>
                <td className="px-3 py-3">{o.customer_phone}</td>
                <td className="px-3 py-3">{o.wilaya}</td>
                <td className="px-3 py-3">{formatDZD(o.total)}</td>
                <td className="px-3 py-3"><StatusPill status={o.status} /></td>
                <td className="px-3 py-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString("fr-DZ")}</td>
                <td className="px-3 py-3 text-right"><button onClick={()=>setOpenId(o.id)} className="text-xs eyebrow underline hover:text-brand">View</button></td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-12 text-center text-sm text-muted-foreground">No orders.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {data && data.pageCount > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={()=>setPage((p)=>Math.max(1,p-1))} disabled={page<=1} className="p-2 border border-border disabled:opacity-30"><ChevronLeft size={16}/></button>
          <span className="text-sm">Page {page} of {data.pageCount}</span>
          <button onClick={()=>setPage((p)=>Math.min(data.pageCount,p+1))} disabled={page>=data.pageCount} className="p-2 border border-border disabled:opacity-30"><ChevronRight size={16}/></button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[80] bg-ink/60" onClick={()=>setOpenId(null)}>
          <div onClick={(e)=>e.stopPropagation()} className="fixed right-0 top-0 bottom-0 w-full sm:w-[520px] bg-paper p-6 overflow-y-auto">
            <p className="eyebrow text-muted-foreground">Order</p>
            <h2 className="font-display text-3xl">#{open.order_number}</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <Field label="Customer" value={open.customer_name} />
              <Field label="Phone" value={open.customer_phone} />
              <Field label="Email" value={open.customer_email ?? "—"} />
              <Field label="Wilaya" value={open.wilaya} />
              <Field label="Address" value={open.address} full />
              {open.notes && <Field label="Notes" value={open.notes} full />}
            </div>
            <h3 className="font-display text-xl mt-8 mb-3">Items</h3>
            <ul className="divide-y divide-border border-y border-border">
              {(open.items as any[]).map((it, idx) => (
                <li key={idx} className="py-3 flex justify-between text-sm">
                  <div>
                    <p className="font-display">{it.name}</p>
                    <p className="text-xs text-muted-foreground">Size {it.size} · {it.color} · x{it.qty}</p>
                  </div>
                  <p className="font-display">{formatDZD(it.unit_price * it.qty)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-sm space-y-1">
              <Row label="Subtotal" value={formatDZD(open.subtotal)} />
              <Row label="Shipping" value={formatDZD(open.shipping)} />
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="eyebrow">Total</span>
                <span className="font-display text-xl">{formatDZD(open.total)}</span>
              </div>
            </div>
            <div className="mt-6">
              <p className="eyebrow text-muted-foreground text-xs mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button key={s} onClick={()=>updateStatus(open.id, s)} className={`px-3 py-1.5 text-xs eyebrow border ${open.status === s ? "border-ink bg-ink text-paper" : "border-border hover:border-ink"}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <p className="eyebrow text-muted-foreground text-xs">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>;
}