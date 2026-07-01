# Zenith — Frontend

A Next.js 14 dashboard for the Zenith fintech backend. Black/white/gray, Playfair Display headings, Geist Sans body, Geist Mono for figures.

## Setup

```bash
npm install
cp .env.example .env.local   # then edit if your backend isn't on the default port
npm run dev
```

Runs on **http://localhost:3000**. Requires the Flask backend running (default expected at `http://127.0.0.1:5050/api` — see `fintech-backend/README.md`).

Demo login: `daniel@example.com` / `Prayer123` (or `sharon@example.com` / `Sunrise123`).

## Structure

```
src/
  app/                 routes (App Router)
    login/, register/  auth pages, shared two-pane layout
    dashboard/          balance hero, quick actions, recent activity
    transfer/           bank transfer + airtime, tabbed
    history/            filterable, paginated transaction list
    settings/           profile + password change
    fonts/              self-hosted Geist (woff2) — see note below
  components/
    ui/                 Button, Input, Card, Modal, Toast — no component library
    receipt-modal.tsx   post-transaction confirmation ("ledger stamp")
    deposit-modal.tsx   quick top-up
    sidebar.tsx          desktop sidebar / mobile bottom tabs
    app-shell.tsx        layout wrapper + auth gate
  hooks/use-auth.tsx     session state, login/register/logout
  lib/
    api.ts               fetch wrapper, token storage, auto-refresh on 401
    format.ts             Naira formatting, kobo splitting, date helpers
    transaction-meta.ts  icon/label/sign per transaction type
  types/                  shapes matching the backend API responses
```

## Design notes

- **Geist Sans/Mono are self-hosted** via `next/font/local` (`src/app/fonts/`), not `next/font/google`. The brief asked for Geist as a Google Font, but Geist isn't in Next.js 14.2's bundled Google Fonts list — Vercel distributes it separately. The two `.woff2` files here are the official MIT-licensed Vercel build.
- **Playfair Display** uses `next/font/google` normally, fetched at build time. This requires network access to `fonts.googleapis.com` — if your build environment blocks that domain, swap to `next/font/local` with a downloaded copy, the same way Geist is handled.
- **Money display**: every amount renders with the whole-Naira figure in Playfair Display and the kobo in monospace, at a visibly smaller scale — never rounded away, always present. This mirrors the backend storing money as integer minor units rather than floats.
- **Receipt modal**: after a transfer or airtime purchase, a stamp-style confirmation animates in with a dashed-border itemization (reference, recipient, balance after) — meant to evoke a stamped ledger entry rather than a generic toast.

## Connecting to a different backend

Edit `NEXT_PUBLIC_API_URL` in `.env.local`. The API client (`src/lib/api.ts`) reads this once at build/runtime; no other code needs to change.

## What's not included

This is a frontend for a demo/skeleton backend, not a production banking app. No automated tests, no E2E suite, no analytics, no real KYC/compliance flows. See the backend README for the corresponding backend caveats.
