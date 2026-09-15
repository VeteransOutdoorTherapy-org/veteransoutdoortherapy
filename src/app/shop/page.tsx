import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/db";
import { breadcrumbSchema, pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { HeroCollage } from "@/components/hero-collage";
import { SectionEdge } from "@/components/section-edge";
export const metadata = pageMetadata({
	title: "Veteran's Outdoor Therapy Apparel and Gear",
	description: "Shop Veteran's Outdoor Therapy shirts, hoodies, mugs, and field gear. Merchandise proceeds help support outdoor programs for Veterans and Gold Star families.",
	path: "/shop",
});
export default async function ShopPage() {
	const items = (await getProducts()).filter((item) => item.category === "Merchandise");
	return (
		<>
			<JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }])} />
			<section className="page-hero">
				<HeroCollage seed={12} />
				<div className="container">
					<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
					<p className="eyebrow">Wear the mission</p>
					<h1 className="display">Veteran&apos;s Outdoor Therapy apparel and mission gear.</h1>
					<p>
						Every order is a donation toward putting a previously deployed Veteran or Gold Star family in the
						field, covering the lodging, meals, and gear behind their time outdoors.
					</p>
				</div>
				<SectionEdge color="var(--paper)" variant="b" />
			</section>
			<section className="section">
				<div className="container">
					<div className="product-grid shop-grid">
						{items.map((product) => (
							<ProductCard key={product.slug} product={product} />
						))}
					</div>
				</div>
			</section>
		</>
	);
}
