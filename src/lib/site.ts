import type { Metadata } from "next";

export const SITE_NAME = "Veteran's Outdoor Therapy";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://veteransoutdoortherapy.org";
export const SITE_DESCRIPTION =
	"Fully funded hunting, fishing, horseback riding, and outdoor experiences for previously deployed Veterans and Gold Star families.";
export const OG_IMAGE = "/og-image.png";
export const FACEBOOK_URL = "https://www.facebook.com/p/Veterans-Outdoor-Therapy-61573994307519/";
export const CONTACT_EMAIL = "contact@veteransoutdoortherapy.org";

export function absoluteUrl(path = "/") {
	return new URL(path, SITE_URL).toString();
}

type PageMetadataOptions = {
	title: string;
	description: string;
	path: string;
	image?: string;
	noIndex?: boolean;
};

export function pageMetadata({ title, description, path, image = OG_IMAGE, noIndex }: PageMetadataOptions): Metadata {
	return {
		title,
		description,
		alternates: { canonical: path },
		openGraph: {
			title,
			description,
			url: path,
			siteName: SITE_NAME,
			type: "website",
			images: [{ url: image, alt: SITE_NAME }],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [image],
		},
		robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
	};
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.path),
		})),
	};
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: { "@type": "Answer", text: item.answer },
		})),
	};
}
