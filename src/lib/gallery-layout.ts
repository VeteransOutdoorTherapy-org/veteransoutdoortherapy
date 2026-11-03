import type { GalleryImage } from "@/lib/data";
import landscapeSources from "@/lib/gallery-landscape.json";

const landscape = new Set(landscapeSources);

export type GalleryTile = GalleryImage & { wide: boolean };

/**
 * Every fifth tile spans two columns, and only a landscape photo fills that
 * shape without being cropped to a sliver. When the photo due in a wide slot
 * is portrait, the next landscape photo is pulled forward into it, so the
 * order stays mostly as sorted. Photos not in the build-time list (an admin
 * upload since the last deploy) are treated as portrait.
 */
export function arrangeGallery(images: GalleryImage[]): GalleryTile[] {
	const rest = [...images];
	const tiles: GalleryTile[] = [];
	while (rest.length > 0) {
		const index = tiles.length % 5 === 0 ? rest.findIndex((image) => landscape.has(image.src)) : -1;
		if (index === -1) tiles.push({ ...rest.shift()!, wide: false });
		else tiles.push({ ...rest.splice(index, 1)[0], wide: true });
	}
	return tiles;
}
