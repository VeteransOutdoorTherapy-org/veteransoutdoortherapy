import type { NextConfig } from "next";

// Old -> new slugs for products/events that were renamed after publishing.
// Only add an entry here once the production database's stored slug has
// actually been updated to the new value (the `products` table has no
// rename support in the admin UI, so the database row must be fixed
// directly first) — otherwise this redirect just forwards visitors to a
// 404.
const renamedProductSlugs: Record<string, string> = {
	"veterans-outdoor-therapy-t-shirt-nature-inspired-veteran-apparel-copy":
		"veterans-outdoor-therapy-t-shirt-nature-inspired-veteran-apparel-burnt-orange",
};

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		// Photos are served from WebP copies made at build time (scripts/image-variants.mjs),
		// never through Vercel's per-transformation image optimizer.
		loader: "custom",
		loaderFile: "./src/lib/image-loader.ts",
		remotePatterns: [
			{ protocol: "https", hostname: "veteransoutdoortherapy.org", pathname: "/wp-content/uploads/**" },
			{ protocol: "https", hostname: "images.unsplash.com" },
			{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
		],
	},
	// Photos never change at the same path, so browsers can keep them for 30 days
	// instead of rechecking with Vercel on every page view.
	async headers() {
		return ["/_img/:path*", "/wp-content/uploads/:path*"].map((source) => ({
			source,
			headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
		}));
	},
	async redirects() {
		return [
			{ source: "/author/mmillard", destination: "/about", permanent: true },
			{ source: "/events/benefit-banquet-dinner-2027", destination: "/events/wilderness-to-wellness-benefit-dinner-2027", permanent: true },
			{ source: "/category/uncategorized", destination: "/events", permanent: true },
			{ source: "/adventures", destination: "/events", permanent: true },
			{ source: "/events-2", destination: "/events", permanent: true },
			{ source: "/events-3", destination: "/events", permanent: true },
			{ source: "/apply", destination: "/application", permanent: true },
			{ source: "/contact-7", destination: "/contact", permanent: true },
			{ source: "/contribute", destination: "/donate", permanent: true },
			{ source: "/services-2", destination: "/programs", permanent: true },
			{ source: "/sponsor", destination: "/sponsorships", permanent: true },
			{ source: "/sponsorships-2", destination: "/sponsorships", permanent: true },
			{ source: "/product-category/sponsorships", destination: "/sponsorships", permanent: true },
			{ source: "/product-category/merchandise", destination: "/shop", permanent: true },
			{ source: "/products", destination: "/shop", permanent: true },
			{ source: "/banquet-2026", destination: "/wilderness-to-wellness", permanent: true },
			{ source: "/memberships", destination: "/donate", permanent: true },
			...Object.entries(renamedProductSlugs).map(([oldSlug, newSlug]) => ({
				source: `/product/${oldSlug}`,
				destination: `/product/${newSlug}`,
				permanent: false,
			})),
		];
	},
};

export default nextConfig;
