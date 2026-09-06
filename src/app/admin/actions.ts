"use server";
import { del, put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdmin, login, logout } from "@/lib/auth";
import { deleteEvent, deleteProduct, getEvents, getProducts, saveEvent, saveProduct, getTestimonials, saveTestimonial, deleteTestimonial, deleteGalleryImage, getGalleryImages, saveGalleryImage, getFieldStories, saveFieldStory, deleteFieldStory } from "@/lib/db";

async function addToGalleryIfMissing(src: string, tag: string, alt: string) {
	if (!src || !src.startsWith("http")) return;
	const existing = await getGalleryImages();
	if (existing.some((image) => image.src === src)) return;
	await saveGalleryImage({
		id: `auto-${randomUUID()}`,
		src,
		alt,
		tags: [tag].filter(Boolean),
		year: new Date().getFullYear().toString(),
		published: true,
		sortOrder: existing.length + 1,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	});
	revalidatePath("/gallery");
}

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

function revalidateFieldStoryPages(slug: string) {
	revalidatePath("/");
	revalidatePath("/field-stories");
	revalidatePath(`/field-stories/${slug}`);
	revalidatePath("/field-stories/[slug]", "page");
	revalidatePath("/admin");
}

function safeFieldStoryUploadPath(slug: string, fileName: string) {
	const safeSlug = slugify(slug).slice(0, 60) || "field-story";
	const safeName =
		fileName
			.toLowerCase()
			.replace(/[^a-z0-9._-]+/g, "-")
			.replace(/-+/g, "-")
			.slice(-80) || "image";
	return `field-stories/${safeSlug}/${Date.now()}-${safeName}`;
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

	const eventType = String(form.get("type") || "").trim();
	await addToGalleryIfMissing(image, eventType.toLowerCase() || "event", `${title} event photo`);

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

function safeGalleryUploadPath(fileName: string) {
	const safeName = fileName.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").slice(-100) || "image.jpg";
	return `gallery/${Date.now()}-${randomUUID().slice(0, 8)}-${safeName}`;
}

export async function saveGalleryMetadataAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const id = String(form.get("id") || "").trim();
	const existing = (await getGalleryImages()).find((image) => image.id === id);
	if (!existing) redirect("/admin?view=gallery&saveError=not-found");
	await saveGalleryImage({
		...existing,
		alt: String(form.get("alt") || "").trim() || existing.alt,
		caption: String(form.get("caption") || "").trim() || undefined,
		tags: String(form.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean),
		year: String(form.get("year") || "").trim() || undefined,
		published: form.get("published") === "on",
		sortOrder: Number(form.get("sortOrder") || existing.sortOrder),
	});
	revalidatePath("/gallery");
	redirect("/admin?view=gallery&saved=1");
}

export async function uploadGalleryImagesAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	if (!process.env.BLOB_READ_WRITE_TOKEN) redirect("/admin?view=gallery&saveError=upload-config");
	const files = form.getAll("imageFiles").filter((value): value is File => value instanceof File && value.size > 0);
	if (!files.length || files.length > 50) redirect("/admin?view=gallery&saveError=file-limit");
	const existing = await getGalleryImages();
	try {
		for (const [index, file] of files.entries()) {
			const blob = await put(safeGalleryUploadPath(file.name), file, { access: "public", addRandomSuffix: true });
			await saveGalleryImage({
				id: `blob-${randomUUID()}`,
				src: blob.url,
				alt: "Veteran outdoor therapy experience in nature",
				tags: ["outdoors", "veteran support"],
				year: new Date().getFullYear().toString(),
				published: true,
				sortOrder: existing.length + index + 1,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			});
		}
	} catch (error) {
		console.error("Gallery upload failed", error);
		redirect("/admin?view=gallery&saveError=upload-failed");
	}
	revalidatePath("/gallery");
	redirect("/admin?view=gallery&saved=1");
}

export async function deleteGalleryImageAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const id = String(form.get("id") || "").trim();
	const image = (await getGalleryImages()).find((entry) => entry.id === id);
	if (!image) redirect("/admin?view=gallery&saveError=not-found");
	if (image.src.startsWith("http") && process.env.BLOB_READ_WRITE_TOKEN) {
		try { await del(image.src); } catch (error) { console.error("Gallery blob deletion failed", error); }
	}
	await deleteGalleryImage(id);
	revalidatePath("/gallery");
	redirect("/admin?view=gallery&deleted=1");
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

	const testimonialCategory = String(form.get("category") || "").trim();
	await addToGalleryIfMissing(image, testimonialCategory.toLowerCase() || "testimonial", `${author} testimonial photo`);

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

function parseLines(value: string) {
	return value
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
}

function parseFacebookLinks(value: string) {
	return parseLines(value)
		.map((line) => {
			const [label, href] = line.split("|").map((part) => part.trim());
			return href ? { label: label || href, href } : null;
		})
		.filter((link): link is { label: string; href: string } => link !== null);
}

export async function saveFieldStoryAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const title = String(form.get("title") || "").trim();
	const slug = slugify(String(form.get("slug") || title));
	const previousSlug = String(form.get("previousSlug") || slug).trim();
	const file = form.get("imageFile");
	const existingImage = String(form.get("existingImage") || "").trim();
	let image = String(form.get("image") || "").trim() || existingImage;

	if (file instanceof File && file.size > 0) {
		if (!process.env.BLOB_READ_WRITE_TOKEN) redirect("/admin?view=field-stories&saveError=upload-config");
		try {
			image = (await put(safeFieldStoryUploadPath(slug, file.name), file, { access: "public", addRandomSuffix: true })).url;
		} catch (error) {
			console.error("Field story image upload failed", { slug, fileName: file.name, error });
			redirect("/admin?view=field-stories&saveError=upload-failed");
		}
	}

	const videoUrl = String(form.get("videoUrl") || "").trim();
	const videoTitle = String(form.get("videoTitle") || "").trim();
	const imageAlt = String(form.get("imageAlt") || "").trim();
	// Every field note gets a gallery tag so its photos always surface in the Gallery, even if left blank.
	const galleryTag = String(form.get("galleryTag") || "").trim() || slug;

	try {
		if (!title || !slug || !image) throw new Error("Missing required field story fields.");
		await saveFieldStory(
			{
				slug,
				title,
				date: String(form.get("date") || "").trim(),
				datePublished: String(form.get("datePublished") || "").trim(),
				location: String(form.get("location") || "").trim(),
				summary: String(form.get("summary") || "").trim(),
				image,
				imageAlt,
				body: parseLines(String(form.get("body") || "")),
				video: videoUrl ? { url: videoUrl, title: videoTitle || title } : undefined,
				facebookLinks: parseFacebookLinks(String(form.get("facebookLinks") || "")),
				reviewCategory: String(form.get("reviewCategory") || "").trim() || undefined,
				galleryTag,
				programHref: String(form.get("programHref") || "/programs").trim(),
				programLabel: String(form.get("programLabel") || "Explore outdoor programs").trim(),
				published: form.get("published") === "on",
			},
			previousSlug,
		);
	} catch (error) {
		console.error("Field story save failed", { slug, error });
		redirect("/admin?view=field-stories&saveError=save-failed");
	}

	await addToGalleryIfMissing(image, galleryTag, imageAlt);

	const photoFiles = form.getAll("photoFiles").filter((value): value is File => value instanceof File && value.size > 0);
	if (photoFiles.length && process.env.BLOB_READ_WRITE_TOKEN) {
		const existingGallery = await getGalleryImages();
		let sortOrder = existingGallery.length;
		for (const photoFile of photoFiles) {
			try {
				const blob = await put(safeGalleryUploadPath(photoFile.name), photoFile, { access: "public", addRandomSuffix: true });
				sortOrder += 1;
				await saveGalleryImage({
					id: `auto-${randomUUID()}`,
					src: blob.url,
					alt: imageAlt || title,
					tags: [galleryTag],
					year: new Date().getFullYear().toString(),
					published: true,
					sortOrder,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				});
			} catch (error) {
				console.error("Field story photo upload failed", { slug, fileName: photoFile.name, error });
			}
		}
		revalidatePath("/gallery");
	}

	revalidateFieldStoryPages(previousSlug);
	revalidateFieldStoryPages(slug);
	redirect(`/admin?view=field-stories&edit=${slug}&saved=1`);
}

export async function duplicateFieldStoryAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const sourceSlug = String(form.get("slug") || "").trim();
	const storyList = await getFieldStories();
	const source = storyList.find((story) => story.slug === sourceSlug);
	if (!source) redirect("/admin?view=field-stories&saveError=save-failed");

	function getDuplicateSlug(existingSlugs: Set<string>, sourceSlug: string) {
		const base = `${slugify(sourceSlug).slice(0, 48) || "field-story"}-copy`;
		if (!existingSlugs.has(base)) return base;
		let index = 2;
		while (existingSlugs.has(`${base}-${index}`)) index += 1;
		return `${base}-${index}`;
	}

	const existingSlugs = new Set(storyList.map((s) => s.slug));
	const duplicateSlug = getDuplicateSlug(existingSlugs, source.slug);
	try {
		await saveFieldStory({
			...source,
			slug: duplicateSlug,
			title: `${source.title} (Copy)`,
			published: false,
		});
	} catch {
		redirect("/admin?view=field-stories&saveError=save-failed");
	}

	revalidateFieldStoryPages(duplicateSlug);
	redirect(`/admin?view=field-stories&edit=${duplicateSlug}&saved=1`);
}

export async function deleteFieldStoryAction(form: FormData) {
	if (!(await isAdmin())) redirect("/admin");
	const slug = String(form.get("slug") || "").trim();
	await deleteFieldStory(slug);
	revalidateFieldStoryPages(slug);
	redirect("/admin?view=field-stories&deleted=1");
}
