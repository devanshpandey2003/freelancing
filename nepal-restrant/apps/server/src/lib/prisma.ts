import { PrismaClient } from "@prisma/client";

// DO NOT pass datasources/url here.
// Render injects DATABASE_URL into process.env automatically.
// Passing { datasources: { db: { url: process.env.DATABASE_URL } } }
// crashes at startup because it is evaluated before env vars load.
const prisma = new PrismaClient();

export default prisma;
