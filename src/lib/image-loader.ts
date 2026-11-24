// Points next/image at the WebP copies scripts/image-variants.mjs writes at build
// time, so no photo goes through Vercel's per-transformation image optimizer.
const WIDTHS = [480, 960, 1600]; // keep in step with scripts/image-variants.mjs

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
	// Only local photos have copies; anything else (SVGs, build-hashed imports, remote URLs) is served as is.
	if (!/^\/(?!_next\/|_img\/)[^?#]+\.(jpe?g|png|webp)$/i.test(src)) return src;
	const size = WIDTHS.find((candidate) => candidate >= width) ?? WIDTHS[WIDTHS.length - 1];
	return `/_img${src}-${size}.webp`;
}
