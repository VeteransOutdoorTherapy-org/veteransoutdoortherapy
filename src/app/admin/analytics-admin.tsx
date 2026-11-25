import { ArrowClockwise, ArrowDownRight, ArrowUpRight, CheckCircle, Circle } from "@phosphor-icons/react/dist/ssr";
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

export function AnalyticsAdmin({ dashboard }: { dashboard: GoogleDashboard }) {
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
						<div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
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
							<RankedList title="Top searches" rows={searchConsole.data.queries} valueLabel="Clicks" secondaryLabel="Shown" />
							<RankedList title="Top pages in search" rows={searchConsole.data.pages} valueLabel="Clicks" secondaryLabel="Shown" />
						</div>
					</>
				) : (
					<SectionError message={searchConsole.error} />
				)}
			</section>
		</div>
	);
}
