export type Product = {
	slug: string;
	name: string;
	shortName: string;
	price: number;
	category: string;
	description: string;
	image: string;
	gallery: string[];
	sizes?: string[];
	stock?: number;
	featured?: boolean;
};

const uploads = "/wp-content/uploads";

export const products: Product[] = [
	{
		slug: "veterans-outdoor-therapy-camo-hoodie-veteran-outdoor-apparel",
		name: "Veteran's Outdoor Therapy Camo Hoodie",
		shortName: "Camo Hoodie",
		price: 30,
		category: "Merchandise",
		description:
			"A warm, comfortable camouflage hoodie built for those who find clarity, strength, and healing in the wild. Soft midweight fleece, an adjustable hood, and a front kangaroo pocket make it ready for cool mornings and nights by the fire.",
		image: `${uploads}/products/camo-hoodie.jpg`,
		gallery: [`${uploads}/products/camo-hoodie.jpg`],
		sizes: ["S", "M", "L", "XL", "XXL"],
		featured: true,
	},
	{
		slug: "veterans-outdoor-therapy-performance-t-shirt-gray-orange",
		name: "Veteran's Outdoor Therapy Performance T-Shirt",
		shortName: "Performance T-Shirt",
		price: 40,
		category: "Merchandise",
		description:
			"A lightweight, moisture-wicking performance shirt with a breathable gray body and blaze-orange accents, designed for hikes, workouts, range days, and time in the field.",
		image: `${uploads}/products/performance-t-shirt.jpg`,
		gallery: [`${uploads}/products/performance-t-shirt.jpg`],
		sizes: ["S", "M", "L", "XL", "XXL"],
		featured: true,
	},
	{
		slug: "veterans-outdoor-therapy-pullover-hoodie-gray-hoodie",
		name: "Veteran's Outdoor Therapy Pullover Hoodie - Gray",
		shortName: "Gray Pullover Hoodie",
		price: 30,
		category: "Merchandise",
		description:
			"A soft gray pullover with an adjustable hood, kangaroo pocket, ribbed cuffs, and the Veteran's Outdoor Therapy mark on the chest.",
		image: `${uploads}/products/pullover-hoodie-gray.jpg`,
		gallery: [`${uploads}/products/pullover-hoodie-gray.jpg`],
		sizes: ["S", "M", "L", "XL", "XXL"],
	},
	{
		slug: "veterans-outdoor-therapy-pullover-hoodie-maroon-hoodie",
		name: "Veteran's Outdoor Therapy Pullover Hoodie - Maroon",
		shortName: "Maroon Pullover Hoodie",
		price: 30,
		category: "Merchandise",
		description:
			"A comfortable maroon pullover hoodie made for camp, evenings by the fire, and everyday support of the mission.",
		image: `${uploads}/products/pullover-hoodie-maroon.jpg`,
		gallery: [`${uploads}/products/pullover-hoodie-maroon.jpg`],
		sizes: ["S", "M", "L", "XL", "XXL"],
	},
	{
		slug: "veterans-outdoor-therapy-pullover-hoodie-tan-hoodie",
		name: "Veteran's Outdoor Therapy Pullover Hoodie - Tan",
		shortName: "Tan Pullover Hoodie",
		price: 30,
		category: "Merchandise",
		description:
			"A comfortable tan pullover hoodie featuring the Veteran's Outdoor Therapy logo, an adjustable hood, and a classic kangaroo pocket.",
		image: `${uploads}/products/pullover-hoodie-tan.webp`,
		gallery: [`${uploads}/products/pullover-hoodie-tan.webp`],
		sizes: ["S", "M", "L", "XL", "XXL"],
	},
	{
		slug: "veterans-outdoor-therapy-t-shirt-nature-inspired-veteran-apparel",
		name: "Veteran's Outdoor Therapy T-Shirt - Sage",
		shortName: "Sage Mission T-Shirt",
		price: 25,
		category: "Merchandise",
		description:
			"A soft sage-green unisex tee where mountains, wildlife, and open air symbolize healing, resilience, and purpose.",
		image: `${uploads}/products/t-shirt-sage.webp`,
		gallery: [`${uploads}/products/t-shirt-sage.webp`],
		sizes: ["S", "M", "L", "XL", "XXL"],
	},
	{
		slug: "veterans-outdoor-therapy-t-shirt-nature-inspired-veteran-apparel-burnt-orange",
		name: "Veteran's Outdoor Therapy T-Shirt - Burnt Orange",
		shortName: "Orange Mission T-Shirt",
		price: 25,
		category: "Merchandise",
		description:
			"A soft burnt-orange unisex tee with a durable nature-inspired mark, made for the trail, campfire, or everyday wear.",
		image: `${uploads}/products/t-shirt-orange.webp`,
		gallery: [`${uploads}/products/t-shirt-orange.webp`],
		sizes: ["S", "M", "L", "XL", "XXL"],
	},
	{
		slug: "veterans-outdoor-therapy-turkey-mug-ceramic-coffee-mug",
		name: "Veteran's Outdoor Therapy Turkey Mug",
		shortName: "Turkey Camp Mug",
		price: 25,
		category: "Merchandise",
		description:
			"A durable ceramic mug with a bold orange handle and interior, the mission logo on one side, and detailed wild turkey artwork on the other.",
		image: `${uploads}/products/turkey-mug.webp`,
		gallery: [`${uploads}/products/turkey-mug.webp`],
		stock: 20,
	},
	{
		slug: "veterans-outdoor-therapy-two-tone-camo-hoodie-outdoor-veteran-apparel",
		name: "Veteran's Outdoor Therapy Two-Tone Camo Hoodie",
		shortName: "Two-Tone Camo Hoodie",
		price: 50,
		category: "Merchandise",
		description:
			"A premium tan hoodie with camouflage sleeves and hood, a relaxed unisex fit, and durable mission artwork.",
		image: `${uploads}/products/two-tone-camo-hoodie.jpg`,
		gallery: [`${uploads}/products/two-tone-camo-hoodie.jpg`],
		sizes: ["S", "M", "L", "XL", "XXL"],
		featured: true,
	},
	...[
		["custom-sponsor", "Custom Sponsor", 100],
		["bronze-sponsor", "Bronze Sponsor", 1000],
		["silver-sponsor", "Silver Sponsor", 3000],
		["gold-sponsor", "Gold Sponsor", 5000],
	].map(([slug, name, price]) => ({
		slug: String(slug),
		name: String(name),
		shortName: String(name),
		price: Number(price),
		category: "Sponsorships" as const,
		description:
			"Directly fund fully supported outdoor adventures that build connection, restore confidence, and create room for healing.",
		image: `${uploads}/2025/09/photo-069.jpg`,
		gallery: [`${uploads}/2025/09/photo-069.jpg`],
	})),
];

export type EventTemplate = "adventure" | "fundraiser";

export type Event = {
	slug: string;
	title: string;
	date: string;
	startDate: string;
	endDate: string;
	image: string;
	type: string;
	location: string;
	summary: string;
	heroTitle: string;
	overviewTitle: string;
	overview: string;
	detailsTitle: string;
	details: string;
	ctaLabel: string;
	ctaHref: string;
	template: EventTemplate;
	published: boolean;
	featured: boolean;
	over: boolean;
	recapUrl?: string;
	sortOrder: number;
};

const participantDetails =
	"Details and registration information are shared with selected participants. Travel, core gear, meals, and activities are funded by our donors and sponsors.";

export const events: Event[] = [
	{
		slug: "missouri-turkey-hunt-2026",
		title: "Missouri Turkey Hunt",
		date: "April 30 - May 3, 2026",
		startDate: "2026-04-30",
		endDate: "2026-05-03",
		image: `${uploads}/2026/01/turkey.jpg`,
		type: "Hunt",
		location: "Missouri",
		summary: "Four Veterans completed the inaugural Missouri turkey hunt, with every hunter tagging a bird and two harvesting their first toms.",
		heroTitle: "Find connection in the spring woods.",
		overviewTitle: "A shared hunt with a larger purpose.",
		overview: participantDetails,
		detailsTitle: "What participants can expect",
		details: "Veterans from Ohio, Nebraska, and Missouri joined local landowners, guides, volunteers, and community supporters for the hunt.",
		ctaLabel: "Apply for support",
		ctaHref: "/apply",
		template: "adventure",
		published: true,
		featured: true,
		over: true,
		recapUrl: "https://www.facebook.com/share/p/1BNHxQBuq1/",
		sortOrder: 1,
	},
	{
		slug: "flint-hills-kansas-turkey-hunt-2026",
		title: "Flint Hills, KS Turkey Hunt",
		date: "May 14 - May 17, 2026",
		startDate: "2026-05-14",
		endDate: "2026-05-17",
		image: `${uploads}/2026/01/turkey2.jpg`,
		type: "Hunt",
		location: "Flint Hills, Kansas",
		summary: "A fully funded turkey hunt in the Flint Hills centered on challenge, recovery, and community.",
		heroTitle: "Head into the Flint Hills together.",
		overviewTitle: "Open country. Shared purpose.",
		overview: participantDetails,
		detailsTitle: "What participants can expect",
		details: "Veterans from Texas and Kansas gathered in the Flint Hills, hosted by Forest, Jardine, and Dru.",
		ctaLabel: "Apply for support",
		ctaHref: "/apply",
		template: "adventure",
		published: true,
		featured: true,
		over: true,
		recapUrl: "https://www.facebook.com/share/p/18AbcbA7td/",
		sortOrder: 2,
	},
	{
		slug: "rocky-point-archery-antelope-hunt-2026",
		title: "Rocky Point Recreational Park",
		date: "September 16 - September 20, 2026",
		startDate: "2026-09-16",
		endDate: "2026-09-20",
		image: `${uploads}/2025/09/photo-130.jpg`,
		type: "Archery antelope hunt",
		location: "Rocky Point Recreational Park",
		summary: "An archery antelope hunt that creates space for challenge, reflection, and connection in open country.",
		heroTitle: "Take aim at a stronger connection.",
		overviewTitle: "Five days grounded in the outdoors.",
		overview: participantDetails,
		detailsTitle: "What participants can expect",
		details: "A supported archery experience, shared meals, and meaningful time with people who understand the journey.",
		ctaLabel: "Apply for support",
		ctaHref: "/apply",
		template: "adventure",
		published: true,
		featured: true,
		over: false,
		sortOrder: 3,
	},
	{
		slug: "coulter-lake-guest-ranch-2026",
		title: "Coulter Lake Guest Ranch",
		date: "July 8 - July 12, 2026",
		startDate: "2026-07-08",
		endDate: "2026-07-12",
		image: `${uploads}/2026/09/horseback/horseback-01.jpg`,
		type: "Female horseback camp",
		location: "Coulter Lake Guest Ranch, Rifle, Colorado",
		summary: "The first annual horseback riding adventure brought female Veterans from Alabama, Wisconsin, South Dakota, and Missouri together at Coulter Lake Guest Ranch.",
		heroTitle: "Ride into room to reconnect.",
		overviewTitle: "A supported ranch experience.",
		overview: participantDetails,
		detailsTitle: "What participants can expect",
		details: "Kelly and Forest Keith, Dina, and Maru hosted the group, with first-year funding support from the Military Order of the Purple Heart.",
		ctaLabel: "Apply for support",
		ctaHref: "/apply",
		template: "adventure",
		published: true,
		featured: false,
		over: true,
		recapUrl: "https://www.facebook.com/share/p/18y8SZtxbM/",
		sortOrder: 4,
	},
	{
		slug: "poker-run-2026",
		title: "Poker Run",
		date: "June 20, 2026",
		startDate: "2026-06-20",
		endDate: "2026-06-20",
		image: `${uploads}/events/poker-run.webp`,
		type: "Fundraiser",
		location: "Columbia, Missouri",
		summary: "Volunteers, sponsors, participants, and riders gathered for the second annual Poker Run, raising support for Veterans and Gold Star families.",
		heroTitle: "Ride with purpose.",
		overviewTitle: "Start and finish together.",
		overview: "The 2nd Annual Veteran's Outdoor Therapy Poker Run brought riders together for a powerful day supporting outdoor therapy programs.",
		detailsTitle: "Every mile funded recovery.",
		details: "Proceeds support fishing, hiking, camping, and hunting experiences that promote healing, camaraderie, and recovery.",
		ctaLabel: "Support the mission",
		ctaHref: "/donate",
		template: "fundraiser",
		published: true,
		featured: false,
		over: true,
		recapUrl: "https://www.facebook.com/share/p/1LZEGfVeTT/",
		sortOrder: 5,
	},
];

export const healingPowerCopy =
	"Engaging in activities such as hiking, horseback riding, fishing, and hunting offers a refreshing escape from daily life while creating opportunities for reflection and bonding with fellow Veterans who understand similar experiences and challenges. These adventures can alleviate stress and support the well-being of Soldiers and Gold Star family members. We love the outdoors, have witnessed the value of time outside, and are proud to share that passion with others.";

export const contributionCopy =
	"Not everyone can sponsor at the Gold, Silver, or Bronze level — and that’s okay. Every donation, big or small, helps us give Veterans a chance to heal through the peace of the outdoors. Whether your gift helps provide a warm meal on a hunt, fuel for a fishing trip, or gear for an adventure, you’re directly impacting the lives of those who’ve served our nation. Join us in showing our Veterans that they are never alone on their journey to healing.";

const galleryFiles = `
2025/09/photo-001.jpg
2025/09/photo-002.jpg
2025/09/photo-003.jpg
2025/09/photo-004.jpg
2025/09/photo-005.jpg
2025/09/photo-006.jpg
2025/09/photo-007.jpg
2025/09/photo-008.jpg
2025/09/photo-009.jpg
2025/09/photo-010.jpg
2025/09/photo-011.jpg
2025/09/photo-012.jpg
2025/09/photo-013.jpg
2025/09/photo-014.jpg
2025/09/photo-015.jpg
2025/09/photo-016.jpg
2025/09/photo-017.jpg
2025/09/photo-018.jpg
2025/09/photo-019.jpg
2025/09/photo-020.jpg
2025/09/photo-021.jpg
2025/09/photo-022.jpg
2025/09/photo-023.jpg
2025/09/photo-024.jpg
2025/09/photo-025.jpg
2025/09/photo-026.jpg
2025/09/photo-027.jpg
2025/09/photo-028.jpg
2025/09/photo-029.jpg
2025/09/photo-030.jpg
2025/09/photo-031.jpg
2025/09/photo-032.jpg
2025/09/photo-033.jpg
2025/09/photo-034.jpg
2025/09/photo-035.jpg
2025/09/photo-036.jpg
2025/09/photo-037.jpg
2025/09/photo-038.jpg
2025/09/photo-039.jpg
2025/09/photo-040.jpg
2025/09/photo-041.jpg
2025/09/photo-042.jpg
2025/09/photo-043.jpg
2025/09/photo-044.jpg
2025/09/photo-045.jpg
2025/09/photo-046.jpg
2025/09/photo-047.jpg
2025/09/photo-048.jpg
2025/09/photo-049.jpg
2025/09/photo-050.jpg
2025/09/photo-051.jpg
2025/09/photo-052.jpg
2025/09/photo-053.jpg
2025/09/photo-054.jpg
2025/09/photo-055.jpg
2025/09/photo-056.jpg
2025/09/photo-057.jpg
2025/09/photo-058.jpg
2025/09/photo-059.jpg
2025/09/photo-060.jpg
2025/09/photo-061.jpg
2025/09/photo-062.jpg
2025/09/photo-063.jpg
2025/09/photo-064.jpg
2025/09/photo-065.jpg
2025/09/photo-066.jpg
2025/09/photo-067.jpg
2025/09/photo-068.jpg
2025/09/photo-069.jpg
2025/09/photo-070.jpg
2025/09/photo-071.jpg
2025/09/photo-072.jpg
2025/09/photo-073.jpg
2025/09/photo-074.jpg
2025/09/photo-075.jpg
2025/09/photo-076.jpg
2025/09/photo-077.jpg
2025/09/photo-078.jpg
2025/09/photo-079.jpg
2025/09/photo-080.jpg
2025/09/photo-081.jpg
2025/09/photo-082.jpg
2025/09/photo-083.jpg
2025/09/photo-084.jpg
2025/09/photo-085.jpg
2025/09/photo-086.jpg
2025/09/photo-087.jpg
2025/09/photo-088.jpg
2025/09/photo-089.jpg
2025/09/photo-090.jpg
2025/09/photo-091.jpg
2025/09/photo-092.jpg
2025/09/photo-093.jpg
2025/09/photo-094.jpg
2025/09/photo-095.jpg
2025/09/photo-096.jpg
2025/09/photo-097.jpg
2025/09/photo-098.jpg
2025/09/photo-099.jpg
2025/09/photo-100.jpg
2025/09/photo-101.jpg
2025/09/photo-102.jpg
2025/09/photo-103.jpg
2025/09/photo-104.jpg
2025/09/photo-105.jpg
2025/09/photo-106.jpg
2025/09/photo-107.jpg
2025/09/photo-108.jpg
2025/09/photo-109.jpg
2025/09/photo-110.jpg
2025/09/photo-111.jpg
2025/09/photo-112.jpg
2025/09/photo-113.jpg
2025/09/photo-114.jpg
2025/09/photo-115.jpg
2025/09/photo-116.jpg
2025/09/photo-117.jpg
2025/09/photo-118.jpg
2025/09/photo-119.jpg
2025/09/photo-120.jpg
2025/09/photo-121.jpg
2025/09/photo-122.jpg
2025/09/photo-123.jpg
2025/09/photo-124.jpg
2025/09/photo-125.jpg
2025/09/photo-126.jpg
2025/09/photo-127.jpg
2025/09/photo-128.jpg
2025/09/photo-129.jpg
2025/09/photo-130.jpg
2025/09/photo-131.jpg
2025/09/photo-132.jpg
2025/09/photo-133.jpg
2025/09/photo-134.png
2025/09/photo-135.jpg
2026/01/photo-136.jpeg
2026/01/photo-137.jpeg
2026/01/photo-138.jpeg
2026/01/photo-139.jpeg
2026/01/photo-140.jpeg
2026/01/photo-141.jpeg
2026/01/photo-142.jpeg
2026/01/photo-143.jpeg
2026/01/photo-144.jpeg
2026/01/photo-145.jpeg
2026/01/photo-146.jpeg
2026/01/photo-147.jpeg
2026/01/photo-148.jpeg
2026/01/photo-149.jpeg
2026/01/photo-150.jpeg
2026/01/photo-151.jpeg
2026/01/photo-152.jpeg
`
	.trim()
	.split("\n");

export type GalleryImage = {
	id: string;
	src: string;
	alt: string;
	caption?: string;
	tags: string[];
	year?: string;
	published: boolean;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
};

const excludedGalleryFiles = new Set(["2025/09/photo-134.png"]);
const uniqueGalleryFiles = Array.from(new Set(galleryFiles)).filter((file) => !excludedGalleryFiles.has(file));
export const galleryImages: GalleryImage[] = uniqueGalleryFiles.map((file, index) => ({
	id: `local-${file.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`,
	src: `${uploads}/${file}`,
	alt: "Veteran outdoor therapy experience in nature",
	tags: ["outdoors", "veteran support"],
	year: file.slice(0, 4),
	published: true,
	sortOrder: index + 1,
	createdAt: file.slice(0, 7),
	updatedAt: file.slice(0, 7),
}));

export type Testimonial = {
	slug: string;
	quote: string;
	author: string;
	service: string;
	image?: string;
	imageAlt?: string;
	imagePosition?: "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
	category?: string;
	published: boolean;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
};
export const testimonials: Testimonial[] = [
	{
		slug: "connie-stone-army",
		quote: "This event allowed me to gain confidence in myself as a Veteran's Advocate. Moving from Veteran in Need, to Veteran being Served, to Veterans serving Veterans has been a journey in healing and in life. To pass on a passion of mine to others that can bring hope and healing truly encompasses the mission of Veteran's Outdoor Therapy.",
		author: "Connie Stone",
		service: "Army (PH)",
		image: `${uploads}/2026/09/horseback/horseback-01.jpg`,
		imageAlt: "Female Veterans with a horse at Coulter Lake Guest Ranch",
		imagePosition: "center",
		category: "General",
		published: true,
		sortOrder: 1,
		createdAt: "2026-08-22",
		updatedAt: "2026-08-22",
	},
	{
		slug: "nancy-neal-air-force",
		quote: "I am so grateful for this experience! I genuinely enjoyed being around so many strong and inspiring Veterans. The hosts, Kelly, Forest, Dina, and Maru were so gracious and welcoming. I loved the home-cooked and family-style meals as well as the stimulating conversations. I really had such a great time.",
		author: "Nancy Neal",
		service: "Air Force",
		image: `${uploads}/2026/09/horseback/horseback-08.jpg`,
		imageAlt: "Female Veteran horseback riding at Coulter Lake Guest Ranch",
		imagePosition: "center",
		category: "Horseback",
		published: true,
		sortOrder: 2,
		createdAt: "2026-07-12",
		updatedAt: "2026-07-12",
	},
	{
		slug: "female-veterans-healing",
		quote: "This event has meant everything to me. It was so amazing to connect with fellow female Veterans who get it. It has helped heal parts of me I didn't know needed it. Talking with Connie about same shared feelings has helped me realize I'm not alone and that seeking help can only help. Thank you for organizing this incredible trip.",
		author: "Anonymous",
		service: "Female Veteran",
		image: `${uploads}/2026/09/horseback/horseback-10.jpg`,
		imageAlt: "Female Veteran horseback riding at Coulter Lake Guest Ranch",
		imagePosition: "center",
		category: "Horseback",
		published: true,
		sortOrder: 3,
		createdAt: "2026-07-12",
		updatedAt: "2026-07-12",
	},
	{
		slug: "ranch-hospitality",
		quote: "Thank you for welcoming us into your beautiful space. You have been so welcoming and accommodating to our group. I felt like a family member instead of a guest. Your ranch is truly stunning, and I would recommend it to anyone!",
		author: "Anonymous",
		service: "Female Veteran",
		image: `${uploads}/2026/09/horseback/horseback-06.jpg`,
		imageAlt: "Female Veterans grooming a horse at Coulter Lake Guest Ranch",
		imagePosition: "center",
		category: "Horseback",
		published: true,
		sortOrder: 4,
		createdAt: "2026-07-12",
		updatedAt: "2026-07-12",
	},
	{
			slug: "guided-rides-hospitality",
			quote: "Your hospitality is something to be admired. The food was amazing and the portions extremely generous! I walked away from each meal full and incredibly happy. Your guided rides were so informative and fun and your patience with us was admirable. I so enjoyed our conversations around the dinner table. Thank you both for everything.",
			author: "Anonymous",
			service: "Female Veteran",
			image: `${uploads}/2026/09/horseback/horseback-01.jpg`,
			imageAlt: "Female Veteran horseback riding at Coulter Lake Guest Ranch",
			imagePosition: "center",
			category: "Horseback",
			published: true,
			sortOrder: 5,
			createdAt: "2026-07-12",
			updatedAt: "2026-07-12",
		},
		{
			slug: "tiffany-baker-army",
			quote: "Everyone was Phenomenal! The food was great! The amount of detail that went into not only the VOT portion but the stay at the ranch, was amazing. I felt so taken care of and spoiled. The instructions were thorough and made for a safe experience. Dinners with Kelly, Forest, Maru and Dina truly felt like we were one big family and felt really special…I haven't laughed that hard in a long time. I was so impressed that Maru and Dina not only served us food, but were guides and helped with all the horse stuff and made sure we had everything we needed. This event means a ton to me. I've been really stressed back at home and burning at both ends, and to just get away and disconnect a bit from reality and be able to be truly present in nature, somewhere beautiful & with good people gave my soul life again! The camaraderie is always something you miss when you leave the service so its nice to be around people who have gone through similar things as you. I got to do something I love, but also challenge myself and experience something I never have before. I'm so grateful to Kelly & Forest for opening up our home to us along with sharing their home and stories.",
			author: "Tiffany Baker",
			service: "Army (PH)",
			image: `${uploads}/2026/09/horseback/horseback-07.jpg`,
			imageAlt: "Female Veteran horseback riding at Coulter Lake Guest Ranch",
			imagePosition: "center",
			category: "Horseback",
			published: true,
			sortOrder: 6,
			createdAt: "2026-07-12",
			updatedAt: "2026-07-12",
		},
		{
			slug: "heather-pippin-army",
			quote: "Thank you Connie for allowing me to stay back on the second ride to relax! Thank you Amanda for doing the interviews, all the photos and helping with the horses! I have learned so much about the horses, history of the area, each other and myself. This will be always in my heart! You are Bad Asses!! Crystal, I loved the flex schedule, sleep in time and relaxed yet planned days. It was just enough without being too much in either direction. Thank you for the gift bags and the time you put into this to bring us all together. You made us feel so welcomed, at home and like part of the family. Thank you for your kindness, your patience, and for creating an experience that reminded us of the healing power of community, nature and horses. We leave with full hearts and deep gratitude!",
			author: "Heather Pippin",
			service: "Army",
			image: `${uploads}/2026/09/horseback/horseback-09.jpg`,
			imageAlt: "Female Veteran horseback riding at Coulter Lake Guest Ranch",
			imagePosition: "center",
			category: "Horseback",
			published: true,
			sortOrder: 7,
			createdAt: "2026-07-12",
			updatedAt: "2026-07-12",
		},
		{
			slug: "jourdan-smith-purple-heart",
			quote: "This being my first turkey hunt I had so many questions about turkey hunting that I thought I would annoy my guide. He answered every question I had and that meant a lot to me. The highs of getting my first turkey to watching 10 plus turkeys just out of range was amazing. Forest was so excited for me when I shot my bird it made me more excited. With the things that have gone on in my life, this turkey hunt is so good for my soul, like a reset. As this event comes to an end I feel so refreshed and so happy that I was invited. Overall experience was amazing with even more awesome people. So, thank you very much.",
			author: "Jourdan Smith",
			service: "Purple Heart Recipient",
			image: undefined,
			imageAlt: undefined,
			imagePosition: "center",
			category: "Turkey Hunt",
			published: true,
			sortOrder: 8,
			createdAt: "2026-05-17",
			updatedAt: "2026-05-17",
		},
		{
			slug: "ryan-fasano-purple-heart",
			quote: "Cooking was phenomenal! Food was delicious, well planned and plentiful. The amount of game we were able to locate was more than expected. The staff were professional, knowledgeable and very respectful! The coordination between hunters/guides allowed us to remain well informed and had a very good idea of what the plan for each day was. As a combat wounded Veteran that has recently retired; this hunt was an incredible opportunity to get into the outdoors with fellow vets and share stories and feel as though you are still part of something. Hunting is my biggest passion. It is more that just a hobby. It is a way of life; most of all – it is my therapy! I would come back to do this hunt every year if given the opportunity!",
			author: "Ryan Fasano",
			service: "Purple Heart Recipient",
			image: undefined,
			imageAlt: undefined,
			imagePosition: "center",
			category: "Turkey Hunt",
			published: true,
			sortOrder: 9,
			createdAt: "2026-05-17",
			updatedAt: "2026-05-17",
		},
		{
			slug: "tyler-fernlund-purple-heart",
			quote: "I really enjoyed the accommodation. The diversity of guide styles and switching people around with them was nice too. Friendly, down-to-earth people and environment. Practicing safety & checking our shot groups and verifying that hunter equipment capabilities met the demands prior to going out was nice. I enjoyed everything overall. The activity was true to the name \"Veteran's Outdoor Therapy\" I hadn't been out with other individuals of a similar background and doing what I love in a long time. It truly has been therapeutic and I am greatly appreciative!",
			author: "Tyler Fernlund",
			service: "Purple Heart Recipient",
			image: undefined,
			imageAlt: undefined,
			imagePosition: "center",
			category: "Turkey Hunt",
			published: true,
			sortOrder: 10,
			createdAt: "2026-05-17",
			updatedAt: "2026-05-17",
		},
		{
			slug: "eric-petersen-kansas",
			quote: "The lodging, Food, intel, guides, host, humor and companionship were all good. This event came at the right time for mental focus, clarity and a family break. Being able to see new states, get my first turkey, and learn from guides has helped me in my personal and professional life.",
			author: "Eric Petersen",
			service: "Veteran",
			image: undefined,
			imageAlt: undefined,
			imagePosition: "center",
			category: "Turkey Hunt",
			published: true,
			sortOrder: 11,
			createdAt: "2026-05-17",
			updatedAt: "2026-05-17",
		},
		{
			slug: "jerome-thurnau-missouri",
			quote: "The accommodation was amazing. So relaxed and truly made to feel welcoming and comfortable. This event was huge to me. I very rarely get away to do anything relaxing and enjoying. All of my get-aways tend to always involve work. It was amazing to be able to reconnect and see a few of the people I was deployed with to Iraq with.",
			author: "Jerome Thurnau",
			service: "Veteran",
			image: undefined,
			imageAlt: undefined,
			imagePosition: "center",
			category: "Turkey Hunt",
			published: true,
			sortOrder: 12,
			createdAt: "2026-05-03",
			updatedAt: "2026-05-03",
		},
		{
			slug: "dustin-raines-missouri",
			quote: "The guides that were used were amazing. The food was amazing, plenty of great land to have access to, and the lodging was great. The communication from Jason leading up to the event was excellent as well. This event let me put my everyday problems aside and decompress with fellow brothers who have been through the military life and combat like myself.",
			author: "Dustin Raines",
			service: "Veteran",
			image: undefined,
			imageAlt: undefined,
			imagePosition: "center",
			category: "Turkey Hunt",
			published: true,
			sortOrder: 13,
			createdAt: "2026-05-03",
			updatedAt: "2026-05-03",
		},
		{
			slug: "derek-jones-rocky-point",
			quote: "Everything from the initial contact to departure was wonderful! The agenda was detailed and well thought out. The food, people, events, sleeping area and all were amazing! This event meant the world to me! It gave me hope again in America and our country. It made me realize that I am not alone and there are other members who have been through what I have. The community involved in this event was the best. They lifted my spirits so much! This whole event let me know America still has pockets of folks who believe in what I did and fully support my efforts. I truly needed to know America had my back. It was an emotional event for me, but it was very much needed. Thank you all for setting this up and volunteering your time, money, energy, and love for this event and showing us that America still cares.",
			author: "Derek Jones",
			service: "Veteran",
			image: undefined,
			imageAlt: undefined,
			imagePosition: "center",
			category: "Antelope Hunt",
			published: true,
			sortOrder: 14,
			createdAt: "2025-09-16",
			updatedAt: "2025-09-16",
		},
		{
			slug: "james-peoples-snagging",
			quote: "Getting out on the water with Veterans Outdoor Therapy was an incredible experience. There's a unique and powerful sense of connection that comes from being with fellow Veterans. We didn't need to explain our pasts; we just understood. We spent the weekend sharing stories, laughing, and enjoying the simple pleasure of fishing. It was more than a trip; it was a reminder of the brotherhood that stays with us long after we take off the uniform. I am incredibly grateful to this organization for creating these opportunities.",
			author: "James Peoples",
			service: "MSG (R), Army, Purple Heart Recipient",
			image: undefined,
			imageAlt: undefined,
			imagePosition: "center",
			category: "Snagging",
			published: true,
			sortOrder: 15,
			createdAt: "2026-03-01",
			updatedAt: "2026-03-01",
		},
		{
			slug: "aaron-mattox-snagging",
			quote: "Seeing how everyone changed from feeling unsure at first arrival, to having awesome and exciting conversations on the second evening really opened my eyes to the great thing VOT is. Vets helping Vets. The fishing was fun and we got some good ones, but the camaraderie we all partook in was oh so good. I look forward to helping more in the future.",
			author: "Aaron Mattox",
			service: "Army",
			image: undefined,
			imageAlt: undefined,
			imagePosition: "center",
			category: "Snagging",
			published: true,
			sortOrder: 16,
			createdAt: "2026-03-01",
			updatedAt: "2026-03-01",
		},
		{
			slug: "chris-shoaf-snagging",
			quote: "I had the opportunity to participate in Veterans Outdoor Therapy's annual paddlefish snagging trip in March 2025, and it was an experience I won't forget. Being able to get outdoors and connect with other combat Veterans who have faced similar challenges was incredibly meaningful. There's something different about being around people who truly understand what you've been through without having to explain it. The camaraderie, support, and shared experiences made a lasting impact on me. The entire trip was well organized, and the environment they created allowed everyone to relax, open up, and just enjoy the moment. It was more than just a fishing trip; it was a chance to reset, reconnect, and be part of a community again. Because of how much this experience meant to me, I've volunteered to help with the 2026 snagging trip. I want to be part of giving other Veterans the same opportunity that meant so much to me. I highly recommend Veterans Outdoor Therapy to any Veteran looking for connection, support, and a chance to get back outdoors with people who understand.",
			author: "Chris Shoaf",
			service: "Army",
			image: undefined,
			imageAlt: undefined,
			imagePosition: "center",
			category: "Snagging",
			published: true,
			sortOrder: 17,
			createdAt: "2026-03-01",
			updatedAt: "2026-03-01",
		},
		{
			slug: "dustin-smith-snagging",
			quote: "This trip was needed so much more than I realized. It was great to get away with like-minded individuals. I didn't catch anything, but to me it wasn't about that, it was about sharing time with other soldiers again. I didn't really think I deserved to be chosen, but I'm so grateful I was. It did so much for my mind. Thank you so much for the opportunity. Truly appreciated!",
			author: "Dustin Smith",
			service: "Army, Purple Heart Recipient",
			image: undefined,
			imageAlt: undefined,
			imagePosition: "center",
			category: "Snagging",
			published: true,
			sortOrder: 18,
			createdAt: "2026-03-01",
			updatedAt: "2026-03-01",
		},
	];

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
	photoGalleries?: { title: string; photos: { src: string; alt: string }[] }[];
	programHref: string;
	programLabel: string;
	published: boolean;
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
		image: `${uploads}/2026/09/horseback/horseback-01.jpg`,
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
		photoGalleries: [
			{
				title: "Photos from the trip",
				photos: [
					{ src: `${uploads}/2026/09/horseback/horseback-01.jpg`, alt: "Female Veterans gathered with a horse at Coulter Lake Guest Ranch" },
					{ src: `${uploads}/2026/09/horseback/horseback-06.jpg`, alt: "Female Veteran with a horse at Coulter Lake Guest Ranch" },
					{ src: `${uploads}/2026/09/horseback/horseback-07.jpg`, alt: "Female Veteran with a horse at Coulter Lake Guest Ranch" },
					{ src: `${uploads}/2026/09/horseback/horseback-08.jpg`, alt: "Female Veterans gathered at the corral at Coulter Lake Guest Ranch" },
					{ src: `${uploads}/2026/09/horseback/horseback-09.jpg`, alt: "Female Veterans gathered on the ranch porch at Coulter Lake Guest Ranch" },
					{ src: `${uploads}/2026/09/horseback/horseback-10.jpg`, alt: "Female Veterans relaxing on the ranch porch at Coulter Lake Guest Ranch" },
				],
			},
		],
		programHref: "/programs",
		programLabel: "Explore outdoor programs",
		published: true,
	},
	{
		slug: "second-annual-poker-run-2026",
		title: "Riders Rally for the Second Annual Poker Run",
		date: "June 20, 2026",
		datePublished: "2026-06-20",
		location: "Head's Blacktop Harley-Davidson, Columbia, Missouri",
		summary:
			"Volunteers, sponsors, and participants gathered at Head's Blacktop Harley-Davidson for the second annual Poker Run, raising money to support Veterans and Gold Star families.",
		image: `${uploads}/2026/09/pokerrun/pokerrun-05.jpg`,
		imageAlt: "Veteran's Outdoor Therapy volunteers and riders at the second annual Poker Run",
		body: [
			"Volunteers, sponsors, and participants gathered at Head's Blacktop Harley-Davidson in Columbia, Missouri, for the second annual Poker Run on June 20, 2026.",
			"The community fundraiser supported the outdoor program work behind Veteran hunts, fishing trips, horseback riding experiences, and other time in the field, all while everyone had a great time together. Win-win.",
			"Volunteer effort and local partnerships made the day possible. The event is one example of how supporters can contribute their time, networks, and event experience as well as financial support.",
		],
		facebookLinks: [
			{ href: "https://www.facebook.com/share/p/18S2gUCPoy/", label: "Read the recap on Facebook" },
		],
		galleryTag: "poker-run",
		photoGalleries: [
			{
				title: "Photos from the day",
				photos: [
					{ src: `${uploads}/2026/09/pokerrun/pokerrun-01.jpg`, alt: "Riders gathered around the table at Head's Blacktop Harley-Davidson" },
					{ src: `${uploads}/2026/09/pokerrun/pokerrun-02.jpg`, alt: "Riders gathered at the bar at Head's Blacktop Harley-Davidson" },
					{ src: `${uploads}/2026/09/pokerrun/pokerrun-03.jpg`, alt: "Riders gathered around the table at Head's Blacktop Harley-Davidson" },
					{ src: `${uploads}/2026/09/pokerrun/pokerrun-04.jpg`, alt: "Riders at Head's Blacktop Harley-Davidson" },
					{ src: `${uploads}/2026/09/pokerrun/pokerrun-05.jpg`, alt: "Veteran's Outdoor Therapy volunteers and riders at the second annual Poker Run" },
				],
			},
		],
		programHref: "/fundraising-application",
		programLabel: "Volunteer or host an event",
		published: true,
	},
	{
		slug: "white-river-fly-fishing-2026",
		title: "Veterans Learn to Fly Fish on the White River",
		date: "August 28-31, 2026",
		datePublished: "2026-08-31",
		location: "Rainbow Drive Resort, White River, Arkansas",
		summary:
			"Veterans from Georgia and Missouri spent four days on Arkansas's White River learning to fly fish, guided by an Army Veteran instructor.",
		image: `${uploads}/2026/09/fishing/fishing-02.jpg`,
		imageAlt: "Veteran holding a rainbow trout caught while fly fishing on the White River",
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
		photoGalleries: [
			{
				title: "The fly-casting lesson",
				photos: [
					{ src: `${uploads}/2026/09/fishing/fishing-06.jpg`, alt: "Veteran learning to fly fish on the White River" },
					{ src: `${uploads}/2026/09/fishing/fishing-07.jpg`, alt: "Veterans fly fishing on the White River" },
					{ src: `${uploads}/2026/09/fishing/fishing-08.jpg`, alt: "Veterans fly fishing on the White River" },
					{ src: `${uploads}/2026/09/fishing/fishing-09.jpg`, alt: "Veteran fly fishing on the White River" },
				],
			},
			{
				title: "Stories were told, memories were made",
				photos: [
					{ src: `${uploads}/2026/09/fishing/fishing-01.jpg`, alt: "Veteran holding a trout caught on the White River" },
					{ src: `${uploads}/2026/09/fishing/fishing-03.jpg`, alt: "Veteran holding a trout caught on the White River" },
					{ src: `${uploads}/2026/09/fishing/fishing-04.jpg`, alt: "Veterans fly fishing on the White River at dusk" },
					{ src: `${uploads}/2026/09/fishing/fishing-05.jpg`, alt: "Veterans gathered for dinner after fly fishing on the White River" },
				],
			},
		],
		programHref: "/programs",
		programLabel: "Explore outdoor programs",
		published: true,
	},
];

export const mission =
	"At Veteran's Outdoor Therapy, our mission is to provide fully funded outdoor adventures for America's heroes as a way to honor the service of Soldiers who have been deployed, and in some instances, sustained the wounds of war. We also extend our support to Gold Star families and children. These outdoor experiences offer a unique blend of physical activity, camaraderie, and emotional healing, enabling participants to reconnect with themselves and nature.";
