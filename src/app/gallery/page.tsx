import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import Link from "next/link";
import { getPublishedGalleryImages } from "@/lib/db";
import { FACEBOOK_URL, breadcrumbSchema, pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
export const metadata = pageMetadata({
	title: "Veteran Outdoor Adventure Photo Gallery",
	description: "See Veteran's Outdoor Therapy in the field through photos from hunting, horseback riding, community events, and time outdoors with Veterans and Gold Star families.",
	path: "/gallery",
});
export default async function GalleryPage() {
	const galleryImages = await getPublishedGalleryImages();
	return (
		<>
			<JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery" }])} />
			<section className="section">
				<div className="container">
					<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gallery" }]} />
					<p className="eyebrow">Proof of the mission</p>
					<h1 className="display section-title">Veteran&apos;s Outdoor Therapy in the field.</h1>
					<p className="prose">
						Every photo reflects more than an adventure. It is a story of healing, hope, and connection, from sunrise on
						the water to laughter around camp.
					</p>
					<div className="gallery-links">
						<Link className="text-link" href="/field-stories">Read the stories behind recent experiences <ArrowRight size={17} /></Link>
						<Link className="text-link" href={FACEBOOK_URL} target="_blank" rel="noreferrer">Follow along on Facebook for more photos <ArrowRight size={17} /></Link>
					</div>
					<GalleryLightbox images={galleryImages} />
				</div>
			</section>
		</>
	);
}
