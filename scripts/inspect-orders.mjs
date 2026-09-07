/**
 * Prints the most recent orders from DATABASE_URL. Useful when verifying a sandbox purchase.
 *
 * Run with:
 *   node --env-file=.env.local scripts/inspect-orders.mjs
 */
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
	console.error("DATABASE_URL is not set.");
	process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const orders = await sql`
	SELECT order_number, status, fulfillment_status, paypal_order_id, paypal_capture_id, total, customer_name,
		internal_notification_sent_at IS NOT NULL AS internal_email,
		customer_notification_sent_at IS NOT NULL AS customer_email
	FROM orders ORDER BY id DESC LIMIT 5
`;
console.table(orders);

const items = await sql`
	SELECT o.order_number, i.product_slug, i.size, i.quantity, i.unit_price, i.line_total
	FROM order_items i JOIN orders o ON o.id = i.order_id
	ORDER BY i.id DESC LIMIT 10
`;
console.table(items);

const events = await sql`
	SELECT o.order_number, e.event_type, e.source, e.created_at
	FROM order_events e JOIN orders o ON o.id = e.order_id
	ORDER BY e.id DESC LIMIT 10
`;
console.table(events);

const [{ n }] = await sql`SELECT count(*)::int AS n FROM products`;
console.log(`products seeded: ${n}`);
