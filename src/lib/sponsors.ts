const sponsorUploads = "/wp-content/uploads/sponsors";

export const sponsorLogos = [
	{
		name: "Three Arrows Outfitters",
		image: `${sponsorUploads}/three-arrows-outfitters.webp`,
		featured: true,
	},
	{
		name: "Veterans United Foundation",
		image: `${sponsorUploads}/veterans-united-foundation.webp`,
		/* Off the homepage bar, which shows featured only; still on /sponsor. */
		featured: false,
	},
	{
		name: "Coulter Lake Guest Ranch & Outfitters",
		image: `${sponsorUploads}/2026/coulter-lake-guest-ranch.jpg`,
		featured: true,
	},
	{
		name: "South Dakota Parks & Wildlife Foundation",
		image: `${sponsorUploads}/south-dakota-parks-wildlife.webp`,
		/* Off the homepage bar, which shows featured only; still on /sponsor. */
		featured: false,
	},
	{
		name: "VFW Riders Missouri",
		image: `${sponsorUploads}/vfw-riders-missouri.webp`,
		featured: true,
	},
	{
		name: "Blacktop Harley-Davidson",
		image: `${sponsorUploads}/blacktop-harley-davidson.png`,
		/* Off the homepage bar, which shows featured only; still on /sponsor. */
		featured: false,
	},
	{
		name: "Parker County Gold Star Families",
		image: `${sponsorUploads}/parker-county-gold-star-families.webp`,
		featured: false,
	},
] as const;

/**
 * The 2026 sponsor roll. Every tile is pre-rendered onto a white square at
 * 440x440 so the globe turns evenly whatever shape the original logo was.
 */
export const sponsors2026 = [
	{ name: "247 Grit Fitness", image: `${sponsorUploads}/2026/247-grit-fitness.webp` },
	{ name: "Ameren Missouri Callaway Energy Center", image: `${sponsorUploads}/2026/ameren-missouri.webp` },
	{ name: "Arbor Aquatic Pros", image: `${sponsorUploads}/2026/arbor-aquatic-pros.webp` },
	{ name: "Bass Pro Shops", image: `${sponsorUploads}/2026/bass-pro.webp` },
	{ name: "Banded Rooster Bar & Grill", image: `${sponsorUploads}/2026/banded-rooster.webp` },
	{ name: "Callaway Montgomery Cattlemen's Association", image: `${sponsorUploads}/2026/cattlemens-association.webp` },
	{ name: "COIL", image: `${sponsorUploads}/2026/coil.webp` },
	{ name: "Conservation Federation of Missouri", image: `${sponsorUploads}/2026/conservation-federation-of-missouri.webp` },
	{ name: "Coulter Lake Guest Ranch", image: `${sponsorUploads}/2026/coulter-lake-guest-ranch.jpg` },
	{ name: "Corrigan Co.", image: `${sponsorUploads}/2026/corrigan-co.webp` },
	{ name: "CParks", image: `${sponsorUploads}/2026/cparks.webp` },
	{ name: "Danuser", image: `${sponsorUploads}/2026/danuser.webp` },
	{ name: "Eibel Construction", image: `${sponsorUploads}/2026/eibel-construction.webp` },
	{ name: "Ferguson", image: `${sponsorUploads}/2026/ferguson.webp` },
	{ name: "Glove Con", image: `${sponsorUploads}/2026/glove-con.webp` },
	{ name: "Head's Blacktop Harley-Davidson", image: `${sponsorUploads}/2026/heads-blacktop-harley-davidson.webp` },
	{ name: "Kroll Excavating", image: `${sponsorUploads}/2026/kroll-excavating.webp` },
	{ name: "Life Pointe", image: `${sponsorUploads}/2026/life-pointe.webp` },
	{ name: "Millstone Weber", image: `${sponsorUploads}/2026/millstone-weber.webp` },
	{ name: "MoSEAL Asphalt Services", image: `${sponsorUploads}/2026/moseal-asphalt-services.webp` },
	{ name: "Precision Hauling LLC", image: `${sponsorUploads}/2026/precision-hauling.webp` },
	{ name: "Precision Precast", image: `${sponsorUploads}/2026/precision-precast.webp` },
	{ name: "R&R Processing", image: `${sponsorUploads}/2026/rr-processing.webp` },
	{ name: "Sapp Construction", image: `${sponsorUploads}/2026/sapp-construction.webp` },
	{ name: "Shryocks Callaway Farms", image: `${sponsorUploads}/2026/shryocks-callaway-farms.webp` },
	{ name: "Southern Star Cares", image: `${sponsorUploads}/2026/southern-star-cares.webp` },
	{ name: "Spatafora Brothers", image: `${sponsorUploads}/2026/spatafora-brothers.webp` },
	{ name: "Spradlin Insulation", image: `${sponsorUploads}/2026/spradlin-insulation.webp` },
	{ name: "Swamp Buck", image: `${sponsorUploads}/2026/swamp-buck.webp` },
	{ name: "Teel Mechanical Service", image: `${sponsorUploads}/2026/teel-mechanical-service.webp` },
	{ name: "The Milestone Group", image: `${sponsorUploads}/2026/the-milestone-group.webp` },
	{ name: "Three Arrows Outfitters", image: `${sponsorUploads}/three-arrows-outfitters.webp` },
	{ name: "VFW Post 2657", image: `${sponsorUploads}/2026/vfw-post-2657.webp` },
	{ name: "Westinghouse", image: `${sponsorUploads}/2026/westinghouse.webp` },
] as const;
