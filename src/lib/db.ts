import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";
import { events as seedEvents, fieldStories as seedFieldStories, products as seedProducts, galleryImages as seedGalleryImages, type Event, type EventTemplate, type FieldStory, type GalleryImage, IMAGE_POSITIONS, type ImagePosition, type Product, testimonials as seedTestimonials, type Testimonial } from "./data";
import { SITE_NAME } from "./site";
import type { CheckoutCustomer, CheckoutItem, OrderRecord, OrderSummary, PricedOrderItem } from "./shop/types";

export type { Testimonial };

function sql() {
	return process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
}

const productFallbackImage = "/vot-logo-original.png";

async function ensureOrders() {
	const db = sql();
	if (!db) return null;
	await db`CREATE TABLE IF NOT EXISTS orders (id bigserial PRIMARY KEY, order_number text NOT NULL UNIQUE, paypal_order_id text UNIQUE, paypal_capture_id text, status text NOT NULL, fulfillment_status text NOT NULL DEFAULT 'unfulfilled', customer_name text NOT NULL, customer_email text NOT NULL, phone text NOT NULL DEFAULT '', shipping_address jsonb NOT NULL, order_notes text NOT NULL DEFAULT '', subtotal numeric NOT NULL, shipping_amount numeric NOT NULL DEFAULT 0, tax_amount numeric NOT NULL DEFAULT 0, total numeric NOT NULL, currency text NOT NULL DEFAULT 'USD', notification_sent_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), paid_at timestamptz, fulfilled_at timestamptz, cancelled_at timestamptz, refunded_at timestamptz, tracking_carrier text, tracking_number text, fulfillment_notes text NOT NULL DEFAULT '', shipment_notification_sent_at timestamptz, updated_at timestamptz NOT NULL DEFAULT now())`;
	await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS internal_notification_sent_at timestamptz`;
	await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_notification_sent_at timestamptz`;
	await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfilled_at timestamptz`;
	await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancelled_at timestamptz`;
	await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS refunded_at timestamptz`;
	await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfillment_status text NOT NULL DEFAULT 'unfulfilled'`;
	await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_carrier text`;
	await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number text`;
	await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS fulfillment_notes text NOT NULL DEFAULT ''`;
	await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipment_notification_sent_at timestamptz`;
	await db`ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now()`;
	await db`CREATE TABLE IF NOT EXISTS order_items (id bigserial PRIMARY KEY, order_id bigint NOT NULL REFERENCES orders(id) ON DELETE CASCADE, product_slug text NOT NULL, product_name text NOT NULL, size text, quantity integer NOT NULL, unit_price numeric NOT NULL, line_total numeric NOT NULL)`;
	await db`CREATE TABLE IF NOT EXISTS order_events (id bigserial PRIMARY KEY, order_id bigint NOT NULL REFERENCES orders(id) ON DELETE CASCADE, event_key text NOT NULL, event_type text NOT NULL, source text NOT NULL, payload jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE (order_id, event_key))`;
	return db;
}
async function ensureProducts() {
	const db = sql();
	if (!db) return null;
	await db`CREATE TABLE IF NOT EXISTS products (slug text PRIMARY KEY, name text NOT NULL, short_name text NOT NULL, price numeric NOT NULL, category text NOT NULL, description text NOT NULL, image text NOT NULL, gallery jsonb NOT NULL DEFAULT '[]', sizes jsonb, stock integer, featured boolean NOT NULL DEFAULT false, updated_at timestamptz NOT NULL DEFAULT now())`;
	await db`CREATE TABLE IF NOT EXISTS migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
	const migration =
		await db`INSERT INTO migrations (id) VALUES ('bronze-price-1000') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (migration.length)
		await db`UPDATE products SET price = 1000, updated_at = now() WHERE slug = 'bronze-sponsor' AND price = 2000`;
	const officialNameMigration =
		await db`INSERT INTO migrations (id) VALUES ('official-name-veterans-to-veteran') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (officialNameMigration.length)
		await db`UPDATE products SET name = replace(name, 'Veterans Outdoor Therapy', ${SITE_NAME}), short_name = replace(short_name, 'Veterans Outdoor Therapy', ${SITE_NAME}), description = replace(description, 'Veterans Outdoor Therapy', ${SITE_NAME}), updated_at = now()`;
	const brokenProductImageMigration =
		await db`INSERT INTO migrations (id) VALUES ('local-product-image-fallbacks') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (brokenProductImageMigration.length) {
		const brokenProductImages = [
			"/wp-content/uploads/2026/01/thumbnail_IMG_7725.jpg",
			"/wp-content/uploads/2025/12/IMG_4715.jpeg",
			"/wp-content/uploads/2025/12/FullSizeRender-3-scaled.jpeg",
			"/wp-content/uploads/2025/12/FullSizeRender-scaled.jpeg",
			"/wp-content/uploads/2025/12/FullSizeRender-4.jpeg",
			"/wp-content/uploads/2025/12/IMG_4733-scaled.jpeg",
			"/wp-content/uploads/2025/12/IMG_4726.jpeg",
			"/wp-content/uploads/2025/12/IMG_7112.jpeg",
			"/wp-content/uploads/2026/01/GetAttachmentThumbnail.jpg",
		];
		for (const brokenImage of brokenProductImages)
			await db`UPDATE products SET image = ${productFallbackImage}, gallery = ${JSON.stringify([productFallbackImage])}, updated_at = now() WHERE image = ${brokenImage}`;
	}
	return db;
}

async function ensureTestimonials() {
	const db = sql();
	if (!db) return null;
	await db`CREATE TABLE IF NOT EXISTS testimonials (slug text PRIMARY KEY, quote text NOT NULL, author text NOT NULL, service text NOT NULL, image text, image_alt text, image_position text, category text, published boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`;
	await db`CREATE TABLE IF NOT EXISTS migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
	const horsebackTestimonialImageMigration =
		await db`INSERT INTO migrations (id) VALUES ('horseback-testimonial-images-2026') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (horsebackTestimonialImageMigration.length) {
		const uploads = "/wp-content/uploads";
		const assignments: [string, string, string][] = [
			["connie-stone-army", `${uploads}/2026/09/horseback/horseback-01.jpg`, "Female Veterans gathered with a horse at Coulter Lake Guest Ranch"],
			["nancy-neal-air-force", `${uploads}/2026/09/horseback/horseback-08.jpg`, "Female Veterans gathered at the corral at Coulter Lake Guest Ranch"],
			["female-veterans-healing", `${uploads}/2026/09/horseback/horseback-10.jpg`, "Female Veterans relaxing on the ranch porch at Coulter Lake Guest Ranch"],
			["ranch-hospitality", `${uploads}/2026/09/horseback/horseback-06.jpg`, "Female Veteran with a horse at Coulter Lake Guest Ranch"],
			["guided-rides-hospitality", `${uploads}/2026/09/horseback/horseback-01.jpg`, "Female Veterans gathered with a horse at Coulter Lake Guest Ranch"],
			["tiffany-baker-army", `${uploads}/2026/09/horseback/horseback-07.jpg`, "Female Veteran with a horse at Coulter Lake Guest Ranch"],
			["heather-pippin-army", `${uploads}/2026/09/horseback/horseback-09.jpg`, "Female Veterans gathered on the ranch porch at Coulter Lake Guest Ranch"],
		];
		for (const [slug, image, imageAlt] of assignments)
			await db`UPDATE testimonials SET image = ${image}, image_alt = ${imageAlt}, updated_at = now() WHERE slug = ${slug}`;
	}
	const removeAllTestimonialImagesMigration =
		await db`INSERT INTO migrations (id) VALUES ('remove-all-testimonial-images-2026') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (removeAllTestimonialImagesMigration.length) {
		await db`UPDATE testimonials SET image = NULL, image_alt = NULL, updated_at = now()`;
	}
	return db;
}

async function ensureEvents() {
	const db = sql();
	if (!db) return null;
	await db`CREATE TABLE IF NOT EXISTS events (slug text PRIMARY KEY, title text NOT NULL, date_label text NOT NULL, start_date date NOT NULL, end_date date NOT NULL, image text NOT NULL, event_type text NOT NULL, location text NOT NULL, summary text NOT NULL, hero_title text NOT NULL, overview_title text NOT NULL, overview text NOT NULL, details_title text NOT NULL, details text NOT NULL, cta_label text NOT NULL, cta_href text NOT NULL, template text NOT NULL DEFAULT 'adventure', published boolean NOT NULL DEFAULT true, featured boolean NOT NULL DEFAULT false, sort_order integer NOT NULL DEFAULT 0, updated_at timestamptz NOT NULL DEFAULT now())`;
	await db`ALTER TABLE events ADD COLUMN IF NOT EXISTS is_over boolean NOT NULL DEFAULT false`;
	await db`ALTER TABLE events ADD COLUMN IF NOT EXISTS recap_url text`;
	await db`CREATE TABLE IF NOT EXISTS migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
	const officialNameMigration =
		await db`INSERT INTO migrations (id) VALUES ('event-official-name-veterans-to-veteran') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (officialNameMigration.length)
		await db`UPDATE events SET title = replace(title, 'Veterans Outdoor Therapy', ${SITE_NAME}), summary = replace(summary, 'Veterans Outdoor Therapy', ${SITE_NAME}), hero_title = replace(hero_title, 'Veterans Outdoor Therapy', ${SITE_NAME}), overview = replace(overview, 'Veterans Outdoor Therapy', ${SITE_NAME}), details = replace(details, 'Veterans Outdoor Therapy', ${SITE_NAME}), updated_at = now()`;
	const recapMigration = await db`INSERT INTO migrations (id) VALUES ('event-recaps-and-over-2026') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (recapMigration.length) {
		await db`UPDATE events SET is_over = true, recap_url = 'https://www.facebook.com/share/p/1BNHxQBuq1/', summary = 'Four Veterans completed the inaugural Missouri turkey hunt, with every hunter tagging a bird and two harvesting their first toms.', details = 'Veterans from Ohio, Nebraska, and Missouri joined local landowners, guides, volunteers, and community supporters for the hunt.', updated_at = now() WHERE slug = 'missouri-turkey-hunt-2026'`;
		await db`UPDATE events SET is_over = true, recap_url = 'https://www.facebook.com/share/p/18AbcbA7td/', details = 'Veterans from Texas and Kansas gathered in the Flint Hills, hosted by Forest, Jardine, and Dru.', updated_at = now() WHERE slug = 'flint-hills-kansas-turkey-hunt-2026'`;
		await db`UPDATE events SET is_over = true, recap_url = 'https://www.facebook.com/share/p/18y8SZtxbM/', location = 'Coulter Lake Guest Ranch, Rifle, Colorado', summary = 'The first annual horseback riding adventure brought female Veterans from Alabama, Wisconsin, South Dakota, and Missouri together at Coulter Lake Guest Ranch.', details = 'Kelly and Forest Keith, Dina, and Maru hosted the group, with first-year funding support from the Military Order of the Purple Heart.', updated_at = now() WHERE slug = 'coulter-lake-guest-ranch-2026'`;
		await db`UPDATE events SET is_over = true, recap_url = 'https://www.facebook.com/share/p/1LZEGfVeTT/', summary = 'Volunteers, sponsors, participants, and riders gathered for the second annual Poker Run, raising support for Veterans and Gold Star families.', updated_at = now() WHERE slug = 'poker-run-2026'`;
	}
	const brokenHorsebackImageMigration =
		await db`INSERT INTO migrations (id) VALUES ('event-horseback-image-fix') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (brokenHorsebackImageMigration.length)
		await db`UPDATE events SET image = '/wp-content/uploads/2026/09/horseback/horseback-01.jpg', updated_at = now() WHERE image = '/wp-content/uploads/2026/01/horseback.jpg'`;
	const brokenTurkeyImagesMigration =
		await db`INSERT INTO migrations (id) VALUES ('event-turkey-images-fix-2026') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (brokenTurkeyImagesMigration.length) {
		await db`UPDATE events SET image = '/wp-content/uploads/2026/09/mo-turkey/underway-02.jpg', updated_at = now() WHERE image = '/wp-content/uploads/2026/01/turkey.jpg'`;
		await db`UPDATE events SET image = '/wp-content/uploads/2026/09/flint-hills/recap-01.jpg', updated_at = now() WHERE image = '/wp-content/uploads/2026/01/turkey2.jpg'`;
	}
	async function seedMissingEvent(db: NonNullable<ReturnType<typeof sql>>, migrationId: string, slug: string) {
		const migration =
			await db`INSERT INTO migrations (id) VALUES (${migrationId}) ON CONFLICT (id) DO NOTHING RETURNING id`;
		if (!migration.length) return;
		const event = seedEvents.find((e) => e.slug === slug);
		if (!event) return;
		await db`INSERT INTO events (slug, title, date_label, start_date, end_date, image, event_type, location, summary, hero_title, overview_title, overview, details_title, details, cta_label, cta_href, template, published, featured, is_over, recap_url, sort_order) VALUES (${event.slug}, ${event.title}, ${event.date}, ${event.startDate}, ${event.endDate}, ${event.image}, ${event.type}, ${event.location}, ${event.summary}, ${event.heroTitle}, ${event.overviewTitle}, ${event.overview}, ${event.detailsTitle}, ${event.details}, ${event.ctaLabel}, ${event.ctaHref}, ${event.template}, ${event.published}, ${event.featured}, ${event.over}, ${event.recapUrl ?? null}, ${event.sortOrder}) ON CONFLICT (slug) DO NOTHING`;
	}
	await seedMissingEvent(db, "seed-tba-missouri-turkey-2027", "missouri-turkey-hunt-2027");
	await seedMissingEvent(db, "seed-tba-flint-hills-2027", "flint-hills-kansas-turkey-hunt-2027");
	await seedMissingEvent(db, "seed-tba-coulter-lake-2027", "coulter-lake-guest-ranch-2027");
	await seedMissingEvent(db, "seed-tba-poker-run-2027", "poker-run-2027");
	await seedMissingEvent(db, "seed-tba-white-river-2027", "white-river-fly-fishing-2027");
	await seedMissingEvent(db, "seed-tba-snagging-2027", "missouri-snagging-trip-2027");
	await seedMissingEvent(db, "seed-tba-wilderness-to-wellness-2027", "wilderness-to-wellness-benefit-dinner-2027");
	return db;
}

export async function getProducts(): Promise<Product[]> {
	const db = await ensureProducts();
	if (!db) return seedProducts;
	const rows = await db`SELECT * FROM products ORDER BY category, name`;
	if (!rows.length) {
		for (const product of seedProducts) await saveProduct(product);
		return seedProducts;
	}
	return rows.map((row) => ({
		slug: String(row.slug),
		name: String(row.name),
		shortName: String(row.short_name),
		price: Number(row.price),
		category: String(row.category),
		description: String(row.description),
		image: String(row.image),
		gallery: row.gallery as string[],
		sizes: row.sizes as string[] | undefined,
		stock: row.stock == null ? undefined : Number(row.stock),
		featured: Boolean(row.featured),
	}));
}

async function ensureGallery() {
	const db = sql();
	if (!db) return null;
	await db`CREATE TABLE IF NOT EXISTS gallery_images (id text PRIMARY KEY, src text NOT NULL UNIQUE, alt text NOT NULL, caption text, tags jsonb NOT NULL DEFAULT '[]', year text, published boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`;
	await db`CREATE TABLE IF NOT EXISTS migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
	const removePhoto063Migration =
		await db`INSERT INTO migrations (id) VALUES ('remove-gallery-photo-063-2026') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (removePhoto063Migration.length) {
		await db`DELETE FROM gallery_images WHERE src = '/wp-content/uploads/2025/09/photo-063.jpg'`;
	}
	const syncFieldStoryPhotosMigration =
		await db`INSERT INTO migrations (id) VALUES ('sync-field-story-photos-to-gallery-2026') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (syncFieldStoryPhotosMigration.length) {
		const existingRows = await db`SELECT src FROM gallery_images`;
		const existingSrcs = new Set(existingRows.map((row) => String(row.src)));
		let nextSortOrder = Number((await db`SELECT COALESCE(MAX(sort_order), 0) AS max FROM gallery_images`)[0].max) + 1;
		const toIdSlug = (src: string) => `local-${src.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`;
		for (const story of seedFieldStories) {
			const tag = story.galleryTag || story.slug;
			const photos: { src: string; alt: string }[] = [
				{ src: story.image, alt: story.imageAlt },
				...(story.photoGalleries || []).flatMap((gallery) => gallery.photos),
			];
			for (const photo of photos) {
				if (existingSrcs.has(photo.src)) continue;
				existingSrcs.add(photo.src);
				await db`INSERT INTO gallery_images (id, src, alt, tags, year, published, sort_order) VALUES (${toIdSlug(photo.src)}, ${photo.src}, ${photo.alt}, ${JSON.stringify([tag])}, ${story.datePublished.slice(0, 4)}, true, ${nextSortOrder}) ON CONFLICT (src) DO NOTHING`;
				nextSortOrder += 1;
			}
		}
	}
	return db;
}

function rowToGalleryImage(row: Record<string, unknown>): GalleryImage {
	return {
		id: String(row.id),
		src: String(row.src),
		alt: String(row.alt || "Veteran outdoor therapy experience in nature"),
		caption: row.caption ? String(row.caption) : undefined,
		tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
		year: row.year ? String(row.year) : undefined,
		published: Boolean(row.published),
		sortOrder: Number(row.sort_order || 0),
		createdAt: String(row.created_at),
		updatedAt: String(row.updated_at),
	};
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
	const db = await ensureGallery();
	if (!db) return seedGalleryImages;
	const rows = await db`SELECT * FROM gallery_images ORDER BY sort_order, created_at`;
	if (!rows.length) {
		for (const image of seedGalleryImages) await saveGalleryImage(image);
		return seedGalleryImages;
	}
	return rows.map((row) => rowToGalleryImage(row));
}

export async function getPublishedGalleryImages(): Promise<GalleryImage[]> {
	return (await getGalleryImages()).filter((image) => image.published);
}

export async function saveGalleryImage(image: GalleryImage) {
	const db = await ensureGallery();
	if (!db) throw new Error("DATABASE_URL is required to save gallery images.");
	await db`INSERT INTO gallery_images (id, src, alt, caption, tags, year, published, sort_order) VALUES (${image.id}, ${image.src}, ${image.alt}, ${image.caption || null}, ${JSON.stringify(image.tags)}, ${image.year || null}, ${image.published}, ${image.sortOrder}) ON CONFLICT (id) DO UPDATE SET src = EXCLUDED.src, alt = EXCLUDED.alt, caption = EXCLUDED.caption, tags = EXCLUDED.tags, year = EXCLUDED.year, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, updated_at = now()`;
}

export async function deleteGalleryImage(id: string) {
	const db = await ensureGallery();
	if (!db) throw new Error("DATABASE_URL is required to delete gallery images.");
	await db`DELETE FROM gallery_images WHERE id = ${id}`;
}

async function ensureFieldStories() {
	const db = sql();
	if (!db) return null;
	await db`CREATE TABLE IF NOT EXISTS field_stories (slug text PRIMARY KEY, title text NOT NULL, date_label text NOT NULL, date_published date NOT NULL, location text NOT NULL, summary text NOT NULL, image text NOT NULL, image_alt text NOT NULL, image_position text, image_position_mobile text, body jsonb NOT NULL DEFAULT '[]', video jsonb, facebook_links jsonb NOT NULL DEFAULT '[]', review_category text, gallery_tag text, photo_galleries jsonb NOT NULL DEFAULT '[]', program_href text NOT NULL, program_label text NOT NULL, published boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now())`;
	await db`ALTER TABLE field_stories ADD COLUMN IF NOT EXISTS image_position text`;
	await db`ALTER TABLE field_stories ADD COLUMN IF NOT EXISTS image_position_mobile text`;
	await db`CREATE TABLE IF NOT EXISTS migrations (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
const dischargeMigration =
		await db`INSERT INTO migrations (id) VALUES ('fix-horseback-photo-mismatch-2026') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (dischargeMigration.length) {
		const correctedPhotos = JSON.stringify([
			{
				title: "Photos from the trip",
				photos: [
					{ src: "/wp-content/uploads/2026/09/horseback/horseback-01.jpg", alt: "Female Veterans gathered with a horse at Coulter Lake Guest Ranch" },
					{ src: "/wp-content/uploads/2026/09/horseback/horseback-06.jpg", alt: "Female Veteran with a horse at Coulter Lake Guest Ranch" },
					{ src: "/wp-content/uploads/2026/09/horseback/horseback-07.jpg", alt: "Female Veteran with a horse at Coulter Lake Guest Ranch" },
					{ src: "/wp-content/uploads/2026/09/horseback/horseback-08.jpg", alt: "Female Veterans gathered at the corral at Coulter Lake Guest Ranch" },
					{ src: "/wp-content/uploads/2026/09/horseback/horseback-09.jpg", alt: "Female Veterans gathered on the ranch porch at Coulter Lake Guest Ranch" },
					{ src: "/wp-content/uploads/2026/09/horseback/horseback-10.jpg", alt: "Female Veterans relaxing on the ranch porch at Coulter Lake Guest Ranch" },
				],
			},
		]);
		await db`UPDATE field_stories SET photo_galleries = ${correctedPhotos}::jsonb, updated_at = now() WHERE slug = 'coulter-lake-female-veteran-horseback-adventure-2026'`;
		await db`UPDATE field_stories SET image = '/wp-content/uploads/2026/09/horseback/horseback-01.jpg', updated_at = now() WHERE image = '/wp-content/uploads/2026/01/horseback.jpg'`;
	}
	const pokerRunUpdateMigration =
		await db`INSERT INTO migrations (id) VALUES ('poker-run-recap-photos-2026') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (pokerRunUpdateMigration.length) {
		const pokerRunPhotos = JSON.stringify([
			{
				title: "Photos from the day",
				photos: [
					{ src: "/wp-content/uploads/2026/09/pokerrun/pokerrun-01.jpg", alt: "Riders gathered around the table at Head's Blacktop Harley-Davidson" },
					{ src: "/wp-content/uploads/2026/09/pokerrun/pokerrun-02.jpg", alt: "Riders gathered at the bar at Head's Blacktop Harley-Davidson" },
					{ src: "/wp-content/uploads/2026/09/pokerrun/pokerrun-03.jpg", alt: "Riders gathered around the table at Head's Blacktop Harley-Davidson" },
					{ src: "/wp-content/uploads/2026/09/pokerrun/pokerrun-04.jpg", alt: "Riders at Head's Blacktop Harley-Davidson" },
					{ src: "/wp-content/uploads/2026/09/pokerrun/pokerrun-05.jpg", alt: "Veteran's Outdoor Therapy volunteers and riders at the second annual Poker Run" },
				],
			},
		]);
		const pokerRunBody = JSON.stringify([
			"Volunteers, sponsors, and participants gathered at Head's Blacktop Harley-Davidson in Columbia, Missouri, for the second annual Poker Run on June 20, 2026.",
			"The community fundraiser supported the outdoor program work behind Veteran hunts, fishing trips, horseback riding experiences, and other time in the field, all while everyone had a great time together. Win-win.",
			"Volunteer effort and local partnerships made the day possible. The event is one example of how supporters can contribute their time, networks, and event experience as well as financial support.",
		]);
		const pokerRunFacebookLinks = JSON.stringify([
			{ href: "https://www.facebook.com/share/p/18S2gUCPoy/", label: "Read the recap on Facebook" },
		]);
		await db`UPDATE field_stories SET
			location = ${"Head's Blacktop Harley-Davidson, Columbia, Missouri"},
			summary = ${"Volunteers, sponsors, and participants gathered at Head's Blacktop Harley-Davidson for the second annual Poker Run, raising money to support Veterans and Gold Star families."},
			image = ${"/wp-content/uploads/2026/09/pokerrun/pokerrun-05.jpg"},
			image_alt = ${"Veteran's Outdoor Therapy volunteers and riders at the second annual Poker Run"},
			body = ${pokerRunBody}::jsonb,
			facebook_links = ${pokerRunFacebookLinks}::jsonb,
			gallery_tag = ${"poker-run"},
			photo_galleries = ${pokerRunPhotos}::jsonb,
			updated_at = now()
		WHERE slug = 'second-annual-poker-run-2026'`;
	}
	async function seedMissingStory(db: NonNullable<ReturnType<typeof sql>>, migrationId: string, slug: string) {
		const migration =
			await db`INSERT INTO migrations (id) VALUES (${migrationId}) ON CONFLICT (id) DO NOTHING RETURNING id`;
		if (!migration.length) return;
		const story = seedFieldStories.find((s) => s.slug === slug);
		if (!story) return;
		await db`INSERT INTO field_stories (slug, title, date_label, date_published, location, summary, image, image_alt, image_position, image_position_mobile, body, video, facebook_links, review_category, gallery_tag, photo_galleries, program_href, program_label, published) VALUES (${story.slug}, ${story.title}, ${story.date}, ${story.datePublished}, ${story.location}, ${story.summary}, ${story.image}, ${story.imageAlt}, ${story.imagePosition ?? null}, ${story.imagePositionMobile ?? null}, ${JSON.stringify(story.body)}, ${story.video ? JSON.stringify(story.video) : null}, ${JSON.stringify(story.facebookLinks || [])}, ${story.reviewCategory || null}, ${story.galleryTag || null}, ${JSON.stringify(story.photoGalleries || [])}, ${story.programHref}, ${story.programLabel}, ${story.published}) ON CONFLICT (slug) DO NOTHING`;
	}
	await seedMissingStory(db, "seed-flint-hills-story-2026", "flint-hills-kansas-turkey-hunt-2026");
	await seedMissingStory(db, "seed-missouri-turkey-story-2026", "missouri-turkey-hunt-2026");
	await seedMissingStory(db, "seed-snagging-story-2026", "missouri-paddlefish-snagging-2026");
	await seedMissingStory(db, "seed-wilderness-to-wellness-story-2026", "wilderness-to-wellness-benefit-dinner-2026");
	const snaggingReviewCategoryMigration =
		await db`INSERT INTO migrations (id) VALUES ('snagging-story-review-category-2026') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (snaggingReviewCategoryMigration.length) {
		await db`UPDATE field_stories SET review_category = 'Snagging', updated_at = now() WHERE slug = 'missouri-paddlefish-snagging-2026'`;
	}
	const snaggingDateFixMigration =
		await db`INSERT INTO migrations (id) VALUES ('snagging-story-date-fix-2026') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (snaggingDateFixMigration.length) {
		await db`UPDATE field_stories SET date_label = 'March 20-22, 2026', date_published = '2026-03-22', updated_at = now() WHERE slug = 'missouri-paddlefish-snagging-2026'`;
	}
	const wildernessToWellnessFixMigration =
		await db`INSERT INTO migrations (id) VALUES ('wilderness-to-wellness-official-recap-2026') ON CONFLICT (id) DO NOTHING RETURNING id`;
	if (wildernessToWellnessFixMigration.length) {
		const story = seedFieldStories.find((s) => s.slug === "wilderness-to-wellness-benefit-dinner-2026");
		if (story) {
			await db`UPDATE field_stories SET
				date_label = ${story.date},
				date_published = ${story.datePublished},
				image = ${story.image},
				image_alt = ${story.imageAlt},
				body = ${JSON.stringify(story.body)}::jsonb,
				facebook_links = ${JSON.stringify(story.facebookLinks || [])}::jsonb,
				photo_galleries = ${JSON.stringify(story.photoGalleries || [])}::jsonb,
				updated_at = now()
			WHERE slug = 'wilderness-to-wellness-benefit-dinner-2026'`;
		}
	}
	return db;
}

/** Postgres `date` columns arrive as Date objects, so format them back to YYYY-MM-DD rather than stringifying. */
function isoDate(value: unknown) {
	if (value instanceof Date) {
		const pad = (part: number) => String(part).padStart(2, "0");
		return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
	}
	return String(value).slice(0, 10);
}

function fieldStoryImagePosition(value: unknown): ImagePosition | undefined {
	return IMAGE_POSITIONS.includes(String(value ?? "") as ImagePosition) ? (String(value) as ImagePosition) : undefined;
}

function rowToFieldStory(row: Record<string, unknown>): FieldStory {
	return {
		slug: String(row.slug),
		title: String(row.title),
		date: String(row.date_label),
		datePublished: isoDate(row.date_published),
		location: String(row.location),
		summary: String(row.summary),
		image: String(row.image),
		imageAlt: String(row.image_alt),
		imagePosition: fieldStoryImagePosition(row.image_position),
		imagePositionMobile: fieldStoryImagePosition(row.image_position_mobile),
		body: Array.isArray(row.body) ? row.body.map(String) : [],
		video: row.video ? (row.video as { url: string; title: string }) : undefined,
		facebookLinks: Array.isArray(row.facebook_links) ? (row.facebook_links as { href: string; label: string }[]) : [],
		reviewCategory: row.review_category ? String(row.review_category) : undefined,
		galleryTag: row.gallery_tag ? String(row.gallery_tag) : undefined,
		photoGalleries: Array.isArray(row.photo_galleries)
			? (row.photo_galleries as { title: string; photos: { src: string; alt: string }[] }[])
			: [],
		programHref: String(row.program_href),
		programLabel: String(row.program_label),
		published: Boolean(row.published),
	};
}

export async function getFieldStories(): Promise<FieldStory[]> {
	const db = await ensureFieldStories();
	if (!db) return [...seedFieldStories].sort((a, b) => b.datePublished.localeCompare(a.datePublished));
	const rows = await db`SELECT * FROM field_stories ORDER BY date_published DESC`;
	if (!rows.length) {
		for (const story of seedFieldStories) await saveFieldStory(story);
		return [...seedFieldStories].sort((a, b) => b.datePublished.localeCompare(a.datePublished));
	}
	return rows.map(rowToFieldStory);
}

export async function getPublishedFieldStories(): Promise<FieldStory[]> {
	return (await getFieldStories()).filter((story) => story.published);
}

export async function getFieldStory(slug: string): Promise<FieldStory | undefined> {
	return (await getFieldStories()).find((story) => story.slug === slug);
}

export async function saveFieldStory(story: FieldStory, previousSlug = story.slug) {
	const db = await ensureFieldStories();
	if (!db) throw new Error("DATABASE_URL is required to save field stories.");
	if (previousSlug && previousSlug !== story.slug) await db`DELETE FROM field_stories WHERE slug = ${previousSlug}`;
	await db`INSERT INTO field_stories (slug, title, date_label, date_published, location, summary, image, image_alt, image_position, image_position_mobile, body, video, facebook_links, review_category, gallery_tag, photo_galleries, program_href, program_label, published) VALUES (${story.slug}, ${story.title}, ${story.date}, ${story.datePublished}, ${story.location}, ${story.summary}, ${story.image}, ${story.imageAlt}, ${story.imagePosition ?? null}, ${story.imagePositionMobile ?? null}, ${JSON.stringify(story.body)}, ${story.video ? JSON.stringify(story.video) : null}, ${JSON.stringify(story.facebookLinks || [])}, ${story.reviewCategory || null}, ${story.galleryTag || null}, ${JSON.stringify(story.photoGalleries || [])}, ${story.programHref}, ${story.programLabel}, ${story.published}) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, date_label = EXCLUDED.date_label, date_published = EXCLUDED.date_published, location = EXCLUDED.location, summary = EXCLUDED.summary, image = EXCLUDED.image, image_alt = EXCLUDED.image_alt, image_position = EXCLUDED.image_position, image_position_mobile = EXCLUDED.image_position_mobile, body = EXCLUDED.body, video = EXCLUDED.video, facebook_links = EXCLUDED.facebook_links, review_category = EXCLUDED.review_category, gallery_tag = EXCLUDED.gallery_tag, photo_galleries = EXCLUDED.photo_galleries, program_href = EXCLUDED.program_href, program_label = EXCLUDED.program_label, published = EXCLUDED.published, updated_at = now()`;
}

export async function deleteFieldStory(slug: string) {
	const db = await ensureFieldStories();
	if (!db) throw new Error("DATABASE_URL is required to delete field stories.");
	await db`DELETE FROM field_stories WHERE slug = ${slug}`;
}

function orderNumber() {
	const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
	return `VOT-${stamp}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function rowToOrder(rows: Array<Record<string, unknown>>): OrderRecord | null {
	const first = rows[0];
	if (!first) return null;
	return {
		orderNumber: String(first.order_number),
		paypalOrderId: first.paypal_order_id ? String(first.paypal_order_id) : "",
		paypalCaptureId: first.paypal_capture_id ? String(first.paypal_capture_id) : undefined,
		status: String(first.status) as OrderRecord["status"],
		fulfillmentStatus: String(first.fulfillment_status || "unfulfilled") as OrderRecord["fulfillmentStatus"],
		customer: {
			name: String(first.customer_name),
			email: String(first.customer_email),
			phone: String(first.phone || ""),
			shippingAddress: first.shipping_address as CheckoutCustomer["shippingAddress"],
			notes: String(first.order_notes || ""),
		},
		items: rows
			.filter((row) => row.item_id != null)
			.map((row) => ({
				slug: String(row.product_slug),
				name: String(row.product_name),
				size: row.size ? String(row.size) : undefined,
				quantity: Number(row.quantity),
				unitPrice: Number(row.unit_price),
				lineTotal: Number(row.line_total),
			})),
		subtotal: Number(first.subtotal),
		total: Number(first.total),
		internalNotificationSent: Boolean(first.internal_notification_sent_at),
		customerNotificationSent: Boolean(first.customer_notification_sent_at),
		shipmentNotificationSent: Boolean(first.shipment_notification_sent_at),
		trackingCarrier: first.tracking_carrier ? String(first.tracking_carrier) : undefined,
		trackingNumber: first.tracking_number ? String(first.tracking_number) : undefined,
		fulfillmentNotes: String(first.fulfillment_notes || ""),
		createdAt: first.created_at ? new Date(String(first.created_at)).toISOString() : undefined,
	};
}

export async function createPendingOrder(customer: CheckoutCustomer, requestedItems: CheckoutItem[]) {
	const db = await ensureOrders();
	if (!db) throw new Error("DATABASE_URL is required to create orders.");
	if (!requestedItems.length || requestedItems.length > 50) throw new Error("Your cart is empty or too large.");

	const products = await getProducts();
	const items: PricedOrderItem[] = requestedItems.map((requested) => {
		const product = products.find((entry) => entry.slug === requested.slug);
		const quantity = Number(requested.quantity);
		if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) throw new Error("One or more cart items are invalid.");
		if (product.sizes?.length && (!requested.size || !product.sizes.includes(requested.size))) {
			throw new Error(`Please choose a valid size for ${product.shortName}.`);
		}
		const unitPrice = Number(product.price);
		return {
			slug: product.slug,
			quantity,
			size: requested.size,
			name: product.shortName,
			unitPrice,
			lineTotal: unitPrice * quantity,
		};
	});
	const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
	const created = await db`
		INSERT INTO orders (order_number, status, customer_name, customer_email, phone, shipping_address, order_notes, subtotal, total)
		VALUES (${orderNumber()}, 'pending', ${customer.name}, ${customer.email}, ${customer.phone}, ${JSON.stringify(customer.shippingAddress)}, ${customer.notes}, ${subtotal}, ${subtotal})
		RETURNING id, order_number
	`;
	const orderId = created[0]?.id;
	if (!orderId) throw new Error("Unable to create order.");
	for (const item of items) {
		await db`INSERT INTO order_items (order_id, product_slug, product_name, size, quantity, unit_price, line_total) VALUES (${orderId}, ${item.slug}, ${item.name}, ${item.size || null}, ${item.quantity}, ${item.unitPrice}, ${item.lineTotal})`;
	}
	return { orderNumber: String(created[0].order_number), items, subtotal, total: subtotal };
}

export async function attachPayPalOrder(orderNumberValue: string, paypalOrderId: string) {
	const db = await ensureOrders();
	if (!db) throw new Error("DATABASE_URL is required to update orders.");
	await db`UPDATE orders SET paypal_order_id = ${paypalOrderId} WHERE order_number = ${orderNumberValue} AND status = 'pending'`;
}

export async function markOrderPaymentFailed(orderNumberValue: string) {
	const db = await ensureOrders();
	if (!db) return;
	await db`UPDATE orders SET status = 'payment_failed' WHERE order_number = ${orderNumberValue} AND status = 'pending'`;
}

export async function getOrderByPayPalId(paypalOrderId: string) {
	const db = await ensureOrders();
	if (!db) return null;
	const rows = await db`
		SELECT o.*, oi.id AS item_id, oi.product_slug, oi.product_name, oi.size, oi.quantity, oi.unit_price, oi.line_total
		FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
		WHERE o.paypal_order_id = ${paypalOrderId}
		ORDER BY oi.id
	`;
	return rowToOrder(rows as Array<Record<string, unknown>>);
}

export async function getOrderByNumber(orderNumberValue: string) {
	const db = await ensureOrders();
	if (!db) return null;
	const rows = await db`
		SELECT o.*, oi.id AS item_id, oi.product_slug, oi.product_name, oi.size, oi.quantity, oi.unit_price, oi.line_total
		FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id
		WHERE o.order_number = ${orderNumberValue}
		ORDER BY oi.id
	`;
	return rowToOrder(rows as Array<Record<string, unknown>>);
}

export async function recordOrderEvent(orderNumberValue: string, eventKey: string, eventType: string, source: string, payload: unknown) {
	const db = await ensureOrders();
	if (!db) return;
	await db`
		INSERT INTO order_events (order_id, event_key, event_type, source, payload)
		SELECT id, ${eventKey}, ${eventType}, ${source}, ${JSON.stringify(payload)} FROM orders WHERE order_number = ${orderNumberValue}
		ON CONFLICT (order_id, event_key) DO NOTHING
	`;
}

export async function getOrderSummaries(filters: { search?: string; paymentStatus?: string; fulfillmentStatus?: string } = {}): Promise<OrderSummary[]> {
	const db = await ensureOrders();
	if (!db) return [];
	const search = filters.search?.trim() || "";
	const paymentStatus = filters.paymentStatus?.trim() || "";
	const fulfillmentStatus = filters.fulfillmentStatus?.trim() || "";
	const searchTerm = `%${search}%`;
	const rows = await db`
		SELECT order_number, status, fulfillment_status, customer_name, customer_email, subtotal, total,
			tracking_carrier, tracking_number, fulfillment_notes, customer_notification_sent_at,
			shipment_notification_sent_at, created_at
		FROM orders
		WHERE (${search} = '' OR order_number ILIKE ${searchTerm} OR customer_name ILIKE ${searchTerm} OR customer_email ILIKE ${searchTerm} OR paypal_order_id ILIKE ${searchTerm})
			AND (${paymentStatus} = '' OR status = ${paymentStatus})
			AND (${fulfillmentStatus} = '' OR fulfillment_status = ${fulfillmentStatus})
		ORDER BY created_at DESC
		LIMIT 100
	`;
	return (rows as Array<Record<string, unknown>>).map((row) => ({
		orderNumber: String(row.order_number),
		status: String(row.status) as OrderRecord["status"],
		fulfillmentStatus: String(row.fulfillment_status) as OrderRecord["fulfillmentStatus"],
		customer: { name: String(row.customer_name), email: String(row.customer_email) },
		items: [],
		subtotal: Number(row.subtotal),
		total: Number(row.total),
		customerNotificationSent: Boolean(row.customer_notification_sent_at),
		shipmentNotificationSent: Boolean(row.shipment_notification_sent_at),
		trackingCarrier: row.tracking_carrier ? String(row.tracking_carrier) : undefined,
		trackingNumber: row.tracking_number ? String(row.tracking_number) : undefined,
		fulfillmentNotes: String(row.fulfillment_notes || ""),
		createdAt: row.created_at ? new Date(String(row.created_at)).toISOString() : undefined,
	}));
}

export async function updateOrderFulfillment(
	orderNumberValue: string,
	fulfillment: {
		status: OrderRecord["fulfillmentStatus"];
		carrier: string;
		trackingNumber: string;
		notes: string;
	},
) {
	const db = await ensureOrders();
	if (!db) throw new Error("DATABASE_URL is required to update orders.");
	if (!["unfulfilled", "processing", "shipped", "completed", "cancelled"].includes(fulfillment.status)) {
		throw new Error("Invalid fulfillment status.");
	}
	const updated = await db`
		UPDATE orders
		SET fulfillment_status = ${fulfillment.status}, tracking_carrier = ${fulfillment.carrier || null}, tracking_number = ${fulfillment.trackingNumber || null}, fulfillment_notes = ${fulfillment.notes}, fulfilled_at = CASE WHEN ${fulfillment.status} IN ('shipped', 'completed') THEN COALESCE(fulfilled_at, now()) ELSE fulfilled_at END, cancelled_at = CASE WHEN ${fulfillment.status} = 'cancelled' THEN COALESCE(cancelled_at, now()) ELSE cancelled_at END, updated_at = now()
		WHERE order_number = ${orderNumberValue}
		RETURNING order_number
	`;
	if (!updated.length) throw new Error("Order was not found.");
	await recordOrderEvent(orderNumberValue, `fulfillment:${Date.now()}`, "fulfillment_updated", "admin", fulfillment);
	return getOrderByNumber(orderNumberValue);
}

export async function markShipmentNotificationSent(orderNumberValue: string) {
	const db = await ensureOrders();
	if (!db) return;
	await db`UPDATE orders SET shipment_notification_sent_at = now(), updated_at = now() WHERE order_number = ${orderNumberValue}`;
}

export async function markOrderPaid(paypalOrderId: string, paypalCaptureId: string) {
	const db = await ensureOrders();
	if (!db) throw new Error("DATABASE_URL is required to update orders.");
	const existing = await getOrderByPayPalId(paypalOrderId);
	if (!existing) throw new Error("Order was not found.");
	if (existing.status !== "paid") {
		await db`UPDATE orders SET status = 'paid', paypal_capture_id = ${paypalCaptureId}, paid_at = now() WHERE paypal_order_id = ${paypalOrderId} AND status = 'pending'`;
	}
	return { order: await getOrderByPayPalId(paypalOrderId), newlyPaid: existing.status !== "paid" };
}

export async function markOrderNotificationSent(orderNumberValue: string) {
	const db = await ensureOrders();
	if (!db) return;
	await db`UPDATE orders SET notification_sent_at = now(), internal_notification_sent_at = now() WHERE order_number = ${orderNumberValue}`;
}

export async function markCustomerNotificationSent(orderNumberValue: string) {
	const db = await ensureOrders();
	if (!db) return;
	await db`UPDATE orders SET customer_notification_sent_at = now() WHERE order_number = ${orderNumberValue}`;
}

export async function markOrderRefunded(paypalOrderId: string) {
	const db = await ensureOrders();
	if (!db) return null;
	await db`UPDATE orders SET status = 'refunded', refunded_at = now() WHERE paypal_order_id = ${paypalOrderId}`;
	return getOrderByPayPalId(paypalOrderId);
}

export async function saveProduct(product: Product) {
	const db = await ensureProducts();
	if (!db) throw new Error("DATABASE_URL is required to save products.");
	await db`INSERT INTO products (slug, name, short_name, price, category, description, image, gallery, sizes, stock, featured) VALUES (${product.slug}, ${product.name}, ${product.shortName}, ${product.price}, ${product.category}, ${product.description}, ${product.image}, ${JSON.stringify(product.gallery)}, ${product.sizes ? JSON.stringify(product.sizes) : null}, ${product.stock ?? null}, ${product.featured ?? false}) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, short_name = EXCLUDED.short_name, price = EXCLUDED.price, category = EXCLUDED.category, description = EXCLUDED.description, image = EXCLUDED.image, gallery = EXCLUDED.gallery, sizes = EXCLUDED.sizes, stock = EXCLUDED.stock, featured = EXCLUDED.featured, updated_at = now()`;
}

export async function deleteProduct(slug: string) {
	const db = await ensureProducts();
	if (!db) throw new Error("DATABASE_URL is required to delete products.");
	await db`DELETE FROM products WHERE slug = ${slug}`;
}

function rowToEvent(row: Record<string, unknown>): Event {
	return {
		slug: String(row.slug),
		title: String(row.title),
		date: String(row.date_label),
		startDate: isoDate(row.start_date),
		endDate: isoDate(row.end_date),
		image: String(row.image),
		type: String(row.event_type),
		location: String(row.location),
		summary: String(row.summary),
		heroTitle: String(row.hero_title),
		overviewTitle: String(row.overview_title),
		overview: String(row.overview),
		detailsTitle: String(row.details_title),
		details: String(row.details),
		ctaLabel: String(row.cta_label),
		ctaHref: String(row.cta_href),
		template: String(row.template) as EventTemplate,
		published: Boolean(row.published),
		featured: Boolean(row.featured),
		over: Boolean(row.is_over),
		recapUrl: row.recap_url ? String(row.recap_url) : undefined,
		sortOrder: Number(row.sort_order),
	};
}

export async function getEvents(): Promise<Event[]> {
	const db = await ensureEvents();
	if (!db) return seedEvents;
	const rows = await db`SELECT * FROM events ORDER BY sort_order, start_date, title`;
	if (!rows.length) {
		for (const event of seedEvents) await saveEvent(event);
		return seedEvents;
	}
	return rows.map(rowToEvent);
}

export async function getEvent(slug: string): Promise<Event | undefined> {
	return (await getEvents()).find((event) => event.slug === slug);
}

export async function saveEvent(event: Event, previousSlug = event.slug) {
	const db = await ensureEvents();
	if (!db) throw new Error("DATABASE_URL is required to save events.");
	if (previousSlug && previousSlug !== event.slug) await db`DELETE FROM events WHERE slug = ${previousSlug}`;
	await db`INSERT INTO events (slug, title, date_label, start_date, end_date, image, event_type, location, summary, hero_title, overview_title, overview, details_title, details, cta_label, cta_href, template, published, featured, is_over, recap_url, sort_order) VALUES (${event.slug}, ${event.title}, ${event.date}, ${event.startDate}, ${event.endDate}, ${event.image}, ${event.type}, ${event.location}, ${event.summary}, ${event.heroTitle}, ${event.overviewTitle}, ${event.overview}, ${event.detailsTitle}, ${event.details}, ${event.ctaLabel}, ${event.ctaHref}, ${event.template}, ${event.published}, ${event.featured}, ${event.over}, ${event.recapUrl ?? null}, ${event.sortOrder}) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, date_label = EXCLUDED.date_label, start_date = EXCLUDED.start_date, end_date = EXCLUDED.end_date, image = EXCLUDED.image, event_type = EXCLUDED.event_type, location = EXCLUDED.location, summary = EXCLUDED.summary, hero_title = EXCLUDED.hero_title, overview_title = EXCLUDED.overview_title, overview = EXCLUDED.overview, details_title = EXCLUDED.details_title, details = EXCLUDED.details, cta_label = EXCLUDED.cta_label, cta_href = EXCLUDED.cta_href, template = EXCLUDED.template, published = EXCLUDED.published, featured = EXCLUDED.featured, is_over = EXCLUDED.is_over, recap_url = EXCLUDED.recap_url, sort_order = EXCLUDED.sort_order, updated_at = now()`;
}

export async function deleteEvent(slug: string) {
	const db = await ensureEvents();
	if (!db) throw new Error("DATABASE_URL is required to delete events.");
	await db`DELETE FROM events WHERE slug = ${slug}`;
}

function rowToTestimonial(row: Record<string, unknown>): Testimonial {
	return {
		slug: String(row.slug),
		quote: String(row.quote),
		author: String(row.author),
		service: String(row.service),
		image: row.image ? String(row.image) : undefined,
		imageAlt: row.image_alt ? String(row.image_alt) : undefined,
		imagePosition: row.image_position
			? (String(row.image_position) as
					| "top"
					| "bottom"
					| "left"
					| "right"
					| "top-left"
					| "top-right"
					| "bottom-left"
					| "bottom-right"
					| "center")
			: undefined,
		category: row.category ? String(row.category) : undefined,
		published: Boolean(row.published),
		sortOrder: Number(row.sort_order),
		createdAt: String(row.created_at),
		updatedAt: String(row.updated_at),
	};
}

export async function getTestimonials(): Promise<Testimonial[]> {
	const db = await ensureTestimonials();
	if (!db) return seedTestimonials;
	const rows = await db`SELECT * FROM testimonials ORDER BY sort_order, created_at`;
	if (!rows.length) {
		for (const testimonial of seedTestimonials) await saveTestimonial(testimonial);
		return seedTestimonials;
	}
	return rows.map(rowToTestimonial);
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
	const all = await getTestimonials();
	return all.filter((t) => t.published);
}

export async function getTestimonial(slug: string): Promise<Testimonial | undefined> {
	return (await getTestimonials()).find((testimonial) => testimonial.slug === slug);
}

export async function saveTestimonial(testimonial: Testimonial, previousSlug = testimonial.slug) {
	const db = await ensureTestimonials();
	if (!db) throw new Error("DATABASE_URL is required to save testimonials.");
	if (previousSlug && previousSlug !== testimonial.slug) await db`DELETE FROM testimonials WHERE slug = ${previousSlug}`;
	await db`INSERT INTO testimonials (slug, quote, author, service, image, image_alt, image_position, category, published, sort_order) VALUES (${testimonial.slug}, ${testimonial.quote}, ${testimonial.author}, ${testimonial.service}, ${testimonial.image ?? null}, ${testimonial.imageAlt ?? null}, ${testimonial.imagePosition ?? null}, ${testimonial.category ?? null}, ${testimonial.published}, ${testimonial.sortOrder}) ON CONFLICT (slug) DO UPDATE SET quote = EXCLUDED.quote, author = EXCLUDED.author, service = EXCLUDED.service, image = EXCLUDED.image, image_alt = EXCLUDED.image_alt, image_position = EXCLUDED.image_position, category = EXCLUDED.category, published = EXCLUDED.published, sort_order = EXCLUDED.sort_order, updated_at = now()`;
}

export async function deleteTestimonial(slug: string) {
	const db = await ensureTestimonials();
	if (!db) throw new Error("DATABASE_URL is required to delete testimonials.");
	await db`DELETE FROM testimonials WHERE slug = ${slug}`;
}

export async function saveSubmission(kind: string, data: Record<string, string>) {
	const db = sql();
	if (!db) throw new Error("DATABASE_URL is required to accept submissions.");
	await db`CREATE TABLE IF NOT EXISTS submissions (id bigserial PRIMARY KEY, kind text NOT NULL, data jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`;
	await db`INSERT INTO submissions (kind, data) VALUES (${kind}, ${JSON.stringify(data)})`;
}
