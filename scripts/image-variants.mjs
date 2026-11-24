// Writes WebP copies of every photo in public/ at the widths src/lib/image-loader.ts
// asks for, into public/_img/. The site then serves photos as plain static files
// instead of sending each one through Vercel's image optimizer, which bills per
// transformation and was being run up by crawlers. Runs before dev and build.
//
// Each copy is also kept in .next/cache/img-variants, keyed by a hash of the
// source photo, because Vercel restores .next/cache between builds. Only new or
// changed photos are encoded; the rest are copied, so a deploy does not spend
// minutes re-encoding the whole library. (File times are no use here: a fresh
// git checkout stamps every source with the checkout time.)
import { createHash } from "node:crypto";
import { availableParallelism } from "node:os";
import { copyFile, mkdir, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTHS = [480, 960, 1600]; // keep in step with src/lib/image-loader.ts
const QUALITY = 70;
const root = path.join(process.cwd(), "public");
const outRoot = path.join(root, "_img");
const cacheRoot = path.join(process.cwd(), ".next", "cache", "img-variants");

const files = (await readdir(root, { recursive: true })).filter(
	(file) => /\.(jpe?g|png|webp)$/i.test(file) && !file.startsWith(`_img${path.sep}`),
);

const exists = (file) => stat(file).then(() => true, () => false);
let encoded = 0;

async function variants(file) {
	const source = path.join(root, file);
	const buffer = await readFile(source);
	const hash = createHash("sha1").update(buffer).digest("hex");
	for (const width of WIDTHS) {
		const target = path.join(outRoot, `${file}-${width}.webp`);
		const cached = path.join(cacheRoot, `${hash}-${width}-q${QUALITY}.webp`);
		if (!(await exists(cached))) {
			await mkdir(cacheRoot, { recursive: true });
			await sharp(buffer)
				.rotate()
				.resize({ width, height: width, fit: "inside", withoutEnlargement: true })
				.webp({ quality: QUALITY })
				.toFile(cached);
			encoded++;
		}
		await mkdir(path.dirname(target), { recursive: true });
		await copyFile(cached, target);
	}
}

// Encode a few photos at once; sharp itself is already multi-threaded per image.
const queue = [...files];
const workers = Array.from({ length: Math.max(2, Math.min(4, availableParallelism())) }, async () => {
	while (queue.length > 0) await variants(queue.shift());
});
await Promise.all(workers);
console.log(`Image variants: ${encoded} encoded, ${files.length * WIDTHS.length - encoded} reused from cache.`);
