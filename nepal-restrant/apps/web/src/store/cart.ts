import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string | null;
  description?: string | null;
  available: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  tableId: number | null;
  setTableId: (id: number) => void;
  addItem: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      tableId: null,

      setTableId: (id) => set({ tableId: id }),

      addItem: (menuItem) => {
        const existing = get().items.find((i) => i.menuItem.id === menuItem.id);
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.menuItem.id === menuItem.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { menuItem, quantity: 1 }],
          }));
        }
      },

      removeItem: (menuItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.menuItem.id !== menuItemId),
        }));
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuItemId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.menuItem.id === menuItemId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce(
          (sum, item) => sum + item.menuItem.price * item.quantity,
          0
        ),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "haveli-cart",
      // Don't persist tableId across sessions
      partialize: (state) => ({ items: state.items }),
    }
  )
);
