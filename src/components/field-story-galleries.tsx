"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox, type LightboxImage } from "@/components/lightbox";

/** A story's photo sections, sharing one viewer that steps through every photo on the page. */
export function FieldStoryGalleries({ galleries }: { galleries: { title: string; photos: LightboxImage[] }[] }) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const allPhotos = galleries.flatMap((gallery) => gallery.photos);
	let offset = 0;

	return (
		<>
			{galleries.map((gallery, galleryIndex) => {
				const start = offset;
				offset += gallery.photos.length;
				return (
					<section className="field-story-section" key={gallery.title}>
						<div className="field-story-section-head">
							<p className="eyebrow">From the field</p>
							<h2>{gallery.title}</h2>
						</div>
						<div className="field-story-gallery">
							{/* No title attribute: it would draw the alt as a hover tooltip. */}
							{gallery.photos.map((photo, index) => {
								const featured = galleryIndex === 0 && index === 0;
								return (
									<button
										key={photo.src}
										type="button"
										className={`field-story-photo${featured ? " field-story-gallery-featured" : ""}`}
										onClick={() => setSelectedIndex(start + index)}
										aria-label={`Open ${photo.alt}, photo ${start + index + 1} of ${allPhotos.length}`}
									>
										<Image
											src={photo.src}
											alt={photo.alt}
											fill
											sizes={featured ? "(max-width: 700px) 100vw, 66vw" : "(max-width: 700px) 50vw, 33vw"}
										/>
									</button>
								);
							})}
						</div>
					</section>
				);
			})}
			<Lightbox images={allPhotos} index={selectedIndex} onChange={setSelectedIndex} />
		</>
	);
}
