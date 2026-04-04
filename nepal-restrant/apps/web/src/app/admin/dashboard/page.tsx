"use client";
import { useEffect, useState } from "react";
import { dashboardApi } from "@/lib/api";
import {
  ShoppingBag,
  Clock,
  ChefHat,
  CheckCircle2,
  XCircle,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

interface Stats {
  orders: {
    total: number;
    pending: number;
    preparing: number;
    served: number;
    cancelled: number;
    today: number;
  };
  revenue: { total: number; today: number };
  tables: { total: number; active: number[]; activeCount: number };
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  href,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  href?: string;
}) {
  const inner = (
    <div className="bg-surface rounded-2xl border border-border p-6 hover:border-accent/30 transition-all group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-muted text-sm mb-1">{label}</p>
          <p className={`text-3xl font-bold font-serif ${color}`}>{value}</p>
          {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity`}
          style={{ background: color.replace("text-", "bg-") }}>
          <Icon size={24} className={color} />
        </div>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats().then((res) => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));

    // Auto-refresh every 30s
    const interval = setInterval(() => {
      dashboardApi.getStats().then((res) => setStats(res.data));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-surface rounded-2xl border border-border p-6 h-28 skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-muted mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.orders.total || 0} color="text-accent" href="/admin/orders" />
        <StatCard icon={DollarSign} label="Total Revenue" value={`Rs. ${(stats?.revenue.total || 0).toLocaleString()}`} color="text-green-400" />
        <StatCard icon={TrendingUp} label="Today's Orders" value={stats?.orders.today || 0} sub="Orders placed today" color="text-blue-400" href="/admin/orders" />
        <StatCard icon={DollarSign} label="Today's Revenue" value={`Rs. ${(stats?.revenue.today || 0).toLocaleString()}`} color="text-purple-400" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Pending" value={stats?.orders.pending || 0} color="text-yellow-400" href="/admin/orders?status=PENDING" />
        <StatCard icon={ChefHat} label="Preparing" value={stats?.orders.preparing || 0} color="text-blue-400" href="/admin/orders?status=PREPARING" />
        <StatCard icon={CheckCircle2} label="Served" value={stats?.orders.served || 0} color="text-green-400" href="/admin/orders?status=SERVED" />
        <StatCard icon={XCircle} label="Cancelled" value={stats?.orders.cancelled || 0} color="text-red-400" href="/admin/orders?status=CANCELLED" />
      </div>

      {/* Tables */}
      <div>
        <h2 className="font-serif text-xl font-bold text-text-primary mb-4">Table Status</h2>
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((t) => {
            const active = stats?.tables.active.includes(t);
            return (
              <div
                key={t}
                className={`rounded-2xl border p-5 text-center transition-all ${
                  active
                    ? "bg-accent/10 border-accent/40 shadow-gold"
                    : "bg-surface border-border"
                }`}
              >
                <div className={`text-3xl font-serif font-bold mb-1 ${active ? "text-accent" : "text-text-muted"}`}>
                  {t}
                </div>
                <div className={`text-xs font-medium ${active ? "text-accent" : "text-text-muted"}`}>
                  {active ? "Occupied" : "Free"}
                </div>
                {active && (
                  <div className="w-2 h-2 rounded-full bg-accent mx-auto mt-2 animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { href: "/admin/orders", label: "Manage Orders", desc: "View and update order status" },
          { href: "/admin/menu", label: "Manage Menu", desc: "Add, edit, or remove items" },
          { href: "/admin/qr-codes", label: "QR Codes", desc: "Print QR codes for all tables" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-surface rounded-2xl border border-border p-5 hover:border-accent/40 transition-all group"
          >
            <p className="font-semibold text-text-primary group-hover:text-accent transition-colors">
              {link.label} →
            </p>
            <p className="text-sm text-text-muted mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
