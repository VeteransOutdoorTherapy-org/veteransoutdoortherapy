# Shop Implementation Plan

## Objective

Turn the current PayPal storefront into a dependable merchandise shop that records every paid purchase, captures the buyer's detailed information, notifies the organization at the same address used by the contact form, produces an invoice/receipt record, and eventually manages fulfillment and inventory.

The implementation will be staged. Payment records, buyer information, and internal notification come first. Per-size inventory is intentionally last because it is useful operationally but less urgent than knowing that a paid order exists and who placed it.

## Current state

The current shop provides:

- Product pages with product name, description, price, image, and optional sizes.
- A browser-local cart stored in `localStorage`.
- PayPal order creation and capture routes.
- Product records in Neon with `sizes` and one optional `stock` number.
- An admin product editor.
- Contact-form email through SMTP to `CONTACT_EMAIL_TO`.

The current shop does not reliably provide:

- A site-owned order record.
- Customer checkout details saved with an order.
- Size/variant details in the server-side PayPal order request.
- Internal paid-order notification.
- Customer order confirmation from this site.
- Invoice/order number generation.
- Payment reconciliation through PayPal webhooks.
- Fulfillment or shipment tracking.
- Per-size inventory.

## Required business outcome

For every successful purchase, the organization must receive a readable email at `CONTACT_EMAIL_TO` containing:

- Order number and payment status.
- PayPal order and capture IDs.
- Customer name, email, phone, and shipping address.
- Every product, selected size/variant, quantity, unit price, and line total.
- Subtotal, shipping, tax if applicable, and total paid.
- Any customer order notes.

The same information must be saved in Neon so the organization can retrieve it even if an email is lost.

## Staged implementation

### Stage 1 — Paid purchase details and immediate notification

Priority: highest.

Build the smallest reliable paid-order pipeline first. This stage does not attempt inventory control.

Customer experience:

1. Customer reviews the cart.
2. Customer enters name, email, phone, shipping address, and order notes.
3. The site validates the cart against the server catalog and calculates the total server-side.
4. The site creates a pending checkout record before opening PayPal.
5. PayPal payment is captured.
6. The site verifies the capture succeeded and the captured amount matches the server total.
7. The organization receives an internal paid-order email at `CONTACT_EMAIL_TO`.
8. The customer sees a confirmation page with an order number.

Stage 1 data should include a minimal durable order record, because notification without persistence is unsafe. It must not decrement inventory yet.

Files introduced or changed:

```text
src/lib/shop/types.ts
src/lib/shop/checkout-validation.ts
src/lib/shop/order-pricing.ts
src/lib/shop/orders.ts
src/lib/shop/paypal.ts
src/lib/shop/order-notifications.ts
src/lib/shop/order-email.ts
src/app/api/shop/checkout/route.ts
src/app/api/paypal/create-order/route.ts
src/app/api/paypal/capture-order/route.ts
src/app/checkout/page.tsx
src/app/checkout/success/page.tsx
src/components/shop/checkout-form.tsx
src/components/shop/order-summary.tsx
src/lib/db.ts
src/lib/mail.ts
```

Stage 1 acceptance criteria:

- A paid PayPal order creates a site-owned order record.
- The notification contains the complete buyer and order details.
- A failed payment does not generate a paid notification.
- The browser cannot alter the server-calculated price.
- Closing the browser after payment does not lose the order record.
- No inventory is changed in this stage.

### Stage 2 — Complete order ledger, invoices, and reconciliation

Priority: second.

Make orders useful as permanent business records and ensure payment state can recover from browser failures.

Database records:

```text
orders
  id
  order_number
  paypal_order_id
  paypal_capture_id
  status
  customer_name
  customer_email
  phone
  shipping_address jsonb
  order_notes
  subtotal
  shipping_amount
  tax_amount
  total
  currency
  created_at
  paid_at
  fulfilled_at
  cancelled_at
  refunded_at

order_items
  id
  order_id
  product_slug
  product_name_snapshot
  variant_label
  sku
  quantity
  unit_price
  line_total

order_events
  id
  order_id
  event_type
  source
  payload jsonb
  created_at
```

Capabilities:

- Human-readable order numbers such as `VOT-20260825-0001`.
- Immutable snapshots of the product name, price, and selected option at purchase time.
- Printable invoice/receipt view.
- Customer confirmation email with invoice details.
- Internal order email with a link to the admin order record.
- PayPal webhook handling for capture, refund, dispute, and cancellation events.
- Idempotency so repeated PayPal callbacks cannot create duplicate orders or emails.
- Clear payment states: `pending`, `paid`, `payment_failed`, `refunded`, and `cancelled`.

Files introduced or changed:

```text
src/lib/shop/invoice.ts
src/lib/shop/payment-events.ts
src/app/api/paypal/webhook/route.ts
src/app/api/shop/orders/[orderNumber]/route.ts
src/app/checkout/success/page.tsx
src/app/invoice/[orderNumber]/page.tsx
src/components/shop/invoice-view.tsx
src/lib/db.ts
```

### Stage 3 — Admin orders and fulfillment workflow

Priority: after records are dependable.

Add an authenticated order-management area:

```text
src/app/admin/orders/page.tsx
src/app/admin/orders/[orderNumber]/page.tsx
src/app/admin/orders/order-actions.ts
src/components/admin/order-list.tsx
src/components/admin/order-detail.tsx
```

Admin capabilities:

- Search by order number, customer name, email, or PayPal ID.
- Filter by payment and fulfillment status.
- View the complete order and invoice.
- Mark orders as processing, shipped, completed, cancelled, or refunded.
- Add carrier and tracking number.
- Send a shipment email to the customer.
- Record internal fulfillment notes.
- Never expose payment card data; PayPal remains the payment processor.

### Stage 4 — Polished customer shop experience

Priority: after the transaction and records are safe.

Improve the customer-facing flow:

```text
src/components/shop/cart-line-item.tsx
src/components/shop/checkout-form.tsx
src/components/shop/customer-order-status.tsx
src/app/order/[orderNumber]/page.tsx
src/app/order/[orderNumber]/loading.tsx
```

Features:

- Quantity controls.
- Clear shipping and fulfillment expectations.
- Order confirmation page that survives refresh.
- Customer order lookup by order number and email.
- Accessible validation and payment error states.
- Better handling of abandoned or expired carts.
- Mobile-first checkout layout.

### Stage 5 — Inventory and per-size variants

Priority: last, as requested.

Replace the current product-level `stock` field with variant-level stock:

```text
product_variants
  id
  product_id
  option_name
  option_value
  sku
  stock_quantity
  reserved_quantity
  low_stock_threshold
  active

inventory_events
  id
  variant_id
  order_id
  change_quantity
  reason
  created_at
```

Files introduced or changed:

```text
src/lib/shop/inventory.ts
src/lib/shop/variants.ts
src/app/api/shop/inventory/route.ts
src/components/shop/variant-selector.tsx
src/components/admin/inventory-editor.tsx
src/lib/db.ts
src/app/admin/page.tsx
src/app/admin/actions.ts
```

Inventory rules:

- Validate stock on the server at checkout.
- Reserve stock only for a short-lived pending checkout, if reservations are enabled.
- Decrement available stock only after confirmed payment.
- Release reservations when checkout expires or payment fails.
- Prevent purchases of inactive or out-of-stock variants.
- Show per-size availability to customers and admins.
- Keep an inventory event history for corrections and audits.

## Proposed final structure

```text
docs/
  SHOP_IMPLEMENTATION_PLAN.md

src/app/
  checkout/page.tsx
  checkout/success/page.tsx
  invoice/[orderNumber]/page.tsx
  order/[orderNumber]/page.tsx
  admin/orders/page.tsx
  admin/orders/[orderNumber]/page.tsx
  api/shop/checkout/route.ts
  api/shop/orders/[orderNumber]/route.ts
  api/shop/inventory/route.ts
  api/paypal/create-order/route.ts
  api/paypal/capture-order/route.ts
  api/paypal/webhook/route.ts

src/components/
  shop/
    cart-line-item.tsx
    checkout-form.tsx
    invoice-view.tsx
    order-summary.tsx
    customer-order-status.tsx
    variant-selector.tsx
  admin/
    order-list.tsx
    order-detail.tsx
    inventory-editor.tsx

src/lib/
  shop/
    types.ts
    checkout-validation.ts
    order-pricing.ts
    orders.ts
    paypal.ts
    payment-events.ts
    order-notifications.ts
    order-email.ts
    invoice.ts
    variants.ts
    inventory.ts
  db.ts
  mail.ts
```

## Environment configuration

The order notification must reuse the contact-form destination:

```env
CONTACT_EMAIL_TO=the-same-address-used-for-contact-notifications
```

Existing SMTP variables remain responsible for sending:

```env
SMTP_HOST=mail.privateemail.com
SMTP_PORT=465
SMTP_USER=website@veteransoutdoortherapy.org
SMTP_PASSWORD=...
```

PayPal remains configured separately:

```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_API_BASE=https://api-m.sandbox.paypal.com
```

Production must switch `PAYPAL_API_BASE` to the live PayPal endpoint only after sandbox tests pass.

## Testing strategy

Each stage must be verified before the next stage begins:

- Unit tests for price calculation, order totals, status transitions, and idempotency.
- API tests for invalid carts, altered prices, missing customer details, failed capture, and duplicate callbacks.
- PayPal sandbox purchases using both successful and failed payment paths.
- Email delivery tests to the same `CONTACT_EMAIL_TO` address.
- Invoice checks against the captured PayPal amount.
- Manual mobile checkout test.
- Inventory tests only when Stage 5 begins.

## Implementation rule

The browser cart is for convenience only. Neon and PayPal are the authoritative sources for order validation and payment state. The site must never treat a client-side success callback alone as proof that an order was paid.
