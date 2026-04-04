"use client";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { Plus, Trash2, X, Crown, User } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

function InviteModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STAFF" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }
    setSaving(true);
    try {
      await authApi.register(form);
      toast.success(`${form.name} added to the team`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to add team member");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <form
        className="bg-surface rounded-3xl border border-border w-full max-w-md shadow-card p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-text-primary">Add Team Member</h2>
          <button type="button" onClick={onClose} className="text-text-muted hover:text-text-primary"><X size={20} /></button>
        </div>

        {[
          { id: "invite-name", label: "Name", type: "text", key: "name", placeholder: "Full name" },
          { id: "invite-email", label: "Email", type: "email", key: "email", placeholder: "Email address" },
          { id: "invite-password", label: "Password", type: "password", key: "password", placeholder: "Initial password" },
        ].map(({ id, label, type, key, placeholder }) => (
          <div key={key}>
            <label className="text-xs text-text-muted uppercase tracking-wide font-medium mb-1 block">{label}</label>
            <input
              id={id}
              type={type}
              value={(form as any)[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>
        ))}

        <div>
          <label className="text-xs text-text-muted uppercase tracking-wide font-medium mb-1 block">Role</label>
          <select
            id="invite-role"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
          >
            <option value="STAFF">Staff</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-text-muted hover:text-text-primary transition-colors text-sm">
            Cancel
          </button>
          <button
            id="invite-submit-btn"
            type="submit"
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-gold text-background font-semibold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />}
            {saving ? "Adding..." : "Add Member"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminTeamPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("haveli_admin");
    if (stored) setCurrentAdmin(JSON.parse(stored));
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await authApi.getAdmins();
      setAdmins(res.data);
    } catch {
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from the team?`)) return;
    try {
      await authApi.deleteAdmin(id);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      toast.success(`${name} removed`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to remove");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-primary">Team</h1>
          <p className="text-text-muted text-sm mt-1">{admins.length} admin accounts</p>
        </div>
        {currentAdmin?.role === "SUPER_ADMIN" && (
          <button
            id="invite-admin-btn"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-gold text-background font-semibold text-sm hover:opacity-90"
          >
            <Plus size={18} />
            Add Admin
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl skeleton" />)}
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {admins.map((admin) => (
              <div key={admin.id} id={`admin-row-${admin.id}`} className="flex items-center justify-between p-4 hover:bg-surface-2 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    {admin.role === "SUPER_ADMIN" ? (
                      <Crown size={18} className="text-accent" />
                    ) : (
                      <User size={18} className="text-text-muted" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary text-sm">{admin.name}</span>
                      {admin.id === currentAdmin?.id && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-accent/20 text-accent">You</span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${admin.role === "SUPER_ADMIN" ? "bg-accent/20 text-accent border border-accent/30" : "bg-surface-2 text-text-muted border border-border"}`}>
                    {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Staff"}
                  </span>
                  <span className="text-xs text-text-muted hidden md:block">
                    Joined {format(new Date(admin.createdAt), "MMM d, yyyy")}
                  </span>
                  {currentAdmin?.role === "SUPER_ADMIN" && admin.id !== currentAdmin?.id && (
                    <button
                      id={`remove-admin-${admin.id}`}
                      onClick={() => handleDelete(admin.id, admin.name)}
                      className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <InviteModal onClose={() => setShowModal(false)} onSuccess={fetchAdmins} />
      )}
    </div>
  );
}
