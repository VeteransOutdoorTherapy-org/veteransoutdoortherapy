// Lists every landscape photo under public/wp-content/uploads, so the gallery
// can keep its two-column tiles for photos that are wider than they are tall.
// Runs before each build; the output is committed so dev works without it.
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.join(process.cwd(), "public");
const uploads = path.join(root, "wp-content", "uploads");
const files = (await readdir(uploads, { recursive: true })).filter((file) => /\.(jpe?g|png|webp)$/i.test(file));

const landscape = [];
for (const file of files) {
	const { width, height, orientation } = await sharp(path.join(uploads, file)).metadata();
	// EXIF orientations 5–8 are rotated a quarter turn, which swaps width and height on screen.
	const [w, h] = orientation >= 5 ? [height, width] : [width, height];
	if (w > h) landscape.push(`/${path.relative(root, path.join(uploads, file)).split(path.sep).join("/")}`);
}

landscape.sort();
await writeFile("src/lib/gallery-landscape.json", `${JSON.stringify(landscape, null, "\t")}\n`);
console.log(`${landscape.length} of ${files.length} uploads are landscape.`);
