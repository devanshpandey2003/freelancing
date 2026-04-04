"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { UtensilsCrossed, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem("haveli_admin_token", res.data.token);
      localStorage.setItem("haveli_admin", JSON.stringify(res.data.admin));
      toast.success(`Welcome, ${res.data.admin.name}!`);
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4"
      style={{ background: "radial-gradient(ellipse at center, #1a1208 0%, #0a0a0a 70%)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed size={28} className="text-background" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-text-primary">Haveli</h1>
          <p className="text-text-muted text-sm mt-1">Admin Panel</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="bg-surface rounded-3xl border border-border p-8 space-y-5 shadow-card"
        >
          <h2 className="font-serif text-xl font-bold text-text-primary text-center">
            Sign in to Dashboard
          </h2>

          <div className="space-y-1">
            <label htmlFor="admin-email" className="text-xs text-text-muted font-medium uppercase tracking-wide">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@haveli.com"
              autoComplete="email"
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="admin-password" className="text-xs text-text-muted font-medium uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 pr-11 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-gold text-background font-semibold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-text-muted mt-6">
          Default: admin@haveli.com / Admin@1234
        </p>

        <div className="text-center mt-4">
          <Link href="/" className="text-xs text-text-muted hover:text-accent transition-colors">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
