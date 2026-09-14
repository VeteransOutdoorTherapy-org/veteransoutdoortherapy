import type { CSSProperties } from "react";
import Image from "next/image";
import { getPublishedGalleryImages } from "@/lib/db";

// A masonry pattern that tiles a 6 x 4 grid exactly: wide, square, and tall cells mixed so the
// collage reads as a hand-made arrangement rather than a filmstrip.
const PATTERN = [
	{ col: "1 / span 2", row: "1 / span 2" },
	{ col: "3 / span 1", row: "1 / span 1" },
	{ col: "3 / span 1", row: "2 / span 1" },
	{ col: "4 / span 1", row: "1 / span 2" },
	{ col: "5 / span 2", row: "1 / span 1" },
	{ col: "5 / span 2", row: "2 / span 1" },
	{ col: "1 / span 1", row: "3 / span 2" },
	{ col: "2 / span 2", row: "3 / span 1" },
	{ col: "2 / span 2", row: "4 / span 1" },
	{ col: "4 / span 2", row: "3 / span 2" },
	{ col: "6 / span 1", row: "3 / span 1" },
	{ col: "6 / span 1", row: "4 / span 1" },
];

/** Deterministic PRNG: the same seed always produces the same collage, so server and client agree. */
function seededRandom(seed: number) {
	let state = seed * 1831565813 + 1;
	return () => {
		state = Math.imul(state ^ (state >>> 15), state | 1);
		state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
		return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
	};
}

/** Background collage for page heroes. Each `seed` shuffles the gallery differently. */
export async function HeroCollage({ seed = 0 }: { seed?: number }) {
	const images = await getPublishedGalleryImages();
	if (!images.length) return null;

	const random = seededRandom(seed + 1);
	const pool = [...images];
	for (let index = pool.length - 1; index > 0; index -= 1) {
		const swap = Math.floor(random() * (index + 1));
		[pool[index], pool[swap]] = [pool[swap], pool[index]];
	}
	const tiles = PATTERN.map((cell, index) => ({ ...cell, image: pool[index % pool.length] }));

	return (
		<div className="hero-collage" aria-hidden="true">
			{tiles.map((tile, index) => (
				<div key={`${tile.image.id}-${index}`} style={{ "--col": tile.col, "--row": tile.row } as CSSProperties}>
					<Image src={tile.image.src} alt="" fill sizes="(max-width: 860px) 34vw, 20vw" />
				</div>
			))}
		</div>
	);
}
