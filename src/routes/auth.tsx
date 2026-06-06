import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — LECCO Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/admin" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-32 pb-24 container-edge max-w-md mx-auto">
      <p className="eyebrow text-muted-foreground">LECCO Admin</p>
      <h1 className="font-display text-5xl mt-2">{mode === "signin" ? "Sign In" : "Create Account"}</h1>
      <form onSubmit={submit} className="mt-10 space-y-5">
        <label className="block">
          <span className="eyebrow text-muted-foreground">Email</span>
          <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="input mt-1.5" />
        </label>
        <label className="block">
          <span className="eyebrow text-muted-foreground">Password</span>
          <input type="password" required minLength={8} value={password} onChange={(e)=>setPassword(e.target.value)} className="input mt-1.5" />
        </label>
        <button type="submit" disabled={loading} className="w-full bg-ink text-paper py-4 eyebrow hover:bg-brand inline-flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <Loader2 size={14} className="animate-spin" />}
          {mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>
      <button onClick={()=>setMode(mode === "signin" ? "signup" : "signin")} className="text-xs text-muted-foreground mt-6 hover:text-brand">
        {mode === "signin" ? "Need an account? Create one →" : "Already have an account? Sign in →"}
      </button>
    </div>
  );
}