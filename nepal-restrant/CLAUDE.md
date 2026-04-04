# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Haveli** is a restaurant management system (monorepo) for a Nepalese restaurant. Customers scan QR codes at tables to browse the menu and place orders; staff manage orders in real time via an admin dashboard.

## Monorepo Structure

npm workspaces monorepo with three packages:

- `apps/server` — Express + TypeScript REST API + Socket.io (`@haveli/server`, runs on port 4000)
- `apps/web` — Next.js 14 frontend (`@haveli/web`, runs on port 3000)
- `packages/prisma` — Shared Prisma schema + client (`@haveli/prisma`)

The server imports `@haveli/prisma` as a workspace dependency, giving it access to the generated Prisma client.

## Commands

All commands run from the repo root unless noted.

```bash
# Start both server and web in parallel
npm run dev

# Database (PostgreSQL via Docker)
docker-compose up -d          # start postgres + pgadmin
npm run db:generate           # regenerate Prisma client after schema changes
npm run db:migrate            # run migrations (dev)
npm run db:seed               # seed initial data
npm run db:studio             # open Prisma Studio at localhost:5555

# Build
npm run build

# Lint (web only)
npm run lint --workspace=apps/web

# Run individual workspaces
npm run dev --workspace=apps/server
npm run dev --workspace=apps/web
```

## Environment Setup

Copy `.env.example` and fill in values. The `.env` file must be at the repo root (or at `packages/prisma/` for the Prisma CLI). Key variables:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — secret for signing admin JWTs
- `CLIENT_URL` — allowed CORS origin for the server (default: `http://localhost:3000`)
- `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_SOCKET_URL` — consumed by the Next.js frontend

## Architecture

### Data Flow

1. Customer scans a table QR code → navigated to `/menu?tableId=N`
2. Customer browses menu, adds items to cart (Zustand store, persisted in localStorage), places order
3. `POST /api/orders` — server validates items, snapshots prices, creates order in DB, emits `order:new` via Socket.io to `admin_room`
4. Admin dashboard connected to Socket.io receives live updates; admin changes status via `PATCH /api/orders/:id/status`
5. Status change emits `order:status_updated` to both `admin_room` and `table_{N}` room — customer sees update in real time

### Auth

Admin-only routes use `authMiddleware` (Bearer JWT). `SUPER_ADMIN` role is additionally guarded by `superAdminOnly` middleware. The web client stores the token in `localStorage` under key `haveli_admin_token` and attaches it via an Axios request interceptor in [apps/web/src/lib/api.ts](apps/web/src/lib/api.ts).

### Socket.io Rooms

- `admin_room` — all connected admins join on `join:admin`
- `table_{N}` — customers join on `join:table` with their table number
- Server emits are in [apps/server/src/socket.ts](apps/server/src/socket.ts); the `io` instance is exported from `index.ts` and imported by route files that need to emit

### Key Files

| File | Purpose |
|------|---------|
| `apps/server/src/index.ts` | Express app setup, route mounting, Socket.io initialization |
| `apps/server/src/socket.ts` | Socket.io event handlers + emit helpers |
| `apps/server/src/middlewares/auth.ts` | JWT middleware + `superAdminOnly` guard |
| `apps/web/src/lib/api.ts` | All Axios API calls, grouped by domain (menu, orders, auth, qr, upload, dashboard) |
| `apps/web/src/store/cart.ts` | Zustand cart store (persisted, tableId not persisted) |
| `packages/prisma/prisma/schema.prisma` | DB schema — `MenuItem`, `Order`, `OrderItem`, `Admin` |

### Business Rules

- Tables are numbered 1–5 (hardcoded validation in `POST /api/orders`)
- Prices stored in rupees (Rs.) as integers
- `OrderItem.price` is a snapshot of `MenuItem.price` at order time, not a foreign key
- Order statuses: `PENDING → PREPARING → SERVED` (or `CANCELLED`)
- Admin roles: `SUPER_ADMIN` (full access) and `STAFF` (can manage orders/menu but not admin users)

### File Uploads

`multer` saves uploaded menu images to `apps/server/public/uploads/`. They are served statically at `/uploads/*`. The `NEXT_PUBLIC_API_URL` prefix is needed in the frontend when constructing image URLs.
