import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getEvents, saveTestimonialSubmission } from "@/lib/db";
import { sendTestimonialNotification } from "@/lib/mail";
import { isValidPhone, phoneDigits } from "@/lib/phone";
import { categoryForEvent, GENERAL_EVENT, SERVICE_BRANCHES } from "@/lib/testimonial-submission";

export const runtime = "nodejs";

const storySchema = z.object({
	firstName: z.string().trim().min(1).max(100),
	lastName: z.string().trim().min(1).max(100),
	email: z.email().max(254),
	phone: z.string().trim().max(40).refine(isValidPhone).default(""),
	branch: z.enum(SERVICE_BRANCHES),
	honors: z.string().trim().max(120).default(""),
	event: z.string().trim().min(1).max(200),
	rating: z.coerce.number().int().min(1).max(5).optional(),
	story: z.string().trim().min(20).max(3000),
	consent: z.literal("on"),
});

function slugify(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
	}
	// Honeypot: people never see this field, so anything in it came from a script.
	if (String(form.get("website") || "").trim()) return NextResponse.json({ ok: true });

	const fields = Object.fromEntries([...form.entries()].filter(([, value]) => typeof value === "string" && value !== ""));
	const result = storySchema.safeParse(fields);
	if (!result.success) return NextResponse.json({ error: "Please check the highlighted fields." }, { status: 400 });
	const input = result.data;

	const event =
		input.event === GENERAL_EVENT ? undefined : (await getEvents()).find((candidate) => candidate.slug === input.event);
	const eventLabel = event ? `${event.title} (${event.startDate.slice(0, 4)})` : "General / not a specific event";
	const author = `${input.firstName} ${input.lastName}`;
	const service = input.honors ? `${input.branch}, ${input.honors}` : input.branch;
	const phone = phoneDigits(input.phone) || undefined;
	const slug = `${slugify(author) || "story"}-${randomUUID().slice(0, 6)}`;

	try {
		await saveTestimonialSubmission({
			slug,
			quote: input.story,
			author,
			service,
			category: categoryForEvent(event?.title),
			rating: input.rating,
			event: event ? eventLabel : undefined,
			email: input.email,
			phone,
		});
	} catch (error) {
		console.error("Testimonial submission could not be saved", error);
		return NextResponse.json({ error: "Submission storage is not configured" }, { status: 503 });
	}
	revalidatePath("/admin");

	try {
		await sendTestimonialNotification({
			slug,
			name: author,
			email: input.email,
			phone,
			service,
			event: eventLabel,
			rating: input.rating,
			story: input.story,
		});
	} catch (error) {
		// The story is saved and waiting in the admin either way.
		console.error("Testimonial notification delivery failed", error);
		return NextResponse.json({ ok: true, notificationSent: false }, { status: 202 });
	}
	return NextResponse.json({ ok: true });
}
