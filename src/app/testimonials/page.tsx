import Image from "next/image";
import Link from "next/link";
import { Quote, Star, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata, breadcrumbSchema, faqSchema } from "@/lib/site";
import { getPublishedTestimonials, type Testimonial } from "@/lib/db";

export const metadata = pageMetadata({
	title: "Veteran Testimonials — Stories of Healing & Hope",
	description:
		"Read powerful testimonials from Veterans who have experienced healing, camaraderie, and renewed purpose through Veteran's Outdoor Therapy's fully funded outdoor adventures.",
	path: "/testimonials",
});

export default async function TestimonialsPage() {
	const testimonials = await getPublishedTestimonials();

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
							"@type": "Review",
							author: {
								"@type": "Person",
								name: testimonial.author,
							},
							reviewBody: testimonial.quote,
							reviewRating: {
								"@type": "Rating",
								ratingValue: "5",
								bestRating: "5",
							},
						},
					})),
				}}
			/>
			<section className="page-hero">
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
					{testimonials.length === 0 ? (
						<div className="empty-state">
							<h2>No testimonials yet</h2>
							<p>
								Testimonials will appear here once added in the admin panel.
							</p>
						</div>
					) : (
						<div className="testimonials-grid">
							{testimonials.map((testimonial) => (
								<article key={testimonial.slug} className="testimonial-card">
									<div className="testimonial-quote">
										<Quote size={48} className="quote-icon" aria-hidden="true" />
										<blockquote>
											<p>{testimonial.quote}</p>
										</blockquote>
									</div>
									{testimonial.image && (
										<div className="testimonial-image">
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
										</div>
										<div className="testimonial-rating" aria-label="5 out of 5 stars">
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
							Have a story to share? We'd love to hear about your experience with
							Veteran's Outdoor Therapy.
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