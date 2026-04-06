import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middlewares/auth";
import { io } from "../index";
import { emitNewOrder, emitOrderStatusUpdate } from "../socket";

const router = Router();


// POST /api/orders — customer places order
router.post("/", async (req: Request, res: Response) => {
  const { tableId, items, note } = req.body;

  if (!tableId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "tableId and items are required" });
  }

  if (tableId < 1 || tableId > 5) {
    return res.status(400).json({ error: "Invalid table ID (1–5)" });
  }

  // Validate all menu items and compute total
  const menuItemIds = items.map((i: { menuItemId: string }) => i.menuItemId);
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds }, available: true },
  });

  if (menuItems.length !== items.length) {
    return res.status(400).json({ error: "One or more menu items are invalid or unavailable" });
  }

  const menuMap = new Map(menuItems.map((m) => [m.id, m]));
  let total = 0;
  const orderItemsData = items.map((item: { menuItemId: string; quantity: number }) => {
    const menuItem = menuMap.get(item.menuItemId)!;
    const price = menuItem.price * item.quantity;
    total += price;
    return {
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      price: menuItem.price, // snapshot price
    };
  });

  const order = await prisma.order.create({
    data: {
      tableId,
      total,
      note: note || null,
      items: { create: orderItemsData },
    },
    include: {
      items: { include: { menuItem: true } },
    },
  });

  // Emit real-time event to admin
  emitNewOrder(io, order);

  return res.status(201).json(order);
});

// GET /api/orders — admin: get all orders
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  const { status, tableId } = req.query;

  const orders = await prisma.order.findMany({
    where: {
      ...(status && { status: status as any }),
      ...(tableId && { tableId: parseInt(tableId as string) }),
    },
    include: {
      items: { include: { menuItem: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return res.json(orders);
});

// GET /api/orders/:id
router.get("/:id", async (req: Request, res: Response) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: { include: { menuItem: true } } },
  });
  if (!order) return res.status(404).json({ error: "Order not found" });
  return res.json(order);
});

// PATCH /api/orders/:id/status — admin updates order status
router.patch("/:id/status", authMiddleware, async (req: Request, res: Response) => {
  const { status } = req.body;
  const validStatuses = ["PENDING", "PREPARING", "SERVED", "CANCELLED"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(", ")}` });
  }

  const existing = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Order not found" });

  const updated = await prisma.order.update({
    where: { id: req.params.id },
    data: { status },
    include: { items: { include: { menuItem: true } } },
  });

  // Emit status update to admin room and the specific table
  emitOrderStatusUpdate(io, updated.tableId, {
    orderId: updated.id,
    status: updated.status,
  });

  return res.json(updated);
});

export default router;
