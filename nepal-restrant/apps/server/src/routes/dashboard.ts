import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

// GET /api/dashboard — admin stats
router.get("/", authMiddleware, async (_req: Request, res: Response) => {
  const [
    totalOrders,
    pendingOrders,
    preparingOrders,
    servedOrders,
    cancelledOrders,
    revenueResult,
    todayOrders,
    todayRevenue,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "PREPARING" } }),
    prisma.order.count({ where: { status: "SERVED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: { not: "CANCELLED" },
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
  ]);

  // Active tables (tables with PENDING or PREPARING orders)
  const activeTableOrders = await prisma.order.findMany({
    where: { status: { in: ["PENDING", "PREPARING"] } },
    select: { tableId: true },
    distinct: ["tableId"],
  });
  const activeTables = activeTableOrders.map((o) => o.tableId);

  return res.json({
    orders: {
      total: totalOrders,
      pending: pendingOrders,
      preparing: preparingOrders,
      served: servedOrders,
      cancelled: cancelledOrders,
      today: todayOrders,
    },
    revenue: {
      total: revenueResult._sum.total || 0,
      today: todayRevenue._sum.total || 0,
    },
    tables: {
      total: 5,
      active: activeTables,
      activeCount: activeTables.length,
    },
  });
});

export default router;
