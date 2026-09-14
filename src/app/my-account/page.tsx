import { Envelope, Question, ShoppingBag } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata({ title: "Order Help", description: "Get help with a Veteran's Outdoor Therapy merchandise order.", path: "/my-account", noIndex: true });
export default function AccountPage() {
	return (
		<section className="section">
			<div className="container account-page">
				<p className="eyebrow">Customer care</p>
				<h1 className="display section-title">
					Order help,
					<br />
					without the runaround.
				</h1>
				<p className="prose">
					You do not need an account to purchase mission gear. PayPal provides your payment receipt, and our team can
					help with order questions.
				</p>
				<div className="account-actions">
					<Link href="/shop">
						<ShoppingBag size={30} />
						<strong>Continue shopping</strong>
						<span>Browse apparel and field gear.</span>
					</Link>
					<a href="mailto:contact@veteransoutdoortherapy.org">
						<Envelope size={30} />
						<strong>Email our team</strong>
						<span>Ask about an existing order.</span>
					</a>
					<Link href="/contact">
						<Question size={30} />
						<strong>Contact support</strong>
						<span>Send an order or general question.</span>
					</Link>
				</div>
			</div>
		</section>
	);
}
