# Vet Buddy Pet Shop — Setup Guide

Full e-commerce shop integrated with the existing Vet Buddy veterinary website (Next.js 14 + Express + MongoDB).

## Folder structure

```
Vet Buddy/
├── src/
│   ├── app/
│   │   ├── shop/                 # Shop, product detail, checkout
│   │   └── admin/                # Admin dashboard
│   ├── components/
│   │   ├── shop/                 # ProductCard, CartDrawer, QRPayment, etc.
│   │   └── admin/                # AdminShell
│   ├── context/                  # Cart, Wishlist, ShopTheme
│   ├── lib/shop/                 # API client, dummy data, constants
│   └── types/shop.ts
├── server/
│   ├── src/
│   │   ├── models/               # Product, Order, Category, Coupon, Review...
│   │   ├── routes/               # REST API
│   │   └── data/seed-products.json
│   └── .env.example
└── docs/SHOP.md
```

## NPM packages

### Frontend (root)
- `framer-motion` — animations
- `react-icons` — icons
- `qrcode.react` — UPI QR payment
- `next`, `react`, `tailwindcss` — existing stack

### Backend (`server/`)
- `express`, `mongoose`, `cors`, `dotenv`
- `jsonwebtoken`, `bcryptjs` — admin auth
- `cloudinary`, `multer` — image uploads

> **Note:** Routing uses **Next.js App Router** (not React Router), which matches your existing project.

## Installation

### 1. Frontend
```bash
npm install
cp .env.example .env.local
npm run dev
```

### 2. Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with MongoDB URI, JWT_SECRET, Cloudinary keys
npm run seed
npm run dev
```

### 3. MongoDB
Install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Set `MONGODB_URI` in `server/.env`.

### 4. Cloudinary (image uploads)
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to `server/.env`
3. Upload product images from **Admin → Products**

Without Cloudinary, the shop still works with seed/dummy image URLs; admin upload returns 503 until configured.

## Environment variables

| Variable | Where | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `.env.local` | `http://localhost:5000/api` |
| `NEXT_PUBLIC_UPI_ID` | `.env.local` | UPI ID for QR payments |
| `MONGODB_URI` | `server/.env` | MongoDB connection |
| `JWT_SECRET` | `server/.env` | Admin JWT secret |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | `server/.env` | Seeded admin login |
| `CLOUDINARY_*` | `server/.env` | Image CDN |
| `UPI_ID` | `server/.env` | Server-side UPI for `/api/config` |
| `CLIENT_URL` | `server/.env` | `http://localhost:3000` for CORS |

## Default admin login

After `npm run seed` in `server/`:
- **Email:** `admin@vetbuddy.com`
- **Password:** `Admin@123`

Change these in production via `server/.env`.

## Routes

| URL | Description |
|-----|-------------|
| `/shop` | Main shop (categories, breeds, filters, pagination) |
| `/shop/product/[slug]` | Product detail + related products |
| `/shop/checkout` | Address form + UPI QR payment |
| `/admin/login` | Admin authentication |
| `/admin` | Dashboard analytics |
| `/admin/products` | CRUD + Cloudinary upload |
| `/admin/orders` | Order status: pending → delivered |

## API endpoints

- `GET /api/products` — list, search, filter, sort, paginate
- `GET /api/products/:slug` — single product
- `GET /api/categories` — categories
- `POST /api/orders` — create order
- `PATCH /api/orders/:id/pay` — mark paid
- `POST /api/auth/login` — admin JWT
- `POST /api/upload` — multi-image upload (admin)
- `GET /api/admin/dashboard` — stats (admin)

## Features checklist

- Shop navbar + home navbar **Shop** link (unchanged clinic sections)
- Cart: add/remove/qty, drawer, localStorage, floating button
- Wishlist (localStorage)
- Breed carousel, category pills, Amazon-style product cards
- Search, filters sidebar, sort, pagination
- Checkout + dynamic UPI QR (Google Pay / PhonePe / Paytm)
- Dark premium UI + loading skeletons
- Admin: products, orders, customers, coupons, payments, reviews
- Fallback dummy products when API is offline

## Production tips

1. Deploy API (Railway, Render, etc.) and set `NEXT_PUBLIC_API_URL`
2. Use MongoDB Atlas + strong `JWT_SECRET`
3. Configure Cloudinary for dynamic product images
4. Replace default admin credentials
