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
		"/shop",
		"/sponsorships",
		"/wilderness-to-wellness",
		"/privacy",
	];
	const hubs = new Set(["/programs", "/programs/veteran-hunting", "/gold-star-families", "/events", "/field-stories", "/sponsorships"]);
	return [
		...routes.map((route) => ({
			url: `${SITE_URL}${route}`,
			changeFrequency: route === "/shop" ? ("weekly" as const) : ("monthly" as const),
			priority: route === "" ? 1 : hubs.has(route) ? 0.85 : 0.7,
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
				changeFrequency: "weekly" as const,
				priority: 0.7,
			})),
		...fieldStories.map((story) => ({
			url: `${SITE_URL}/field-stories/${story.slug}`,
			changeFrequency: "monthly" as const,
			priority: 0.7,
		})),
	];
}
