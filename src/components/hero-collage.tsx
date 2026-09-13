import Image from "next/image";
import { getPublishedGalleryImages } from "@/lib/db";

/** Background collage for page heroes. `seed` varies the pick per page without random ordering at render. */
export async function HeroCollage({ seed = 0 }: { seed?: number }) {
	const images = await getPublishedGalleryImages();
	if (!images.length) return null;
	const offset = seed % images.length;
	const collage = Array.from({ length: Math.min(8, images.length) }, (_, index) => images[(offset + index * 7) % images.length]);

	return (
		<div className="hero-collage" aria-hidden="true">
			{collage.map((image, index) => (
				<div key={`${image.id}-${index}`}>
					<Image src={image.src} alt="" fill sizes="25vw" />
				</div>
			))}
		</div>
	);
}
