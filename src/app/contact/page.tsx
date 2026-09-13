import { IntakeForm } from "@/components/intake-form";
import { breadcrumbSchema, pageMetadata } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
export const metadata = pageMetadata({
	title: "Contact Veteran's Outdoor Therapy",
	description: "Contact Veteran's Outdoor Therapy about applications, outdoor program hosting, nonprofit sponsorships, volunteering, merchandise, or media requests.",
	path: "/contact",
});
export default function ContactPage() {
	return (
		<>
			<JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
			<section className="section">
				<div className="container form-layout">
					<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
					<div>
						<p className="eyebrow">Reach our team</p>
						<h1 className="display section-title">Contact Veteran&apos;s Outdoor Therapy.</h1>
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
