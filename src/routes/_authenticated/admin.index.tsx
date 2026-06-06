import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminListAllProducts, isAdmin } from "@/lib/admin.functions";
import { adminListOrders } from "@/lib/orders.functions";
import { formatDZD } from "@/lib/format";
import { Package, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: admin } = useQuery({ queryKey: ["is-admin"], queryFn: () => isAdmin() });
  const enabled = !!admin?.isAdmin;
  const { data: products } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => adminListAllProducts(),
    enabled,
  });
  const { data: orders } = useQuery({
    queryKey: ["admin", "orders", "recent"],
    queryFn: () => adminListOrders({ data: { page: 1, perPage: 20 } }),
    enabled,
  });

  const totalRevenue = orders?.items.reduce((s, o) => s + (o.total ?? 0), 0) ?? 0;
  const pendingCount = orders?.items.filter((o) => o.status === "pending").length ?? 0;
  const lowStock = products?.filter((p) => p.stock < 5).length ?? 0;

  return (
    <div>
      <p className="eyebrow text-muted-foreground">Overview</p>
      <h1 className="font-display text-4xl mt-2">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Stat icon={<Package size={18} />} label="Products" value={products?.length ?? 0} />
        <Stat icon={<ShoppingCart size={18} />} label="Orders" value={orders?.total ?? 0} />
        <Stat icon={<TrendingUp size={18} />} label="Revenue" value={formatDZD(totalRevenue)} />
        <Stat icon={<AlertCircle size={18} />} label="Low stock" value={lowStock} />
      </div>

      <h2 className="font-display text-2xl mt-12 mb-4">Recent orders</h2>
      {!orders?.items.length ? (
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <Th>Order #</Th><Th>Customer</Th><Th>Wilaya</Th><Th>Total</Th><Th>Status</Th><Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {orders.items.slice(0, 8).map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <Td className="font-mono">{o.order_number}</Td>
                  <Td>{o.customer_name}</Td>
                  <Td>{o.wilaya}</Td>
                  <Td>{formatDZD(o.total)}</Td>
                  <Td><StatusPill status={o.status} /></Td>
                  <Td>{new Date(o.created_at).toLocaleDateString("fr-DZ")}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link to="/admin/orders" className="eyebrow hover:text-brand">All orders →</Link>
        {pendingCount > 0 && <span className="text-brand">{pendingCount} pending</span>}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="border border-border p-5">
      <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="eyebrow">{label}</span></div>
      <p className="font-display text-3xl mt-2">{value}</p>
    </div>
  );
}
function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2 eyebrow text-xs text-muted-foreground font-normal">{children}</th>;
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-3 ${className}`}>{children}</td>;
}
export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-900",
    confirmed: "bg-blue-100 text-blue-900",
    shipped: "bg-purple-100 text-purple-900",
    delivered: "bg-green-100 text-green-900",
    cancelled: "bg-red-100 text-red-900",
  };
  return <span className={`px-2 py-1 text-[10px] eyebrow ${map[status] ?? "bg-secondary"}`}>{status}</span>;
}