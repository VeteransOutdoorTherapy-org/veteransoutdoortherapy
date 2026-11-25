import "server-only";
import { createSign } from "crypto";
import { unstable_cache } from "next/cache";

/**
 * Reads Google Analytics 4 and Search Console for the admin dashboard, the way
 * Google's Site Kit plugin does for WordPress. It signs in as a Google Cloud
 * service account that has been given read access to both, so there is no
 * OAuth screen. Reports are cached for an hour to stay well inside Google's
 * free quotas.
 */

export const GOOGLE_DASHBOARD_TAG = "google-dashboard";

const SCOPES = [
	"https://www.googleapis.com/auth/analytics.readonly",
	"https://www.googleapis.com/auth/webmasters.readonly",
].join(" ");

export type Row = { label: string; value: number; secondary?: number };
type Section<T> = { data?: T; error?: string };

export type GoogleDashboard = {
	days: number;
	analytics: Section<{
		totals: { label: string; current: number; previous: number; format: "number" | "percent" | "seconds" }[];
		daily: { date: string; users: number }[];
		pages: Row[];
		channels: Row[];
		sources: Row[];
		devices: Row[];
		cities: Row[];
		events: Row[];
		adsCampaigns: Row[];
	}>;
	searchConsole: Section<{
		totals: { clicks: number; impressions: number; ctr: number; position: number };
		queries: Row[];
		pages: Row[];
	}>;
	fetchedAt: string;
};

/** What is configured, so the dashboard can show what is still missing. */
export function googleSetup() {
	return {
		serviceAccount: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() && process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.trim()),
		analyticsProperty: process.env.GA4_PROPERTY_ID?.trim() || "",
		searchConsoleSite: process.env.SEARCH_CONSOLE_SITE?.trim() || "",
		serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() || "",
	};
}

async function accessToken() {
	const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!.trim();
	// Vercel stores the key's line breaks as literal \n.
	const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY!.replace(/\\n/g, "\n").trim();
	const now = Math.floor(Date.now() / 1000);
	const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
	const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({ iss: email, scope: SCOPES, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
	const signature = createSign("RSA-SHA256").update(unsigned).sign(key, "base64url");
	const response = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
		cache: "no-store",
	});
	if (!response.ok) throw new Error(`Google sign-in failed (${response.status}): ${await response.text()}`);
	return ((await response.json()) as { access_token: string }).access_token;
}

async function postJson<T>(url: string, token: string, body: object): Promise<T> {
	const response = await fetch(url, {
		method: "POST",
		headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
		body: JSON.stringify(body),
		cache: "no-store",
	});
	if (!response.ok) {
		const detail = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
		throw new Error(detail?.error?.message || `Google returned ${response.status}`);
	}
	return response.json() as Promise<T>;
}

type ReportRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };

async function loadAnalytics(token: string, property: string, days: number) {
	const current = { startDate: `${days - 1}daysAgo`, endDate: "today" };
	const previous = { startDate: `${days * 2 - 1}daysAgo`, endDate: `${days}daysAgo` };
	const report = (body: object) =>
		postJson<{ rows?: ReportRow[] }>(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`, token, {
			dateRanges: [current],
			...body,
		}).then((result) => result.rows ?? []);
	const toRows = (rows: ReportRow[]): Row[] =>
		rows.map((row) => ({
			label: row.dimensionValues?.[0]?.value || "(not set)",
			value: Number(row.metricValues?.[0]?.value || 0),
			secondary: row.metricValues?.[1] ? Number(row.metricValues[1].value) : undefined,
		}));
	const top = (dimension: string, metrics: string[], limit: number, dimensionFilter?: object) =>
		report({
			dimensions: [{ name: dimension }],
			metrics: metrics.map((name) => ({ name })),
			orderBys: [{ metric: { metricName: metrics[0] }, desc: true }],
			limit,
			...(dimensionFilter && { dimensionFilter }),
		}).then(toRows);

	const totalMetrics = ["activeUsers", "sessions", "screenPageViews", "engagementRate", "averageSessionDuration"];
	const [totalRows, dailyRows, pages, channels, sources, devices, cities, events, adsCampaigns] = await Promise.all([
		report({ dateRanges: [current, previous], metrics: totalMetrics.map((name) => ({ name })) }),
		report({ dimensions: [{ name: "date" }], metrics: [{ name: "activeUsers" }], orderBys: [{ dimension: { dimensionName: "date" } }] }),
		top("pagePath", ["screenPageViews", "activeUsers"], 10),
		top("sessionDefaultChannelGroup", ["sessions"], 8),
		top("sessionSource", ["sessions"], 8),
		top("deviceCategory", ["activeUsers"], 4),
		top("city", ["activeUsers"], 8),
		// The events GA4 records on its own for every visit say nothing a visitor chose to do.
		top("eventName", ["eventCount"], 10, {
			notExpression: { filter: { fieldName: "eventName", inListFilter: { values: ["page_view", "session_start", "first_visit", "user_engagement", "scroll"] } } },
		}),
		top("sessionGoogleAdsCampaignName", ["sessions"], 8, {
			notExpression: { filter: { fieldName: "sessionGoogleAdsCampaignName", stringFilter: { value: "(not set)" } } },
		}),
	]);

	// With two date ranges GA4 labels each row date_range_0 (current) or date_range_1 (previous).
	const totalsFor = (range: string) => totalRows.find((row) => row.dimensionValues?.[0]?.value === range)?.metricValues ?? [];
	const now = totalsFor("date_range_0");
	const before = totalsFor("date_range_1");
	const labels: [string, "number" | "percent" | "seconds"][] = [
		["Visitors", "number"],
		["Sessions", "number"],
		["Page views", "number"],
		["Engagement rate", "percent"],
		["Avg. session", "seconds"],
	];
	return {
		totals: labels.map(([label, format], index) => ({
			label,
			format,
			current: Number(now[index]?.value || 0),
			previous: Number(before[index]?.value || 0),
		})),
		daily: dailyRows.map((row) => {
			const raw = row.dimensionValues?.[0]?.value || "";
			return { date: `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`, users: Number(row.metricValues?.[0]?.value || 0) };
		}),
		pages,
		channels,
		sources,
		devices,
		cities,
		events,
		adsCampaigns,
	};
}

async function loadSearchConsole(token: string, site: string, days: number) {
	const isoDaysAgo = (count: number) => new Date(Date.now() - count * 86_400_000).toISOString().slice(0, 10);
	type Result = { rows?: { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number }[] };
	const query = (dimensions: string[]) =>
		postJson<Result>(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, token, {
			startDate: isoDaysAgo(days - 1),
			endDate: isoDaysAgo(0),
			dimensions,
			rowLimit: 10,
		}).then((result) => result.rows ?? []);
	const [totals, queries, pages] = await Promise.all([query([]), query(["query"]), query(["page"])]);
	const toRows = (rows: Awaited<ReturnType<typeof query>>): Row[] =>
		rows.map((row) => ({ label: row.keys?.[0] || "", value: row.clicks, secondary: row.impressions }));
	return {
		totals: {
			clicks: totals[0]?.clicks ?? 0,
			impressions: totals[0]?.impressions ?? 0,
			ctr: totals[0]?.ctr ?? 0,
			position: totals[0]?.position ?? 0,
		},
		queries: toRows(queries),
		pages: toRows(pages).map((row) => ({ ...row, label: row.label.replace(/^https?:\/\/[^/]+/, "") || "/" })),
	};
}

async function settle<T>(work: () => Promise<T>): Promise<Section<T>> {
	try {
		return { data: await work() };
	} catch (error) {
		return { error: error instanceof Error ? error.message : String(error) };
	}
}

export const getGoogleDashboard = unstable_cache(
	async (days: number): Promise<GoogleDashboard> => {
		const setup = googleSetup();
		const notConfigured = { error: "Not connected yet." };
		let token: string | undefined;
		let signInError: string | undefined;
		if (setup.serviceAccount) {
			try {
				token = await accessToken();
			} catch (error) {
				signInError = error instanceof Error ? error.message : String(error);
			}
		}
		const section = <T,>(configured: string, work: (token: string) => Promise<T>): Promise<Section<T>> =>
			!configured || !setup.serviceAccount ? Promise.resolve(notConfigured) : token ? settle(() => work(token!)) : Promise.resolve({ error: signInError });
		const [analytics, searchConsole] = await Promise.all([
			section(setup.analyticsProperty, (accessToken) => loadAnalytics(accessToken, setup.analyticsProperty, days)),
			section(setup.searchConsoleSite, (accessToken) => loadSearchConsole(accessToken, setup.searchConsoleSite, days)),
		]);
		return { days, analytics, searchConsole, fetchedAt: new Date().toISOString() };
	},
	["google-dashboard"],
	{ revalidate: 3600, tags: [GOOGLE_DASHBOARD_TAG] },
);
