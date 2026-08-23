"use server";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin, login, logout } from "@/lib/auth";
import { deleteEvent, deleteProduct, getEvents, getProducts, saveEvent, saveProduct, getTestimonials, saveTestimonial, deleteTestimonial } from "@/lib/db";

function revalidateCatalogPages(slug: string) {
	revalidatePath("/");
	revalidatePath("/shop");
	revalidatePath("/products");
	revalidatePath("/product-category/merchandise");
	revalidatePath("/sponsor");
	revalidatePath("/product-category/sponsorships");
	revalidatePath(`/product/${slug}`);
	revalidatePath("/admin");
}

function revalidateEventPages(slug: string) {
	revalidatePath("/");
	revalidatePath("/events");
	revalidatePath(`/events/${slug}`);
	revalidatePath("/events/[slug]", "page");
	revalidatePath("/admin");
}

function slugify(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

function normalizeCategory(value: string) {
	const cleaned = value.trim().replace(/\s+/g, " ");
	if (!cleaned) return "Merchandise";
	if (cleaned.toLowerCase() === "sponsorships") return "Sponsorships";
	if (cleaned.toLowerCase() === "merchandise") return "Merchandise";
	return cleaned;
}

function safeUploadPath(slug: string, fileName: string) {
	const safeSlug = slugify(slug).slice(0, 60) || "product";
	const safeName =
		fileName
			.toLowerCase()
			.replace(/[^a-z0-9._-]+/g, "-")
			.replace(/-+/g, "-")
			.slice(-80) || "image";
	return `products/${safeSlug}/${Date.now()}-${safeName}`;
}

function safeEventUploadPath(slug: string, fileName: string) {
	const safeSlug = slugify(slug).slice(0, 60) || "event";
	const safeName =
		fileName
			.toLowerCase()
			.replace(/[^a-z0-9._-]+/g, "-")
			.replace(/-+/g, "-")
			.slice(-80) || "image";
	return `events/${safeSlug}/${Date.now()}-${safeName}`;
}

export async function loginAction(form: FormData) {
	const valid = await login(String(form.get("username") || ""), String(form.get("password") || ""));
	if (!valid) redirect("/admin?error=1");
	redirect("/admin");
}
export async function logoutAction() {
	await logout();
	redirect("/admin");
}
export async function saveProductAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const name = String(form.get("name") || "").trim();
	const slug = String(
		form.get("slug") ||
			name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)/g, ""),
	);
	const file = form.get("imageFile");
	const existingImage = String(form.get("existingImage") || "").trim();
	let image = String(form.get("image") || "").trim() || existingImage;
	if (file instanceof File && file.size > 0) {
		if (!process.env.BLOB_READ_WRITE_TOKEN) redirect("/admin?saveError=upload-config");
		try {
			image = (await put(safeUploadPath(slug, file.name), file, { access: "public", addRandomSuffix: true })).url;
		} catch (error) {
			console.error("Product image upload failed", {
				slug,
				fileName: file.name,
				error,
			});
			redirect("/admin?saveError=upload-failed");
		}
	}
	try {
		await saveProduct({
			slug,
			name,
			shortName: String(form.get("shortName") || name),
			price: Number(form.get("price")),
			category: normalizeCategory(String(form.get("category") || "")),
			description: String(form.get("description") || ""),
			image,
			gallery: image ? [image] : [],
			sizes: String(form.get("sizes") || "")
				.split(",")
				.map((size) => size.trim())
				.filter(Boolean),
			stock: form.get("stock") ? Number(form.get("stock")) : undefined,
			featured: form.get("featured") === "on",
		});
	} catch (error) {
		console.error("Product save failed", { slug, error });
		redirect("/admin?saveError=save-failed");
	}
	revalidateCatalogPages(slug);
	redirect("/admin?saved=1");
}

function getDuplicateSlug(existingSlugs: Set<string>, sourceSlug: string) {
	const base = `${slugify(sourceSlug).slice(0, 48) || "product"}-copy`;
	if (!existingSlugs.has(base)) return base;
	let index = 2;
	while (existingSlugs.has(`${base}-${index}`)) index += 1;
	return `${base}-${index}`;
}

export async function duplicateProductAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const sourceSlug = String(form.get("slug") || "").trim();
	if (!sourceSlug) redirect("/admin?saveError=save-failed");

	const products = await getProducts();
	const source = products.find((product) => product.slug === sourceSlug);
	if (!source) redirect("/admin?saveError=save-failed");

	const existingSlugs = new Set(products.map((product) => product.slug));
	const duplicateSlug = getDuplicateSlug(existingSlugs, source.slug);

	try {
		await saveProduct({
			...source,
			slug: duplicateSlug,
			name: `${source.name} (Copy)`,
			shortName: `${source.shortName} Copy`,
		});
	} catch {
		redirect("/admin?saveError=save-failed");
	}

	revalidateCatalogPages(duplicateSlug);
	redirect(`/admin?edit=${duplicateSlug}&saved=1`);
}
export async function deleteProductAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const slug = String(form.get("slug") || "");
	await deleteProduct(slug);
	revalidateCatalogPages(slug);
}

export async function saveEventAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const title = String(form.get("title") || "").trim();
	const slug = slugify(String(form.get("slug") || title));
	const previousSlug = String(form.get("previousSlug") || slug).trim();
	const file = form.get("imageFile");
	const existingImage = String(form.get("existingImage") || "").trim();
	let image = String(form.get("image") || "").trim() || existingImage;

	if (file instanceof File && file.size > 0) {
		if (!process.env.BLOB_READ_WRITE_TOKEN) redirect("/admin?view=events&saveError=upload-config");
		try {
			image = (await put(safeEventUploadPath(slug, file.name), file, { access: "public", addRandomSuffix: true })).url;
		} catch (error) {
			console.error("Event image upload failed", { slug, fileName: file.name, error });
			redirect("/admin?view=events&saveError=upload-failed");
		}
	}

	try {
		if (!title || !slug || !image) throw new Error("Missing required event fields.");
		await saveEvent(
			{
				slug,
				title,
				date: String(form.get("date") || "").trim(),
				startDate: String(form.get("startDate") || ""),
				endDate: String(form.get("endDate") || ""),
				image,
				type: String(form.get("type") || "").trim(),
				location: String(form.get("location") || "").trim(),
				summary: String(form.get("summary") || "").trim(),
				heroTitle: String(form.get("heroTitle") || "").trim(),
				overviewTitle: String(form.get("overviewTitle") || "").trim(),
				overview: String(form.get("overview") || "").trim(),
				detailsTitle: String(form.get("detailsTitle") || "").trim(),
				details: String(form.get("details") || "").trim(),
				ctaLabel: String(form.get("ctaLabel") || "").trim(),
				ctaHref: String(form.get("ctaHref") || "").trim(),
				template: form.get("template") === "fundraiser" ? "fundraiser" : "adventure",
				published: form.get("published") === "on",
				featured: form.get("featured") === "on",
				over: form.get("over") === "on",
				recapUrl: String(form.get("recapUrl") || "").trim() || undefined,
				sortOrder: Number(form.get("sortOrder") || 0),
			},
			previousSlug,
		);
	} catch (error) {
		console.error("Event save failed", { slug, error });
		redirect("/admin?view=events&saveError=save-failed");
	}

	revalidateEventPages(previousSlug);
	revalidateEventPages(slug);
	redirect(`/admin?view=events&edit=${slug}&saved=1`);
}

export async function duplicateEventAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const sourceSlug = String(form.get("slug") || "").trim();
	const eventList = await getEvents();
	const source = eventList.find((event) => event.slug === sourceSlug);
	if (!source) redirect("/admin?view=events&saveError=save-failed");

	const duplicateSlug = getDuplicateSlug(new Set(eventList.map((event) => event.slug)), source.slug);
	try {
		await saveEvent({
			...source,
			slug: duplicateSlug,
			title: `${source.title} (Copy)`,
			published: false,
			featured: false,
			over: false,
			recapUrl: undefined,
			sortOrder: eventList.length + 1,
		});
	} catch {
		redirect("/admin?view=events&saveError=save-failed");
	}

	revalidateEventPages(duplicateSlug);
	redirect(`/admin?view=events&edit=${duplicateSlug}&saved=1`);
}

export async function deleteEventAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const slug = String(form.get("slug") || "").trim();
	await deleteEvent(slug);
	revalidateEventPages(slug);
	redirect("/admin?view=events&deleted=1");
}

function revalidateTestimonialPages(slug: string) {
	revalidatePath("/testimonials");
	revalidatePath("/admin");
	revalidatePath(`/admin?view=testimonials&edit=${slug}`);
}

function safeTestimonialUploadPath(slug: string, fileName: string) {
	const safeSlug = slugify(slug).slice(0, 60) || "testimonial";
	const safeName =
		fileName
			.toLowerCase()
			.replace(/[^a-z0-9._-]+/g, "-")
			.replace(/-+/g, "-")
			.slice(-80) || "image";
	return `testimonials/${safeSlug}/${Date.now()}-${safeName}`;
}

export async function saveTestimonialAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const author = String(form.get("author") || "").trim();
	const slug = slugify(String(form.get("slug") || author));
	const previousSlug = String(form.get("previousSlug") || slug).trim();
	const file = form.get("imageFile");
	const existingImage = String(form.get("existingImage") || "").trim();
	let image = String(form.get("image") || "").trim() || existingImage;

	if (file instanceof File && file.size > 0) {
		if (!process.env.BLOB_READ_WRITE_TOKEN) redirect("/admin?view=testimonials&saveError=upload-config");
		try {
			image = (await put(safeTestimonialUploadPath(slug, file.name), file, { access: "public", addRandomSuffix: true })).url;
		} catch (error) {
			console.error("Testimonial image upload failed", { slug, fileName: file.name, error });
			redirect("/admin?view=testimonials&saveError=upload-failed");
		}
	}

	try {
		if (!author || !slug) throw new Error("Missing required testimonial fields.");
		await saveTestimonial(
			{
				slug,
				quote: String(form.get("quote") || "").trim(),
				author,
				service: String(form.get("service") || "").trim(),
				image: image || undefined,
				imageAlt: String(form.get("imageAlt") || "").trim() || undefined,
				imagePosition: (String(form.get("imagePosition") || "") as
				| "top"
				| "bottom"
				| "left"
				| "right"
				| "top-left"
				| "top-right"
				| "bottom-left"
				| "bottom-right"
				| "center"
				| undefined) || undefined,
				category: String(form.get("category") || "").trim() || undefined,
				published: form.get("published") === "on",
				sortOrder: Number(form.get("sortOrder") || 0),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			previousSlug,
		);
	} catch (error) {
		console.error("Testimonial save failed", { slug, error });
		redirect("/admin?view=testimonials&saveError=save-failed");
	}

	revalidateTestimonialPages(previousSlug);
	revalidateTestimonialPages(slug);
	redirect(`/admin?view=testimonials&edit=${slug}&saved=1`);
}

export async function duplicateTestimonialAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const sourceSlug = String(form.get("slug") || "").trim();
	const testimonialList = await getTestimonials();
	const source = testimonialList.find((testimonial) => testimonial.slug === sourceSlug);
	if (!source) redirect("/admin?view=testimonials&saveError=save-failed");

	function getDuplicateSlug(existingSlugs: Set<string>, sourceSlug: string) {
		const base = `${slugify(sourceSlug).slice(0, 48) || "testimonial"}-copy`;
		if (!existingSlugs.has(base)) return base;
		let index = 2;
		while (existingSlugs.has(`${base}-${index}`)) index += 1;
		return `${base}-${index}`;
	}

	const existingSlugs = new Set(testimonialList.map((t) => t.slug));
	const duplicateSlug = getDuplicateSlug(existingSlugs, source.slug);
	try {
		await saveTestimonial({
			...source,
			slug: duplicateSlug,
			author: `${source.author} (Copy)`,
			published: false,
			sortOrder: testimonialList.length + 1,
		});
	} catch {
		redirect("/admin?view=testimonials&saveError=save-failed");
	}

	revalidateTestimonialPages(duplicateSlug);
	redirect(`/admin?view=testimonials&edit=${duplicateSlug}&saved=1`);
}

export async function deleteTestimonialAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const slug = String(form.get("slug") || "").trim();
	await deleteTestimonial(slug);
	revalidateTestimonialPages(slug);
	redirect("/admin?view=testimonials&deleted=1");
}
