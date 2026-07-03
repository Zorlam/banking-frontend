# Zenith — Frontend

A production-deployed Next.js 14 frontend for a banking-style fintech application. The application communicates with a Flask REST API and provides authentication, account management, transfers, airtime purchases, transaction history, and account settings.

## Live Deployment

* **Live Application:** https://keen-pavlova-f4dc6e.netlify.app
* **Backend API:** https://banking-backend-2mwq.onrender.com
* **Backend Repository:** https://github.com/Zorlam/banking-backend

## Tech Stack

* Next.js 14 (App Router)
* TypeScript
* Tailwind CSS
* React
* Local Fonts (Geist Sans & Geist Mono)
* Playfair Display
* JWT Authentication

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The application runs locally on:

```text
http://localhost:3000
```

The frontend expects the backend API URL to be configured in `.env.local`.

Example:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:5050/api
```

For production, the frontend communicates with the deployed Render backend.


```

## Project Structure

```
src/
  app/
    login/
    register/
    dashboard/
    transfer/
    history/
    settings/
    fonts/
  components/
    ui/
    receipt-modal.tsx
    deposit-modal.tsx
    sidebar.tsx
    app-shell.tsx
  hooks/
    use-auth.tsx
  lib/
    api.ts
    format.ts
    transaction-meta.ts
  types/
```

## Features

* User registration and login
* JWT authentication
* Automatic access token refresh
* Dashboard with account overview
* Money transfers
* Airtime purchases
* Deposit and withdrawal operations
* Transaction history with pagination
* Password change
* Responsive layout for desktop and mobile devices
* Custom reusable UI components
* Receipt modal for completed transactions
* Currency formatting using Naira and Kobo

## Design Notes

* Geist Sans and Geist Mono are self-hosted using `next/font/local`.
* Playfair Display is loaded using `next/font/google`.
* Monetary values display both Naira and Kobo to match the backend's integer-based money storage.
* Transaction receipts use a ledger-inspired confirmation modal rather than a standard notification.

## Backend Configuration

The API endpoint is configured through:

```env
NEXT_PUBLIC_API_URL=
```

No code changes are required when switching between local development and production—only the environment variable needs to be updated.

## Known Limitations

This project is intended as a portfolio and learning project.

Current limitations include:

* No automated tests
* No end-to-end testing
* No offline support
* No real banking integrations
* No KYC or regulatory compliance workflows

See the backend repository for API implementation details and backend-specific limitations.
