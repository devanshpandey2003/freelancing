"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ordersApi } from "@/lib/api";
import { CheckCircle2, Clock, ChefHat, PartyPopper } from "lucide-react";
import Link from "next/link";
import { io } from "socket.io-client";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const tableId = parseInt(searchParams.get("table") || "0");

  const [order, setOrder] = useState<any>(null);
  const [status, setStatus] = useState("PENDING");

  useEffect(() => {
    if (!orderId) { router.push("/menu"); return; }

    ordersApi.getById(orderId).then((res) => {
      setOrder(res.data);
      setStatus(res.data.status);
    });

    // Real-time status updates
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000");
    socket.emit("join:table", tableId);
    socket.on("order:status_updated", (data: { orderId: string; status: string }) => {
      if (data.orderId === orderId) setStatus(data.status);
    });
    return () => { socket.disconnect(); };
  }, [orderId, tableId, router]);

  const statusConfig: Record<string, { icon: any; label: string; color: string; bg: string }> = {
    PENDING: {
      icon: Clock,
      label: "Order Received",
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    PREPARING: {
      icon: ChefHat,
      label: "Being Prepared",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    SERVED: {
      icon: PartyPopper,
      label: "Served! Enjoy!",
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  };

  const current = statusConfig[status] || statusConfig.PENDING;
  const StatusIcon = current.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center animate-pulse">
            <CheckCircle2 size={48} className="text-accent" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-4xl font-bold text-text-primary">
            Order Placed!
          </h1>
          <p className="text-text-muted">
            Your order has been received. We'll start preparing it shortly.
          </p>
        </div>

        {/* Status tracker */}
        <div className={`p-6 rounded-2xl ${current.bg} border border-white/10`}>
          <div className="flex items-center justify-center gap-3">
            <StatusIcon size={28} className={current.color} />
            <span className={`text-xl font-bold ${current.color}`}>
              {current.label}
            </span>
          </div>
          <p className="text-text-muted text-sm mt-2">
            Status updates in real-time — no need to refresh!
          </p>
        </div>

        {/* Order details */}
        {order && (
          <div className="bg-surface rounded-2xl border border-border p-5 text-left space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Table</span>
              <span className="text-accent font-bold">Table {order.tableId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Order ID</span>
              <span className="text-text-secondary font-mono text-xs">
                #{order.id.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="gold-divider" />
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-text-secondary">
                  {item.menuItem.name} × {item.quantity}
                </span>
                <span className="text-text-primary font-medium">
                  Rs. {item.price * item.quantity}
                </span>
              </div>
            ))}
            <div className="gold-divider" />
            <div className="flex justify-between">
              <span className="font-semibold text-text-primary">Total</span>
              <span className="font-bold text-accent text-lg">
                Rs. {order.total}
              </span>
            </div>
          </div>
        )}

        <Link
          href={`/menu?table=${tableId}`}
          id="order-more-btn"
          className="block w-full py-3 rounded-xl border border-accent/40 text-accent font-medium hover:bg-accent/10 transition-colors"
        >
          Order More Items
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
