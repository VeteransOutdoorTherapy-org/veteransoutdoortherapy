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
	galleryTag?: string;
	photos?: { src: string; alt: string }[];
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
		galleryTag: "horseback",
		photos: [
			{ src: `${uploads}/2026/09/horseback/horseback-01.jpg`, alt: "Female Veterans with a horse at Coulter Lake Guest Ranch" },
			{ src: `${uploads}/2026/09/horseback/horseback-02.jpg`, alt: "Female Veteran horseback riding at Coulter Lake Guest Ranch" },
			{ src: `${uploads}/2026/09/horseback/horseback-03.jpg`, alt: "Female Veteran horseback riding at Coulter Lake Guest Ranch" },
			{ src: `${uploads}/2026/09/horseback/horseback-04.jpg`, alt: "Female Veteran horseback riding at Coulter Lake Guest Ranch" },
			{ src: `${uploads}/2026/09/horseback/horseback-05.jpg`, alt: "Female Veteran horseback riding at Coulter Lake Guest Ranch" },
			{ src: `${uploads}/2026/09/horseback/horseback-06.jpg`, alt: "Female Veterans grooming a horse at Coulter Lake Guest Ranch" },
			{ src: `${uploads}/2026/09/horseback/horseback-07.jpg`, alt: "Female Veteran horseback riding at Coulter Lake Guest Ranch" },
			{ src: `${uploads}/2026/09/horseback/horseback-08.jpg`, alt: "Female Veterans hiking at Rifle Falls State Park" },
			{ src: `${uploads}/2026/09/horseback/horseback-09.jpg`, alt: "Female Veteran horseback riding at Coulter Lake Guest Ranch" },
			{ src: `${uploads}/2026/09/horseback/horseback-10.jpg`, alt: "Female Veterans off-roading at Coulter Lake Guest Ranch" },
		],
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
	{
		slug: "white-river-fly-fishing-2026",
		title: "Veterans Learn to Fly Fish on the White River",
		date: "August 28-31, 2026",
		datePublished: "2026-08-31",
		location: "Rainbow Drive Resort, White River, Arkansas",
		summary:
			"Veterans from Georgia and Missouri spent four days on Arkansas's White River learning to fly fish, guided by an Army Veteran instructor.",
		image: `${uploads}/2026/09/white-river-fly-fishing.jpg`,
		imageAlt: "Veteran holding a trout caught while fly fishing on the White River",
		body: [
			"Veterans from Georgia and Missouri spent four days on Arkansas's White River learning to fly fish in August 2026.",
			"Army Veteran Stan, owner of Tat2flyfisher Guide Services, spent an afternoon teaching the group the basics of fly casting before they waded into the river.",
			"Stories were told, memories were made, and healing was in the air as the group found the fish, and maybe a new hobby, in the outdoors.",
			"Rainbow Drive Resort arranged an experienced guide for the trip, and Natural State Fly Shop supplied wader rentals for the group.",
		],
		facebookLinks: [
			{
				href: "https://www.facebook.com/permalink.php?story_fbid=pfbid037CoZVJ75arJBLhZuPVqsk88m3mdJcX7UftjjhYNPR4ErzBQR72jXZdJxceMaUXfVl&id=61573994307519",
				label: "Read the fly-fishing lesson post on Facebook",
			},
			{
				href: "https://www.facebook.com/permalink.php?story_fbid=pfbid02kwhiWbA6Ky1ZCPywcFXsdFybkEc6LpaA1iQMCyipNsCFxny57JRgJwja9qnibMh4l&id=61573994307519",
				label: "Read the trip recap on Facebook",
			},
		],
		galleryTag: "fishing",
		photos: [
			{ src: `${uploads}/2026/09/fishing/fishing-06.jpg`, alt: "Veteran learning to fly fish on the White River" },
			{ src: `${uploads}/2026/09/fishing/fishing-07.jpg`, alt: "Veterans fly fishing on the White River" },
			{ src: `${uploads}/2026/09/fishing/fishing-08.jpg`, alt: "Veterans fly fishing on the White River" },
			{ src: `${uploads}/2026/09/fishing/fishing-09.jpg`, alt: "Veteran fly fishing on the White River" },
			{ src: `${uploads}/2026/09/fishing/fishing-01.jpg`, alt: "Veteran holding a trout caught on the White River" },
			{ src: `${uploads}/2026/09/fishing/fishing-02.jpg`, alt: "Veteran fly fishing on the White River" },
			{ src: `${uploads}/2026/09/fishing/fishing-03.jpg`, alt: "Veteran holding a trout caught on the White River" },
			{ src: `${uploads}/2026/09/fishing/fishing-04.jpg`, alt: "Veterans fly fishing on the White River at dusk" },
			{ src: `${uploads}/2026/09/fishing/fishing-05.jpg`, alt: "Veterans gathered for dinner after fly fishing on the White River" },
		],
		programHref: "/programs",
		programLabel: "Explore outdoor programs",
	},
];

export function getFieldStory(slug: string) {
	return fieldStories.find((story) => story.slug === slug);
}
