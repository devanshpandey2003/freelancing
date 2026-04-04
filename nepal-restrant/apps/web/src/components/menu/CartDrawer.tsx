"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, ShoppingCart, Trash2, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { ordersApi } from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  tableId: number;
}

export default function CartDrawer({ open, onClose, tableId }: CartDrawerProps) {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, total } = useCartStore();
  const [note, setNote] = useState("");
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!tableId || tableId < 1 || tableId > 5) {
      toast.error("Invalid table. Please scan the QR code again.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setPlacing(true);
    try {
      const res = await ordersApi.place({
        tableId,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
        })),
        note: note.trim() || undefined,
      });

      clearCart();
      onClose();
      router.push(`/order-success?orderId=${res.data.id}&table=${tableId}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        id="cart-drawer"
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border z-50 flex flex-col transition-transform duration-400 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingCart size={20} className="text-accent" />
            <h2 className="font-serif text-xl font-bold text-text-primary">
              Your Cart
            </h2>
            {tableId >= 1 && tableId <= 5 && (
              <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
                Table {tableId}
              </span>
            )}
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center">
                <ShoppingCart size={32} className="text-text-muted" />
              </div>
              <div>
                <p className="text-text-primary font-medium">Your cart is empty</p>
                <p className="text-text-muted text-sm mt-1">
                  Browse the menu and add items to order
                </p>
              </div>
            </div>
          ) : (
            items.map((cartItem) => (
              <div
                key={cartItem.menuItem.id}
                className="flex gap-4 p-3 rounded-xl bg-surface-2 border border-border"
              >
                {/* Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={cartItem.menuItem.imageUrl || "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=200&q=80"}
                    alt={cartItem.menuItem.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary line-clamp-1 mb-1">
                    {cartItem.menuItem.name}
                  </p>
                  <p className="text-accent text-sm font-bold">
                    Rs. {cartItem.menuItem.price * cartItem.quantity}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      id={`cart-dec-${cartItem.menuItem.id}`}
                      onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-surface-3 flex items-center justify-center hover:bg-accent/20 transition-colors"
                    >
                      <Minus size={12} className="text-text-primary" />
                    </button>
                    <span className="text-sm font-semibold text-text-primary w-5 text-center">
                      {cartItem.quantity}
                    </span>
                    <button
                      id={`cart-inc-${cartItem.menuItem.id}`}
                      onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-surface-3 flex items-center justify-center hover:bg-accent/20 transition-colors"
                    >
                      <Plus size={12} className="text-text-primary" />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  id={`remove-${cartItem.menuItem.id}`}
                  onClick={() => removeItem(cartItem.menuItem.id)}
                  className="p-1.5 text-text-muted hover:text-accent-red transition-colors self-start"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-border space-y-4">
            {/* Note */}
            <textarea
              id="order-note"
              placeholder="Any special instructions? (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full bg-surface-2 border border-border rounded-xl p-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent resize-none transition-colors"
            />

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-text-muted text-sm">Total</span>
              <span className="font-serif text-2xl font-bold text-gradient-gold">
                Rs. {total()}
              </span>
            </div>

            {/* Place order */}
            <button
              id="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={placing || !tableId}
              className="w-full py-4 rounded-xl bg-gradient-gold text-background font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-gold-lg"
            >
              {placing ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  Place Order
                  <ChevronRight size={18} />
                </>
              )}
            </button>

            {!tableId && (
              <p className="text-center text-xs text-accent-red">
                Please scan the QR code at your table to place an order.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
