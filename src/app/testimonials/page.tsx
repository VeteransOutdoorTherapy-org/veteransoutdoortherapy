import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { FeaturedTestimonial, interleaveByLength, TestimonialCard, TestimonialGrid } from "@/components/testimonials";
import { publicName } from "@/lib/names";
import { pageMetadata, breadcrumbSchema } from "@/lib/site";
import { getPublishedTestimonials } from "@/lib/db";
import { HeroCollage } from "@/components/hero-collage";
import { SectionEdge } from "@/components/section-edge";

/**
 * Every page that reads the database regenerates on this interval. The admin's
 * save actions still call revalidatePath for an immediate refresh; this is the
 * floor, so a change made any other way — a direct edit, a seed correction —
 * appears without waiting for a deploy.
 */
export const revalidate = 3600;

export const metadata = pageMetadata({
	title: "Veteran Testimonials — Stories of Healing & Hope",
	description:
		"Read testimonials from Veterans who found healing, camaraderie, and renewed purpose in the field with Veteran's Outdoor Therapy.",
	path: "/testimonials",
});

export default async function TestimonialsPage({ searchParams }: { searchParams: Promise<{ category?: string; year?: string }> }) {
	const query = await searchParams;
	const allTestimonials = await getPublishedTestimonials();
	const categories = Array.from(new Set(allTestimonials.map((t) => t.category || "Uncategorized"))).sort();
	const years = Array.from(new Set(allTestimonials.map((t) => t.createdAt.slice(0, 4)))).sort().reverse();
	const testimonials = allTestimonials.filter((t) => (!query.category || (t.category || "Uncategorized") === query.category) && (!query.year || t.createdAt.startsWith(query.year)));
	// The first quote of a readable length leads the page at a larger size; the rest fill the grid.
	const featured = testimonials.length > 3 ? testimonials.find((t) => t.quote.length >= 200 && t.quote.length <= 520) : undefined;
	const rest = testimonials.filter((t) => t !== featured);

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
							creator: { "@type": "Person", name: publicName(testimonial.author) },
						},
					})),
				}}
			/>
			<section className="page-hero">
				<HeroCollage />
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
						Real stories from Veterans who found healing, purpose, and brotherhood in the field, alongside
						others who understand.
					</p>
				</div>
				<SectionEdge color="var(--paper)" variant="a" />
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
						<div className="mt-10 flex flex-col gap-12">
							{featured && <FeaturedTestimonial testimonial={featured} />}
							<TestimonialGrid>
								{interleaveByLength(rest).map((testimonial) => (
									<TestimonialCard key={testimonial.slug} testimonial={testimonial} showRating showCategory />
								))}
							</TestimonialGrid>
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
