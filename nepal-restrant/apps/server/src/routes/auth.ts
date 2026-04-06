import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authMiddleware, AuthRequest, superAdminOnly } from "../middlewares/auth";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Database error or server crash", detail: error.message });
  }
});

// POST /api/auth/register (Super Admin only can create new admins)
router.post(
  "/register",
  authMiddleware,
  superAdminOnly,
  async (req: AuthRequest, res: Response) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 12);
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashed,
        role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "STAFF",
      },
    });

    return res.status(201).json({
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    });
  }
);

// GET /api/auth/me
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  const admin = await prisma.admin.findUnique({
    where: { id: req.admin!.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return res.json(admin);
});

// GET /api/auth/admins (Super Admin only)
router.get(
  "/admins",
  authMiddleware,
  superAdminOnly,
  async (_req: Request, res: Response) => {
    const admins = await prisma.admin.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return res.json(admins);
  }
);

// DELETE /api/auth/admins/:id (Super Admin only)
router.delete(
  "/admins/:id",
  authMiddleware,
  superAdminOnly,
  async (req: AuthRequest, res: Response) => {
    if (req.params.id === req.admin!.id) {
      return res.status(400).json({ error: "Cannot delete yourself" });
    }
    await prisma.admin.delete({ where: { id: req.params.id } });
    return res.json({ message: "Admin deleted" });
  }
);

export default router;
