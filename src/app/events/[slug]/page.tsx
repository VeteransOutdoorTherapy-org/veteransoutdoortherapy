import { ArrowRight, CalendarDots, MapPin } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { events as seedEvents } from "@/lib/data";
import { getEvent, getEvents } from "@/lib/db";
import { absoluteUrl, breadcrumbSchema, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/site";
import { imageFocusStyle } from "@/lib/data";
import { SectionEdge } from "@/components/section-edge";

export function generateStaticParams() {
	return seedEvents.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	const event = await getEvent(slug);
	if (!event || !event.published) return {};
	return pageMetadata({
		title: `${event.title}: ${event.type}`,
		description: `${event.summary} ${event.date} at ${event.location}.`,
		path: `/events/${event.slug}`,
		image: event.image,
	});
}

/**
 * Finished events to show under this one: earlier runs of the same event first,
 * since a hunt that repeats every year is what a visitor most wants to see, then
 * other recent trips to fill the row.
 */
async function pastEvents(current: { slug: string; title: string }) {
	const today = new Date().toISOString().slice(0, 10);
	const finished = (await getEvents())
		.filter((event) => event.published && event.slug !== current.slug && (event.over || event.endDate < today))
		.sort((a, b) => b.endDate.localeCompare(a.endDate));
	const sameEvent = finished.filter((event) => event.title === current.title);
	const others = finished.filter((event) => event.title !== current.title);
	return [...sameEvent, ...others].slice(0, 3);
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const event = await getEvent(slug);
	if (!event || !event.published) notFound();
	const path = `/events/${event.slug}`;
	const eventIsOver = event.over || new Date(event.endDate) < new Date();
	const previous = await pastEvents(event);
	const eventSchema = {
		"@context": "https://schema.org",
		"@type": "Event",
		name: `${event.title}: ${event.type}`,
		description: event.summary,
		startDate: event.startDate,
		endDate: event.endDate,
		eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
		eventStatus: eventIsOver ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled",
		image: [event.image],
		url: absoluteUrl(path),
		location: { "@type": "Place", name: event.location },
		audience: { "@type": "Audience", audienceType: "Previously deployed Veterans and Gold Star families" },
		organizer: { "@id": `${SITE_URL}/#organization`, "@type": "Organization", name: SITE_NAME, url: SITE_URL },
		...(!eventIsOver && event.template === "adventure" && {
			offers: { "@type": "Offer", price: 0, priceCurrency: "USD", url: absoluteUrl(event.ctaHref), availability: "https://schema.org/LimitedAvailability" },
		}),
	};

	return (
		<>
			<JsonLd data={[
				breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Events", path: "/events" }, { name: event.title, path }]),
				eventSchema,
			]} />
			<section className={`event-page-hero has-edge ${event.template}`}>
				<div className="container event-page-hero-grid">
					<div>
						<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Events", href: "/events" }, { label: event.title }]} />
						<p className="eyebrow">{event.type}</p>
						<h1 className="display">{event.title}</h1>
						<p className="event-hero-message">{event.heroTitle}</p>
						<p>{event.summary}</p>
						<div className="event-meta">
							<span>
								<CalendarDots size={18} /> {event.date}
							</span>
							<span>
								<MapPin size={18} /> {event.location}
							</span>
						</div>
						{eventIsOver && event.recapUrl ? (
							<a className="button orange" href={event.recapUrl} target="_blank" rel="noreferrer">View event recap</a>
						) : (
							<Link className="button orange" href={eventIsOver ? "/donate" : event.ctaHref}>
								{eventIsOver ? "Support future events" : event.ctaLabel}
							</Link>
						)}
					</div>
					<div className="event-page-image" style={imageFocusStyle(event)}>
						<Image src={event.image} alt={event.title} fill priority sizes="(max-width: 800px) 100vw, 48vw" />
					</div>
				</div>
				<SectionEdge color="var(--paper)" variant="b" />
			</section>
			<section className="section event-page-content">
				<div className="container event-page-sections">
					<article>
						<p className="eyebrow">{event.title}</p>
						<h2 className="display">{event.overviewTitle}</h2>
						<p>{event.overview}</p>
					</article>
					<article>
						<h2 className="display">{event.detailsTitle}</h2>
						<p>{event.details}</p>
					</article>
				</div>
			</section>
			{previous.length > 0 && (
				<section className="section past-events-section event-past has-edge">
					<div className="container">
						<p className="eyebrow">Already in the books</p>
						<h2 className="display section-title">Where we have been.</h2>
						<div className="past-events-grid">
							{previous.map((past) => (
								<article key={past.slug}>
									<div className="past-event-image" style={imageFocusStyle(past)}>
										<Image src={past.image} alt={past.title} fill sizes="(max-width: 700px) 100vw, 33vw" />
									</div>
									<p className="eyebrow">{past.type}</p>
									<h3 className="display">{past.title}</h3>
									<strong>{past.date}{past.location ? ` | ${past.location}` : ""}</strong>
									<p>{past.summary}</p>
									<div className="card-actions">
										<Link className="text-link" href={`/events/${past.slug}`}>
											View event details <ArrowRight size={17} />
										</Link>
									</div>
								</article>
							))}
						</div>
					</div>
					<SectionEdge color="#e4e6df" variant="a" />
				</section>
			)}
			{/* The title is already the h1 and the summary is already in the hero, so this
			    band carries the action and nothing else. */}
			<section className="giving-band light event-cta-band">
				<div className="container">
					<h2 className="display">{eventIsOver ? "This one is in the books." : "Take a place on this trip."}</h2>
					{eventIsOver && event.recapUrl ? (
						<a className="button orange" href={event.recapUrl} target="_blank" rel="noreferrer">View event recap</a>
					) : (
						<Link className="button orange" href={eventIsOver ? "/donate" : event.ctaHref}>
							{eventIsOver ? "Support future events" : event.ctaLabel}
						</Link>
					)}
				</div>
			</section>
		</>
	);
}
