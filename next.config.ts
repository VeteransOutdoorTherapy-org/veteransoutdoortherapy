import type { NextConfig } from "next";

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
		];
	},
};

export default nextConfig;
