import Link from "next/link";
import { InvoiceView } from "@/components/shop/invoice-view";
import type { OrderRecord } from "@/lib/shop/types";
import { updateOrderFulfillmentAction } from "@/app/admin/orders/order-actions";

const fulfillmentStatuses: OrderRecord["fulfillmentStatus"][] = ["unfulfilled", "processing", "shipped", "completed", "cancelled"];

export function OrderDetail({ order, saved, error, shipmentError }: { order: OrderRecord; saved?: boolean; error?: string; shipmentError?: boolean }) {
	return (
		<div className="admin-order-detail">
			<div className="button-row">
				<Link className="text-link" href="/admin/orders">← Back to orders</Link>
				<Link className="text-link" href={`/invoice/${encodeURIComponent(order.orderNumber)}`}>Open invoice</Link>
			</div>
			{saved && <p className="success-note">Order updated.</p>}
			{error && <p className="form-error">This order could not be updated. Please check the fields and try again.</p>}
			{shipmentError && <p className="form-error">The order was saved, but the shipment email could not be sent. Save again to retry.</p>}
			<InvoiceView order={order} />
			<form className="product-form" action={updateOrderFulfillmentAction}>
				<h2 className="display">Fulfillment</h2>
				<input type="hidden" name="orderNumber" value={order.orderNumber} />
				<label>
					Fulfillment status
					<select className="field" name="status" defaultValue={order.fulfillmentStatus}>
						{fulfillmentStatuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
					</select>
				</label>
				<div className="form-row">
					<label>
						Carrier
						<input className="field" name="carrier" defaultValue={order.trackingCarrier} placeholder="USPS, UPS, FedEx" />
					</label>
					<label>
						Tracking number
						<input className="field" name="trackingNumber" defaultValue={order.trackingNumber} />
					</label>
				</div>
				<label>
					Internal fulfillment notes
					<textarea className="field" name="notes" rows={5} defaultValue={order.fulfillmentNotes} placeholder="Packing, pickup, refund, or other internal notes" />
				</label>
				<button className="button orange" type="submit">Save fulfillment update</button>
			</form>
		</div>
	);
}
