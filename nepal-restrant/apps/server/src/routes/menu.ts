import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middlewares/auth";

const router = Router();


// GET /api/menu — public, returns all items grouped by category
router.get("/", async (_req: Request, res: Response) => {
  const items = await prisma.menuItem.findMany({
    where: { available: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  // Group by category
  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return res.json({ items, grouped });
});

// GET /api/menu/all — admin: includes unavailable items
router.get("/all", authMiddleware, async (_req: Request, res: Response) => {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
  return res.json(items);
});

// GET /api/menu/:id
router.get("/:id", async (req: Request, res: Response) => {
  const item = await prisma.menuItem.findUnique({ where: { id: req.params.id } });
  if (!item) return res.status(404).json({ error: "Item not found" });
  return res.json(item);
});

// POST /api/menu — admin only
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const { name, category, price, imageUrl, description, available } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ error: "Name, category and price are required" });
  }

  const item = await prisma.menuItem.create({
    data: {
      name,
      category,
      price: parseInt(price),
      imageUrl: imageUrl || null,
      description: description || null,
      available: available !== undefined ? Boolean(available) : true,
    },
  });
  return res.status(201).json(item);
});

// PUT /api/menu/:id — admin only
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  const { name, category, price, imageUrl, description, available } = req.body;

  const existing = await prisma.menuItem.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Item not found" });

  const updated = await prisma.menuItem.update({
    where: { id: req.params.id },
    data: {
      ...(name && { name }),
      ...(category && { category }),
      ...(price && { price: parseInt(price) }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(description !== undefined && { description }),
      ...(available !== undefined && { available: Boolean(available) }),
    },
  });
  return res.json(updated);
});

// DELETE /api/menu/:id — admin only
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  const existing = await prisma.menuItem.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ error: "Item not found" });

  await prisma.menuItem.delete({ where: { id: req.params.id } });
  return res.json({ message: "Item deleted" });
});

export default router;
