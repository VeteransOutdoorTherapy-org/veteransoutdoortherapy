import "server-only";
import type { OrderRecord } from "./types";

type PayPalResponse = {
	id?: string;
	status?: string;
	purchase_units?: Array<{
		payments?: { captures?: Array<{ id?: string; status?: string; amount?: { value?: string } }> };
	}>;
	message?: string;
};

function apiBase() {
	return process.env.PAYPAL_API_BASE?.trim() || "https://api-m.sandbox.paypal.com";
}

async function accessToken() {
	const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
	const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
	if (!clientId || !clientSecret) throw new Error("PayPal server credentials are not configured.");
	const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
	const response = await fetch(`${apiBase()}/v1/oauth2/token`, {
		method: "POST",
		headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
		body: "grant_type=client_credentials",
		cache: "no-store",
	});
	if (!response.ok) throw new Error("PayPal authentication failed.");
	return ((await response.json()) as { access_token: string }).access_token;
}

export async function createPayPalOrder(order: OrderRecord) {
	const token = await accessToken();
	const response = await fetch(`${apiBase()}/v2/checkout/orders`, {
		method: "POST",
		headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
		body: JSON.stringify({
			intent: "CAPTURE",
			purchase_units: [
				{
					reference_id: order.orderNumber,
					invoice_id: order.orderNumber,
					custom_id: order.orderNumber,
					amount: {
						currency_code: "USD",
						value: order.total.toFixed(2),
						breakdown: { item_total: { currency_code: "USD", value: order.subtotal.toFixed(2) } },
					},
					items: order.items.map((item) => ({
						name: `${item.name}${item.size ? ` - Size ${item.size}` : ""}`.slice(0, 127),
						quantity: String(item.quantity),
						unit_amount: { currency_code: "USD", value: item.unitPrice.toFixed(2) },
					})),
					shipping: {
						name: { full_name: order.customer.name },
						address: {
							address_line_1: order.customer.shippingAddress.addressLine1,
							address_line_2: order.customer.shippingAddress.addressLine2 || undefined,
							admin_area_2: order.customer.shippingAddress.city,
							admin_area_1: order.customer.shippingAddress.state,
							postal_code: order.customer.shippingAddress.postalCode,
							country_code: order.customer.shippingAddress.country,
						},
					},
				},
			],
		}),
		cache: "no-store",
	});
	const body = (await response.json()) as PayPalResponse;
	if (!response.ok || !body.id) throw new Error(body.message || "PayPal order creation failed.");
	return body;
}

export async function capturePayPalOrder(paypalOrderId: string) {
	const token = await accessToken();
	const response = await fetch(`${apiBase()}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`, {
		method: "POST",
		headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
		cache: "no-store",
	});
	const body = (await response.json()) as PayPalResponse;
	if (!response.ok) throw new Error(body.message || "PayPal capture failed.");
	return body;
}

export async function verifyPayPalWebhook(rawBody: string, headers: Headers) {
	const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim();
	if (!webhookId) throw new Error("PAYPAL_WEBHOOK_ID is not configured.");
	const headerValues = {
		auth_algo: headers.get("paypal-auth-algo"),
		cert_url: headers.get("paypal-cert-url"),
		transmission_id: headers.get("paypal-transmission-id"),
		transmission_sig: headers.get("paypal-transmission-sig"),
		transmission_time: headers.get("paypal-transmission-time"),
	};
	if (Object.values(headerValues).some((value) => !value)) return false;
	const token = await accessToken();
	const response = await fetch(`${apiBase()}/v1/notifications/verify-webhook-signature`, {
		method: "POST",
		headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
		body: JSON.stringify({ ...headerValues, webhook_id: webhookId, webhook_event: JSON.parse(rawBody) }),
		cache: "no-store",
	});
	if (!response.ok) return false;
	return ((await response.json()) as { verification_status?: string }).verification_status === "SUCCESS";
}

export function captureDetails(response: PayPalResponse) {
	const capture = response.purchase_units?.[0]?.payments?.captures?.[0];
	if (response.status !== "COMPLETED" || capture?.status !== "COMPLETED" || !capture.id || !capture.amount?.value) {
		throw new Error("PayPal did not report a completed payment.");
	}
	return { id: capture.id, amount: capture.amount.value };
}
