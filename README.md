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

## Content administration

The authenticated `/admin` area includes Products, Events, Testimonials, Orders, Gallery, and Wiki tabs.

- Gallery images are stored as database records with local seed assets as a fallback. Admins can upload one or many PNG/JPEG/WebP files, edit alt text, captions, tags, year, publication status, and sort order, or delete an image. Blob-backed uploads are removed from Vercel Blob when deleted.
- The public gallery uses responsive local/Blob images, descriptive alt text, captions, keyboard navigation, and an accessible lightbox. Duplicate local seed entries are de-duplicated and the known standalone logo asset is excluded.
- Testimonials can be filtered by category and year on `/testimonials` and in admin. Categories and dates are stored with each testimonial.
- The admin Wiki at `/admin/wiki` explains publishing rules, checkout/order operations, and troubleshooting.

The full gallery discovery, curation, UX, SEO, recognition, and QA record is in [`docs/GALLERY_IMPLEMENTATION_PLAN.md`](docs/GALLERY_IMPLEMENTATION_PLAN.md). The gallery requires `DATABASE_URL` for persistent edits and `BLOB_READ_WRITE_TOKEN` for uploads.

The complete administrator operating manual and developer handoff is in [`docs/ADMIN_WIKI.md`](docs/ADMIN_WIKI.md), and the same guide is available to authenticated administrators at `/admin/wiki`.

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
