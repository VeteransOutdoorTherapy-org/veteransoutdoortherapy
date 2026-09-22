import { ArrowRight, CalendarDots, MapPin } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { events as seedEvents } from "@/lib/data";
import { getEvent, getEvents, getFieldStories } from "@/lib/db";
import { absoluteUrl, breadcrumbSchema, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/site";
import { imageFocusStyle } from "@/lib/data";
import { SectionEdge } from "@/components/section-edge";
import { storyForEvent } from "@/lib/past-events";

/**
 * Every page that reads the database regenerates on this interval. The admin's
 * save actions still call revalidatePath for an immediate refresh; this is the
 * floor, so a change made any other way — a direct edit, a seed correction —
 * appears without waiting for a deploy.
 */
export const revalidate = 600;

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
	const [events, stories] = await Promise.all([getEvents(), getFieldStories()]);
	const finished = events
		.filter((event) => event.published && event.slug !== current.slug && (event.over || event.endDate < today))
		.sort((a, b) => b.endDate.localeCompare(a.endDate));
	const sameEvent = finished.filter((event) => event.title === current.title);
	const others = finished.filter((event) => event.title !== current.title);
	const published = stories.filter((story) => story.published);
	return [...sameEvent, ...others].slice(0, 3).map((event) => ({ event, story: storyForEvent(event, published) }));
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const event = await getEvent(slug);
	if (!event || !event.published) notFound();
	const path = `/events/${event.slug}`;
	const eventIsOver = event.over || new Date(event.endDate) < new Date();
	const previous = await pastEvents(event);
	// Applications close a month out. Between that point and the end of the trip
	// there is nothing to ask for, so the closing band stays away entirely.
	const closing = new Date();
	closing.setMonth(closing.getMonth() + 1);
	const applicationsOpen = !eventIsOver && event.startDate > closing.toISOString().slice(0, 10);
	const ownStory = eventIsOver ? storyForEvent(event, (await getFieldStories()).filter((story) => story.published)) : undefined;
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
							{previous.map(({ event: past, story }) => (
								<article key={past.slug}>
									<div className="past-event-image" style={imageFocusStyle(past)}>
										<Image src={past.image} alt={past.title} fill sizes="(max-width: 700px) 100vw, 33vw" />
									</div>
									<p className="eyebrow">{past.type}</p>
									<h3 className="display">{past.title}</h3>
									<strong>{past.date}{past.location ? ` | ${past.location}` : ""}</strong>
									<p>{past.summary}</p>
									<div className="card-actions">
										{story && (
											<Link className="text-link" href={`/field-stories/${story.slug}`}>
												Read the field note <ArrowRight size={17} />
											</Link>
										)}
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
			{(eventIsOver || applicationsOpen) && (
				<section className="giving-band light event-cta-band">
					<div className="container">
						<h2 className="display">{eventIsOver ? "How this one went." : "Take a place on this trip."}</h2>
						{/* A finished event sends you to its write-up, then its recap; only one that
						    is still taking applications carries the apply wording. */}
						{eventIsOver ? (
							ownStory ? (
								<Link className="button orange" href={`/field-stories/${ownStory.slug}`}>Read the field note</Link>
							) : event.recapUrl ? (
								<a className="button orange" href={event.recapUrl} target="_blank" rel="noreferrer">View event recap</a>
							) : (
								<Link className="button orange" href="/field-stories">Read stories from the field</Link>
							)
						) : (
							<Link className="button orange" href={event.ctaHref}>{event.ctaLabel}</Link>
						)}
					</div>
				</section>
			)}
		</>
	);
}
