import Image from "next/image";
import Link from "next/link";
import { Quote, Star, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata, breadcrumbSchema } from "@/lib/site";
import { getPublishedGalleryImages, getPublishedTestimonials } from "@/lib/db";

export const metadata = pageMetadata({
	title: "Veteran Testimonials — Stories of Healing & Hope",
	description:
		"Read powerful testimonials from Veterans who have experienced healing, camaraderie, and renewed purpose through Veteran's Outdoor Therapy's fully funded outdoor adventures.",
	path: "/testimonials",
});

export default async function TestimonialsPage({ searchParams }: { searchParams: Promise<{ category?: string; year?: string }> }) {
	const query = await searchParams;
	const allTestimonials = await getPublishedTestimonials();
	const categories = Array.from(new Set(allTestimonials.map((t) => t.category || "Uncategorized"))).sort();
	const years = Array.from(new Set(allTestimonials.map((t) => t.createdAt.slice(0, 4)))).sort().reverse();
	const testimonials = allTestimonials.filter((t) => (!query.category || (t.category || "Uncategorized") === query.category) && (!query.year || t.createdAt.startsWith(query.year)));
	const galleryImages = await getPublishedGalleryImages();
	const heroCollage = [...galleryImages].sort(() => Math.random() - 0.5).slice(0, 8);

	return (
		<>
			<JsonLd
				data={breadcrumbSchema([
					{ name: "Home", path: "/" },
					{ name: "Testimonials", path: "/testimonials" },
				])}
			/>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "ItemList",
					itemListElement: testimonials.map((testimonial, index) => ({
						"@type": "ListItem",
						position: index + 1,
						item: {
							"@type": "Quotation",
							text: testimonial.quote,
							creator: { "@type": "Person", name: testimonial.author },
						},
					})),
				}}
			/>
			<section className="page-hero testimonials-hero">
				{heroCollage.length > 0 && (
					<div className="testimonials-hero-collage" aria-hidden="true">
						{heroCollage.map((image) => (
							<div key={image.id}>
								<Image src={image.src} alt="" fill sizes="25vw" />
							</div>
						))}
					</div>
				)}
				<div className="container">
					<Breadcrumbs
						light
						items={[
							{ label: "Home", href: "/" },
							{ label: "Testimonials" },
						]}
					/>
					<p className="eyebrow">Voices from the field</p>
					<h1 className="display">What Veterans say about their experience.</h1>
					<p>
						Real stories from Veterans who found healing, purpose, and brotherhood through
						fully funded outdoor adventures.
					</p>
				</div>
			</section>

			<section className="section">
				<div className="container">
					<form className="public-filters" method="get" aria-label="Filter testimonials"><label>Category<select className="field" name="category" defaultValue={query.category}><option value="">All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Year<select className="field" name="year" defaultValue={query.year}><option value="">All years</option>{years.map((year) => <option key={year}>{year}</option>)}</select></label><button className="button secondary" type="submit">Filter</button></form>
					{testimonials.length === 0 ? (
						<div className="empty-state">
							<h2>No testimonials yet</h2>
							<p>
								Testimonials will appear here once added in the admin panel.
							</p>
						</div>
					) : (
						<div className="testimonials-masonry">
							{testimonials.map((testimonial) => (
								<article
									key={testimonial.slug}
									className={testimonial.quote.length > 500 ? "testimonial-card testimonial-card-wide" : "testimonial-card"}
								>
									<div className="testimonial-quote">
										<Quote size={48} className="quote-icon" aria-hidden="true" />
										<blockquote>
											<p>{testimonial.quote}</p>
										</blockquote>
									</div>
									{testimonial.image && (
										<div
											className="testimonial-image"
											style={{
												objectPosition: testimonial.imagePosition
													? testimonial.imagePosition.replace("-", " ")
													: "center",
											}}
										>
											<Image
												src={testimonial.image}
												alt={
													testimonial.imageAlt ||
													`${testimonial.author} - ${testimonial.service}`
												}
												width={400}
												height={300}
												className="testimonial-img"
											/>
										</div>
									)}
									<footer className="testimonial-author">
										<div className="author-info">
											<cite className="author-name">{testimonial.author}</cite>
											<span className="author-service">{testimonial.service}</span>
											{testimonial.category && (
												<span className="author-category">{testimonial.category}</span>
											)}
										</div>
										<div className="testimonial-rating" aria-label="5 out of 5 stars" data-horizontal={true}>
											{[1, 2, 3, 4, 5].map((star) => (
												<Star key={star} size={18} fill="currentColor" />
											))}
										</div>
									</footer>
								</article>
							))}
						</div>
					)}

					<div className="testimonial-cta">
						<p>
							Have a story to share? We&apos;d love to hear about your experience with
							Veteran&apos;s Outdoor Therapy.
						</p>
						<Link className="button orange" href="/contact">
							Share Your Story
							<ArrowRight size={17} />
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
