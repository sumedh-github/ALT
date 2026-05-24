# Avero Loose Theory (ALT) - Frontend Only

ALT is a frontend-only Next.js 14 storefront prototype focused on dark luxury streetwear aesthetics.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Zustand for cart/UI state
- Framer Motion for page reveals and interactions

## Routes

- `/` homepage
- `/shop` product listing
- `/shop/[slug]` product detail
- `/lookbook`
- `/about`
- `/cart`

## Run locally

```bash
npm install
echo 'NEXT_PUBLIC_SITE_URL="http://localhost:3000"' > .env
npm run dev
```

Then open `http://localhost:3000`.
