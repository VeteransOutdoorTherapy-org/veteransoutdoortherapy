export type ShippingAddress = {
	addressLine1: string;
	addressLine2: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
};

export type CheckoutCustomer = {
	name: string;
	email: string;
	phone: string;
	shippingAddress: ShippingAddress;
	notes: string;
};

export type CheckoutItem = {
	slug: string;
	quantity: number;
	size?: string;
};

export type PricedOrderItem = CheckoutItem & {
	name: string;
	unitPrice: number;
	lineTotal: number;
};

export type OrderRecord = {
	orderNumber: string;
	paypalOrderId: string;
	paypalCaptureId?: string;
	status: "pending" | "paid" | "payment_failed" | "refunded" | "cancelled";
	fulfillmentStatus: "unfulfilled" | "processing" | "shipped" | "completed" | "cancelled";
	customer: CheckoutCustomer;
	items: PricedOrderItem[];
	subtotal: number;
	total: number;
	internalNotificationSent: boolean;
	customerNotificationSent: boolean;
	shipmentNotificationSent: boolean;
	trackingCarrier?: string;
	trackingNumber?: string;
	fulfillmentNotes: string;
	createdAt?: string;
};

export type OrderSummary = Pick<
	OrderRecord,
		| "orderNumber"
		| "status"
		| "fulfillmentStatus"
		| "customerNotificationSent"
		| "shipmentNotificationSent"
		| "trackingCarrier"
		| "trackingNumber"
		| "fulfillmentNotes"
		| "createdAt"
	> & {
	customer: Pick<CheckoutCustomer, "name" | "email">;
	items: [];
		subtotal: number;
		total: number;
};
