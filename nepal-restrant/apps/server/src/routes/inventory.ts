import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

// ── Categories ────────────────────────────────────────────────────────────────

// GET /api/inventory/categories
router.get("/categories", authMiddleware, async (_req: Request, res: Response) => {
  const categories = await prisma.inventoryCategory.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  });
  return res.json(categories);
});

// POST /api/inventory/categories
router.post("/categories", authMiddleware, async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ error: "Category name is required" });
  }
  try {
    const category = await prisma.inventoryCategory.create({
      data: { name: name.trim() },
      include: { _count: { select: { items: true } } },
    });
    return res.status(201).json(category);
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(400).json({ error: "Category name already exists" });
    }
    throw err;
  }
});

// PUT /api/inventory/categories/:id
router.put("/categories/:id", authMiddleware, async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ error: "Category name is required" });
  }
  const existing = await prisma.inventoryCategory.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Category not found" });

  try {
    const updated = await prisma.inventoryCategory.update({
      where: { id: req.params.id },
      data: { name: name.trim() },
      include: { _count: { select: { items: true } } },
    });
    return res.json(updated);
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(400).json({ error: "Category name already exists" });
    }
    throw err;
  }
});

// DELETE /api/inventory/categories/:id
router.delete("/categories/:id", authMiddleware, async (req: Request, res: Response) => {
  const existing = await prisma.inventoryCategory.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { items: true } } },
  });
  if (!existing) return res.status(404).json({ error: "Category not found" });
  if (existing._count.items > 0) {
    return res.status(400).json({
      error: `Cannot delete: category has ${existing._count.items} item(s). Remove items first.`,
    });
  }
  await prisma.inventoryCategory.delete({ where: { id: req.params.id } });
  return res.json({ message: "Category deleted" });
});

// ── Items ─────────────────────────────────────────────────────────────────────

// GET /api/inventory/items?categoryId=
router.get("/items", authMiddleware, async (req: Request, res: Response) => {
  const { categoryId } = req.query;
  const items = await prisma.inventoryItem.findMany({
    where: categoryId ? { categoryId: categoryId as string } : undefined,
    include: { category: { select: { id: true, name: true } } },
    orderBy: [{ category: { name: "asc" } }, { name: "asc" }],
  });
  return res.json(items);
});

// POST /api/inventory/items
router.post("/items", authMiddleware, async (req: Request, res: Response) => {
  const { name, categoryId, quantity, unit, price, lowStockThreshold } = req.body;
  if (!name?.trim() || !categoryId || !unit?.trim()) {
    return res.status(400).json({ error: "Name, categoryId, and unit are required" });
  }
  const category = await prisma.inventoryCategory.findUnique({ where: { id: categoryId } });
  if (!category) return res.status(400).json({ error: "Category not found" });

  const item = await prisma.inventoryItem.create({
    data: {
      name: name.trim(),
      categoryId,
      unit: unit.trim(),
      quantity: quantity !== undefined ? parseFloat(quantity) : 0,
      price: price !== undefined && price !== "" ? parseFloat(price) : null,
      lowStockThreshold: lowStockThreshold !== undefined ? parseFloat(lowStockThreshold) : 5,
    },
    include: { category: { select: { id: true, name: true } } },
  });
  return res.status(201).json(item);
});

// PUT /api/inventory/items/:id  (name, unit, price, threshold only — not quantity)
router.put("/items/:id", authMiddleware, async (req: Request, res: Response) => {
  const { name, unit, price, lowStockThreshold, categoryId } = req.body;
  const existing = await prisma.inventoryItem.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Item not found" });

  if (categoryId) {
    const cat = await prisma.inventoryCategory.findUnique({ where: { id: categoryId } });
    if (!cat) return res.status(400).json({ error: "Category not found" });
  }

  const updated = await prisma.inventoryItem.update({
    where: { id: req.params.id },
    data: {
      ...(name?.trim() && { name: name.trim() }),
      ...(unit?.trim() && { unit: unit.trim() }),
      ...(categoryId && { categoryId }),
      ...(price !== undefined && { price: price === "" || price === null ? null : parseFloat(price) }),
      ...(lowStockThreshold !== undefined && { lowStockThreshold: parseFloat(lowStockThreshold) }),
    },
    include: { category: { select: { id: true, name: true } } },
  });
  return res.json(updated);
});

// DELETE /api/inventory/items/:id
router.delete("/items/:id", authMiddleware, async (req: Request, res: Response) => {
  const existing = await prisma.inventoryItem.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Item not found" });
  await prisma.inventoryItem.delete({ where: { id: req.params.id } });
  return res.json({ message: "Item deleted" });
});

// ── Stock adjustment ──────────────────────────────────────────────────────────

// POST /api/inventory/items/:id/stock
router.post("/items/:id/stock", authMiddleware, async (req: Request, res: Response) => {
  const { action, quantity, note } = req.body;

  if (!["ADD", "REMOVE"].includes(action)) {
    return res.status(400).json({ error: "action must be ADD or REMOVE" });
  }
  const qty = parseFloat(quantity);
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({ error: "quantity must be a positive number" });
  }

  const item = await prisma.inventoryItem.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: "Item not found" });

  if (action === "REMOVE" && item.quantity < qty) {
    return res.status(400).json({
      error: `Insufficient stock. Available: ${item.quantity} ${item.unit}`,
    });
  }

  const [updatedItem] = await prisma.$transaction([
    prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: { quantity: action === "ADD" ? item.quantity + qty : item.quantity - qty },
      include: { category: { select: { id: true, name: true } } },
    }),
    prisma.inventoryLog.create({
      data: {
        itemId: req.params.id,
        action,
        quantity: qty,
        note: note?.trim() || null,
      },
    }),
  ]);

  return res.json(updatedItem);
});

// ── Stock logs ────────────────────────────────────────────────────────────────

// GET /api/inventory/items/:id/logs
router.get("/items/:id/logs", authMiddleware, async (req: Request, res: Response) => {
  const item = await prisma.inventoryItem.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: "Item not found" });

  const logs = await prisma.inventoryLog.findMany({
    where: { itemId: req.params.id },
    orderBy: { createdAt: "desc" },
  });
  return res.json(logs);
});

export default router;
