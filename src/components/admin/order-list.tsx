import Link from "next/link";
import type { OrderSummary } from "@/lib/shop/types";

function label(value: string) {
	return value.replaceAll("_", " ");
}

function dateLabel(value?: string) {
	return value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
}

export function OrderList({ orders }: { orders: OrderSummary[] }) {
	if (!orders.length) return <p className="empty-state">No orders matched those filters.</p>;
	return (
		<div className="admin-order-list">
			{orders.map((order) => (
				<Link className="admin-order-row" href={`/admin/orders/${encodeURIComponent(order.orderNumber)}`} key={order.orderNumber}>
					<div>
						<strong>{order.orderNumber}</strong>
						<span>{order.customer.name} · {order.customer.email}</span>
						<small>{dateLabel(order.createdAt)}</small>
					</div>
					<div>
						<span className={`order-status status-${order.status}`}>Payment: {label(order.status)}</span>
						<span className={`order-status status-${order.fulfillmentStatus}`}>Fulfillment: {label(order.fulfillmentStatus)}</span>
					</div>
					<strong>${order.total.toFixed(2)}</strong>
				</Link>
			))}
		</div>
	);
}
