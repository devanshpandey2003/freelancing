import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  admin?: { id: string; email: string; role: string };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      id: string;
      email: string;
      role: string;
    };
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

export function superAdminOnly(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (req.admin?.role !== "SUPER_ADMIN") {
    return res.status(403).json({ error: "Forbidden: Super admin only" });
  }
  next();
}
