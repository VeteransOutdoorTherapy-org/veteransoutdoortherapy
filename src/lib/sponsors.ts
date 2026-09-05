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
		featured: true,
	},
	{
		name: "Coulter Lake Guest Ranch & Outfitters",
		image: `${sponsorUploads}/coulter-lake-guest-ranch.webp`,
		featured: true,
	},
	{
		name: "South Dakota Parks & Wildlife Foundation",
		image: `${sponsorUploads}/south-dakota-parks-wildlife.webp`,
		featured: true,
	},
	{
		name: "VFW Riders Missouri",
		image: `${sponsorUploads}/vfw-riders-missouri.webp`,
		featured: true,
	},
	{
		name: "Blacktop Harley-Davidson",
		image: `${sponsorUploads}/blacktop-harley-davidson.png`,
		featured: true,
	},
	{
		name: "Parker County Gold Star Families",
		image: `${sponsorUploads}/parker-county-gold-star-families.webp`,
		featured: false,
	},
] as const;
