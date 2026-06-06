import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { isAdmin } from "@/lib/admin.functions";
import { LogOut, LayoutDashboard, Package, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AdminShell,
});

function AdminShell() {
  const nav = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["is-admin"],
    queryFn: () => isAdmin(),
  });

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/auth" });
  }

  if (isLoading) {
    return <div className="pt-40 container-edge text-center"><p className="text-muted-foreground">Loading…</p></div>;
  }
  if (!data?.isAdmin) {
    return (
      <div className="pt-40 pb-24 container-edge max-w-lg mx-auto text-center">
        <h1 className="font-display text-5xl">Admin access required</h1>
        <p className="text-muted-foreground mt-3">Your account is signed in but is not an admin. Ask the project owner to grant the admin role to your user in the Cloud panel (insert a row into <code>user_roles</code> with role <code>admin</code>).</p>
        <button onClick={signOut} className="mt-8 border border-ink px-6 py-3 eyebrow hover:bg-ink hover:text-paper">Sign out</button>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 min-h-screen bg-secondary/30">
      <div className="container-edge py-8">
        <div className="grid md:grid-cols-[220px_1fr] gap-8">
          <aside className="md:sticky md:top-24 md:self-start space-y-1">
            <p className="eyebrow text-muted-foreground mb-3">Admin</p>
            <NavLink to="/admin" icon={<LayoutDashboard size={16} />}>Dashboard</NavLink>
            <NavLink to="/admin/products" icon={<Package size={16} />}>Products</NavLink>
            <NavLink to="/admin/orders" icon={<ShoppingCart size={16} />}>Orders</NavLink>
            <button onClick={signOut} className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-brand">
              <LogOut size={14} /> Sign out
            </button>
          </aside>
          <main className="bg-paper border border-border p-6 md:p-8 min-h-[60vh]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function NavLink({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      to={to as any}
      activeProps={{ className: "bg-ink text-paper" }}
      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-ink/5 [&.active]:bg-ink [&.active]:text-paper"
    >
      {icon} {children}
    </Link>
  );
}