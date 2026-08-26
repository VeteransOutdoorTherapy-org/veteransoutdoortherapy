import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getOrderByNumber } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
	if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	const { orderNumber } = await params;
	const order = await getOrderByNumber(orderNumber);
	return order ? NextResponse.json(order) : NextResponse.json({ error: "Order not found" }, { status: 404 });
}
