import {
	applyStockForOrder,
	getOrderByPayPalId,
	markCustomerNotificationSent,
	markOrderNotificationSent,
	markOrderPaid,
	recordOrderEvent,
} from "@/lib/db";
import { sendCustomerOrderConfirmation, sendOrderNotification } from "@/lib/mail";

export async function finalizePaidOrder(
	paypalOrderId: string,
	paypalCaptureId: string,
	eventKey: string,
	source: string,
	payload: unknown,
) {
	const existing = await getOrderByPayPalId(paypalOrderId);
	if (!existing) throw new Error("Order was not found.");
	const result = await markOrderPaid(paypalOrderId, paypalCaptureId);
	if (!result.order) throw new Error("Paid order could not be loaded.");
	await recordOrderEvent(result.order.orderNumber, eventKey, "payment_completed", source, payload);
	// Only the capture that actually flips the order to paid moves stock, so retries cannot double-deduct.
	if (result.newlyPaid) await applyStockForOrder(result.order.orderNumber);

	let internalNotificationSent = result.order.internalNotificationSent;
	if (!internalNotificationSent) {
		try {
			await sendOrderNotification({
				orderNumber: result.order.orderNumber,
				paypalOrderId: result.order.paypalOrderId,
				paypalCaptureId: result.order.paypalCaptureId,
				customerName: result.order.customer.name,
				customerEmail: result.order.customer.email,
				phone: result.order.customer.phone,
				shippingAddress: result.order.customer.shippingAddress,
				items: result.order.items,
				subtotal: result.order.subtotal,
				total: result.order.total,
				notes: result.order.customer.notes,
			});
			await markOrderNotificationSent(result.order.orderNumber);
			internalNotificationSent = true;
		} catch (error) {
			console.error("Internal order notification failed", { orderNumber: result.order.orderNumber, error });
		}
	}

	let customerNotificationSent = result.order.customerNotificationSent;
	if (!customerNotificationSent) {
		try {
			await sendCustomerOrderConfirmation({
				orderNumber: result.order.orderNumber,
				paypalOrderId: result.order.paypalOrderId,
				paypalCaptureId: result.order.paypalCaptureId,
				customerName: result.order.customer.name,
				customerEmail: result.order.customer.email,
				phone: result.order.customer.phone,
				shippingAddress: result.order.customer.shippingAddress,
				items: result.order.items,
				subtotal: result.order.subtotal,
				total: result.order.total,
				notes: result.order.customer.notes,
			});
			await markCustomerNotificationSent(result.order.orderNumber);
			customerNotificationSent = true;
		} catch (error) {
			console.error("Customer order confirmation failed", { orderNumber: result.order.orderNumber, error });
		}
	}

	return { order: result.order, newlyPaid: result.newlyPaid, internalNotificationSent, customerNotificationSent };
}
