import type { Metadata } from "next";
import { Archivo, Barlow_Condensed } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, CONTACT_EMAIL, FACEBOOK_URL, OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
	variable: "--font-body",
	subsets: ["latin"],
});

const barlow = Barlow_Condensed({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	openGraph: {
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		url: "/",
		siteName: SITE_NAME,
		type: "website",
		images: [{ url: OG_IMAGE, alt: SITE_NAME }],
	},
	twitter: {
		card: "summary_large_image",
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		images: [OG_IMAGE],
	},
	robots: { index: true, follow: true },
	icons: {
		icon: [
			{ url: "/vot-icon-192.png", sizes: "192x192", type: "image/png" },
			{ url: "/vot-icon-512.png", sizes: "512x512", type: "image/png" },
		],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
	},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": ["Organization", "NGO"],
		"@id": `${SITE_URL}/#organization`,
		name: SITE_NAME,
		url: SITE_URL,
		logo: absoluteUrl("/vot-logo-original.png"),
		description: SITE_DESCRIPTION,
		email: CONTACT_EMAIL,
		nonprofitStatus: "Nonprofit501c3",
		sameAs: [FACEBOOK_URL, "https://www.instagram.com/veteransoutdoortherapy"],
		contactPoint: { "@type": "ContactPoint", contactType: "general inquiries", email: CONTACT_EMAIL },
	};
	const websiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${SITE_URL}/#website`,
		name: SITE_NAME,
		url: SITE_URL,
		description: SITE_DESCRIPTION,
		publisher: { "@id": `${SITE_URL}/#organization` },
	};
	return (
		<html lang="en" className={`${archivo.variable} ${barlow.variable}`}>
			<body>
				<JsonLd data={[organizationSchema, websiteSchema]} />
				<CartProvider>
					<Header />
					<main>{children}</main>
					<Footer />
				</CartProvider>
			</body>
		</html>
	);
}
