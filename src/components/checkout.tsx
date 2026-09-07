"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { formatPhone, phoneDigits } from "@/lib/phone";
import { useCart } from "./cart-provider";

type CustomerDetails = {
	name: string;
	email: string;
	phone: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	state: string;
	postalCode: string;
	notes: string;
};

const initialCustomer: CustomerDetails = {
	name: "",
	email: "",
	phone: "",
	addressLine1: "",
	addressLine2: "",
	city: "",
	state: "",
	postalCode: "",
	notes: "",
};

export function Checkout() {
	const { items, total, remove, clear } = useCart();
	const router = useRouter();
	const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
	const formRef = useRef<HTMLFormElement>(null);
	const orderNumberRef = useRef("");
	const [customer, setCustomer] = useState(initialCustomer);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	function updateCustomer(field: keyof CustomerDetails, value: string) {
		setCustomer((current) => ({ ...current, [field]: value }));
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setMessage("Use the PayPal button below to complete payment.");
	}

	if (!items.length) {
		return (
			<div className="empty-state">
				<h2 className="display">Your pack is empty.</h2>
				<p>Find mission gear that helps fund the next adventure.</p>
				<Link className="button" href="/shop">
					Browse the shop
				</Link>
			</div>
		);
	}

	return (
		<div className="checkout-grid">
			<div>
				<div className="cart-items">
					{items.map((item) => (
						<article key={`${item.slug}-${item.size}`}>
							<div>
								<Image src={item.image} alt="" fill sizes="100px" />
							</div>
							<span>
								<strong>{item.name}</strong>
								<small>
									{item.size && `Size ${item.size} · `}Qty {item.quantity}
								</small>
							</span>
							<b>${(item.price * item.quantity).toFixed(2)}</b>
							<button type="button" onClick={() => remove(item.slug, item.size)} aria-label={`Remove ${item.name}`}>
								<Trash2 size={18} />
							</button>
						</article>
					))}
				</div>

				<form className="checkout-details" ref={formRef} onSubmit={handleSubmit}>
					<h2 className="display">Your details.</h2>
					<p className="prose">We need these details to send your order and help our team fulfill it.</p>
					<label>
						Full name
						<input className="field" required value={customer.name} onChange={(event) => updateCustomer("name", event.target.value)} />
					</label>
					<div className="form-row">
						<label>
							Email
							<input className="field" type="email" required value={customer.email} onChange={(event) => updateCustomer("email", event.target.value)} />
						</label>
						<label>
							Phone <span>(optional)</span>
							<input
								className="field"
								type="tel"
								inputMode="tel"
								autoComplete="tel"
								placeholder="(573) 544-7788"
								maxLength={14}
								pattern="\(\d{3}\) \d{3}-\d{4}"
								title="Enter a 10-digit US phone number, like (573) 544-7788."
								value={formatPhone(customer.phone)}
								onChange={(event) => updateCustomer("phone", phoneDigits(event.target.value))}
							/>
						</label>
					</div>
					<label>
						Shipping address
						<input className="field" required value={customer.addressLine1} onChange={(event) => updateCustomer("addressLine1", event.target.value)} />
					</label>
					<label>
						Apartment, suite, or unit <span>(optional)</span>
						<input className="field" value={customer.addressLine2} onChange={(event) => updateCustomer("addressLine2", event.target.value)} />
					</label>
					<div className="form-row">
						<label>
							City
							<input className="field" required value={customer.city} onChange={(event) => updateCustomer("city", event.target.value)} />
						</label>
						<label>
							State
							<input className="field" required value={customer.state} onChange={(event) => updateCustomer("state", event.target.value)} />
						</label>
						<label>
							ZIP code
							<input className="field" required value={customer.postalCode} onChange={(event) => updateCustomer("postalCode", event.target.value)} />
						</label>
					</div>
					<label>
						Order notes <span>(optional)</span>
						<textarea className="field" rows={4} value={customer.notes} onChange={(event) => updateCustomer("notes", event.target.value)} />
					</label>
					<button className="button" type="submit" hidden>
						Continue
					</button>
				</form>
			</div>

			<aside className="order-summary">
				<h2 className="display">Order summary</h2>
				<div>
					<span>Total</span>
					<strong>${total.toFixed(2)}</strong>
				</div>
				{clientId ? (
					<PayPalScriptProvider options={{ clientId, currency: "USD" }}>
						<PayPalButtons
							style={{ layout: "vertical", shape: "rect" }}
							createOrder={async () => {
								if (!formRef.current?.reportValidity()) {
									setMessage("");
									setError("Please complete your details above before paying.");
									throw new Error("Checkout details are incomplete.");
								}
								setError("");
								setMessage("");
								const response = await fetch("/api/paypal/create-order", {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({
										items: items.map(({ slug, quantity, size }) => ({ slug, quantity, size })),
										customer: {
											name: customer.name,
											email: customer.email,
											phone: customer.phone,
											shippingAddress: {
												addressLine1: customer.addressLine1,
												addressLine2: customer.addressLine2,
												city: customer.city,
												state: customer.state,
												postalCode: customer.postalCode,
												country: "US",
											},
											notes: customer.notes,
										},
									}),
								});
								const result = (await response.json()) as { id?: string; orderNumber?: string; error?: string };
								if (!response.ok || !result.id || !result.orderNumber) {
									setError(result.error || "We could not start checkout. Please try again.");
									throw new Error(result.error || "We could not start checkout.");
								}
								orderNumberRef.current = result.orderNumber;
								return result.id;
							}}
							onApprove={async ({ orderID }) => {
								const response = await fetch("/api/paypal/capture-order", {
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ orderID, orderNumber: orderNumberRef.current }),
								});
								const result = (await response.json()) as { orderNumber?: string; notificationSent?: boolean; error?: string };
								if (!response.ok || !result.orderNumber) throw new Error(result.error || "We could not confirm the payment.");
								clear();
								router.push(`/checkout/success?order=${encodeURIComponent(result.orderNumber)}${result.notificationSent ? "" : "&notification=delayed"}`);
							}}
							onError={() => setError((current) => current || "PayPal checkout could not be completed. Please try again or contact our team.")}
							onCancel={() => setMessage("Payment was cancelled. Your cart is still saved.")}
						/>
					</PayPalScriptProvider>
				) : (
					<p className="setup-note">PayPal checkout appears after the client ID is configured.</p>
				)}
				{error && <p className="form-error" role="alert">{error}</p>}
				{message && <p role="status">{message}</p>}
				<p className="secure-note">Payments are securely processed by PayPal.</p>
			</aside>
		</div>
	);
}
