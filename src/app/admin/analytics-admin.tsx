import { ArrowClockwise, ArrowDownRight, ArrowUpRight, CheckCircle, Circle } from "@phosphor-icons/react/dist/ssr";
import type { Event } from "@/lib/data";
import { type GoogleDashboard, googleSetup, type Row } from "@/lib/google-analytics";
import { refreshGoogleDashboardAction } from "./actions";

export const ANALYTICS_RANGES = [7, 28, 90] as const;

const integer = new Intl.NumberFormat("en-US");

function formatValue(value: number, format: "number" | "percent" | "seconds") {
	if (format === "percent") return `${(value * 100).toFixed(1)}%`;
	if (format === "seconds") return `${Math.floor(value / 60)}m ${String(Math.round(value % 60)).padStart(2, "0")}s`;
	return integer.format(Math.round(value));
}

function Change({ current, previous }: { current: number; previous: number }) {
	if (!previous) return <span className="text-xs text-(--moss)">No earlier data</span>;
	const change = (current - previous) / previous;
	const up = change >= 0;
	const Icon = up ? ArrowUpRight : ArrowDownRight;
	return (
		<span className="inline-flex items-center gap-1 text-xs font-semibold text-(--moss)">
			<Icon size={14} weight="bold" aria-hidden="true" />
			{up ? "Up" : "Down"} {Math.abs(change * 100).toFixed(0)}% on the previous period
		</span>
	);
}

function Tile({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
	return (
		<div className="rounded-2xl bg-(--white) p-5 ring-1 ring-(--ink)/8">
			<div className="text-xs font-bold tracking-wide text-(--moss) uppercase">{label}</div>
			<div className="mt-1 text-3xl font-semibold text-(--ink)">{value}</div>
			<div className="mt-1">{children}</div>
		</div>
	);
}

/** One bar per row, single hue, scaled to the largest; the numbers stay in ink beside it. */
function RankedList({ title, rows, valueLabel, secondaryLabel, empty }: { title: string; rows: Row[]; valueLabel: string; secondaryLabel?: string; empty?: string }) {
	const max = Math.max(1, ...rows.map((row) => row.value));
	return (
		<div className="rounded-2xl bg-(--white) p-5 ring-1 ring-(--ink)/8">
			<h3 className="m-0 text-base font-semibold text-(--ink)">{title}</h3>
			{rows.length === 0 ? (
				<p className="mt-3 mb-0 text-sm text-(--moss)">{empty || "Nothing recorded in this period."}</p>
			) : (
				<table className="mt-3 w-full border-collapse text-sm">
					<thead>
						<tr className="text-left text-xs text-(--moss)">
							<th className="pb-2 font-semibold">&nbsp;</th>
							<th className="pb-2 text-right font-semibold">{valueLabel}</th>
							{secondaryLabel && <th className="pb-2 pl-3 text-right font-semibold">{secondaryLabel}</th>}
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr key={row.label} className="border-t border-(--ink)/6">
								<td className="w-full max-w-0 py-1.5 pr-3">
									<div className="truncate text-(--ink)" title={row.label}>
										{row.label}
									</div>
									<div className="mt-1 h-1.5 rounded-full bg-(--forest)/10">
										<div className="h-1.5 rounded-full bg-(--forest)" style={{ width: `${(row.value / max) * 100}%` }} />
									</div>
								</td>
								<td className="py-1.5 text-right font-semibold whitespace-nowrap text-(--ink) tabular-nums">{integer.format(row.value)}</td>
								{secondaryLabel && (
									<td className="py-1.5 pl-3 text-right whitespace-nowrap text-(--moss) tabular-nums">{integer.format(row.secondary ?? 0)}</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

/** Visitors per day: one 2px line over a faint area, with a hover target per day. */
function DailyChart({ daily }: { daily: { date: string; users: number }[] }) {
	if (daily.length < 2) return null;
	const width = 720;
	const height = 180;
	const pad = { top: 12, right: 8, bottom: 24, left: 8 };
	const max = Math.max(1, ...daily.map((day) => day.users));
	const x = (index: number) => pad.left + (index / (daily.length - 1)) * (width - pad.left - pad.right);
	const y = (value: number) => pad.top + (1 - value / max) * (height - pad.top - pad.bottom);
	const line = daily.map((day, index) => `${index ? "L" : "M"}${x(index).toFixed(1)},${y(day.users).toFixed(1)}`).join(" ");
	const baseline = height - pad.bottom;
	const label = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric" });
	const step = (width - pad.left - pad.right) / (daily.length - 1);
	return (
		<div className="rounded-2xl bg-(--white) p-5 ring-1 ring-(--ink)/8">
			<div className="flex items-baseline justify-between gap-3">
				<h3 className="m-0 text-base font-semibold text-(--ink)">Visitors per day</h3>
				<span className="text-xs text-(--moss)">Peak {integer.format(max)}</span>
			</div>
			<svg viewBox={`0 0 ${width} ${height}`} className="mt-3 block h-auto w-full" role="img" aria-label="Visitors per day">
				<line x1={pad.left} x2={width - pad.right} y1={baseline} y2={baseline} stroke="currentColor" className="text-(--ink)/15" />
				<path d={`${line} L${x(daily.length - 1)},${baseline} L${x(0)},${baseline} Z`} className="fill-(--orange)/10" />
				<path d={line} fill="none" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" className="stroke-(--orange)" />
				{daily.map((day, index) => (
					<g key={day.date} className="group">
						<circle cx={x(index)} cy={y(day.users)} r={4} className="fill-(--orange) opacity-0 group-hover:opacity-100" />
						<rect x={x(index) - step / 2} y={0} width={step} height={height} fill="transparent">
							<title>{`${label(day.date)}: ${integer.format(day.users)} visitors`}</title>
						</rect>
					</g>
				))}
				<text x={pad.left} y={height - 6} className="fill-(--moss) text-[11px]">
					{label(daily[0].date)}
				</text>
				<text x={width - pad.right} y={height - 6} textAnchor="end" className="fill-(--moss) text-[11px]">
					{label(daily[daily.length - 1].date)}
				</text>
			</svg>
		</div>
	);
}

function SetupStep({ done, children }: { done: boolean; children: React.ReactNode }) {
	const Icon = done ? CheckCircle : Circle;
	return (
		<li className="flex items-start gap-2">
			<Icon size={18} weight={done ? "fill" : "regular"} className={`mt-0.5 shrink-0 ${done ? "text-(--forest)" : "text-(--moss)"}`} aria-hidden="true" />
			<span>
				{children} <span className="sr-only">{done ? "(done)" : "(to do)"}</span>
			</span>
		</li>
	);
}

function SectionError({ message }: { message?: string }) {
	return <p className="form-error">{message === "Not connected yet." ? "Not connected yet. See the setup steps above." : `Google returned an error: ${message}`}</p>;
}

const AD_GRANTS_POLICY = "https://support.google.com/nonprofits/answer/9314402";

/** Campaigns worth running, each pointing at a page on this site that asks for one clear action. */
function campaignIdeas(events: Event[], pages: Row[]) {
	const today = new Date().toISOString().slice(0, 10);
	const viewsOf = (path: string) => pages.find((page) => page.label === path)?.value;
	const ticketed = events
		.filter((event) => event.published && event.ticketsUrl && !event.over && event.endDate >= today)
		.map((event) => {
			const place = event.location.split(",").map((part) => part.trim());
			const city = place.length > 1 ? place[place.length - 2] : place[0];
			return {
				name: `${event.title} tickets`,
				path: `/events/${event.slug}`,
				goal: `Ticket and table sales through the Zeffy form. Pause the campaign after ${event.date}.`,
				keywords: [event.title.toLowerCase(), "veterans benefit dinner", `fundraiser dinner ${city.toLowerCase()}`],
			};
		});
	return [
		...ticketed,
		{
			name: "Veteran applications",
			path: "/application",
			goal: "Applications from previously deployed Veterans and Gold Star family members.",
			keywords: ["outdoor programs for veterans", "veteran hunting trips", "veteran fishing trips", "gold star family programs"],
		},
		{
			name: "Donations",
			path: "/donate",
			goal: "Gifts through the Zeffy donation form.",
			keywords: ["donate to veterans charity", "veterans nonprofit missouri", "support combat veterans"],
		},
		{
			name: "Sponsors",
			path: "/sponsorships",
			goal: "Businesses and hosts asking about sponsorship.",
			keywords: ["sponsor a veteran hunt", "veteran charity sponsorship", "veterans event sponsor"],
		},
	].map((idea) => ({ ...idea, views: viewsOf(idea.path) }));
}

function AdGrantsSuggestions({ dashboard, events }: { dashboard: GoogleDashboard; events: Event[] }) {
	const { analytics, searchConsole } = dashboard;
	const keyEvents = analytics.data?.totals.find((total) => total.label === "Key events")?.current;
	const adsLinked = analytics.data ? analytics.data.adsCampaigns.length > 0 : undefined;
	// Searches of two or more words where the site sits past the first few results:
	// the ones an ad can put at the top. Ad Grants does not allow single-word keywords.
	const missed = (searchConsole.data?.queries ?? [])
		.filter((query) => query.label.trim().split(/\s+/).length >= 2 && (query.position ?? 0) > 8)
		.sort((a, b) => (b.secondary ?? 0) - (a.secondary ?? 0))
		.slice(0, 10);
	const ideas = campaignIdeas(events, analytics.data?.pages ?? []);
	return (
		<section className="flex flex-col gap-4">
			<h2 className="m-0" style={{ fontSize: "1.35rem" }}>
				Google Ad Grants · Suggestions
			</h2>
			<p className="m-0 max-w-3xl text-sm leading-6 text-(--moss)">
				Ad Grants gives nonprofits up to $10,000 a month in Google search ads. These suggestions come from this site&apos;s own numbers
				and pages.
			</p>
			<div className="rounded-2xl bg-(--white) p-5 ring-1 ring-(--ink)/8">
				<h3 className="m-0 text-base font-semibold text-(--ink)">Before the ads run</h3>
				<ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0 text-sm leading-6">
					<SetupStep done={Boolean(keyEvents)}>
						<strong>Conversion tracking.</strong>{" "}
						{keyEvents === undefined
							? "Connect Google Analytics to check it."
							: keyEvents
								? `${integer.format(keyEvents)} key events in the last ${dashboard.days} days.`
								: `No key events in the last ${dashboard.days} days.`}{" "}
						The grant requires at least one real conversion a month. In GA4, mark the actions that matter (a contact form sent, an
						application, tickets bought) as key events, then import them into Google Ads.
					</SetupStep>
					<SetupStep done={Boolean(adsLinked)}>
						<strong>Google Ads linked to Analytics.</strong> In GA4, Admin → Product links → Google Ads links. Campaign traffic then
						shows in the Google Ads panel above.
					</SetupStep>
				</ul>
				<h3 className="mt-5 mb-0 text-base font-semibold text-(--ink)">Rules that keep the grant active</h3>
				<ul className="mt-2 mb-0 flex flex-col gap-1 pl-5 text-sm leading-6 text-(--ink)">
					<li>
						Keep the account&apos;s click-through rate at 5% or higher each month; two months below it pauses the account. Pause keywords
						that are shown a lot but rarely clicked.
					</li>
					<li>Bid with Maximize conversions or another conversion-based strategy.</li>
					<li>Give each campaign at least two ad groups of closely related keywords.</li>
					<li>No single-word keywords, and none so broad they could mean anything.</li>
					<li>Count only real actions as conversions; time on the site is not one.</li>
				</ul>
				<a className="text-link mt-3 inline-block text-sm" href={AD_GRANTS_POLICY} target="_blank" rel="noreferrer">
					Google&apos;s Ad Grants policy guide
				</a>
			</div>
			<div className="grid gap-4 lg:grid-cols-2">
				{ideas.map((idea) => (
					<div key={idea.name} className="rounded-2xl bg-(--white) p-5 ring-1 ring-(--ink)/8">
						<div className="flex items-baseline justify-between gap-3">
							<h3 className="m-0 text-base font-semibold text-(--ink)">{idea.name}</h3>
							{idea.views !== undefined && <span className="text-xs whitespace-nowrap text-(--moss)">{integer.format(idea.views)} views</span>}
						</div>
						<p className="mt-1 mb-0 text-sm text-(--moss)">
							Landing page:{" "}
							<a className="text-link" href={idea.path} target="_blank" rel="noreferrer">
								{idea.path}
							</a>
						</p>
						<p className="mt-2 mb-0 text-sm leading-6 text-(--ink)">{idea.goal}</p>
						<div className="mt-3 flex flex-wrap gap-1.5">
							{idea.keywords.map((keyword) => (
								<span key={keyword} className="rounded-full bg-(--forest)/8 px-2.5 py-1 text-xs text-(--ink)">
									{keyword}
								</span>
							))}
						</div>
					</div>
				))}
			</div>
			<div className="rounded-2xl bg-(--white) p-5 ring-1 ring-(--ink)/8">
				<h3 className="m-0 text-base font-semibold text-(--ink)">Searches the site is missing</h3>
				<p className="mt-1 mb-0 text-sm text-(--moss)">
					People search these and Google shows the site below the first few results. Ad keywords can put it on top.
				</p>
				{!searchConsole.data ? (
					<p className="mt-3 mb-0 text-sm text-(--moss)">Connect Search Console to see these.</p>
				) : missed.length === 0 ? (
					<p className="mt-3 mb-0 text-sm text-(--moss)">None in this period: the site already ranks near the top for its searches.</p>
				) : (
					<table className="mt-3 w-full border-collapse text-sm">
						<thead>
							<tr className="text-left text-xs text-(--moss)">
								<th className="pb-2 font-semibold">Search</th>
								<th className="pb-2 text-right font-semibold">Shown</th>
								<th className="pb-2 pl-3 text-right font-semibold">Position</th>
							</tr>
						</thead>
						<tbody>
							{missed.map((query) => (
								<tr key={query.label} className="border-t border-(--ink)/6">
									<td className="py-1.5 pr-3 text-(--ink)">{query.label}</td>
									<td className="py-1.5 text-right text-(--ink) tabular-nums">{integer.format(query.secondary ?? 0)}</td>
									<td className="py-1.5 pl-3 text-right text-(--moss) tabular-nums">{(query.position ?? 0).toFixed(1)}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</section>
	);
}

export function AnalyticsAdmin({ dashboard, events }: { dashboard: GoogleDashboard; events: Event[] }) {
	const setup = googleSetup();
	const ready = setup.serviceAccount && setup.analyticsProperty && setup.searchConsoleSite;
	const { analytics, searchConsole } = dashboard;
	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex gap-2" role="group" aria-label="Date range">
					{ANALYTICS_RANGES.map((days) => (
						<a
							key={days}
							href={`/admin?view=analytics&range=${days}`}
							className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-(--ink)/15 ${dashboard.days === days ? "bg-(--forest)" : "bg-(--white)"}`}
							// Inline, because the site's own link color outranks Tailwind's utilities.
							style={{ color: dashboard.days === days ? "#fff" : "var(--ink)" }}
							aria-current={dashboard.days === days ? "true" : undefined}
						>
							Last {days} days
						</a>
					))}
				</div>
				<form action={refreshGoogleDashboardAction} className="flex items-center gap-3 text-xs text-(--moss)">
					<input type="hidden" name="range" value={dashboard.days} />
					Updated {new Date(dashboard.fetchedAt).toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "medium", timeStyle: "short" })}
					<button className="button secondary" type="submit">
						<ArrowClockwise size={16} /> Refresh
					</button>
				</form>
			</div>

			{!ready && (
				<div className="rounded-2xl bg-(--orange)/8 p-5 text-sm leading-6 ring-1 ring-(--orange)/20">
					<strong className="block">Connect Google</strong>
					<ul className="m-0 mt-2 flex list-none flex-col gap-1.5 p-0">
						<SetupStep done={setup.serviceAccount}>
							A Google Cloud service account, with its email and private key in Vercel as GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_KEY.
						</SetupStep>
						<SetupStep done={Boolean(setup.analyticsProperty)}>
							The Google Analytics 4 property ID in GA4_PROPERTY_ID, with the service account added to that property as a Viewer.
						</SetupStep>
						<SetupStep done={Boolean(setup.searchConsoleSite)}>
							The Search Console property in SEARCH_CONSOLE_SITE (for example sc-domain:veteransoutdoortherapy.org), with the service account added as a user.
						</SetupStep>
					</ul>
				</div>
			)}

			<section className="flex flex-col gap-4">
				<h2 className="m-0" style={{ fontSize: "1.35rem" }}>Visitors · Google Analytics</h2>
				{analytics.data ? (
					<>
						<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
							{analytics.data.totals.map((total) => (
								<Tile key={total.label} label={total.label} value={formatValue(total.current, total.format)}>
									<Change current={total.current} previous={total.previous} />
								</Tile>
							))}
						</div>
						<DailyChart daily={analytics.data.daily} />
						<div className="grid gap-4 lg:grid-cols-2">
							<RankedList title="Top pages" rows={analytics.data.pages} valueLabel="Views" secondaryLabel="Visitors" />
							<RankedList title="How people arrive" rows={analytics.data.channels} valueLabel="Sessions" />
							<RankedList title="Top sources" rows={analytics.data.sources} valueLabel="Sessions" />
							<RankedList title="What visitors did" rows={analytics.data.events} valueLabel="Times" empty="No actions beyond page views in this period." />
							<RankedList title="Devices" rows={analytics.data.devices} valueLabel="Visitors" />
							<RankedList title="Cities" rows={analytics.data.cities} valueLabel="Visitors" />
							<RankedList
								title="Google Ads campaigns"
								rows={analytics.data.adsCampaigns}
								valueLabel="Sessions"
								empty="No ad traffic. Campaigns appear here once Google Ads is linked to this Analytics property."
							/>
						</div>
					</>
				) : (
					<SectionError message={analytics.error} />
				)}
			</section>

			<section className="flex flex-col gap-4">
				<h2 className="m-0" style={{ fontSize: "1.35rem" }}>Google Search · Search Console</h2>
				{searchConsole.data ? (
					<>
						<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
							<Tile label="Clicks" value={integer.format(searchConsole.data.totals.clicks)} />
							<Tile label="Impressions" value={integer.format(searchConsole.data.totals.impressions)} />
							<Tile label="Click rate" value={`${(searchConsole.data.totals.ctr * 100).toFixed(1)}%`} />
							<Tile label="Avg. position" value={searchConsole.data.totals.position ? searchConsole.data.totals.position.toFixed(1) : "–"} />
						</div>
						<p className="m-0 text-xs text-(--moss)">Search data runs two to three days behind.</p>
						<div className="grid gap-4 lg:grid-cols-2">
							<RankedList title="Top searches" rows={searchConsole.data.queries.slice(0, 10)} valueLabel="Clicks" secondaryLabel="Shown" />
							<RankedList title="Top pages in search" rows={searchConsole.data.pages} valueLabel="Clicks" secondaryLabel="Shown" />
						</div>
					</>
				) : (
					<SectionError message={searchConsole.error} />
				)}
			</section>

			<AdGrantsSuggestions dashboard={dashboard} events={events} />
		</div>
	);
}
