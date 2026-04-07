"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Bell, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface OrderNotif {
  id: string;
  orderId: string;
  type: "new" | "updated";
  tableId: number;
  items: { name: string; quantity: number }[];
  total: number;
  status?: string;
  timestamp: Date;
}

function playSound(type: "new" | "updated") {
  try {
    const ctx = new AudioContext();

    if (type === "new") {
      // Three ascending notes — cheerful "new order" ding
      const notes = [523, 659, 784]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = "sine";
        const t = ctx.currentTime + i * 0.18;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        osc.start(t);
        osc.stop(t + 0.6);
      });
    } else {
      // Single soft chime for status updates
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 659;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.9);
    }
  } catch {
    // AudioContext not available (SSR or restricted)
  }
}

function NotifCard({
  notif,
  onDismiss,
}: {
  notif: OrderNotif;
  onDismiss: (id: string) => void;
}) {
  const isNew = notif.type === "new";

  // Auto-dismiss after 8s
  useEffect(() => {
    const t = setTimeout(() => onDismiss(notif.id), 8000);
    return () => clearTimeout(t);
  }, [notif.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
      className={`relative w-80 rounded-2xl border overflow-hidden shadow-2xl ${
        isNew
          ? "bg-surface border-accent/40"
          : "bg-surface border-blue-500/30"
      }`}
    >
      {/* Progress bar */}
      <motion.div
        className={`absolute top-0 left-0 h-0.5 ${isNew ? "bg-accent" : "bg-blue-400"}`}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 8, ease: "linear" }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isNew ? "bg-accent/20" : "bg-blue-500/20"
              }`}
            >
              {isNew ? (
                <Bell size={17} className="text-accent" />
              ) : (
                <ShoppingBag size={17} className="text-blue-400" />
              )}
            </div>
            <div>
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${
                  isNew ? "text-accent" : "text-blue-400"
                }`}
              >
                {isNew ? "New Order" : "Order Updated"}
              </p>
              <p className="text-lg font-bold text-text-primary font-serif leading-tight">
                Table {notif.tableId}
              </p>
            </div>
          </div>
          <button
            onClick={() => onDismiss(notif.id)}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Items preview */}
        <div className="space-y-1 mb-3">
          {notif.items.slice(0, 3).map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-text-secondary">
              <span className="w-1 h-1 rounded-full bg-text-muted shrink-0" />
              <span className="truncate">
                {item.name} ×{item.quantity}
              </span>
            </div>
          ))}
          {notif.items.length > 3 && (
            <p className="text-xs text-text-muted pl-3">
              +{notif.items.length - 3} more items
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border">
          <span className="font-bold text-text-primary">Rs. {notif.total}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted">
              {format(notif.timestamp, "HH:mm")}
            </span>
            <Link
              href="/admin/orders"
              onClick={() => onDismiss(notif.id)}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                isNew
                  ? "text-accent hover:text-accent/80"
                  : "text-blue-400 hover:text-blue-300"
              }`}
            >
              View <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function OrderNotifications() {
  const [notifs, setNotifs] = useState<OrderNotif[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const dismiss = (id: string) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));

  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000"
    );
    socketRef.current = socket;
    socket.emit("join:admin");

    socket.on("order:new", (order: any) => {
      playSound("new");
      setNotifs((prev) => [
        {
          id: `notif-${Date.now()}`,
          orderId: order.id,
          type: "new",
          tableId: order.tableId,
          items: (order.items || []).map((i: any) => ({
            name: i.menuItem?.name || "Item",
            quantity: i.quantity,
          })),
          total: order.total,
          timestamp: new Date(),
        },
        ...prev,
      ]);
    });

    socket.on(
      "order:status_updated",
      (update: { orderId: string; status: string; order?: any }) => {
        // Only notify on customer-relevant events (not admin-triggered cancellation)
        if (update.status === "CANCELLED") return;
        playSound("updated");
        setNotifs((prev) => [
          {
            id: `notif-${Date.now()}`,
            orderId: update.orderId,
            type: "updated",
            tableId: update.order?.tableId ?? 0,
            items: (update.order?.items || []).map((i: any) => ({
              name: i.menuItem?.name || "Item",
              quantity: i.quantity,
            })),
            total: update.order?.total ?? 0,
            status: update.status,
            timestamp: new Date(),
          },
          ...prev,
        ]);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifs.slice(0, 4).map((notif) => (
          <div key={notif.id} className="pointer-events-auto">
            <NotifCard notif={notif} onDismiss={dismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
