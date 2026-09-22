import { ArrowRight, Quotes } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { ApplicationHub } from "@/components/application-hub";
import { JsonLd } from "@/components/json-ld";
import { SectionEdge } from "@/components/section-edge";
import { getEvents, getPublishedTestimonials } from "@/lib/db";
import { publicName } from "@/lib/names";
import { documentedPastEvents, toPastEvent } from "@/lib/past-events";
import { breadcrumbSchema, pageMetadata } from "@/lib/site";

/**
 * Every page that reads the database regenerates on this interval. The admin's
 * save actions still call revalidatePath for an immediate refresh; this is the
 * floor, so a change made any other way — a direct edit, a seed correction —
 * appears without waiting for a deploy.
 */
export const revalidate = 600;

export const metadata = pageMetadata({
	title: "Apply for a Veteran or Gold Star Outdoor Program",
	description: "Choose the Veteran's Outdoor Therapy application for previously deployed Veterans, Gold Star families, volunteers, hosts, or fundraisers.",
	path: "/application",
});

export default async function ApplicationPage() {
	const today = new Date().toISOString().slice(0, 10);
	const [events, testimonials] = await Promise.all([getEvents(), getPublishedTestimonials()]);
	const pastEvents = [
		...events.filter((event) => event.published && (event.over || event.endDate < today)).map(toPastEvent),
		...documentedPastEvents,
	]
		.sort((a, b) => b.sortDate.localeCompare(a.sortDate))
		.slice(0, 3);
	// Short quotes only: these sit three across, so a long one would tower over its neighbors.
	const voices = testimonials.filter((testimonial) => testimonial.quote.length <= 320).slice(0, 3);

	return (
		<>
			<JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Applications", path: "/application" }])} />
			<ApplicationHub />

			{pastEvents.length > 0 && (
				<section className="section past-events-section has-edge">
					<div className="container">
						<p className="eyebrow">What you are applying to join</p>
						<h2 className="display section-title">Recent time in the field.</h2>
						<div className="past-events-grid">
							{pastEvents.map((event) => (
								<article key={`${event.title}-${event.sortDate}`}>
									<div className="past-event-image">
										<Image src={event.image} alt={event.imageAlt ?? `${event.title}, ${event.date}`} fill sizes="(max-width: 700px) 100vw, 33vw" />
									</div>
									<p className="eyebrow">{event.type}</p>
									<h3 className="display">{event.title}</h3>
									<strong>{event.date}{event.location ? ` | ${event.location}` : ""}</strong>
									<p>{event.summary}</p>
									{event.href && <Link className="text-link" href={event.href}>View event details</Link>}
								</article>
							))}
						</div>
						<div className="link-row">
							<div className="link-row-actions">
								<Link className="button secondary" href="/events">See the events</Link>
								<Link className="button secondary" href="/field-stories">Read stories from the field</Link>
							</div>
						</div>
					</div>
					<SectionEdge color="#efece1" variant="b" />
				</section>
			)}

			{voices.length > 0 && (
				<section className="voices-band has-edge">
					<div className="container">
						<div className="voices-head">
							<p className="eyebrow">From Veterans who went</p>
							<h2 className="display section-title">Before you decide, hear from them.</h2>
						</div>
						<div className="voices-grid">
							{voices.map((testimonial) => (
								<figure key={testimonial.slug}>
									<Quotes size={30} weight="fill" className="quote-icon" aria-hidden="true" />
									<blockquote>{testimonial.quote}</blockquote>
									<figcaption>
										{publicName(testimonial.author)}
										<span>{testimonial.service}</span>
									</figcaption>
								</figure>
							))}
						</div>
						<Link className="text-link" href="/testimonials">Read more testimonials <ArrowRight size={17} /></Link>
					</div>
				</section>
			)}
		</>
	);
}
