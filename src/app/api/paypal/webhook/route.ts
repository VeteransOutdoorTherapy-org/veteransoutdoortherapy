import { NextResponse } from "next/server";
import { getOrderByPayPalId, markOrderPaymentFailed, markOrderRefunded, recordOrderEvent } from "@/lib/db";
import { finalizePaidOrder } from "@/lib/shop/order-finalization";
import { verifyPayPalWebhook } from "@/lib/shop/paypal";

export const runtime = "nodejs";

type PayPalWebhookEvent = {
	id?: string;
	event_type?: string;
	resource?: {
		id?: string;
		status?: string;
		amount?: { value?: string };
		order_id?: string;
		supplementary_data?: { related_ids?: { order_id?: string } };
	};
};

function relatedOrderId(event: PayPalWebhookEvent) {
	return event.resource?.supplementary_data?.related_ids?.order_id || event.resource?.order_id;
}

export async function POST(request: Request) {
	const rawBody = await request.text();
	let event: PayPalWebhookEvent;
	try {
		event = JSON.parse(rawBody) as PayPalWebhookEvent;
	} catch {
		return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
	}

	try {
		if (!(await verifyPayPalWebhook(rawBody, request.headers))) {
			return NextResponse.json({ error: "Webhook signature verification failed." }, { status: 400 });
		}
	} catch (error) {
		console.error("PayPal webhook verification failed", error);
		return NextResponse.json({ error: "Webhook verification unavailable." }, { status: 503 });
	}

	const eventId = event.id;
	const eventType = event.event_type;
	const paypalOrderId = relatedOrderId(event);
	if (!eventId || !eventType || !paypalOrderId) return NextResponse.json({ received: true });

	try {
		const order = await getOrderByPayPalId(paypalOrderId);
		if (!order) return NextResponse.json({ received: true, ignored: true });

		if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
			const captureId = event.resource?.id;
			const amount = event.resource?.amount?.value;
			if (!captureId || !amount || Number(amount).toFixed(2) !== order.total.toFixed(2)) {
				await recordOrderEvent(order.orderNumber, `webhook:${eventId}`, "payment_amount_mismatch", "paypal-webhook", event);
				return NextResponse.json({ error: "Webhook amount did not match the order." }, { status: 409 });
			}
			await finalizePaidOrder(paypalOrderId, captureId, `webhook:${eventId}`, "paypal-webhook", event);
		} else if (eventType === "PAYMENT.CAPTURE.REFUNDED") {
			await markOrderRefunded(paypalOrderId);
			await recordOrderEvent(order.orderNumber, `webhook:${eventId}`, eventType, "paypal-webhook", event);
		} else if (eventType === "PAYMENT.CAPTURE.DENIED" || eventType === "PAYMENT.CAPTURE.DECLINED") {
			await markOrderPaymentFailed(order.orderNumber);
			await recordOrderEvent(order.orderNumber, `webhook:${eventId}`, eventType, "paypal-webhook", event);
		} else {
			await recordOrderEvent(order.orderNumber, `webhook:${eventId}`, eventType, "paypal-webhook", event);
		}
		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("PayPal webhook processing failed", { eventId, eventType, error });
		return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
	}
}
