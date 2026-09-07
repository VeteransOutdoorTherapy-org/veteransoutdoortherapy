import { displayPhone } from "@/lib/phone";
import type { OrderRecord } from "@/lib/shop/types";

export function InvoiceView({ order }: { order: OrderRecord }) {
	return (
		<article className="invoice-card">
			<div className="invoice-heading">
				<div>
					<p className="eyebrow">Veteran&apos;s Outdoor Therapy</p>
					<h1 className="display">Order {order.orderNumber}</h1>
				</div>
				<strong>{order.status.replaceAll("_", " ").toUpperCase()}</strong>
			</div>
			<div className="invoice-details">
				<div>
					<strong>Customer</strong>
					<span>{order.customer.name}</span>
					<span>{order.customer.email}</span>
					{order.customer.phone && <span>{displayPhone(order.customer.phone)}</span>}
				</div>
				<div>
					<strong>Ship to</strong>
					<span>{order.customer.shippingAddress.addressLine1}</span>
					{order.customer.shippingAddress.addressLine2 && <span>{order.customer.shippingAddress.addressLine2}</span>}
					<span>
						{order.customer.shippingAddress.city}, {order.customer.shippingAddress.state} {order.customer.shippingAddress.postalCode}
					</span>
					<span>{order.customer.shippingAddress.country}</span>
				</div>
			</div>
			<table>
				<thead>
					<tr>
						<th>Item</th>
						<th>Qty</th>
						<th>Unit price</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{order.items.map((item) => (
						<tr key={`${item.slug}-${item.size}`}>
							<td>{item.name}{item.size && ` · Size ${item.size}`}</td>
							<td>{item.quantity}</td>
							<td>${item.unitPrice.toFixed(2)}</td>
							<td>${item.lineTotal.toFixed(2)}</td>
						</tr>
					))}
				</tbody>
				<tfoot>
					<tr>
						<th colSpan={3}>Total paid</th>
						<th>${order.total.toFixed(2)}</th>
					</tr>
				</tfoot>
			</table>
			{order.customer.notes && <p><strong>Order notes:</strong> {order.customer.notes}</p>}
			<p className="prose">PayPal order ID: {order.paypalOrderId}</p>
		</article>
	);
}
