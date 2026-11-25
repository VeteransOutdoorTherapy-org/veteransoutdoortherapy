// Shared by the Share your story form (client) and its API route (server).

export const SERVICE_BRANCHES = [
	"Army",
	"Navy",
	"Air Force",
	"Marine Corps",
	"Coast Guard",
	"Space Force",
	"Army National Guard",
	"Air National Guard",
	"Gold Star family member",
	"Volunteer or supporter",
] as const;

export type EventOption = { value: string; label: string };

export const GENERAL_EVENT = "general";

/** Trips that have already happened, newest first, for the "Which event?" select. */
export function pastEventOptions(
	events: { slug: string; title: string; startDate: string; endDate: string; published: boolean; over?: boolean }[],
	today = new Date().toISOString().slice(0, 10),
): EventOption[] {
	return events
		.filter((event) => event.published && (event.over || event.endDate < today))
		.sort((a, b) => b.startDate.localeCompare(a.startDate))
		.map((event) => ({ value: event.slug, label: `${event.title} (${event.startDate.slice(0, 4)})` }));
}

/**
 * The testimonial category the public pages filter on, guessed from the event's
 * title. The admin can change it before publishing.
 */
export function categoryForEvent(title: string | undefined) {
	if (!title) return "General";
	if (/horse|ranch/i.test(title)) return "Horseback";
	if (/snag|paddlefish/i.test(title)) return "Snagging";
	if (/turkey/i.test(title)) return "Turkey Hunt";
	if (/antelope/i.test(title)) return "Antelope Hunt";
	if (/fish/i.test(title)) return "Fishing";
	if (/hunt/i.test(title)) return "Hunting";
	return "General";
}
