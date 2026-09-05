import type { NextConfig } from "next";

// Old -> new slugs for products/events that were renamed after publishing.
// Add an entry here whenever a live slug changes so bookmarked/indexed links still resolve.
const renamedProductSlugs: Record<string, string> = {
	"veterans-outdoor-therapy-t-shirt-nature-inspired-veteran-apparel-copy":
		"veterans-outdoor-therapy-t-shirt-nature-inspired-veteran-apparel-burnt-orange",
};

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "veteransoutdoortherapy.org", pathname: "/wp-content/uploads/**" },
			{ protocol: "https", hostname: "images.unsplash.com" },
			{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
		],
	},
	async redirects() {
		return [
			{ source: "/author/mmillard", destination: "/about", permanent: true },
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
