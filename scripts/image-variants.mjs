// Writes WebP copies of every photo in public/ at the widths src/lib/image-loader.ts
// asks for, into public/_img/. The site then serves photos as plain static files
// instead of sending each one through Vercel's image optimizer, which bills per
// transformation and was being run up by crawlers. Runs before dev and build, and
// skips any copy that is already newer than its source.
import { mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTHS = [640, 1080, 1920]; // keep in step with src/lib/image-loader.ts
const root = path.join(process.cwd(), "public");
const outRoot = path.join(root, "_img");

const files = (await readdir(root, { recursive: true })).filter(
	(file) => /\.(jpe?g|png|webp)$/i.test(file) && !file.startsWith(`_img${path.sep}`),
);

let written = 0;
for (const file of files) {
	const source = path.join(root, file);
	const sourceTime = (await stat(source)).mtimeMs;
	for (const width of WIDTHS) {
		const target = path.join(outRoot, `${file}-${width}.webp`);
		const existing = await stat(target).catch(() => null);
		if (existing && existing.mtimeMs >= sourceTime) continue;
		await mkdir(path.dirname(target), { recursive: true });
		await sharp(source)
			.rotate()
			.resize({ width, height: width, fit: "inside", withoutEnlargement: true })
			.webp({ quality: 75 })
			.toFile(target);
		written++;
	}
}
console.log(`Image variants: ${written} written, ${files.length * WIDTHS.length - written} already current.`);
