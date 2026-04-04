"use client";
import { useEffect, useState, useRef } from "react";
import { menuApi, uploadApi } from "@/lib/api";
import { Plus, Pencil, Trash2, X, Check, Upload, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string | null;
  description?: string | null;
  available: boolean;
}

const CATEGORIES = [
  "Soup","Chicken Momo","Veg Momo","Chicken","Veg Items","Chaumin",
  "Salad","Sadeko","Egg Items","Burgers","Sausage","Breakfast",
  "Soft Drinks","Beer","Tea & Coffee",
];

function MenuItemModal({
  item,
  onClose,
  onSuccess,
}: {
  item: MenuItem | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: item?.name || "",
    category: item?.category || CATEGORIES[0],
    price: item?.price?.toString() || "",
    description: item?.description || "",
    imageUrl: item?.imageUrl || "",
    available: item?.available ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.upload(file);
      setForm((f) => ({ ...f, imageUrl: res.data.imageUrl }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.price) {
      toast.error("Name, category, and price are required");
      return;
    }
    setSaving(true);
    try {
      if (item) {
        await menuApi.update(item.id, form);
        toast.success("Item updated");
      } else {
        await menuApi.create(form);
        toast.success("Item created");
      }
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to save");
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
            {item ? "Edit Item" : "Add New Item"}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Image preview */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-surface-2 border border-border shrink-0">
              {form.imageUrl ? (
                <Image src={form.imageUrl} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">No image</div>
              )}
            </div>
            <div className="space-y-2">
              <button
                id="upload-image-btn"
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-text-muted hover:text-accent hover:border-accent transition-colors text-sm"
              >
                {uploading ? <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" /> : <Upload size={14} />}
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-xs text-text-muted">Or paste URL below</p>
            </div>
          </div>

          {/* Image URL */}
          <input
            type="url"
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
          />

          {/* Name */}
          <div>
            <label className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1 block">Name *</label>
            <input
              id="item-name"
              type="text"
              placeholder="e.g. Chicken Momo Steam"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1 block">Category *</label>
            <select
              id="item-category"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1 block">Price (Rs.) *</label>
            <input
              id="item-price"
              type="number"
              placeholder="e.g. 150"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              min="1"
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1 block">Description</label>
            <textarea
              id="item-description"
              placeholder="Short description (optional)"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent resize-none"
            />
          </div>

          {/* Available toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Available to customers</span>
            <button
              id="item-available-toggle"
              type="button"
              onClick={() => setForm((f) => ({ ...f, available: !f.available }))}
              className={`transition-colors ${form.available ? "text-green-400" : "text-text-muted"}`}
            >
              {form.available ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-border flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-border text-text-muted hover:text-text-primary transition-colors text-sm">
            Cancel
          </button>
          <button
            id="save-item-btn"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-gold text-background font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" /> : <Check size={16} />}
            {saving ? "Saving..." : item ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [modalItem, setModalItem] = useState<MenuItem | null | undefined>(undefined);

  const fetchItems = async () => {
    try {
      const res = await menuApi.getAllAdmin();
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await menuApi.delete(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Item deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = items.filter(
    (i) =>
      (categoryFilter === "All" || i.category === categoryFilter) &&
      i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-text-primary">Menu Management</h1>
          <p className="text-text-muted text-sm mt-1">{items.length} total items</p>
        </div>
        <button
          id="add-item-btn"
          onClick={() => setModalItem(null)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-gold text-background font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="menu-admin-search"
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent flex-1"
        />
        <select
          id="category-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent"
        >
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl skeleton" />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs text-text-muted font-medium uppercase tracking-wide">Item</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted font-medium uppercase tracking-wide">Category</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted font-medium uppercase tracking-wide">Price</th>
                  <th className="text-left px-4 py-3 text-xs text-text-muted font-medium uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-xs text-text-muted font-medium uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => (
                  <tr key={item.id} id={`menu-row-${item.id}`} className="hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={item.imageUrl || "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=100&q=60"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-text-primary">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-accent font-bold text-sm">Rs. {item.price}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.available ? "status-served" : "status-cancelled"}`}>
                        {item.available ? "Available" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`edit-${item.id}`}
                          onClick={() => setModalItem(item)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          id={`delete-${item.id}`}
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-text-muted text-sm">
                No items found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalItem !== undefined && (
        <MenuItemModal
          item={modalItem}
          onClose={() => setModalItem(undefined)}
          onSuccess={fetchItems}
        />
      )}
    </div>
  );
}
