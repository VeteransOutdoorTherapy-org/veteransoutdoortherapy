import { HeroCollage } from "./hero-collage";
import { JotformEmbed } from "./jotform-embed";

const jotforms = {
	"veteran-application": { id: "250862137733054", title: "Combat Veteran Application" },
	"gold-star-family-application": { id: "250871818258062", title: "Gold Star Family Application" },
	"volunteer-fundraiser-host": { id: "250872219266057", title: "Fundraising, Volunteering, Host Application" },
} as const;

type ApplicationType = keyof typeof jotforms;

export function ApplicationFormPage({
	eyebrow,
	title,
	copy,
	type,
}: {
	eyebrow: string;
	title: string;
	copy: string;
	type: ApplicationType;
}) {
	const form = jotforms[type];
	return (
		<>
			<section className="page-hero compact-hero">
				<HeroCollage seed={9} />
				<div className="container">
					<p className="eyebrow">{eyebrow}</p>
					<h1 className="display">{title}</h1>
					<p>{copy}</p>
				</div>
			</section>
			<section className="section application-embed-section">
				<div className="container application-embed-layout">
					<div className="application-embed-intro">
						<p className="eyebrow">Confidential application</p>
						<h2 className="display section-title">Tell us about you.</h2>
						<p>
							There is no cost to participate in selected programs. Your information is used only to review and
							coordinate this request.
						</p>
					</div>
					<JotformEmbed formId={form.id} title={form.title} />
				</div>
			</section>
		</>
	);
}
