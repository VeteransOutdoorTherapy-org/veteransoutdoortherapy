import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getOrderByNumber } from "@/lib/db";
import { pageMetadata } from "@/lib/site";
import { OrderDetail } from "@/components/admin/order-detail";

export const metadata = pageMetadata({ title: "Order detail", description: "View and fulfill a merchandise order.", path: "/admin/orders", noIndex: true });

export default async function AdminOrderPage({
	params,
	searchParams,
}: {
	params: Promise<{ orderNumber: string }>;
	searchParams: Promise<{ saved?: string; error?: string; shipmentError?: string }>;
}) {
	if (!(await isAdmin())) redirect("/admin");
	const { orderNumber } = await params;
	const order = await getOrderByNumber(orderNumber);
	if (!order) notFound();
	const query = await searchParams;
	return (
		<section className="admin-page">
			<div className="container">
				<OrderDetail order={order} saved={query.saved === "1"} error={query.error} shipmentError={query.shipmentError === "1"} />
			</div>
		</section>
	);
}
