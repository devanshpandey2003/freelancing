# Haveli Restaurant — Full-Stack Web Application

A complete restaurant management system with QR-code-based table ordering, real-time admin panel, and a premium dark-themed Next.js frontend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Node.js + Express + Socket.io |
| Database | PostgreSQL + Prisma ORM |
| Real-time | Socket.io |
| Auth | JWT (multi-user admin) |
| QR Codes | `qrcode` npm package |
| Image Upload | Multer (local storage) |
| Deployment | Vercel (frontend) + Railway (backend) |

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
│   │       │       ├── layout.tsx     # Sidebar layout
│   │       │       ├── dashboard/     # Stats
│   │       │       ├── orders/        # Real-time orders (kanban)
│   │       │       ├── menu/          # Menu CRUD
│   │       │       ├── qr-codes/      # QR code display
│   │       │       └── team/          # Admin user management
│   │       ├── components/
│   │       │   ├── landing/           # Hero, Navbar, etc.
│   │       │   └── menu/              # MenuPageClient, CartDrawer
│   │       ├── lib/api.ts             # Axios API client
│   │       └── store/cart.ts          # Zustand cart store
│   └── server/                 # Express API
│       └── src/
│           ├── index.ts               # App entry point
│           ├── socket.ts              # Socket.io setup
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

# Install all workspace dependencies
npm install
```

### Step 2 — Environment Variables

```bash
# Copy example env files
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
- pgAdmin on port `5050` (visit http://localhost:5050, use admin@haveli.com / admin)

### Step 4 — Database Setup

```bash
# Navigate to prisma package
cd packages/prisma

# Install dependencies
npm install

# Generate Prisma client
npm run generate

# Run migrations
npm run migrate

# Seed with all menu items + default admin
npm run seed
```

### Step 5 — Run the Application

```bash
# From root directory — starts both server and web app
npm run dev
```

Or run individually:

```bash
# Backend (port 4000)
npm run dev --workspace=apps/server

# Frontend (port 3000)
npm run dev --workspace=apps/web
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
| GET | `/api/menu` | No | All available items (grouped) |
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
| POST | `/api/upload` | Yes | Upload image |
| GET | `/api/dashboard` | Yes | Dashboard stats |

### Socket.io Events

| Event | Direction | Description |
|---|---|---|
| `join:admin` | Client → Server | Admin subscribes to all orders |
| `join:table` | Client → Server | Customer subscribes to table updates |
| `order:new` | Server → Admin | New order placed |
| `order:status_updated` | Server → All | Order status changed |

---

## Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Set root directory to `apps/web`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL
   - `NEXT_PUBLIC_SOCKET_URL` = your Railway backend URL

### Backend → Railway

1. Create new project at [railway.app](https://railway.app)
2. Add PostgreSQL service (Railway provides `DATABASE_URL` automatically)
3. Connect your GitHub repo
4. Set root directory to monorepo root
5. Railway uses `railway.json` for build/start commands
6. Add environment variables:
   - `JWT_SECRET` = long random string
   - `CLIENT_URL` = your Vercel frontend URL
7. After first deploy, run: `npm run db:migrate:prod` and `npm run db:seed`

---

## QR Code System

Each table (1–5) has a unique QR code that encodes:
```
https://your-domain.vercel.app/menu?table=1
```

When scanned:
1. Customer's browser opens the menu page
2. Table ID is automatically read from the URL
3. All cart actions and the final order include the table ID
4. Admin sees orders labeled by table number

**Generate QR codes:** Visit `/admin/qr-codes` and print them.

---

## Menu Categories

The menu includes 90+ items across 15 categories:
- Soup (Veg/Chicken/Thukpa)
- Chicken Momo (Steam/Fry/Jhol/Chilly/Kothey)
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
