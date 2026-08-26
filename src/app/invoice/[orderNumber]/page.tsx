import { notFound, redirect } from "next/navigation";
import { InvoiceView } from "@/components/shop/invoice-view";
import { isAdmin } from "@/lib/auth";
import { getOrderByNumber } from "@/lib/db";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({ title: "Order invoice", description: "Order invoice and purchase details.", path: "/invoice", noIndex: true });

export default async function InvoicePage({ params }: { params: Promise<{ orderNumber: string }> }) {
	if (!(await isAdmin())) redirect("/admin");
	const { orderNumber } = await params;
	const order = await getOrderByNumber(orderNumber);
	if (!order) notFound();
	return (
		<section className="section">
			<div className="container narrow-content">
				<InvoiceView order={order} />
			</div>
		</section>
	);
}
