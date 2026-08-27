# Veteran's Outdoor Therapy Admin Wiki

This is the complete operating and developer handoff manual for the private `/admin` area. The in-app copy is intentionally written for a nontechnical administrator; this file includes the same operating instructions plus implementation details for a developer taking over the project.

## 1. What the website is

The site is a Next.js 16 App Router application using React 19 and TypeScript. It is intended to run on Vercel and uses:

| Area | Technology | Purpose |
| --- | --- | --- |
| Web application | Next.js 16, React 19, TypeScript | Pages, server rendering, forms, route handlers, metadata |
| Styling | Global CSS in `src/app/globals.css` | Layout, responsive design, admin and public presentation |
| Database | Neon Postgres via `@neondatabase/serverless` | Products, events, testimonials, gallery metadata, orders, submissions |
| Uploaded media | Vercel Blob | Public URLs for newly uploaded product, event, testimonial, and gallery files |
| Checkout | PayPal Checkout APIs and React SDK | Browser checkout plus server-side amount/payment verification |
| Email | Nodemailer over SMTP | Contact, paid-order, confirmation, and shipment messages |
| Hosting | Vercel | Production deployment, environment variables, and server execution |

The private admin area is server-protected. The public site can display seed content without a database, but persistent editing requires Neon. Uploads require Blob configuration.

## 2. Plain-language administrator guide

### Sign in and sign out

1. Visit `https://veteransoutdoortherapy.org/admin`.
2. Enter the administrator username and password.
3. Use the tabs to choose a content area.
4. Sign out when finished, especially on a shared computer.

The admin panel includes Products, Events, Testimonials, Orders, Gallery, and Wiki tabs.

### Products

Use Products to manage merchandise and sponsorship catalog records. Add by filling in the form, choosing an image or pasting a URL, entering comma-separated sizes if applicable, and pressing Save product. Use the pencil icon to edit, the copy icon to duplicate, and the trash icon to delete. Featured controls prominent home-page placement. Stock is currently informational: checkout validates a product and size but does not automatically deduct inventory.

### Events

An event includes public page copy, dates, location, image, event template, CTA, publication state, featured state, and recap information. Uncheck Published to hide an event without deleting it. Use Is over and a verified recap URL for completed events. Check both the events list and the event detail page after saving.

### Testimonials

Testimonials contain the approved quote, author display name, service/branch, category, image, alt text, image position, publication state, and sort order. Use the public and admin category/year filters to browse records. Use Anonymous when identification is not approved. Uncheck Published to keep a record while hiding it from visitors.

### Gallery

The Gallery tab accepts one or multiple PNG, JPEG, or WebP images. Select several files with Ctrl (Windows) or Command (Mac), then press Upload images. New uploads initially appear published with a generic description, so edit every new image before considering the work finished.

- Alt text: a short description for someone who cannot see the image. Example: “Two Veterans stand beside a lake after a fishing outing.” Do not write “image of” or stuff in keywords.
- Caption: optional visible context, such as the event or activity.
- Tags: comma-separated internal labels such as `fishing, Missouri, community`.
- Year: the verified photo/event year.
- Published: uncheck to hide without deleting.
- Sort order: controls relative display order.

Changing Published saves immediately. Unchecking it hides the image from the public gallery without pressing Save metadata. Use Save metadata for the other fields.

Only publish authentic outdoor-therapy moments. Exclude gore, severe injury, graphic medical scenes, duplicates, standalone logos, flyers, posters, advertisements, and unapproved images. Delete removes the gallery record; Blob uploads are also sent for storage deletion. Keep originals in an external archive if they may be needed.

Alt text is not a reliable mouseover tooltip. The implementation supplies alt text, a hover title, and a visible caption in the lightbox so the description works for mouse, keyboard, touch, and assistive technology users.

### Orders and email

After PayPal reports a completed payment, the server verifies the amount, marks the order paid, stores the customer and line items, and sends a paid-order notification to `CONTACT_EMAIL_TO` plus an order confirmation to the customer’s checkout email. The order stores name, email, phone, shipping address, notes, product, size, quantity, prices, PayPal IDs, and timestamps.

Search Orders by order number, customer name, email, or PayPal ID. Open the order, confirm payment is Paid, review every line item and address, set Processing while preparing, then set Shipped with carrier and tracking number. The customer receives a shipment email once for that tracking combination. Set Completed after delivery. Payment status and fulfillment status are separate; orders are records, not a size-level inventory system.

### Email troubleshooting

The website sends through the configured SMTP mailbox. `CONTACT_EMAIL_TO` is the team destination for contact submissions and paid-order notifications. Contact messages use the visitor email as Reply-To, so pressing Reply normally answers the visitor. Customer confirmations and shipping notices go to the checkout email and use the team address as Reply-To.

If mail is missing, check spam/junk, the destination address, SMTP credentials, and Vercel logs. A paid order remains recorded even if email delivery fails.

### Common problems and safe fixes

- Cannot sign in: confirm the exact deployed `ADMIN_USERNAME` and `ADMIN_PASSWORD`; ask a developer to rotate them through hosting settings.
- Save fails: confirm `DATABASE_URL` exists and the database is reachable.
- Upload fails: confirm `BLOB_READ_WRITE_TOKEN`, accepted file type, and reasonable file size.
- Broken image: confirm the local asset or Blob URL still exists, then re-upload with a clear filename.
- Customer paid but no email arrived: find the order in Orders and check payment status; email delivery is separate from payment.
- Public content did not change: confirm the Save message, refresh, and test in a private window.

## 3. Developer handoff: architecture and data flow

### Admin mutation flow

1. A server-rendered admin page checks `isAdmin()`.
2. The administrator submits a native HTML form.
3. A server action in `src/app/admin/actions.ts` checks `isAdmin()` again.
4. Input is normalized and files are uploaded to Blob if present.
5. The action writes through `src/lib/db.ts` to Neon.
6. `revalidatePath()` invalidates affected routes.
7. The action redirects to the admin view with a status query parameter.

Authorization is checked inside every server action; a hidden field or private page is not authorization.

### Gallery flow

`src/lib/data.ts` contains the curated local fallback manifest. `getGalleryImages()` creates `gallery_images` when Neon is configured and seeds it when empty. Thereafter the database is the source of truth. New files use the Blob `gallery/` prefix and the public URL is stored in Neon. `getPublishedGalleryImages()` powers the public page.

### Checkout flow

The browser calls `/api/paypal/create-order`. The server validates slugs, quantities, and sizes against the catalog and creates a pending order. PayPal handles payment. The browser calls `/api/paypal/capture-order`; the server captures, verifies a completed capture and exact total, and runs the idempotent finalizer. `/api/paypal/webhook` provides a second payment signal. Unique `order_events` keys prevent duplicate finalization and notifications.

### Email flow

`src/lib/mail.ts` creates a Nodemailer SMTP transporter. `/api/submissions` saves contact/intake submissions and sends contact notifications. `src/lib/shop/order-finalization.ts` sends internal and customer order mail after payment. `src/app/admin/orders/order-actions.ts` sends shipment mail after a valid fulfillment update.

## 4. Database tables

- `products`: catalog, pricing, image URLs, sizes, optional stock, featured flag.
- `events`: page copy, dates, image, type, location, template, publication, featured and recap fields.
- `testimonials`: quote, author, service, image metadata, category, publication and order fields.
- `gallery_images`: image URL, alt, caption, tags, year, publication and order fields.
- `orders`: customer, shipping, payment IDs/status, totals, fulfillment/tracking, notification timestamps.
- `order_items`: immutable-at-order-time product name, size, quantity, unit price, and line total.
- `order_events`: PayPal/finalization audit and idempotency events.
- `submissions`: contact/intake payloads and timestamps.
- `migrations`: one-time data corrections run during lazy initialization.

Schema creation is currently lazy in `src/lib/db.ts`, not a migration CLI. A future developer should move schema changes into versioned migrations before scaling the data model.

## 5. Environment and deployment

Production requires `NEXT_PUBLIC_SITE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, SMTP variables, and PayPal variables documented in `.env.example`. Never commit values. Use PayPal sandbox credentials while testing and switch API base and credentials together for production.

Run `npm run lint` and `npm run build`, then test login, saves, gallery batch upload/delete, filters, PayPal sandbox checkout, order records, invoices, all email paths, keyboard navigation, mobile layout, and broken-image checks. Google Fonts are fetched by `next/font`; if build networking cannot reach Google Fonts, self-host with `next/font/local`.

## 6. Known limitations and next improvements

- Stock is not tracked per size and is not decremented at checkout.
- Authentication is one shared cookie session with no roles or password-reset UI.
- Gallery moderation is human review; recognition tooling is not integrated.
- Seed alt text is a safe generic fallback and should be replaced with human-reviewed descriptions in Gallery.
- Uploads should gain explicit size, dimension, MIME-sniffing, malware, and moderation checks.
- Database setup should use versioned migrations instead of lazy DDL.
- Customer data requires careful access control, retention, and backup practices.
