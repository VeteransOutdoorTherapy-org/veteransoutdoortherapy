import { ProductCatalog } from "@/components/product-catalog";
import { getProducts } from "@/lib/db";
import { pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata = pageMetadata({
	title: "Mission Gear and Sponsorship Options",
	description: "Browse Veteran's Outdoor Therapy merchandise first, followed by nonprofit sponsorship options that help fund outdoor programs.",
	path: "/products",
});

export default async function ProductsPage() {
	const items = await getProducts();
	return (
		<section className="section">
			<div className="container">
				<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
				<p className="eyebrow">Every order is a donation</p>
				<h1 className="display section-title">Gear that gives back.</h1>
				<p className="prose">
					Every order is a donation to the mission. What you spend pays for the lodging, meals, and gear behind
					a Veteran or Gold Star family’s time outdoors.
				</p>
				<ProductCatalog products={items} />
			</div>
		</section>
	);
}
