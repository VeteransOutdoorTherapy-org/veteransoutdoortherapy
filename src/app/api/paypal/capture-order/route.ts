import { NextResponse } from "next/server";
import { getOrderByPayPalId } from "@/lib/db";
import { captureDetails, capturePayPalOrder } from "@/lib/shop/paypal";
import { finalizePaidOrder } from "@/lib/shop/order-finalization";

export const runtime = "nodejs";

export async function POST(request: Request) {
	try {
		const { orderID, orderNumber } = (await request.json()) as { orderID?: string; orderNumber?: string };
		if (!orderID || !/^[A-Z0-9]+$/i.test(orderID)) return NextResponse.json({ error: "Invalid order." }, { status: 400 });
		const existing = await getOrderByPayPalId(orderID);
		if (!existing || (orderNumber && existing.orderNumber !== orderNumber)) {
			return NextResponse.json({ error: "Order was not found." }, { status: 404 });
		}
		const captured = captureDetails(await capturePayPalOrder(orderID));
		if (Number(captured.amount).toFixed(2) !== existing.total.toFixed(2)) {
			return NextResponse.json({ error: "The captured amount did not match the order." }, { status: 409 });
		}
		const result = await finalizePaidOrder(orderID, captured.id, `capture:${captured.id}`, "paypal-capture", {
			orderID,
			captureID: captured.id,
			amount: captured.amount,
		});
		return NextResponse.json({
			ok: true,
			orderNumber: result.order.orderNumber,
			notificationSent: result.internalNotificationSent && result.customerNotificationSent,
		});
	} catch (error) {
		console.error("PayPal capture failed", error);
		return NextResponse.json({ error: "We could not confirm the payment." }, { status: 502 });
	}
}
