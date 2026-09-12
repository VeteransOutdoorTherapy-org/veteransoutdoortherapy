/**
 * Builds the 1200x630 social share card from the horizontal logo.
 *
 * Run with:
 *   node scripts/generate-og-image.mjs
 */
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const INK = "#23432d";

const logo = await sharp("public/vot-logo-horizontal.png")
	.resize({ width: 860, fit: "inside", withoutEnlargement: false })
	.toBuffer();

const caption = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
	<text x="${WIDTH / 2}" y="545" text-anchor="middle" fill="#f5f2e8" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" letter-spacing="1">
		Fully funded outdoor experiences for Veterans
	</text>
	<text x="${WIDTH / 2}" y="590" text-anchor="middle" fill="#c9d4c4" font-family="Arial, Helvetica, sans-serif" font-size="27">
		Hunting · Fishing · Horseback riding · Gold Star families
	</text>
</svg>`);

await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 4, background: INK } })
	.composite([
		{ input: logo, gravity: "north", top: 90, left: Math.round((WIDTH - 860) / 2) },
		{ input: caption, top: 0, left: 0 },
	])
	.png()
	.toFile("public/og-image.png");

console.log("wrote public/og-image.png (1200x630)");
