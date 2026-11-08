# Deepavali 2026 · a celebration from Jegan

A small, interactive Tamil Deepavali greeting that everyone opens from one shared link:
light the Agal Vilakku (அகல் விளக்கு), taste the sweets, play with virtual crackers,
share a moment for family and friends, and receive Jegan's wishes.

No backend, database, accounts or personalisation: every visitor sees the same page.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

## Checks

```bash
npm run typecheck      # TypeScript
npm run lint           # ESLint
npm test               # Vitest unit tests
npx playwright install chromium webkit   # once
npm run build && npm run test:e2e        # Playwright (Chromium + WebKit, mobile + desktop)
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project**, import the repository (framework preset: Next.js, defaults are fine).
3. Deploy. No environment variables are required.
   `VERCEL_PROJECT_PRODUCTION_URL` is set by Vercel and used for social preview URLs.
   Optional: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://deepavali.example.com`) when using a custom domain.
4. Open the production URL and share it on WhatsApp.

Or from the CLI: `npx vercel` then `npx vercel --prod`.

## Where things live

- `src/lib/greeting.ts`: all greeting copy (English and Tamil).
- `src/lib/art/`: generated SVG geometry (agal vilakku, kolam, thoranam).
- `src/components/`: hero and vilakku, sweets, crackers, family, personality, final greeting, share.
- `e2e/`, `tests/unit/`: Playwright and Vitest suites.
