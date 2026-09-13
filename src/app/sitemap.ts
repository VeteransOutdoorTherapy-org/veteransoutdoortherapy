import type { MetadataRoute } from "next";
import { getEvents, getProducts, getPublishedFieldStories } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [products, events, fieldStories] = await Promise.all([getProducts(), getEvents(), getPublishedFieldStories()]);
	const routes = [
		"",
		"/about",
		"/programs",
		"/programs/veteran-hunting",
		"/gold-star-families",
		"/events",
		"/field-stories",
		"/application",
		"/contact",
		"/donate",
		"/gallery",
		"/testimonials",
		"/fundraising-application",
		"/shop",
		"/sponsorships",
		"/wilderness-to-wellness",
		"/privacy",
	];
	// The pages worth showing as sitelinks under the homepage result: the ones a visitor is
	// most often looking for, ranked above the rest so crawlers see the intended hierarchy.
	const hubs = new Set([
		"/application",
		"/programs",
		"/events",
		"/field-stories",
		"/gold-star-families",
		"/about",
		"/donate",
		"/sponsorships",
	]);
	const updated = new Date();
	return [
		...routes.map((route) => ({
			url: `${SITE_URL}${route}`,
			lastModified: updated,
			changeFrequency: route === "/shop" ? ("weekly" as const) : ("monthly" as const),
			priority: route === "" ? 1 : hubs.has(route) ? 0.9 : 0.6,
		})),
		...products.filter((product) => product.category !== "Sponsorships").map((product) => ({
			url: `${SITE_URL}/product/${product.slug}`,
			changeFrequency: "weekly" as const,
			priority: 0.6,
		})),
		...events
			.filter((event) => event.published)
			.map((event) => ({
				url: `${SITE_URL}/events/${event.slug}`,
				lastModified: new Date(event.endDate),
				changeFrequency: "weekly" as const,
				priority: 0.7,
			})),
		...fieldStories.map((story) => ({
			url: `${SITE_URL}/field-stories/${story.slug}`,
			lastModified: new Date(story.datePublished),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		})),
	];
}
