import { NextResponse } from "next/server";
import { z } from "zod";
import { attachPayPalOrder, createPendingOrder, markOrderPaymentFailed } from "@/lib/db";
import { createPayPalOrder } from "@/lib/shop/paypal";

export const runtime = "nodejs";

const checkoutSchema = z.object({
	items: z.array(z.object({ slug: z.string().trim().min(1).max(200), quantity: z.number().int().min(1).max(20), size: z.string().trim().max(30).optional() })),
	customer: z.object({
		name: z.string().trim().min(1).max(120),
		email: z.email().max(254),
		phone: z.string().trim().max(40),
		shippingAddress: z.object({
			addressLine1: z.string().trim().min(1).max(150),
			addressLine2: z.string().trim().max(150),
			city: z.string().trim().min(1).max(80),
			state: z.string().trim().min(1).max(80),
			postalCode: z.string().trim().min(1).max(20),
			country: z.literal("US"),
		}),
		notes: z.string().trim().max(1000),
	}),
});

export async function POST(request: Request) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
	}
	const parsed = checkoutSchema.safeParse(body);
	if (!parsed.success) return NextResponse.json({ error: "Please complete the checkout details." }, { status: 400 });

	let orderNumber = "";
	try {
		const pending = await createPendingOrder(parsed.data.customer, parsed.data.items);
		orderNumber = pending.orderNumber;
		const paypalOrder = await createPayPalOrder({
			...pending,
			paypalOrderId: "",
			status: "pending",
			fulfillmentStatus: "unfulfilled",
			customer: parsed.data.customer,
			internalNotificationSent: false,
			customerNotificationSent: false,
			shipmentNotificationSent: false,
			fulfillmentNotes: "",
		});
		await attachPayPalOrder(orderNumber, paypalOrder.id as string);
		return NextResponse.json({ id: paypalOrder.id, orderNumber });
	} catch (error) {
		if (orderNumber) await markOrderPaymentFailed(orderNumber).catch(() => undefined);
		console.error("PayPal order creation failed", error);
		return NextResponse.json({ error: "We could not start checkout. Please try again." }, { status: 502 });
	}
}
