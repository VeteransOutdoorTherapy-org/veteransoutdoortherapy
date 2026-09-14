import { ArrowRight, FileText, HandHeart, Shield, Star } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Breadcrumbs } from "./breadcrumbs";
import { HeroCollage } from "./hero-collage";
import { SectionEdge } from "./section-edge";

const paths = [
	{
		icon: Shield,
		title: "Veteran application",
		copy: "For previously deployed Veterans. The application asks about your deployment history, and a DD214 is required before a trip is confirmed.",
		href: "/veteran-application",
		action: "Apply as a Veteran",
	},
	{
		icon: Star,
		title: "Gold Star family",
		copy: "Request support and outdoor opportunities for Gold Star family members and children.",
		href: "/gold-star-family-application",
		action: "Apply as a family",
	},
	{
		icon: HandHeart,
		title: "Volunteer, host, or fundraiser",
		copy: "Offer your time, property, expertise, or fundraising support to help make an adventure possible.",
		href: "/fundraising-application",
		action: "Join the mission",
	},
];

export function ApplicationHub() {
	return (
		<>
			<section className="page-hero application-hero">
				<SectionEdge color="var(--paper)" variant="a" flip />
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
					{paths.map(({ icon: Icon, title, copy, href, action }, index) => (
						<article key={href}>
							<span className="path-number">0{index + 1}</span>
							<Icon size={34} />
							<h2 className="display">{title}</h2>
							<p>{copy}</p>
							<Link className="text-link" href={href}>
								{action} <ArrowRight size={17} />
							</Link>
						</article>
					))}
				</div>
			</section>
			<section className="section eligibility-section">
				<div className="container eligibility-grid">
					<div>
						<p className="eyebrow">Before you apply</p>
						<h2 className="display section-title">Who these programs are for.</h2>
						<p className="prose">
							Our outdoor programs exist for Veterans who deployed, and for Gold Star families and their children. That
							focus is deliberate: the experiences are built around what deployment leaves behind, and around the company
							of others who carry the same thing.
						</p>
					</div>
					<div className="eligibility-points">
						<div>
							<Shield size={26} />
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
							<Star size={26} />
							<h3 className="display">Gold Star families</h3>
							<p>
								Gold Star family members and children apply through the family application instead. No DD214 is needed;
								we will ask about your service member and how your family would like to be honored.
							</p>
						</div>
					</div>
				</div>
			</section>
			<section className="application-note">
				<div className="container">
					<strong>Selected applicants pay nothing. Travel, lodging, meals, and gear are covered.</strong>
					<p>
						Our team reviews each application personally and contacts applicants directly about fit, availability,
						accessibility, and next steps.
					</p>
				</div>
			</section>
		</>
	);
}
