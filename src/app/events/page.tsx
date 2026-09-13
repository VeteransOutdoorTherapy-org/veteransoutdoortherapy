import Image from "next/image";
import Link from "next/link";
import { MissionFilm } from "@/components/mission-film";
import { getEvents } from "@/lib/db";
import { documentedPastEvents, type PastEvent } from "@/lib/past-events";
import { pageMetadata } from "@/lib/site";
import { HeroCollage } from "@/components/hero-collage";

export const metadata = pageMetadata({
	title: "Veteran Outdoor Events: Upcoming and Past",
	description: "View upcoming Veteran hunts and outdoor experiences, plus a growing archive of past trips, fundraisers, camps, hikes, and community events.",
	path: "/events",
});

export default async function EventsPage() {
	const events = (await getEvents())
		.filter((event) => event.published)
		.sort((a, b) => a.sortOrder - b.sortOrder);
	const today = new Date().toISOString().slice(0, 10);
	const upcomingEvents = events.filter((event) => !event.over && event.endDate >= today);
	const completedEvents: PastEvent[] = events
		.filter((event) => event.over || event.endDate < today)
		.map((event) => ({
			title: event.title,
			date: event.date,
			sortDate: event.endDate,
			type: event.type,
			location: event.location,
			summary: event.summary,
			image: event.image,
			href: `/events/${event.slug}`,
			recapUrl: event.recapUrl,
		}));
	const pastEvents = [...completedEvents, ...documentedPastEvents].sort((a, b) => b.sortDate.localeCompare(a.sortDate));

	return (
		<>
			<section className="page-hero">
				<HeroCollage seed={2} />
				<div className="container">
					<p className="eyebrow">Field calendar and event archive</p>
					<h1 className="display">Upcoming Veteran hunts and outdoor experiences.</h1>
					<p>Every trip is built around connection, challenge, and the quiet that only open country can provide.</p>
				</div>
			</section>
			<section className="section">
				<div className="container adventure-list">
					{upcomingEvents.map((event, index) => (
						<article key={event.slug}>
							<div className="adventure-image">
								<Image src={event.image} alt={event.title} fill sizes="(max-width: 760px) 100vw, 45vw" />
							</div>
							<div>
								<span className="event-number">0{index + 1}</span>
								<p className="eyebrow">{event.type}</p>
								<h2 className="display">{event.title}</h2>
								<strong>{event.date}</strong>
								<p>{event.summary}</p>
								<Link className="button" href={`/events/${event.slug}`}>
									View event details
								</Link>
							</div>
						</article>
					))}
					{upcomingEvents.length === 0 && <p className="prose">New experiences are being planned. Check back for the next field opportunity.</p>}
				</div>
			</section>
			<section className="section past-events-section">
				<div className="container">
					<p className="eyebrow">Where we have been</p>
					<h2 className="display section-title">Past events.</h2>
					<p className="prose past-events-intro">A growing record of the hunts, fishing trips, rides, hikes, camps, and community events that have carried the mission forward.</p>
					<div className="past-events-grid">
						{pastEvents.map((event) => (
							<article key={`${event.title}-${event.sortDate}`}>
								<div className="past-event-image"><Image src={event.image} alt={event.imageAlt ?? `${event.title}, ${event.date}`} fill sizes="(max-width: 700px) 100vw, 33vw" /></div>
								<p className="eyebrow">{event.type}</p>
								<h3 className="display">{event.title}</h3>
								<strong>{event.date}{event.location ? ` | ${event.location}` : ""}</strong>
								<p>{event.summary}</p>
								{event.href && <Link className="text-link" href={event.href}>View event details</Link>}
								{event.recapUrl && <a className="text-link" href={event.recapUrl} target="_blank" rel="noreferrer">View Facebook recap</a>}
							</article>
						))}
					</div>
				</div>
			</section>
			<MissionFilm />
		</>
	);
}
