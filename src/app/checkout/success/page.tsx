import Link from "next/link";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
	title: "Order confirmed",
	description: "Your Veteran's Outdoor Therapy merchandise order has been confirmed.",
	path: "/checkout/success",
	noIndex: true,
});

export default async function CheckoutSuccessPage({
	searchParams,
}: {
	searchParams: Promise<{ order?: string; notification?: string }>;
}) {
	const params = await searchParams;
	const orderNumber = params.order?.trim();
	const notificationDelayed = params.notification === "delayed";
	return (
		<section className="section">
			<div className="container narrow-content">
				<p className="eyebrow">Payment received</p>
				<h1 className="display section-title">Thank you for supporting the mission.</h1>
				<p className="prose">
					Your payment was completed through PayPal. We saved your order details and our team will review the order for fulfillment.
				</p>
				{orderNumber && (
					<p className="order-confirmation-number">
						Order number: <strong>{orderNumber}</strong>
					</p>
				)}
				{notificationDelayed && (
					<p className="setup-note">
						Your payment was recorded, but our internal notification is delayed. We will still be able to retrieve the order from our records.
					</p>
				)}
				<div className="button-row">
					<Link className="button orange" href="/shop">
						Continue shopping
					</Link>
					<Link className="text-link" href="/contact">
						Contact our team
					</Link>
				</div>
			</div>
		</section>
	);
}
