# Veteran's Outdoor Therapy

A Vercel-ready nonprofit and ecommerce site built with Next.js 16, React 19, Neon Postgres, Vercel Blob, and PayPal Checkout.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the service credentials. The committed example contains no secrets; `.env.local` is ignored by Git.

## Free-tier services

1. Create a Neon Postgres database and add `DATABASE_URL` in Vercel.
2. Enable Vercel Blob and add `BLOB_READ_WRITE_TOKEN`.
3. Create a PayPal developer app. Use sandbox credentials until test orders pass, then switch `PAYPAL_API_BASE` to `https://api-m.paypal.com` with live credentials.
4. Set `ADMIN_USERNAME` and a strong `ADMIN_PASSWORD` in Vercel.
5. Set `NEXT_PUBLIC_SITE_URL=https://veteransoutdoortherapy.org`.

The catalog works from seed data without Neon. Product writes and form submissions intentionally require the database. Image uploads intentionally require Blob. Checkout is hidden until a public PayPal client ID is present.

## Commands

```bash
npm run lint
npm run build
npm start
```

See `CONTENT-MIGRATION.md` for the source-site inventory and migration status.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
