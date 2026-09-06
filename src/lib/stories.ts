const uploads = "https://veteransoutdoortherapy.org/wp-content/uploads";

export type FieldStory = {
	slug: string;
	title: string;
	date: string;
	datePublished: string;
	location: string;
	summary: string;
	image: string;
	imageAlt: string;
	body: string[];
	video?: { url: string; title: string };
	facebookLinks?: { href: string; label: string }[];
	reviewCategory?: string;
	programHref: string;
	programLabel: string;
};

export const fieldStories: FieldStory[] = [
	{
		slug: "coulter-lake-female-veteran-horseback-adventure-2026",
		title: "Female Veterans Gather at Coulter Lake Guest Ranch",
		date: "July 8-12, 2026",
		datePublished: "2026-07-12",
		location: "Coulter Lake Guest Ranch, Rifle, Colorado",
		summary:
			"The first annual Coulter Lake Guest Ranch Horseback Riding Adventure welcomed female Veterans from four states for riding, shared meals, and time outdoors.",
		image: `${uploads}/2026/01/horseback.jpg`,
		imageAlt: "Horseback riding country at Coulter Lake Guest Ranch",
		body: [
			"Female Veterans traveled from Alabama, Wisconsin, South Dakota, and Missouri for the first annual Coulter Lake Guest Ranch Horseback Riding Adventure in Rifle, Colorado, in July 2026.",
			"Kelly and Forest Keith, Dina, and Maru welcomed the group to the ranch for horseback riding, shared meals, open country, and time with other Veterans.",
			"The Military Order of the Purple Heart helped fund the experience during Veteran's Outdoor Therapy's first year.",
			"Over the following days, the group covered basic grooming, tacking, round pen work, and beginning riding practices with Connie Stone as their Equine Therapy Instructor, along with off-roading and a hike through Rifle Falls State Park.",
			"Videographer Amanda Trudell captured the trip on film, and Veteran's Outdoor Therapy is grateful to every volunteer and donor whose generosity made the experience possible.",
		],
		video: {
			url: "https://www.youtube-nocookie.com/embed/lDsib0mkSAM",
			title: "Healing through Horses - Veteran's Outdoor Therapy",
		},
		facebookLinks: [
			{ href: "https://www.facebook.com/share/p/1Fzt4iftJn/", label: "Read the arrival post on Facebook" },
			{ href: "https://www.facebook.com/share/p/19L9J99nGh/", label: "Read the mid-week update on Facebook" },
			{ href: "https://www.facebook.com/share/v/1JWQBKDUvb/", label: "Watch the recap video on Facebook" },
		],
		reviewCategory: "Horseback",
		programHref: "/programs",
		programLabel: "Explore outdoor programs",
	},
	{
		slug: "second-annual-poker-run-2026",
		title: "Riders Rally for the Second Annual Poker Run",
		date: "June 20, 2026",
		datePublished: "2026-06-20",
		location: "Columbia, Missouri",
		summary:
			"Volunteers, sponsors, participants, and riders came together for the second annual Poker Run supporting Veteran's Outdoor Therapy programs.",
		image: `${uploads}/events/poker-run.webp`,
		imageAlt: "Motorcycles gathered for the Veteran's Outdoor Therapy Poker Run",
		body: [
			"The second annual Poker Run brought riders, volunteers, sponsors, and participants together in Columbia, Missouri, on June 20, 2026.",
			"The community fundraiser supported the outdoor program work behind Veteran hunts, fishing trips, horseback riding experiences, and other time in the field.",
			"Volunteer effort and local partnerships made the day possible. The event is one example of how supporters can contribute their time, networks, and event experience as well as financial support.",
		],
		programHref: "/fundraising-application",
		programLabel: "Volunteer or host an event",
	},
];

export function getFieldStory(slug: string) {
	return fieldStories.find((story) => story.slug === slug);
}
