"use client";
import { useEffect, useState, useCallback } from "react";
import { ordersApi } from "@/lib/api";
import { io } from "socket.io-client";
import { Clock, ChefHat, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

type OrderStatus = "PENDING" | "PREPARING" | "SERVED" | "CANCELLED";

const STATUS_COLS: { status: OrderStatus; label: string; icon: any; color: string; bg: string }[] = [
  { status: "PENDING", label: "Pending", icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  { status: "PREPARING", label: "Preparing", icon: ChefHat, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30" },
  { status: "SERVED", label: "Served", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
  { status: "CANCELLED", label: "Cancelled", icon: XCircle, color: "text-red-400", bg: "bg-red-400/10 border-red-400/30" },
];

const STATUS_NEXT: Record<string, OrderStatus | null> = {
  PENDING: "PREPARING",
  PREPARING: "SERVED",
  SERVED: null,
  CANCELLED: null,
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await ordersApi.getAll();
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    // Socket.io real-time
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000");
    socket.emit("join:admin");

    socket.on("order:new", (newOrder: any) => {
      setOrders((prev) => [newOrder, ...prev]);
      toast.success(`🔔 New order from Table ${newOrder.tableId}!`);
    });

    socket.on("order:status_updated", (update: { orderId: string; status: string }) => {
      setOrders((prev) =>
        prev.map((o) => o.id === update.orderId ? { ...o, status: update.status } : o)
      );
    });

    return () => { socket.disconnect(); };
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await ordersApi.updateStatus(orderId, status);
      // Socket.io will update the list automatically
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm("Cancel this order?")) return;
    setUpdatingId(orderId);
    try {
      await ordersApi.updateStatus(orderId, "CANCELLED");
    } catch {
      toast.error("Failed to cancel order");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-serif text-3xl font-bold text-text-primary">Orders</h1>
        <button
          id="refresh-orders-btn"
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-text-muted hover:text-accent hover:border-accent transition-colors text-sm"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {STATUS_COLS.map(({ status, label, icon: Icon, color, bg }) => {
          const colOrders = orders.filter((o) => o.status === status);
          return (
            <div key={status} className="space-y-3">
              {/* Column header */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${bg}`}>
                <Icon size={16} className={color} />
                <span className={`text-sm font-semibold ${color}`}>{label}</span>
                <span className="ml-auto bg-black/20 text-xs rounded-full px-2 py-0.5 font-mono">
                  {colOrders.length}
                </span>
              </div>

              {/* Order cards */}
              <div className="space-y-3">
                {colOrders.length === 0 ? (
                  <div className="text-center py-8 text-text-muted text-sm">
                    No {label.toLowerCase()} orders
                  </div>
                ) : (
                  colOrders.map((order) => {
                    const nextStatus = STATUS_NEXT[order.status] as OrderStatus | null;
                    return (
                      <div
                        key={order.id}
                        id={`order-${order.id}`}
                        className="bg-surface rounded-2xl border border-border p-4 space-y-3 hover:border-accent/30 transition-colors"
                      >
                        {/* Order header */}
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-accent">Table {order.tableId}</span>
                          <span className="text-xs text-text-muted font-mono">
                            #{order.id.slice(-6).toUpperCase()}
                          </span>
                        </div>

                        {/* Items */}
                        <div className="space-y-1">
                          {order.items?.slice(0, 3).map((item: any) => (
                            <div key={item.id} className="flex justify-between text-xs">
                              <span className="text-text-secondary truncate">
                                {item.menuItem?.name} ×{item.quantity}
                              </span>
                              <span className="text-text-muted ml-2">
                                Rs. {item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <p className="text-xs text-text-muted">
                              +{order.items.length - 3} more items
                            </p>
                          )}
                        </div>

                        {/* Note */}
                        {order.note && (
                          <p className="text-xs text-accent/70 italic bg-accent/5 rounded px-2 py-1">
                            Note: {order.note}
                          </p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-1 border-t border-border">
                          <span className="font-bold text-text-primary">
                            Rs. {order.total}
                          </span>
                          <span className="text-xs text-text-muted">
                            {format(new Date(order.createdAt), "HH:mm")}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {nextStatus && (
                            <button
                              id={`advance-${order.id}`}
                              onClick={() => updateStatus(order.id, nextStatus)}
                              disabled={updatingId === order.id}
                              className="flex-1 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs font-medium hover:bg-accent hover:text-background transition-all disabled:opacity-50"
                            >
                              {updatingId === order.id ? "..." : `Mark ${nextStatus.charAt(0) + nextStatus.slice(1).toLowerCase()}`}
                            </button>
                          )}
                          {order.status !== "CANCELLED" && order.status !== "SERVED" && (
                            <button
                              id={`cancel-${order.id}`}
                              onClick={() => cancelOrder(order.id)}
                              disabled={updatingId === order.id}
                              className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10 transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
