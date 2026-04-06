"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { menuApi } from "@/lib/api";
import { useCartStore, type MenuItem } from "@/store/cart";
import Image from "next/image";
import { Plus, Minus, ShoppingCart, Search, X } from "lucide-react";
import CartDrawer from "@/components/menu/CartDrawer";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

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

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
  exit: { opacity: 0, y: -16, scale: 0.97, transition: { duration: 0.22 } },
};

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
      } catch {
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

  const count = itemCount();

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
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-serif text-xl font-bold text-text-primary">
              Haveli Menu
            </h1>
            {tableId >= 1 && tableId <= 5 && (
              <p className="text-xs text-accent font-medium">Table {tableId}</p>
            )}
          </motion.div>

          <motion.button
            id="cart-btn"
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-full bg-surface-2 border border-border hover:border-accent transition-colors"
            aria-label="Open cart"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
          >
            <ShoppingCart size={20} className="text-text-primary" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-background text-xs font-bold flex items-center justify-center"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
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
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
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
                  className={`w-full text-left px-4 py-3 text-sm transition-all relative ${
                    activeCategory === cat
                      ? "text-accent bg-accent/10 border-r-2 border-accent font-medium"
                      : "text-text-muted hover:text-text-primary hover:bg-surface-2"
                  }`}
                >
                  {activeCategory === cat && (
                    <motion.span
                      layoutId="active-cat-indicator"
                      className="absolute inset-0 bg-accent/10 border-r-2 border-accent"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative">
                    {cat}
                    <span className="ml-1 text-xs text-text-muted">
                      ({menuData[cat]?.length || 0})
                    </span>
                  </span>
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 pb-28 md:pb-6">
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
          <AnimatePresence mode="wait">
            <motion.h2
              key={searchQuery || activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="font-serif text-xl sm:text-2xl font-bold text-text-primary mb-3 sm:mb-6"
            >
              {searchQuery ? `Search: "${searchQuery}"` : activeCategory}
            </motion.h2>
          </AnimatePresence>

          {/* Items grid */}
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-text-muted">No items found</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={searchQuery || activeCategory}
                className="grid grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-4"
              >
                {filteredItems.map((item, index) => {
                  const qty = getItemQty(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      id={`menu-item-${item.id}`}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="group bg-surface rounded-xl sm:rounded-2xl overflow-hidden border border-border hover:border-accent/40 transition-all hover:shadow-card-hover flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative h-28 sm:h-44 overflow-hidden shrink-0">
                        <Image
                          src={item.imageUrl || "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80"}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-108 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Info */}
                      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-text-primary text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-2 leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-accent font-bold text-sm sm:text-lg mb-2 sm:mb-3">
                          Rs. {item.price}
                        </p>

                        {/* Add to cart controls */}
                        <div className="mt-auto">
                          <AnimatePresence mode="wait">
                            {qty === 0 ? (
                              <motion.button
                                key="add"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.18 }}
                                id={`add-${item.id}`}
                                onClick={() => {
                                  addItem(item);
                                  toast.success(`${item.name} added`);
                                }}
                                whileTap={{ scale: 0.94 }}
                                className="w-full py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-accent/10 border border-accent/40 text-accent text-xs sm:text-sm font-medium hover:bg-accent hover:text-background transition-all flex items-center justify-center gap-1 sm:gap-2"
                              >
                                <Plus size={13} />
                                <span className="hidden xs:inline">Add</span>
                                <span className="xs:hidden">Add</span>
                              </motion.button>
                            ) : (
                              <motion.div
                                key="qty"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.18 }}
                                className="flex items-center justify-between"
                              >
                                <motion.button
                                  id={`dec-${item.id}`}
                                  onClick={() => updateQuantity(item.id, qty - 1)}
                                  whileTap={{ scale: 0.88 }}
                                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-surface-2 border border-border flex items-center justify-center hover:border-accent transition-colors"
                                >
                                  <Minus size={12} className="text-text-primary" />
                                </motion.button>
                                <motion.span
                                  key={qty}
                                  initial={{ scale: 1.4, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="font-bold text-text-primary text-sm"
                                >
                                  {qty}
                                </motion.span>
                                <motion.button
                                  id={`inc-${item.id}`}
                                  onClick={() => addItem(item)}
                                  whileTap={{ scale: 0.88 }}
                                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-accent flex items-center justify-center hover:opacity-90 transition-opacity"
                                >
                                  <Plus size={12} className="text-background" />
                                </motion.button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Floating cart button (mobile) */}
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 md:hidden w-[90vw] max-w-sm"
          >
            <motion.button
              id="floating-cart-btn"
              onClick={() => setCartOpen(true)}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-full bg-gradient-gold text-background font-semibold shadow-gold-lg hover:opacity-90 transition-opacity"
            >
              <ShoppingCart size={20} />
              <span>View Cart · Rs. {useCartStore.getState().total()}</span>
              <span className="bg-background/20 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {count}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} tableId={tableId} />
    </div>
  );
}
