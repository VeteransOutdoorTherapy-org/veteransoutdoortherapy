import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { getOrderSummaries } from "@/lib/db";
import { pageMetadata } from "@/lib/site";
import { OrderList } from "@/components/admin/order-list";

export const metadata = pageMetadata({ title: "Orders admin", description: "Manage merchandise orders and fulfillment.", path: "/admin/orders", noIndex: true });

const paymentStatuses = ["pending", "paid", "payment_failed", "refunded", "cancelled"];
const fulfillmentStatuses = ["unfulfilled", "processing", "shipped", "completed", "cancelled"];

export default async function OrdersAdminPage({
	searchParams,
}: {
	searchParams: Promise<{ search?: string; payment?: string; fulfillment?: string }>;
}) {
	if (!(await isAdmin())) redirect("/admin");
	const query = await searchParams;
	const search = query.search?.trim() || "";
	const payment = paymentStatuses.includes(query.payment || "") ? query.payment : "";
	const fulfillment = fulfillmentStatuses.includes(query.fulfillment || "") ? query.fulfillment : "";
	const orders = await getOrderSummaries({ search, paymentStatus: payment, fulfillmentStatus: fulfillment });
	return (
		<section className="admin-page">
			<div className="container">
				<header>
					<div>
						<p className="eyebrow">Site operations</p>
						<h1 className="display"><ClipboardList size={30} /> Orders</h1>
					</div>
					<Link className="text-link" href="/admin">Back to content admin</Link>
				</header>
				<form className="order-filters" method="get">
					<label>
						Search orders
						<input className="field" name="search" defaultValue={search} placeholder="Order number, name, email, PayPal ID" />
					</label>
					<label>
						Payment
						<select className="field" name="payment" defaultValue={payment}>
							<option value="">All payment statuses</option>
							{paymentStatuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
						</select>
					</label>
					<label>
						Fulfillment
						<select className="field" name="fulfillment" defaultValue={fulfillment}>
							<option value="">All fulfillment statuses</option>
							{fulfillmentStatuses.map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
						</select>
					</label>
					<button className="button orange" type="submit">Filter</button>
				</form>
				<p className="admin-result-count">Showing {orders.length} order{orders.length === 1 ? "" : "s"} (up to 100).</p>
				<OrderList orders={orders} />
			</div>
		</section>
	);
}
