import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionEdge } from "@/components/section-edge";
export const metadata = pageMetadata({
	title: "2026 Benefit Raffle Archive",
	description: "View the completed 2026 Veteran's Outdoor Therapy benefit raffle and find current outdoor events and ways to support the mission.",
	path: "/2026-gun-raffle",
	noIndex: true,
});
export default function RafflePage() {
	return (
		<section className="page-hero">
			<SectionEdge color="var(--paper)" variant="a" flip />
			<div className="container">
				<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "2026 Gun Raffle" }]} />
				<p className="eyebrow">Annual benefit raffle</p>
				<h1 className="display">2026 Veteran&apos;s Outdoor Therapy benefit raffle.</h1>
				<p>
					Tickets were $20 for three chances to win. The drawing took place March 13, 2026 at the Wilderness to Wellness
					benefit dinner. All state and federal firearm regulations apply.
				</p>
				<Link className="button orange" href="/events">
					See upcoming events
				</Link>
			</div>
		</section>
	);
}
