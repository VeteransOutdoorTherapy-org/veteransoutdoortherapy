import { ArrowRight, HandHeart, Shield, Star } from "lucide-react";
import Link from "next/link";

const paths = [
	{
		icon: Shield,
		title: "Veteran application",
		copy: "Apply for an outdoor experience built around connection, challenge, and time outside.",
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
				<div className="container">
					<p className="eyebrow">There is a place for you here</p>
					<h1 className="display">
						Choose your
						<br />
						way forward.
					</h1>
					<p>Whether you are seeking an outdoor experience or helping create one, start with the path that fits you.</p>
				</div>
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
