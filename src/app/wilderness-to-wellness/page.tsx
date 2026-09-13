import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { HeroCollage } from "@/components/hero-collage";
export const metadata = pageMetadata({
	title: "Wilderness to Wellness Benefit",
	description: "Learn about the Wilderness to Wellness benefit supporting outdoor experiences for previously deployed Veterans and Gold Star families.",
	path: "/wilderness-to-wellness",
});
export default function WellnessPage() {
	return (
		<>
			<section className="page-hero">
				<HeroCollage seed={7} />
				<div className="container">
					<p className="eyebrow">Wilderness to Wellness</p>
					<h1 className="display">Wilderness to Wellness.</h1>
					<p>
						Join us for an evening that celebrates the power of nature, community, and resilience. Wilderness to
						Wellness is more than a banquet — it&apos;s a journey through stories of service, healing, and hope.
					</p>
					<Link className="button orange" href="/contact">
						Ask about the next event
					</Link>
				</div>
			</section>
			<section className="section">
				<div className="container story-copy">
					<p className="eyebrow">Join us on the path</p>
					<h2 className="display section-title">From Wilderness to Wellness.</h2>
					<p className="prose">
						Together, we honor the service and sacrifice of our nation&apos;s heroes while sharing the transformative
						peace that comes from the great outdoors. The 2026 event sold out, and our next Benefit Banquet Dinner
						is being planned for 2027.
					</p>
					<Link className="text-link" href="/sponsorships">
						Join us in making a difference
					</Link>
				</div>
			</section>
		</>
	);
}
