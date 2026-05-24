# Avero Loose Theory (ALT) Ecommerce

Dark luxury streetwear ecommerce implementation built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, NextAuth v5, Stripe, Cloudinary, Zustand, Framer Motion, and React Hook Form + Zod.

## Stack

- Next.js 14 + TypeScript
- Tailwind CSS with ALT design tokens
- Prisma ORM + PostgreSQL (Supabase-ready)
- NextAuth.js v5 (Credentials + Google OAuth)
- Stripe Checkout + webhook
- Cloudinary signed upload endpoint
- Zustand cart/UI stores
- Framer Motion page reveals
- React Hook Form + Zod schemas

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Push schema and seed:
   ```bash
   npm run db:push
   npm run prisma:seed
   ```
5. Run dev server:
   ```bash
   npm run dev
   ```

Default admin seed credentials:
- email: `admin@averoalt.com`
- password: `AltAdmin123!`
