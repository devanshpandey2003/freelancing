# Haveli Restaurant — Full-Stack Web Application

A complete restaurant management system with QR-code-based table ordering, real-time admin panel, audio order notifications, and a premium dark-themed Next.js frontend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Node.js + Express + Socket.io |
| Database | PostgreSQL + Prisma ORM |
| Real-time | Socket.io |
| Auth | JWT (multi-user admin) |
| Animations | Framer Motion |
| QR Codes | `qrcode` npm package |
| Image Upload | Multer (local storage) |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Features

### Customer-Facing
- **QR code ordering** — scan a table QR code, browse the menu, and place an order directly from your phone
- **Mobile-first menu** — hamburger drawer for category navigation, 2-per-row item grid optimised for small screens
- **Live cart** — Zustand-powered cart persisted in localStorage; floating cart button shows total
- **Real-time order status** — customers see their order progress (Pending → Preparing → Served) via Socket.io

### Admin Panel
- **Live order board** — kanban columns (Pending / Preparing / Served / Cancelled) updated instantly via Socket.io
- **Audio notifications** — synthesised Web Audio API tones play on every new or updated order; no audio file dependencies
- **Rich notification cards** — slide-in cards show table number, item list, total, and a one-click link to the order
- **Menu management** — full CRUD with image uploads
- **Dashboard stats** — today's orders, revenue, per-status counts, and live table occupancy
- **QR code generator** — view and download QR codes for all 5 tables
- **Team management** — Super Admin can create/delete Staff accounts

---

## Project Structure

```
haveli/
├── apps/
│   ├── web/                    # Next.js 14 frontend
│   │   └── src/
│   │       ├── app/
│   │       │   ├── page.tsx           # Landing page
│   │       │   ├── menu/page.tsx      # Customer menu
│   │       │   ├── order-success/     # Order confirmation
│   │       │   └── admin/             # Admin panel
│   │       │       ├── page.tsx       # Login
│   │       │       ├── layout.tsx     # Sidebar layout + global notifications
│   │       │       ├── dashboard/     # Stats
│   │       │       ├── orders/        # Real-time orders (kanban)
│   │       │       ├── menu/          # Menu CRUD
│   │       │       ├── inventory/     # Inventory tracking
│   │       │       ├── qr-codes/      # QR code display
│   │       │       └── team/          # Admin user management
│   │       ├── components/
│   │       │   ├── landing/           # Hero, Navbar, etc.
│   │       │   ├── menu/              # MenuPageClient, CartDrawer
│   │       │   └── admin/             # OrderNotifications
│   │       ├── lib/api.ts             # Axios API client
│   │       └── store/cart.ts          # Zustand cart store
│   └── server/                 # Express API
│       └── src/
│           ├── index.ts               # App entry point
│           ├── socket.ts              # Socket.io setup + emit helpers
│           ├── routes/
│           │   ├── auth.ts            # Login/register/admin mgmt
│           │   ├── menu.ts            # Menu CRUD
│           │   ├── orders.ts          # Order placement & status
│           │   ├── qr.ts              # QR code generation
│           │   ├── upload.ts          # Image upload
│           │   └── dashboard.ts       # Stats
│           └── middlewares/auth.ts    # JWT middleware
└── packages/
    └── prisma/                 # Shared database schema
        ├── prisma/schema.prisma       # DB models
        └── src/seed.ts                # Seed data (90+ menu items)
```

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- Docker Desktop (for PostgreSQL)
- npm 8+

### Step 1 — Clone & Install

```bash
git clone <repo-url>
cd haveli

npm install
```

### Step 2 — Environment Variables

```bash
cp .env.example .env
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/server/.env`:
```env
DATABASE_URL="postgresql://haveli:haveli_secret@localhost:5432/haveli_restaurant"
JWT_SECRET="your_super_secret_key_here"
CLIENT_URL="http://localhost:3000"
PORT=4000
```

Edit `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

### Step 3 — Start PostgreSQL

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port `5432`
- pgAdmin on port `5050` (visit http://localhost:5050, credentials: `admin@haveli.com` / `admin`)

### Step 4 — Database Setup

```bash
cd packages/prisma
npm install
npm run generate
npm run migrate
npm run seed
```

### Step 5 — Run the Application

```bash
# From repo root — starts both server and web app in parallel
npm run dev
```

Or run individually:

```bash
npm run dev --workspace=apps/server   # port 4000
npm run dev --workspace=apps/web      # port 3000
```

### Step 6 — Open the App

| URL | Description |
|---|---|
| http://localhost:3000 | Landing page |
| http://localhost:3000/menu?table=1 | Customer menu (Table 1) |
| http://localhost:3000/admin | Admin login |
| http://localhost:4000/health | API health check |
| http://localhost:5050 | pgAdmin |

**Default Admin Credentials:**
- Email: `admin@haveli.com`
- Password: `Admin@1234`

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | No | Admin login |
| POST | `/api/auth/register` | Super Admin | Create new admin |
| GET | `/api/auth/me` | Yes | Current admin info |
| GET | `/api/auth/admins` | Super Admin | List all admins |
| DELETE | `/api/auth/admins/:id` | Super Admin | Delete admin |

### Menu
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/menu` | No | All available items (grouped by category) |
| GET | `/api/menu/all` | Yes | All items including hidden |
| POST | `/api/menu` | Yes | Create item |
| PUT | `/api/menu/:id` | Yes | Update item |
| DELETE | `/api/menu/:id` | Yes | Delete item |

### Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | No | Place order (customer) |
| GET | `/api/orders` | Yes | List all orders |
| GET | `/api/orders/:id` | No | Get order by ID |
| PATCH | `/api/orders/:id/status` | Yes | Update order status |

### Other
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/qr` | No | All 5 QR codes |
| GET | `/api/qr/:tableId` | No | Single QR code |
| GET | `/api/qr/:tableId?format=png` | No | Download QR as PNG |
| POST | `/api/upload` | Yes | Upload menu item image |
| GET | `/api/dashboard` | Yes | Dashboard stats |

### Socket.io Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `join:admin` | Client → Server | — | Admin subscribes to all order events |
| `join:table` | Client → Server | `tableId: number` | Customer subscribes to their table |
| `order:new` | Server → Admin | Full order object | New order placed by a customer |
| `order:status_updated` | Server → Admin + Table | `{ orderId, status, order }` | Order status changed by admin |

---

## Order Notifications

When any admin page is open, a global notification system listens for Socket.io events and:

1. **Plays a synthesised sound** via the Web Audio API (no audio files needed)
   - New order → three ascending notes (C5 → E5 → G5)
   - Status update → single soft chime
2. **Shows a slide-in card** (top-right) with table number, item summary, total, and a direct link to the orders board
3. Cards **auto-dismiss after 8 seconds** with a draining progress bar, or can be closed manually
4. Up to 4 notification cards stack simultaneously

---

## QR Code System

Each table (1–5) has a unique QR code that encodes:
```
https://your-domain.vercel.app/menu?table=N
```

When scanned:
1. Customer's browser opens the mobile-optimised menu page
2. Table ID is read from the URL and stored in the cart
3. All orders are tagged with the table number
4. Admin sees orders labelled by table on the kanban board

Generate and print QR codes from `/admin/qr-codes`.

---

## Menu Categories

90+ items across 15 categories:

- Soup (Veg / Chicken / Thukpa)
- Chicken Momo (Steam / Fry / Jhol / Chilly / Kothey)
- Veg Momo
- Chicken
- Veg Items
- Egg Items
- Salad
- Sadeko
- Burgers
- Sausage
- Chaumin
- Breakfast
- Soft Drinks
- Beer
- Tea & Coffee

---

## Deployment

### Frontend → Vercel

1. Push to GitHub and import the repo at [vercel.com](https://vercel.com)
2. Set root directory to `apps/web`
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL
   - `NEXT_PUBLIC_SOCKET_URL` = your Railway backend URL

### Backend → Railway

1. Create a new project at [railway.app](https://railway.app)
2. Add a PostgreSQL service (Railway provides `DATABASE_URL` automatically)
3. Connect your GitHub repo; set build/start commands via `railway.json`
4. Add environment variables:
   - `JWT_SECRET` = long random string
   - `CLIENT_URL` = your Vercel frontend URL
5. After first deploy: `npm run db:migrate:prod && npm run db:seed`
