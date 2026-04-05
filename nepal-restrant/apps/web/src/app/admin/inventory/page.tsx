"use client";
import { useEffect, useState, useCallback } from "react";
import { inventoryApi } from "@/lib/api";
import {
  Plus, Pencil, Trash2, X, Check, ChevronRight,
  Package, AlertTriangle, History, TrendingUp, TrendingDown,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  _count: { items: number };
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number | null;
  lowStockThreshold: number;
  categoryId: string;
  category: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

interface StockLog {
  id: string;
  action: "ADD" | "REMOVE";
  quantity: number;
  note: string | null;
  createdAt: string;
}

// ── Category Modal ────────────────────────────────────────────────────────────

function CategoryModal({
  category,
  onClose,
  onSuccess,
}: {
  category: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(category?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      if (category) {
        await inventoryApi.updateCategory(category.id, name.trim());
        toast.success("Category renamed");
      } else {
        await inventoryApi.createCategory(name.trim());
        toast.success("Category created");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-3xl border border-border w-full max-w-sm shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-text-primary">
            {category ? "Rename Category" : "Add Category"}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1 block">Name *</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Beverages"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>
        </div>
        <div className="p-6 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-text-muted hover:text-text-primary transition-colors text-sm">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-gold text-background font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
            {category ? "Rename" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Item Modal ────────────────────────────────────────────────────────────────

function ItemModal({
  item,
  categories,
  defaultCategoryId,
  onClose,
  onSuccess,
}: {
  item: InventoryItem | null;
  categories: Category[];
  defaultCategoryId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: item?.name || "",
    categoryId: item?.categoryId || defaultCategoryId || categories[0]?.id || "",
    quantity: item?.quantity?.toString() || "0",
    unit: item?.unit || "",
    price: item?.price?.toString() || "",
    lowStockThreshold: item?.lowStockThreshold?.toString() || "5",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim() || !form.categoryId || !form.unit.trim()) {
      toast.error("Name, category, and unit are required");
      return;
    }
    setSaving(true);
    try {
      if (item) {
        await inventoryApi.updateItem(item.id, {
          name: form.name,
          categoryId: form.categoryId,
          unit: form.unit,
          price: form.price === "" ? null : parseFloat(form.price),
          lowStockThreshold: parseFloat(form.lowStockThreshold) || 5,
        });
        toast.success("Item updated");
      } else {
        await inventoryApi.createItem({
          name: form.name,
          categoryId: form.categoryId,
          quantity: parseFloat(form.quantity) || 0,
          unit: form.unit,
          price: form.price === "" ? null : parseFloat(form.price),
          lowStockThreshold: parseFloat(form.lowStockThreshold) || 5,
        });
        toast.success("Item added");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-surface rounded-3xl border border-border w-full max-w-lg shadow-card max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-text-primary">
            {item ? "Edit Item" : "Add Item"}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1 block">Name *</label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Coca-Cola"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1 block">Category *</label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Quantity (only for new items) */}
          {!item && (
            <div>
              <label className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1 block">Initial Quantity</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
            </div>
          )}

          {/* Unit */}
          <div>
            <label className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1 block">Unit *</label>
            <input
              type="text"
              placeholder="e.g. bottles, kg, packets"
              value={form.unit}
              onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          {/* Price + Threshold row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1 block">Cost Price (optional)</label>
              <input
                type="number"
                placeholder="e.g. 50"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1 block">Low Stock Alert at</label>
              <input
                type="number"
                placeholder="5"
                min="0"
                value={form.lowStockThreshold}
                onChange={(e) => setForm((f) => ({ ...f, lowStockThreshold: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-text-muted hover:text-text-primary transition-colors text-sm">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-gold text-background font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
            {item ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stock Adjust Modal ────────────────────────────────────────────────────────

function StockAdjustModal({
  item,
  onClose,
  onSuccess,
}: {
  item: InventoryItem;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [action, setAction] = useState<"ADD" | "REMOVE">("ADD");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdjust = async () => {
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) { toast.error("Enter a valid quantity"); return; }
    setSaving(true);
    try {
      await inventoryApi.adjustStock(item.id, { action, quantity: qty, note: note.trim() || undefined });
      toast.success(`Stock ${action === "ADD" ? "added" : "removed"} — ${qty} ${item.unit}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to adjust stock");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-3xl border border-border w-full max-w-sm shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-text-primary">Adjust Stock</h2>
            <p className="text-xs text-text-muted mt-0.5">{item.name} · {item.quantity} {item.unit} available</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* ADD / REMOVE toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setAction("ADD")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                action === "ADD"
                  ? "bg-green-500/15 border-green-500/40 text-green-400"
                  : "border-border text-text-muted hover:border-green-500/30"
              }`}
            >
              <TrendingUp size={16} /> Add Stock
            </button>
            <button
              onClick={() => setAction("REMOVE")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                action === "REMOVE"
                  ? "bg-red-500/15 border-red-500/40 text-red-400"
                  : "border-border text-text-muted hover:border-red-500/30"
              }`}
            >
              <TrendingDown size={16} /> Remove
            </button>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1 block">Quantity ({item.unit})</label>
            <input
              autoFocus
              type="number"
              placeholder="0"
              min="0.01"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdjust()}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          {/* Note */}
          <div>
            <label className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1 block">Note (optional)</label>
            <input
              type="text"
              placeholder="e.g. Morning restock, sold at bar..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="p-6 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-text-muted hover:text-text-primary transition-colors text-sm">Cancel</button>
          <button
            onClick={handleAdjust}
            disabled={saving}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all ${
              action === "ADD"
                ? "bg-green-500 hover:bg-green-400 text-white"
                : "bg-red-500 hover:bg-red-400 text-white"
            }`}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : action === "ADD" ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            {saving ? "Saving..." : action === "ADD" ? "Add Stock" : "Remove Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stock Log Drawer ──────────────────────────────────────────────────────────

function StockLogDrawer({
  item,
  onClose,
}: {
  item: InventoryItem;
  onClose: () => void;
}) {
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inventoryApi.getLogs(item.id).then((res) => {
      setLogs(res.data);
    }).catch(() => {
      toast.error("Failed to load logs");
    }).finally(() => setLoading(false));
  }, [item.id]);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <History size={18} className="text-accent" />
              <h2 className="font-serif text-xl font-bold text-text-primary">Stock History</h2>
            </div>
            <p className="text-xs text-text-muted mt-0.5">{item.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-2 text-text-muted hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Current stock summary */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between bg-surface-2 rounded-xl px-4 py-3">
            <span className="text-sm text-text-muted">Current Stock</span>
            <span className="font-serif text-xl font-bold text-accent">
              {item.quantity} <span className="text-sm font-normal text-text-muted">{item.unit}</span>
            </span>
          </div>
        </div>

        {/* Log list */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl skeleton" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center">
                <History size={24} className="text-text-muted" />
              </div>
              <p className="text-text-muted text-sm">No stock changes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-2 border border-border">
                  <span className={`mt-0.5 shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    log.action === "ADD"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {log.action === "ADD" ? "+" : "−"}{log.quantity}
                  </span>
                  <div className="flex-1 min-w-0">
                    {log.note && (
                      <p className="text-sm text-text-primary truncate">{log.note}</p>
                    )}
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        month: "short", day: "numeric",
                        hour: "numeric", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {log.action === "ADD"
                    ? <TrendingUp size={14} className="text-green-400 shrink-0 mt-1" />
                    : <TrendingDown size={14} className="text-red-400 shrink-0 mt-1" />
                  }
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminInventoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Modal states
  const [categoryModal, setCategoryModal] = useState<Category | null | undefined>(undefined);
  const [itemModal, setItemModal] = useState<InventoryItem | null | undefined>(undefined);
  const [stockModal, setStockModal] = useState<InventoryItem | null>(null);
  const [logDrawer, setLogDrawer] = useState<InventoryItem | null>(null);

  const fetchCategories = useCallback(async () => {
    const res = await inventoryApi.getCategories();
    setCategories(res.data);
  }, []);

  const fetchItems = useCallback(async () => {
    const res = await inventoryApi.getItems(
      selectedCategoryId !== "all" ? selectedCategoryId : undefined
    );
    setItems(res.data);
  }, [selectedCategoryId]);

  const refresh = useCallback(async () => {
    await Promise.all([fetchCategories(), fetchItems()]);
  }, [fetchCategories, fetchItems]);

  useEffect(() => {
    setLoading(true);
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const handleDeleteCategory = async (cat: Category) => {
    if (cat._count.items > 0) {
      toast.error(`Remove all items from "${cat.name}" first`);
      return;
    }
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await inventoryApi.deleteCategory(cat.id);
      toast.success("Category deleted");
      if (selectedCategoryId === cat.id) setSelectedCategoryId("all");
      refresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete");
    }
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await inventoryApi.deleteItem(item.id);
      toast.success("Item deleted");
      refresh();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const totalItems = categories.reduce((sum, c) => sum + c._count.items, 0);
  const lowStockItems = items.filter((i) => i.quantity <= i.lowStockThreshold);

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-primary">Inventory</h1>
          <p className="text-text-muted text-sm mt-1">
            {totalItems} items across {categories.length} categories
            {lowStockItems.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-medium">
                ⚠ {lowStockItems.length} low stock
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCategoryModal(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-text-muted hover:text-accent hover:border-accent transition-all text-sm font-medium"
          >
            <Plus size={16} /> Category
          </button>
          <button
            onClick={() => setItemModal(null)}
            disabled={categories.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-gold text-background font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* ── Category sidebar ── */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 gap-1">
          <p className="text-xs text-text-muted font-medium uppercase tracking-wide px-3 mb-2">Categories</p>

          <button
            onClick={() => setSelectedCategoryId("all")}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
              selectedCategoryId === "all"
                ? "bg-accent/15 text-accent border border-accent/30 font-medium"
                : "text-text-muted hover:text-text-primary hover:bg-surface-2"
            }`}
          >
            <span className="flex items-center gap-2"><Package size={15} /> All Items</span>
            <span className="text-xs opacity-70">{totalItems}</span>
          </button>

          {categories.map((cat) => (
            <div key={cat.id} className="group flex items-center gap-1">
              <button
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all min-w-0 ${
                  selectedCategoryId === cat.id
                    ? "bg-accent/15 text-accent border border-accent/30 font-medium"
                    : "text-text-muted hover:text-text-primary hover:bg-surface-2"
                }`}
              >
                <span className="truncate">{cat.name}</span>
                <span className="text-xs opacity-70 shrink-0 ml-1">{cat._count.items}</span>
              </button>
              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setCategoryModal(cat)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                  title="Rename"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && !loading && (
            <p className="text-xs text-text-muted px-3 py-2">No categories yet</p>
          )}
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          {/* Mobile category tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategoryId("all")}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
                selectedCategoryId === "all" ? "bg-accent text-background font-semibold" : "bg-surface-2 text-text-muted border border-border"
              }`}
            >
              All ({totalItems})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
                  selectedCategoryId === cat.id ? "bg-accent text-background font-semibold" : "bg-surface-2 text-text-muted border border-border"
                }`}
              >
                {cat.name} ({cat._count.items})
              </button>
            ))}
          </div>

          {/* Items table */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => <div key={i} className="h-16 rounded-xl skeleton" />)}
            </div>
          ) : (
            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs text-text-muted font-medium uppercase tracking-wide">Item</th>
                      <th className="text-left px-4 py-3 text-xs text-text-muted font-medium uppercase tracking-wide hidden sm:table-cell">Category</th>
                      <th className="text-left px-4 py-3 text-xs text-text-muted font-medium uppercase tracking-wide">Stock</th>
                      <th className="text-left px-4 py-3 text-xs text-text-muted font-medium uppercase tracking-wide hidden md:table-cell">Price</th>
                      <th className="text-left px-4 py-3 text-xs text-text-muted font-medium uppercase tracking-wide">Status</th>
                      <th className="text-right px-4 py-3 text-xs text-text-muted font-medium uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredItems.map((item) => {
                      const isLow = item.quantity <= item.lowStockThreshold;
                      const isOut = item.quantity === 0;
                      return (
                        <tr key={item.id} className="hover:bg-surface-2 transition-colors">
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-text-primary">{item.name}</span>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                              {item.category.name}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-bold text-text-primary">
                              {item.quantity}
                            </span>
                            <span className="text-xs text-text-muted ml-1">{item.unit}</span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-sm text-text-secondary">
                            {item.price != null ? `Rs. ${item.price}` : "—"}
                          </td>
                          <td className="px-4 py-3">
                            {isOut ? (
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 w-fit">
                                <AlertTriangle size={10} /> Low Stock
                              </span>
                            ) : (
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                In Stock
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setStockModal(item)}
                                className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                                title="Adjust stock"
                              >
                                <ChevronRight size={16} />
                              </button>
                              <button
                                onClick={() => setLogDrawer(item)}
                                className="p-1.5 rounded-lg text-text-muted hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                                title="View history"
                              >
                                <History size={16} />
                              </button>
                              <button
                                onClick={() => setItemModal(item)}
                                className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item)}
                                className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredItems.length === 0 && (
                  <div className="text-center py-16">
                    <Package size={32} className="text-text-muted mx-auto mb-3 opacity-40" />
                    <p className="text-text-muted text-sm">
                      {search ? "No items match your search" : "No items in this category"}
                    </p>
                    {!search && categories.length > 0 && (
                      <button
                        onClick={() => setItemModal(null)}
                        className="mt-3 text-accent text-sm hover:underline"
                      >
                        Add your first item
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {categoryModal !== undefined && (
        <CategoryModal
          category={categoryModal}
          onClose={() => setCategoryModal(undefined)}
          onSuccess={refresh}
        />
      )}

      {itemModal !== undefined && (
        <ItemModal
          item={itemModal}
          categories={categories}
          defaultCategoryId={selectedCategoryId !== "all" ? selectedCategoryId : categories[0]?.id || ""}
          onClose={() => setItemModal(undefined)}
          onSuccess={refresh}
        />
      )}

      {stockModal && (
        <StockAdjustModal
          item={stockModal}
          onClose={() => setStockModal(null)}
          onSuccess={refresh}
        />
      )}

      {logDrawer && (
        <StockLogDrawer
          item={logDrawer}
          onClose={() => setLogDrawer(null)}
        />
      )}
    </div>
  );
}
