import { FileText, HandHeart, Medal, ShieldChevron, Star } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Breadcrumbs } from "./breadcrumbs";
import { HeroCollage } from "./hero-collage";
import { SectionEdge } from "./section-edge";

const paths = [
	{
		icon: ShieldChevron,
		ribbon: "For those who deployed",
		title: "Veteran application",
		copy: "For previously deployed Veterans. The application asks about your deployment history, and a DD214 is required before a trip is confirmed.",
		href: "/veteran-application",
		action: "Apply as a Veteran",
	},
	{
		icon: Star,
		ribbon: "For the families of the fallen",
		title: "Gold Star family member",
		copy: "For anyone who lost a service member — a spouse, parent, child, or sibling. You apply as yourself, not on behalf of a household.",
		href: "/gold-star-family-application",
		action: "Apply as a Gold Star family member",
	},
	{
		icon: HandHeart,
		ribbon: "For those who make it possible",
		title: "Volunteer, host, or fundraiser",
		copy: "Offer your time, property, expertise, or fundraising support to help make an outdoor experience possible.",
		href: "/fundraising-application",
		action: "Join the mission",
	},
];

export function ApplicationHub() {
	return (
		<>
			<section className="page-hero application-hero">
				<HeroCollage seed={10} />
				<div className="container">
					<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Applications" }]} />
					<p className="eyebrow">There is a place for you here</p>
					<h1 className="display">
						Choose your
						<br />
						way forward.
					</h1>
					<p>Whether you are seeking an outdoor experience or helping create one, start with the path that fits you.</p>
				</div>
				<SectionEdge color="var(--paper)" variant="b" />
			</section>
			<section className="section">
				<div className="container application-grid">
					{paths.map(({ icon: Icon, ribbon, title, copy, href, action }) => (
						<Link className="path-card" key={href} href={href}>
							<span className="path-ribbon">{ribbon}</span>
							<span className="path-medallion">
								<Icon size={30} weight="duotone" />
							</span>
							<h2 className="display">{title}</h2>
							<p>{copy}</p>
							<span className="path-action">{action}</span>
						</Link>
					))}
				</div>
			</section>
			<section className="section eligibility-section">
				<div className="container eligibility-grid">
					<div>
						<p className="eyebrow">Before you apply</p>
						<h2 className="display section-title">Who these programs are for.</h2>
						<p className="prose">
							Our outdoor programs exist for Veterans who deployed, and for Gold Star family members. That focus is
							deliberate: the experiences are built around what deployment leaves behind, and around the company of
							others who carry the same thing.
						</p>
					</div>
					<div className="eligibility-points">
						<div>
							<ShieldChevron size={26} />
							<h3 className="display">Deployment history</h3>
							<p>
								The Veteran application asks where and when you deployed. Combat service is not required, but a
								deployment is, and we ask you to describe it in your own words.
							</p>
						</div>
						<div>
							<FileText size={26} />
							<h3 className="display">DD214 or service records</h3>
							<p>
								Selected applicants provide a DD214 (member copy 4, or any copy showing character of service and
								deployment) before a trip is confirmed. Do not send it with your application; our team will ask for it
								directly when your application moves forward.
							</p>
						</div>
						<div>
							<Medal size={26} />
							<h3 className="display">Gold Star family members</h3>
							<p>
								A Gold Star family member &mdash; a spouse, parent, child, or sibling of a service member who died &mdash;
								applies through the Gold Star application instead. No DD214 is needed; we will ask about your service
								member and how you would like them honored.
							</p>
						</div>
					</div>
				</div>
			</section>
			<section className="application-note">
				<div className="container">
					<strong>Every application is read by a person, not a form.</strong>
					<p>
						Our team reviews each application personally and contacts applicants directly about fit, availability,
						accessibility, and next steps.
					</p>
				</div>
			</section>
		</>
	);
}
