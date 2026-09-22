import { ArrowLeft, HandHeart, Package, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { ProductCard } from "@/components/product-card";
import { products, productInStock, type Product } from "@/lib/data";
import { getProducts } from "@/lib/db";
import { absoluteUrl, breadcrumbSchema, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Every page that reads the database regenerates on this interval. The admin's
 * save actions still call revalidatePath for an immediate refresh; this is the
 * floor, so a change made any other way — a direct edit, a seed correction —
 * appears without waiting for a deploy.
 */
export const revalidate = 600;

/** Deterministic PRNG: a static page gets a stable shuffle without calling Math.random() at render. */
function seededRandom(seed: number) {
	let state = seed * 1831565813 + 1;
	return () => {
		state = Math.imul(state ^ (state >>> 15), state | 1);
		state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
		return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * Up to three other products, shuffled off the slug so each page keeps its own stable trio.
 * Kept inside the same category: merchandise pages are indexed, sponsorship pages are not,
 * so the two should not link into each other.
 */
function relatedProducts(all: Product[], slug: string, category: string) {
	const pool = all.filter((item) => item.slug !== slug && item.category === category);
	let seed = 0;
	for (const character of slug) seed = Math.imul(seed ^ character.charCodeAt(0), 2654435761);
	const random = seededRandom(seed);
	for (let index = pool.length - 1; index > 0; index -= 1) {
		const swap = Math.floor(random() * (index + 1));
		[pool[index], pool[swap]] = [pool[swap], pool[index]];
	}
	return pool.slice(0, 3);
}
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
	const allProducts = await getProducts();
	const product = allProducts.find((item) => item.slug === slug);
	if (!product) notFound();
	const related = relatedProducts(allProducts, product.slug, product.category);
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
		<>
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
								<Package size={18} />{" "}
								{product.sizes
									.filter((entry) => entry.stock != null)
									.map((entry) => `${entry.size}: ${entry.stock}`)
									.join(" · ")}
							</p>
						) : product.stock != null ? (
							<p className="stock">
								<Package size={18} /> {product.stock} in stock
							</p>
						) : null}
						{!productInStock(product) && <p className="stock sold-out">Sold out</p>}
						<AddToCart product={product} />
						<p className="donation-note">
							This purchase is a donation. Every dollar goes back into the lodging, meals, and gear behind an
							outdoor experience for a previously deployed Veteran or a Gold Star family member.
						</p>
						<div className="product-assurance">
							<span>
								<ShieldCheck size={30} /> Secure PayPal checkout
							</span>
							<span>
								<HandHeart size={30} /> Funds a Veteran&apos;s time outdoors
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
		{related.length > 0 && (
			<section className="section">
				<div className="container">
					<p className="eyebrow">Keep looking around</p>
					<h2 className="display section-title">More ways to back a Veteran&apos;s time outdoors.</h2>
					<div className="product-grid shop-grid">
						{related.map((item) => (
							<ProductCard key={item.slug} product={item} />
						))}
					</div>
				</div>
			</section>
		)}
		</>
	);
}
