const uploads = "/wp-content/uploads";

export type PastEvent = {
	title: string;
	date: string;
	sortDate: string;
	type: string;
	location?: string;
	summary: string;
	image: string;
	imageAlt?: string;
	href?: string;
	recapUrl?: string;
	/** Style carrying the admin's focus choice, for archive entries built from an event record. */
	focus?: Record<string, string>;
};

import { imageFocusStyle, type Event } from "./data";

/** A finished event, rendered the same way as the hand-written archive entries below. */
export function toPastEvent(event: Event): PastEvent {
	return {
		title: event.title,
		date: event.date,
		sortDate: event.endDate,
		type: event.type,
		location: event.location,
		summary: event.summary,
		image: event.image,
		focus: imageFocusStyle(event),
		href: `/events/${event.slug}`,
		recapUrl: event.recapUrl,
	};
}

export const documentedPastEvents: PastEvent[] = [
	{
		title: "Wilderness to Wellness Dinner Banquet",
		date: "March 13, 2026",
		sortDate: "2026-03-13",
		type: "Benefit dinner",
		summary: "A sold-out evening centered on service, community, stories, and support for outdoor programs.",
		image: `${uploads}/2025/09/photo-049.jpg`,
		href: "/wilderness-to-wellness",
		recapUrl: "https://www.facebook.com/share/p/18jSBLgpCR/",
	},
	{
		title: "2026 Annual Gun Raffle",
		date: "March 13, 2026",
		sortDate: "2026-03-13",
		type: "Fundraiser",
		summary: "The annual benefit raffle concluded with its drawing during the Wilderness to Wellness event.",
		image: `${uploads}/2025/09/photo-134.png`,
		href: "/2026-gun-raffle",
	},
	{
		title: "Missouri Snagging Spoonbill",
		date: "March 20-22, 2026",
		sortDate: "2026-03-20",
		type: "Fishing",
		location: "Missouri",
		summary: "A multi-day Missouri spoonbill fishing experience for Veterans in the field together.",
		image: `${uploads}/2026/09/snagging/catch-01.jpg`,
		recapUrl: "https://www.facebook.com/share/p/17xSyoKzX4/",
	},
	{
		title: "Larry's Arizona Elk Hunt",
		date: "November 2025",
		sortDate: "2025-11-20",
		type: "Elk hunt",
		location: "Arizona",
		summary: "Larry encountered cow elk at close range while the group searched for a bull; the trip remained a meaningful time among friends despite difficult weather.",
		image: `${uploads}/2026/01/photo-146.jpeg`,
		imageAlt: "Veteran on Larry's Arizona Elk Hunt",
		recapUrl: "https://www.facebook.com/share/p/19Z3SwTEUq/",
	},
	{
		title: "Antelope Hunt",
		date: "September 2025",
		sortDate: "2025-09-01",
		type: "Hunt",
		summary: "A supported antelope hunt built around time in open country and connection with fellow Veterans.",
		image: `${uploads}/2025/09/photo-130.jpg`,
		imageAlt: "Veteran with a harvested antelope in open country",
	},
	{
		title: "Gold Star Peak Hike",
		date: "June 2025",
		sortDate: "2025-06-01",
		type: "Hiking",
		summary: "A shared mountain experience honoring service, sacrifice, and Gold Star families.",
		image: `${uploads}/2025/09/photo-035.jpg`,
		imageAlt: "Gold Star Peak Hike",
	},
	{
		title: "Poker Run",
		date: "June 2025",
		sortDate: "2025-06-01",
		type: "Fundraiser",
		summary: "Riders and community supporters gathered to help fund outdoor experiences for Veterans and Gold Star families.",
		image: `${uploads}/events/poker-run.webp`,
	},
	{
		title: "Spoonbill Fishing Adventure",
		date: "March 2025",
		sortDate: "2025-03-01",
		type: "Fishing",
		summary: "Veterans gathered for a Missouri spoonbill fishing adventure and time together on the water.",
		image: `${uploads}/2025/09/photo-012.jpg`,
	},
];

/**
 * The field note written up after an event, where one exists.
 *
 * Events and stories are separate records with no foreign key, and their slugs
 * only sometimes agree (poker-run-2026 was written up as
 * second-annual-poker-run-2026). A story is published within a few days of the
 * trip it covers, so the date window is what reliably ties the two together.
 */
export function storyForEvent(
	event: { slug: string; startDate: string; endDate: string },
	stories: { slug: string; datePublished: string }[],
) {
	const exact = stories.find((story) => story.slug === event.slug);
	if (exact) return exact;
	const opens = event.startDate;
	const closes = new Date(`${event.endDate}T00:00:00Z`);
	closes.setUTCDate(closes.getUTCDate() + 14);
	const shuts = closes.toISOString().slice(0, 10);
	return stories.find((story) => story.datePublished >= opens && story.datePublished <= shuts);
}
