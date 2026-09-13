import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/db";
import { breadcrumbSchema, pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
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
			<section className="section">
				<div className="container">
					<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
					<p className="eyebrow">Every order is a donation</p>
					<h1 className="display section-title">Veteran&apos;s Outdoor Therapy apparel and mission gear.</h1>
					<p className="prose">
						Buying a shirt here is less a transaction than a contribution. What you spend goes back into the field:
						a night of lodging, a meal around the table, the gear that lets a previously deployed Veteran or a Gold Star
						family spend a few days outdoors at no cost to them.
					</p>
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
