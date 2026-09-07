/**
 * Checks that the PayPal gateway is configured correctly before testing checkout.
 *
 * Run with:
 *   node --env-file=.env.local scripts/verify-paypal.mjs
 */

const REQUIRED = [
	"NEXT_PUBLIC_PAYPAL_CLIENT_ID",
	"PAYPAL_CLIENT_ID",
	"PAYPAL_CLIENT_SECRET",
	"PAYPAL_API_BASE",
];

const SANDBOX_BASE = "https://api-m.sandbox.paypal.com";
const LIVE_BASE = "https://api-m.paypal.com";

const problems = [];
const notes = [];

const envFile = process.execArgv.concat(process.argv).find((arg) => arg.startsWith("--env-file"))?.split("=")[1];
if (envFile) {
	const { readFileSync } = await import("node:fs");
	const seen = new Map();
	for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
		const match = /^([A-Z_0-9]+)=/.exec(line);
		if (match) seen.set(match[1], (seen.get(match[1]) || 0) + 1);
	}
	const duplicates = [...seen].filter(([, count]) => count > 1).map(([key]) => key);
	if (duplicates.length) notes.push(`Duplicate keys in ${envFile} (last one wins): ${duplicates.join(", ")}`);
}

function value(name) {
	return process.env[name]?.trim() || "";
}

for (const name of REQUIRED) {
	if (!value(name)) problems.push(`${name} is not set.`);
}

if (!value("DATABASE_URL")) {
	notes.push("DATABASE_URL is not set. PayPal will authenticate, but checkout cannot create order records yet.");
}

if (!value("PAYPAL_WEBHOOK_ID")) {
	notes.push("PAYPAL_WEBHOOK_ID is not set. Card capture still works, but refunds and denials will not reconcile.");
}

if (value("NEXT_PUBLIC_PAYPAL_CLIENT_ID") && value("PAYPAL_CLIENT_ID") && value("NEXT_PUBLIC_PAYPAL_CLIENT_ID") !== value("PAYPAL_CLIENT_ID")) {
	problems.push("NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_ID differ. The browser and the server must use the same PayPal app.");
}

const apiBase = value("PAYPAL_API_BASE") || SANDBOX_BASE;
if (apiBase !== SANDBOX_BASE && apiBase !== LIVE_BASE) {
	problems.push(`PAYPAL_API_BASE is "${apiBase}". Expected ${SANDBOX_BASE} or ${LIVE_BASE}.`);
}

if (problems.length) {
	console.error("PayPal configuration is incomplete:\n");
	for (const problem of problems) console.error(`  - ${problem}`);
	console.error("\nAdd the missing values to .env.local, then run this script again.");
	process.exit(1);
}

const secretLength = value("PAYPAL_CLIENT_SECRET").length;
if (secretLength && secretLength < 70) {
	notes.push(`PAYPAL_CLIENT_SECRET is ${secretLength} characters. PayPal secrets are normally about 80, so this paste may be truncated.`);
}

for (const note of notes) console.warn(`Warning: ${note}`);
notes.length = 0;

const mode = apiBase === LIVE_BASE ? "LIVE" : "sandbox";
console.log(`Mode: ${mode} (${apiBase})`);

const credentials = Buffer.from(`${value("PAYPAL_CLIENT_ID")}:${value("PAYPAL_CLIENT_SECRET")}`).toString("base64");
const tokenResponse = await fetch(`${apiBase}/v1/oauth2/token`, {
	method: "POST",
	headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
	body: "grant_type=client_credentials",
});
const tokenBody = await tokenResponse.json();
if (!tokenResponse.ok || !tokenBody.access_token) {
	console.error(`Authentication failed (HTTP ${tokenResponse.status}): ${tokenBody.error_description || tokenBody.error || "unknown error"}`);
	console.error("Confirm the client ID and secret belong to the same app, and that the app matches the selected PAYPAL_API_BASE.");
	process.exit(1);
}
console.log(`Authentication: ok (token expires in ${tokenBody.expires_in}s)`);

const webhookId = value("PAYPAL_WEBHOOK_ID");
if (webhookId) {
	const webhookResponse = await fetch(`${apiBase}/v1/notifications/webhooks`, {
		headers: { Authorization: `Bearer ${tokenBody.access_token}` },
	});
	const webhookBody = await webhookResponse.json();
	const match = webhookBody.webhooks?.find((hook) => hook.id === webhookId);
	if (!match) {
		console.error(`Webhook ${webhookId} does not exist on this PayPal app.`);
		const available = webhookBody.webhooks?.map((hook) => `${hook.id} -> ${hook.url}`) || [];
		if (available.length) console.error(`Webhooks on this app:\n  ${available.join("\n  ")}`);
		process.exit(1);
	}
	const subscribed = match.event_types?.map((event) => event.name) || [];
	const missing = ["PAYMENT.CAPTURE.COMPLETED", "PAYMENT.CAPTURE.REFUNDED", "PAYMENT.CAPTURE.DENIED"].filter(
		(event) => !subscribed.includes(event) && !subscribed.includes("*"),
	);
	console.log(`Webhook: ${match.url}`);
	if (missing.length) notes.push(`Webhook is not subscribed to: ${missing.join(", ")}`);
}

for (const note of notes) console.warn(`Warning: ${note}`);
console.log(`\nPayPal ${mode} configuration is ready.`);
