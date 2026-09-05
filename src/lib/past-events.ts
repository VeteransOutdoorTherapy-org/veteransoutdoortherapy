const uploads = "https://veteransoutdoortherapy.org/wp-content/uploads";

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
};

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
		image: `${uploads}/2025/09/photo-023.jpg`,
		recapUrl: "https://www.facebook.com/share/p/17xSyoKzX4/",
	},
	{
		title: "Larry's Arizona Elk Hunt",
		date: "November 2025",
		sortDate: "2025-11-20",
		type: "Elk hunt",
		location: "Arizona",
		summary: "Larry encountered cow elk at close range while the group searched for a bull; the trip remained a meaningful time among friends despite difficult weather.",
		image: `${uploads}/2025/10/AdobeStock_761949620-scaled.jpeg`,
		imageAlt: "Elk at sunset representing Larry's Arizona Elk Hunt",
		recapUrl: "https://www.facebook.com/share/p/19Z3SwTEUq/",
	},
	{
		title: "Antelope Hunt",
		date: "September 2025",
		sortDate: "2025-09-01",
		type: "Hunt",
		summary: "A supported antelope hunt built around time in open country and connection with fellow Veterans.",
		image: `${uploads}/2025/09/552154529_122157952622799810_7348700458735825128_n.jpg`,
	},
	{
		title: "Gold Star Peak Hike",
		date: "June 2025",
		sortDate: "2025-06-01",
		type: "Hiking",
		summary: "A shared mountain experience honoring service, sacrifice, and Gold Star families.",
		image: `${uploads}/2025/09/510943338_122138281850799810_4751360453603558598_n-980x575.jpg`,
	},
	{
		title: "Poker Run",
		date: "May-June 2025",
		sortDate: "2025-05-01",
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
