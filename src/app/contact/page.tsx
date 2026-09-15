import { IntakeForm } from "@/components/intake-form";
import { breadcrumbSchema, pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { HeroCollage } from "@/components/hero-collage";
import { SectionEdge } from "@/components/section-edge";
export const metadata = pageMetadata({
	title: "Contact Veteran's Outdoor Therapy",
	description: "Contact Veteran's Outdoor Therapy about applications, outdoor program hosting, nonprofit sponsorships, volunteering, merchandise, or media requests.",
	path: "/contact",
});
export default function ContactPage() {
	return (
		<>
			<JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
			<section className="page-hero">
				<HeroCollage seed={14} />
				<div className="container">
					<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
					<p className="eyebrow">Reach our team</p>
					<h1 className="display">Contact Veteran&apos;s Outdoor Therapy.</h1>
					<p>
						Questions about applying, hosting an experience, sponsoring the mission, or volunteering all reach the same
						team. Send a note and we will follow up.
					</p>
				</div>
				<SectionEdge color="var(--paper)" variant="a" />
			</section>
			<section className="section">
				<div className="container form-layout">
					<div>
						<p className="eyebrow">Direct contact</p>
						<h2 className="display section-title">Reach us here.</h2>
						<p>
							Email{" "}
							<a className="text-link" href="mailto:contact@veteransoutdoortherapy.org">
								contact@veteransoutdoortherapy.org
							</a>
						</p>
						<p>
							Hours: Monday-Friday, 9 AM-6 PM
							<br />
							Saturday-Sunday, 10 AM-3 PM
						</p>
					</div>
					<IntakeForm kind="contact" includeType={false} />
				</div>
			</section>
		</>
	);
}
