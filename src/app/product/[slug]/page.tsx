import { ArrowLeft, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { products, productInStock } from "@/lib/data";
import { getProducts } from "@/lib/db";
import { absoluteUrl, breadcrumbSchema, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/site";
export function generateStaticParams() {
	return products.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
	const { slug } = await params;
	const product = (await getProducts()).find((item) => item.slug === slug);
	if (!product) return {};
	const isSponsorship = product.category === "Sponsorships";
	return pageMetadata({
		title: product.name,
		description: product.description,
		path: isSponsorship ? "/sponsorships" : `/product/${product.slug}`,
		image: product.image,
		noIndex: isSponsorship,
	});
}
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const product = (await getProducts()).find((item) => item.slug === slug);
	if (!product) notFound();
	const isSponsorship = product.category === "Sponsorships";
	const path = `/product/${product.slug}`;
	const productSchema = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		description: product.description,
		image: [product.image, ...product.gallery],
		url: absoluteUrl(path),
		brand: { "@type": "Brand", name: SITE_NAME },
		offers: {
			"@type": "Offer",
			price: product.price,
			priceCurrency: "USD",
			availability: productInStock(product) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
			url: absoluteUrl(path),
			seller: { "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
		},
	};
	return (
		<section className="section product-page">
			{!isSponsorship && <JsonLd data={[
				breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }, { name: product.shortName, path }]),
				productSchema,
			]} />}
			<div className="container">
				<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: isSponsorship ? "Sponsorships" : "Shop", href: isSponsorship ? "/sponsorships" : "/shop" }, { label: product.shortName }]} />
				<Link className="back-link" href={product.category === "Merchandise" ? "/shop" : "/sponsorships"}>
					<ArrowLeft size={17} /> Back
				</Link>
				<div className="product-detail">
					<div className="product-main-image">
						<Image src={product.image} alt={product.name} fill priority sizes="(max-width: 800px) 100vw, 55vw" />
					</div>
					<div className="product-copy">
						<p className="eyebrow">{product.category}</p>
						<h1 className="display">{product.name}</h1>
						<p className="price">${product.price.toLocaleString()}</p>
						<p>{product.description}</p>
						{product.sizes?.some((entry) => entry.stock != null) ? (
							<p className="stock">
								<PackageCheck size={18} />{" "}
								{product.sizes
									.filter((entry) => entry.stock != null)
									.map((entry) => `${entry.size}: ${entry.stock}`)
									.join(" · ")}
							</p>
						) : product.stock != null ? (
							<p className="stock">
								<PackageCheck size={18} /> {product.stock} in stock
							</p>
						) : null}
						{!productInStock(product) && <p className="stock sold-out">Sold out</p>}
						<AddToCart product={product} />
						<div className="product-assurance">
							<span>
								<ShieldCheck /> Secure PayPal checkout
							</span>
							<span>
								<Truck /> Purpose-driven purchase
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
