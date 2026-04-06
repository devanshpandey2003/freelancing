import { PrismaClient } from "@prisma/client";

// Use explicit URL if available (local dev with .env), otherwise let
// Prisma read DATABASE_URL from process.env automatically (Render/production).
const prisma = process.env.DATABASE_URL
  ? new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } })
  : new PrismaClient();

export default prisma;
