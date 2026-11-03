"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "@/components/lightbox";
import type { GalleryTile } from "@/lib/gallery-layout";

export function GalleryLightbox({ images }: { images: GalleryTile[] }) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	return (
		<>
			<div className="gallery-grid">
				{/* Deliberately no title attribute on these tiles. title, not alt, is what
				    draws the browser's hover tooltip; the alt below still reaches crawlers
				    and screen readers, and aria-label carries it to the button itself. */}
				{images.map((image, index) => (
					<button
						className={`gallery-item${image.wide ? " wide" : ""}`}
						key={image.id}
						type="button"
						onClick={() => setSelectedIndex(index)}
						aria-label={`Open ${image.alt}, photo ${index + 1} of ${images.length}`}
					>
						<Image
							src={image.src}
							alt={image.alt}
							fill
							sizes="(max-width: 700px) 100vw, 40vw"
						/>
					</button>
				))}
			</div>
			<Lightbox images={images} index={selectedIndex} onChange={setSelectedIndex} />
		</>
	);
}
