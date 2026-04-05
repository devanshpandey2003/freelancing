"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  QrCode,
  Users,
  LogOut,
  Menu,
  X,
  ChefHat,
  Package,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/orders", icon: ClipboardList, label: "Orders" },
  { href: "/admin/menu", icon: UtensilsCrossed, label: "Menu" },
  { href: "/admin/inventory", icon: Package, label: "Inventory" },
  { href: "/admin/qr-codes", icon: QrCode, label: "QR Codes" },
  { href: "/admin/team", icon: Users, label: "Team" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin") return; // login page, no auth check
    const token = localStorage.getItem("haveli_admin_token");
    const adminData = localStorage.getItem("haveli_admin");
    if (!token) { router.push("/admin"); return; }
    if (adminData) setAdmin(JSON.parse(adminData));
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("haveli_admin_token");
    localStorage.removeItem("haveli_admin");
    router.push("/admin");
  };

  if (pathname === "/admin") return <>{children}</>;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full z-40 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center">
            <ChefHat size={18} className="text-background" />
          </div>
          <div>
            <div className="font-serif text-lg font-bold text-text-primary">Haveli</div>
            <div className="text-xs text-text-muted">Admin Panel</div>
          </div>
          <button
            className="ml-auto md:hidden text-text-muted"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                id={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  active
                    ? "bg-accent/15 text-accent border border-accent/30 font-medium"
                    : "text-text-muted hover:text-text-primary hover:bg-surface-2"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Admin info + logout */}
        <div className="p-4 border-t border-border space-y-3">
          {admin && (
            <div className="px-4 py-3 rounded-xl bg-surface-2">
              <p className="text-sm font-medium text-text-primary truncate">{admin.name}</p>
              <p className="text-xs text-text-muted truncate">{admin.email}</p>
              <span className="text-xs text-accent font-medium capitalize">
                {admin.role?.toLowerCase().replace("_", " ")}
              </span>
            </div>
          )}
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-text-muted hover:text-accent-red hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
          <button
            id="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-text-muted hover:text-text-primary"
          >
            <Menu size={22} />
          </button>
          <span className="font-serif text-lg font-bold text-text-primary">Haveli Admin</span>
          <div className="w-9" />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
