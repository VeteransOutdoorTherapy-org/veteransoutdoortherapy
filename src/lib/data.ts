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

const uploads = "https://veteransoutdoortherapy.org/wp-content/uploads";

export const products: Product[] = [
	{
		slug: "veterans-outdoor-therapy-camo-hoodie-veteran-outdoor-apparel",
		name: "Veteran's Outdoor Therapy Camo Hoodie",
		shortName: "Camo Hoodie",
		price: 30,
		category: "Merchandise",
		description:
			"A warm, comfortable camouflage hoodie built for those who find clarity, strength, and healing in the wild. Soft midweight fleece, an adjustable hood, and a front kangaroo pocket make it ready for cool mornings and nights by the fire.",
		image: `${uploads}/2026/01/thumbnail_IMG_7725.jpg`,
		gallery: [`${uploads}/2026/01/thumbnail_IMG_7725.jpg`],
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
		image: `${uploads}/2025/12/IMG_4715.jpeg`,
		gallery: [`${uploads}/2025/12/IMG_4715.jpeg`],
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
		image: `${uploads}/2025/12/FullSizeRender-3-scaled.jpeg`,
		gallery: [`${uploads}/2025/12/FullSizeRender-3-scaled.jpeg`],
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
		image: `${uploads}/2025/12/FullSizeRender-scaled.jpeg`,
		gallery: [`${uploads}/2025/12/FullSizeRender-scaled.jpeg`],
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
		image: `${uploads}/2025/12/FullSizeRender-4.jpeg`,
		gallery: [`${uploads}/2025/12/FullSizeRender-4.jpeg`],
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
		image: `${uploads}/2025/12/IMG_4733-scaled.jpeg`,
		gallery: [`${uploads}/2025/12/IMG_4733-scaled.jpeg`],
		sizes: ["S", "M", "L", "XL", "XXL"],
	},
	{
		slug: "veterans-outdoor-therapy-t-shirt-nature-inspired-veteran-apparel-copy",
		name: "Veteran's Outdoor Therapy T-Shirt - Burnt Orange",
		shortName: "Orange Mission T-Shirt",
		price: 25,
		category: "Merchandise",
		description:
			"A soft burnt-orange unisex tee with a durable nature-inspired mark, made for the trail, campfire, or everyday wear.",
		image: `${uploads}/2025/12/IMG_4726.jpeg`,
		gallery: [`${uploads}/2025/12/IMG_4726.jpeg`],
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
		image: `${uploads}/2025/12/IMG_7112.jpeg`,
		gallery: [`${uploads}/2025/12/IMG_7112.jpeg`],
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
		image: `${uploads}/2026/01/GetAttachmentThumbnail.jpg`,
		gallery: [`${uploads}/2026/01/GetAttachmentThumbnail.jpg`],
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
		image: `${uploads}/2025/09/514023039_122139090914799810_7702720490048483923_n.jpg`,
		gallery: [`${uploads}/2025/09/514023039_122139090914799810_7702720490048483923_n.jpg`],
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
		image: `${uploads}/2025/09/552626219_122157680714799810_368606548123490962_n-980x735.jpg`,
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
		image: `${uploads}/2026/01/horseback.jpg`,
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
		image: `${uploads}/2025/10/thumbnail_IMG_4884-980x735.jpg`,
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
2025/09/481919614_10235564637753446_8095133793450501592_n.jpg
2025/09/483527723_122105256578799810_3831270692360133858_n.jpg
2025/09/484166917_122104166342799810_995586109881750643_n.jpg
2025/09/484172626_122104166366799810_7898062975548890851_n.jpg
2025/09/484199878_122104636574799810_8601803267546646284_n.jpg
2025/09/484210336_122104166528799810_1864254687950348352_n.jpg
2025/09/484223993_122104822820799810_7135858314035382439_n.jpg
2025/09/484226217_122104822760799810_6194458446935058612_n.jpg
2025/09/484240065_122104166420799810_4092940764792726825_n.jpg
2025/09/484481779_122104166468799810_4566249416808408984_n.jpg
2025/09/484488692_122104166210799810_4306388486977427141_n.jpg
2025/09/484527054_122104636580799810_235754695164465977_n.jpg
2025/09/484528852_122104822640799810_7167080403069482178_n.jpg
2025/09/484569228_122105112878799810_516984991374913715_n.jpg
2025/09/484583897_122104822670799810_2875250384220948969_n.jpg
2025/09/484629616_122104166192799810_1302864157923132890_n.jpg
2025/09/484806564_122104636718799810_1143969132079666343_n.jpg
2025/09/484808121_122105112824799810_4967495717152420532_n.jpg
2025/09/484808443_122105112932799810_3925522413812156618_n.jpg
2025/09/484977744_122104166432799810_7750842584414220054_n.jpg
2025/09/485060307_122104822778799810_8300838612294941159_n.jpg
2025/09/499920766_122133145346799810_8716595135930404123_n.jpg
2025/09/509702992_122137491146799810_9156368211752062663_n.jpg
2025/09/510247005_122138279414799810_424283478530025200_n.jpg
2025/09/510358533_122138282186799810_4722159459945622269_n.jpg
2025/09/510433696_122138281904799810_5229512030218445936_n.jpg
2025/09/510449119_122138282108799810_7246660250135791357_n.jpg
2025/09/510470920_122138282024799810_7009349050469403752_n.jpg
2025/09/510557738_122138281916799810_2089891434765132909_n.jpg
2025/09/510845124_122138281976799810_4927755404263927369_n.jpg
2025/09/510940734_122138281628799810_2063972005413402824_n.jpg
2025/09/510943338_122138281850799810_4751360453603558598_n.jpg
2025/09/510946750_122138281838799810_1164173324495209276_n.jpg
2025/09/510950566_122138282060799810_274065486792681180_n.jpg
2025/09/510954381_122138282000799810_2015012737457698918_n.jpg
2025/09/510972159_122138282120799810_5144107243595783292_n.jpg
2025/09/510977350_122138281862799810_2608066378522048871_n.jpg
2025/09/510978403_122138282162799810_5582562870249922882_n.jpg
2025/09/511331312_122138281880799810_406733942476349116_n.jpg
2025/09/511528210_122138281940799810_42499641450970314_n.jpg
2025/09/511567098_122138281670799810_1432347358615580881_n.jpg
2025/09/511570233_122138280608799810_3062368554634141654_n.jpg
2025/09/511697792_122138282012799810_7491747869384944174_n.jpg
2025/09/511864650_122138282036799810_3327900015936343769_n.jpg
2025/09/511896826_122138282096799810_5846071500550668928_n.jpg
2025/09/511913995_122138280836799810_5259018934774501848_n.jpg
2025/09/511916595_122138282174799810_913652625794499895_n.jpg
2025/09/511994622_122138282138799810_4362412928790921847_n.jpg
2025/09/511997373_122138281208799810_5775376023828163000_n.jpg
2025/09/512001818_122138281928799810_1582461503829132806_n.jpg
2025/09/512006994_122138282150799810_3157424738829166990_n.jpg
2025/09/512109511_122138282084799810_4056114719304348341_n.jpg
2025/09/512128934_122138281964799810_1406445857703913020_n.jpg
2025/09/512162113_122138281808799810_8088440366432688107_n.jpg
2025/09/512401263_122138281238799810_170421210347815227_n.jpg
2025/09/512678804_122138280932799810_8886075036874788374_n.jpg
2025/09/512747302_122138280572799810_7509777048999568813_n.jpg
2025/09/512847519_122138281952799810_5132475707828454023_n.jpg
2025/09/513088088_122138282072799810_1027240434212297695_n.jpg
2025/09/513116270_122139092720799810_5699336949970199566_n.jpg
2025/09/548502232_122157681224799810_3750938922386055152_n.jpg
2025/09/548626931_122157681158799810_4015773705541295360_n.jpg
2025/09/548759636_122157681314799810_8210040793894355202_n.jpg
2025/09/548856433_122157681272799810_3240113051628715071_n.jpg
2025/09/548896110_122157681014799810_2323543656694974920_n.jpg
2025/09/548962567_122157227576799810_7949463464755932560_n.jpg
2025/09/549248128_122157681362799810_8816281257936851804_n.jpg
2025/09/549297357_122157681260799810_7817952536162742712_n.jpg
2025/09/549327287_122157280958799810_3129363699940096930_n.jpg
2025/09/549582187_122157680648799810_6937095100613865064_n.jpg
2025/09/549644240_122157681338799810_154435253116294159_n.jpg
2025/09/549708441_122157680738799810_1642409910386788987_n.jpg
2025/09/549743307_122157681248799810_8122806601166540134_n.jpg
2025/09/549760986_122157952562799810_5688847935351886263_n.jpg
2025/09/549767057_122157680894799810_7605824911311743418_n.jpg
2025/09/549775387_122157690182799810_6999600064628427883_n.jpg
2025/09/550026566_122157681146799810_71086069186160420_n.jpg
2025/09/550120810_122157680618799810_5965778852052654141_n.jpg
2025/09/550165376_122157681038799810_8297195385189279385_n.jpg
2025/09/550240611_122157680996799810_1435117279936204103_n.jpg
2025/09/550242742_122157681128799810_6496918086870901158_n.jpg
2025/09/550282577_122157952574799810_8969172570293407512_n.jpg
2025/09/550371944_122157680786799810_4778066517165990403_n.jpg
2025/09/550389163_122157681326799810_5612883145857965568_n.jpg
2025/09/550397019_122157681104799810_2848883129853993942_n.jpg
2025/09/550442427_122157678650799810_7113430024840590060_n.jpg
2025/09/550457113_122157680726799810_1367303364793695539_n.jpg
2025/09/550471947_122157681386799810_586658443217857011_n.jpg
2025/09/550487209_122157690224799810_8093869336266107344_n.jpg
2025/09/550503830_122157681236799810_1214685013529295352_n.jpg
2025/09/550504929_122157680918799810_951769977526676647_n.jpg
2025/09/550517208_122157952478799810_4887382110128925501_n.jpg
2025/09/550549768_122157680972799810_2718000616115641209_n.jpg
2025/09/550605295_122157681212799810_2052559294739253028_n.jpg
2025/09/550713477_122157680690799810_7947000905489448789_n.jpg
2025/09/550719754_122157681374799810_7998419673709024765_n.jpg
2025/09/550726386_122157681194799810_7523105287141979281_n.jpg
2025/09/550862235_122157952520799810_4778247159870462553_n.jpg
2025/09/550887401_122157680678799810_1118992377910066529_n.jpg
2025/09/550995429_122157681350799810_9041554858618310074_n.jpg
2025/09/551017665_122157680774799810_7492556067325948454_n.jpg
2025/09/551027779_122157952508799810_7440529465549451332_n.jpg
2025/09/551028355_122157681176799810_8168110366922247618_n.jpg
2025/09/551230195_122157952202799810_8381457785869093674_n.jpg
2025/09/551259727_122157681080799810_6254929477374712131_n.jpg
2025/09/552168487_122157691460799810_4817069116542257593_n.jpg
2025/09/552222028_122157952634799810_990009748671373528_n.jpg
2025/09/552251499_122157952760799810_3467885177971731612_n.jpg
2025/09/552311910_122157952598799810_4218736820376529599_n.jpg
2025/09/552343637_122157681296799810_7308527521806719766_n.jpg
2025/09/552343642_122157952466799810_7291110204013298765_n.jpg
2025/09/552356587_122157680702799810_3664330136042631249_n.jpg
2025/09/552421796_122157952544799810_3092845574380142301_n.jpg
2025/09/552500182_122157680846799810_2237481460447767216_n.jpg
2025/09/552626211_122157952436799810_562294068412297872_n.jpg
2025/09/552626219_122157680714799810_368606548123490962_n.jpg
2025/09/552842565_122157952172799810_4343926363786270650_n.jpg
2025/09/552922089_122157952424799810_8022555371703067355_n.jpg
2025/09/553717918_122157952532799810_7971630637195279746_n.jpg
2025/09/626884bbf04d340c565832d04f7da6ca.png
2026/01/FullSizeRender-1.jpeg
2026/01/FullSizeRender-3-1.jpeg
2026/01/FullSizeRender-4-1.jpeg
2026/01/IMG_7269-1.jpeg
2026/01/IMG_7269-1-rotated.jpeg
2026/01/IMG_7304-1.jpeg
2026/01/IMG_7304-1-scaled.jpeg
2026/01/IMG_7321-1.jpeg
2026/01/IMG_7321-1-rotated.jpeg
2026/01/IMG_7338-1.jpeg
2026/01/IMG_7338-1-scaled.jpeg
2026/01/IMG_7342-1.jpeg
2026/01/IMG_7342-1-scaled.jpeg
2026/01/IMG_7371-1.jpeg
2026/01/IMG_7371-1-rotated.jpeg
2026/01/IMG_7397-1.jpeg
2026/01/IMG_7397-1-scaled.jpeg
`
	.trim()
	.split("\n");

export const galleryImages = galleryFiles.map((file) => `${uploads}/${file}`);

export type Testimonial = {
	slug: string;
	quote: string;
	author: string;
	service: string;
	image?: string;
	imageAlt?: string;
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
		image: undefined,
		imageAlt: undefined,
		published: true,
		sortOrder: 1,
		createdAt: "2026-08-22",
		updatedAt: "2026-08-22",
	},
];

export const mission =
	"At Veteran's Outdoor Therapy, our mission is to provide fully funded outdoor adventures for America's heroes as a way to honor the service of Soldiers who have been deployed, and in some instances, sustained the wounds of war. We also extend our support to Gold Star families and children. These outdoor experiences offer a unique blend of physical activity, camaraderie, and emotional healing, enabling participants to reconnect with themselves and nature.";
