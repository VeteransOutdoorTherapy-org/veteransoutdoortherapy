import "server-only";
import nodemailer from "nodemailer";
import { displayPhone } from "./phone";

export type ContactNotification = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	message: string;
};

export type OrderNotification = {
	orderNumber: string;
	paypalOrderId: string;
	paypalCaptureId?: string;
	customerName: string;
	customerEmail: string;
	phone: string;
	shippingAddress: {
		addressLine1: string;
		addressLine2: string;
		city: string;
		state: string;
		postalCode: string;
		country: string;
	};
	items: Array<{
		name: string;
		size?: string;
		quantity: number;
		unitPrice: number;
		lineTotal: number;
	}>;
	subtotal: number;
	total: number;
	notes: string;
};

export type ShipmentNotification = {
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	carrier: string;
	trackingNumber: string;
};

function requiredEnvironment(name: string) {
	const value = process.env[name]?.trim();
	if (!value) throw new Error(`${name} is required to send contact notifications.`);
	return value;
}

function createTransporter() {
	const port = Number(process.env.SMTP_PORT || 465);
	const user = requiredEnvironment("SMTP_USER");
	return {
		user,
		transporter: nodemailer.createTransport({
			host: process.env.SMTP_HOST?.trim() || "mail.privateemail.com",
			port,
			secure: port === 465,
			auth: { user, pass: requiredEnvironment("SMTP_PASSWORD") },
			connectionTimeout: 10_000,
			greetingTimeout: 10_000,
			socketTimeout: 15_000,
			tls: { minVersion: "TLSv1.2" },
		}),
	};
}

export async function sendContactNotification(contact: ContactNotification) {
	const { user, transporter } = createTransporter();

	const name = `${contact.firstName} ${contact.lastName}`.trim();
	await transporter.sendMail({
		from: `Veterans Outdoor Therapy Website <${user}>`,
		to: requiredEnvironment("CONTACT_EMAIL_TO"),
		replyTo: contact.email,
		subject: `New website contact from ${name}`,
		text: [
			"A new contact form was submitted at veteransoutdoortherapy.org.",
			"",
			`Name: ${name}`,
			`Email: ${contact.email}`,
			`Phone: ${contact.phone || "Not provided"}`,
			"",
			"Message:",
			contact.message,
			"",
			"Reply to this email to respond directly to the sender.",
		].join("\n"),
	});
}

export async function sendOrderNotification(order: OrderNotification) {
	const { user, transporter } = createTransporter();
	const itemLines = order.items.map(
		(item) =>
			`- ${item.name}${item.size ? ` (Size ${item.size})` : ""} × ${item.quantity} at $${item.unitPrice.toFixed(2)} = $${item.lineTotal.toFixed(2)}`,
	);
	await transporter.sendMail({
		from: `Veterans Outdoor Therapy Website <${user}>`,
		to: requiredEnvironment("CONTACT_EMAIL_TO"),
		replyTo: order.customerEmail,
		subject: `Paid merchandise order ${order.orderNumber}`,
		text: [
			"A merchandise order was paid through veteransoutdoortherapy.org.",
			"",
			`Order number: ${order.orderNumber}`,
			`PayPal order ID: ${order.paypalOrderId}`,
			`PayPal capture ID: ${order.paypalCaptureId || "Not provided"}`,
			"",
			`Customer: ${order.customerName}`,
			`Email: ${order.customerEmail}`,
			`Phone: ${order.phone ? displayPhone(order.phone) : "Not provided"}`,
			"",
			"Shipping address:",
			order.shippingAddress.addressLine1,
			...(order.shippingAddress.addressLine2 ? [order.shippingAddress.addressLine2] : []),
			`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`,
			order.shippingAddress.country,
			"",
			"Items:",
			...itemLines,
			"",
			`Subtotal: $${order.subtotal.toFixed(2)}`,
			`Total paid: $${order.total.toFixed(2)}`,
			"",
			`Customer notes: ${order.notes || "None"}`,
		].join("\n"),
	});
}

export async function sendCustomerOrderConfirmation(order: OrderNotification) {
	const { user, transporter } = createTransporter();
	const itemLines = order.items.map(
		(item) =>
			`- ${item.name}${item.size ? ` (Size ${item.size})` : ""} × ${item.quantity} at $${item.unitPrice.toFixed(2)} = $${item.lineTotal.toFixed(2)}`,
	);
	await transporter.sendMail({
		from: `Veterans Outdoor Therapy <${user}>`,
		to: order.customerEmail,
		replyTo: requiredEnvironment("CONTACT_EMAIL_TO"),
		subject: `Your Veteran's Outdoor Therapy order ${order.orderNumber}`,
		text: [
			`Thank you for your order, ${order.customerName}.`,
			"",
			`Order number: ${order.orderNumber}`,
			"Payment status: Paid through PayPal",
			"",
			"Items:",
			...itemLines,
			"",
			`Total paid: $${order.total.toFixed(2)}`,
			"",
			"Shipping to:",
			order.shippingAddress.addressLine1,
			...(order.shippingAddress.addressLine2 ? [order.shippingAddress.addressLine2] : []),
			`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}`,
			order.shippingAddress.country,
			"",
			"Our team will review the order and follow up if anything is needed.",
		].join("\n"),
	});
}

export async function sendShipmentNotification(shipment: ShipmentNotification) {
	const { user, transporter } = createTransporter();
	await transporter.sendMail({
		from: `Veteran's Outdoor Therapy <${user}>`,
		to: shipment.customerEmail,
		replyTo: requiredEnvironment("CONTACT_EMAIL_TO"),
		subject: `Your order ${shipment.orderNumber} has shipped`,
		text: [
			`Hi ${shipment.customerName},`,
			"",
			`Your Veteran's Outdoor Therapy order ${shipment.orderNumber} has shipped.`,
			"",
			`Carrier: ${shipment.carrier || "Not provided"}`,
			`Tracking number: ${shipment.trackingNumber}`,
			"",
			"Thank you for supporting the mission.",
		].join("\n"),
	});
}
