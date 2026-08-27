"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getOrderByNumber, markShipmentNotificationSent, updateOrderFulfillment } from "@/lib/db";
import { sendShipmentNotification } from "@/lib/mail";
import type { OrderRecord } from "@/lib/shop/types";

const fulfillmentStatuses: OrderRecord["fulfillmentStatus"][] = ["unfulfilled", "processing", "shipped", "completed", "cancelled"];

export async function updateOrderFulfillmentAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const orderNumber = String(form.get("orderNumber") || "").trim();
	const statusValue = String(form.get("status") || "").trim() as OrderRecord["fulfillmentStatus"];
	const carrier = String(form.get("carrier") || "").trim().slice(0, 80);
	const trackingNumber = String(form.get("trackingNumber") || "").trim().slice(0, 120);
	const notes = String(form.get("notes") || "").trim().slice(0, 3000);
	if (!orderNumber || !fulfillmentStatuses.includes(statusValue)) redirect(`/admin/orders/${encodeURIComponent(orderNumber)}?error=invalid`);

	const previous = await getOrderByNumber(orderNumber);
	if (!previous) redirect("/admin/orders?error=not-found");
	try {
		const updated = await updateOrderFulfillment(orderNumber, { status: statusValue, carrier, trackingNumber, notes });
		if (
			updated &&
			statusValue === "shipped" &&
			trackingNumber &&
			(!previous.shipmentNotificationSent || previous.fulfillmentStatus !== "shipped" || previous.trackingNumber !== trackingNumber)
		) {
			try {
				await sendShipmentNotification({
					orderNumber: updated.orderNumber,
					customerName: updated.customer.name,
					customerEmail: updated.customer.email,
					carrier,
					trackingNumber,
				});
				await markShipmentNotificationSent(orderNumber);
			} catch (error) {
				console.error("Shipment notification failed", { orderNumber, error });
				redirect(`/admin/orders/${encodeURIComponent(orderNumber)}?saved=1&shipmentError=1`);
			}
		}
	} catch (error) {
		console.error("Order fulfillment update failed", { orderNumber, error });
		redirect(`/admin/orders/${encodeURIComponent(orderNumber)}?error=save`);
	}
	revalidatePath("/admin/orders");
	revalidatePath(`/admin/orders/${orderNumber}`);
	revalidatePath(`/invoice/${orderNumber}`);
	redirect(`/admin/orders/${encodeURIComponent(orderNumber)}?saved=1`);
}
