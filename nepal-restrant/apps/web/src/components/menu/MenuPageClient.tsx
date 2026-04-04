"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { menuApi } from "@/lib/api";
import { useCartStore, type MenuItem } from "@/store/cart";
import Image from "next/image";
import { Plus, Minus, ShoppingCart, Search, X } from "lucide-react";
import CartDrawer from "@/components/menu/CartDrawer";
import toast from "react-hot-toast";

const CATEGORY_ORDER = [
  "Soup",
  "Chicken Momo",
  "Veg Momo",
  "Chicken",
  "Veg Items",
  "Chaumin",
  "Salad",
  "Sadeko",
  "Egg Items",
  "Burgers",
  "Sausage",
  "Breakfast",
  "Soft Drinks",
  "Beer",
  "Tea & Coffee",
];

export default function MenuPageClient() {
  const searchParams = useSearchParams();
  const tableId = parseInt(searchParams.get("table") || "0");

  const { addItem, updateQuantity, items: cartItems, itemCount, setTableId } = useCartStore();

  const [menuData, setMenuData] = useState<Record<string, MenuItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (tableId >= 1 && tableId <= 5) {
      setTableId(tableId);
    }
  }, [tableId, setTableId]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await menuApi.getAll();
        setMenuData(res.data.grouped);
        const firstCat = Object.keys(res.data.grouped)[0];
        setActiveCategory(firstCat || "");
      } catch (err) {
        toast.error("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const getItemQty = useCallback(
    (itemId: string) => {
      const found = cartItems.find((c) => c.menuItem.id === itemId);
      return found ? found.quantity : 0;
    },
    [cartItems]
  );

  const allCategories = Object.keys(menuData).sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const filteredItems = searchQuery
    ? Object.values(menuData)
        .flat()
        .filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : menuData[activeCategory] || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto" />
          <p className="text-text-muted">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container-section flex items-center justify-between h-16">
          <div>
            <h1 className="font-serif text-xl font-bold text-text-primary">
              Haveli Menu
            </h1>
            {tableId >= 1 && tableId <= 5 && (
              <p className="text-xs text-accent font-medium">Table {tableId}</p>
            )}
          </div>

          <button
            id="cart-btn"
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-full bg-surface-2 border border-border hover:border-accent transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart size={20} className="text-text-primary" />
            {itemCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-background text-xs font-bold flex items-center justify-center">
                {itemCount()}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="container-section pb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              id="menu-search"
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-full pl-9 pr-9 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar categories (desktop) */}
        {!searchQuery && (
          <aside className="hidden md:block w-52 shrink-0 sticky top-[108px] h-[calc(100vh-108px)] overflow-y-auto border-r border-border">
            <nav className="py-4">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  id={`cat-${cat.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-4 py-3 text-sm transition-all ${
                    activeCategory === cat
                      ? "text-accent bg-accent/10 border-r-2 border-accent font-medium"
                      : "text-text-muted hover:text-text-primary hover:bg-surface-2"
                  }`}
                >
                  {cat}
                  <span className="ml-1 text-xs text-text-muted">
                    ({menuData[cat]?.length || 0})
                  </span>
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Mobile category tabs */}
          {!searchQuery && (
            <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm transition-all ${
                    activeCategory === cat
                      ? "bg-accent text-background font-semibold"
                      : "bg-surface-2 text-text-muted border border-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Category heading */}
          <h2 className="font-serif text-2xl font-bold text-text-primary mb-6">
            {searchQuery ? `Search: "${searchQuery}"` : activeCategory}
          </h2>

          {/* Items grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-muted">No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const qty = getItemQty(item.id);
                return (
                  <div
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    className="group bg-surface rounded-2xl overflow-hidden border border-border hover:border-accent/40 transition-all hover:shadow-card-hover"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={item.imageUrl || "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80"}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-text-primary text-sm mb-1 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-accent font-bold text-lg mb-3">
                        Rs. {item.price}
                      </p>

                      {/* Add to cart controls */}
                      {qty === 0 ? (
                        <button
                          id={`add-${item.id}`}
                          onClick={() => {
                            addItem(item);
                            toast.success(`${item.name} added to cart`);
                          }}
                          className="w-full py-2 rounded-xl bg-accent/10 border border-accent/40 text-accent text-sm font-medium hover:bg-accent hover:text-background transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={16} />
                          Add to Cart
                        </button>
                      ) : (
                        <div className="flex items-center justify-between">
                          <button
                            id={`dec-${item.id}`}
                            onClick={() => updateQuantity(item.id, qty - 1)}
                            className="w-9 h-9 rounded-full bg-surface-2 border border-border flex items-center justify-center hover:border-accent transition-colors"
                          >
                            <Minus size={14} className="text-text-primary" />
                          </button>
                          <span className="font-bold text-text-primary">
                            {qty}
                          </span>
                          <button
                            id={`inc-${item.id}`}
                            onClick={() => {
                              addItem(item);
                            }}
                            className="w-9 h-9 rounded-full bg-accent flex items-center justify-center hover:opacity-90 transition-opacity"
                          >
                            <Plus size={14} className="text-background" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Floating cart button (mobile) */}
      {itemCount() > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden">
          <button
            id="floating-cart-btn"
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-gradient-gold text-background font-semibold shadow-gold-lg hover:opacity-90 transition-opacity"
          >
            <ShoppingCart size={20} />
            <span>View Cart · Rs. {useCartStore.getState().total()}</span>
            <span className="bg-background/20 rounded-full w-6 h-6 flex items-center justify-center text-xs">
              {itemCount()}
            </span>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} tableId={tableId} />
    </div>
  );
}
