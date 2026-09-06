import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SponsorOpportunities } from "@/components/sponsor-opportunities";
import { getProducts } from "@/lib/db";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/site";
import { sponsorLogos } from "@/lib/sponsors";
export const metadata = pageMetadata({
	title: "Sponsor Outdoor Programs for Veterans",
	description: "Fund travel, lodging, meals, gear, guides, and field access for Veteran and Gold Star family outdoor experiences through a nonprofit sponsorship.",
	path: "/sponsorships",
});
const tierDetails: Record<string, { tagline: string; benefits: string[] }> = {
	"bronze-sponsor": {
		tagline: "Help Make A Difference",
		benefits: [
			"Recognition on our website",
			"Free sponsor badge",
			"Newsletter mention",
			"Social media shoutout",
			"Event participation",
		],
	},
	"silver-sponsor": {
		tagline: "Sponsor A Hero",
		benefits: [
			"Partial Veteran sponsorship",
			"Logo on event materials",
			"Priority event invitations",
			"Dedicated social media post",
			"Exclusive networking opportunities",
			"Annual appreciation dinner invite",
		],
	},
	"gold-sponsor": {
		tagline: "Sponsor an Event",
		benefits: [
			"Fund a full event",
			"Prominent logo placement",
			"Priority event invitations",
			"Dedicated social media post",
			"Exclusive networking opportunities",
			"Feature in press releases",
			"Social media shoutout",
			"VIP access to events",
		],
	},
};
const customTier = {
	tagline: "Build a custom partnership",
	benefits: [
		"Direct support for outdoor programs",
		"Recognition tailored to your partnership",
		"Connection with mission events",
		"Personal planning with our team",
	],
};
const sponsorFaqs = [
	{
		question: "What does a nonprofit sponsorship fund?",
		answer: "Sponsorships help cover practical program costs such as travel, lodging, meals, field access, guides, equipment, and activity expenses for selected Veterans and Gold Star family participants.",
	},
	{
		question: "Can a business sponsor a specific hunt or event?",
		answer: "Yes. Businesses and organizations can ask about supporting a specific scheduled experience or building a custom partnership around a program need, event, service, or location.",
	},
	{
		question: "Are in-kind contributions accepted?",
		answer: "Potential partners can offer land access, lodging, transportation, meals, equipment, professional expertise, event services, or other in-kind support. The team reviews each offer against current program needs.",
	},
	{
		question: "How are mission partners recognized?",
		answer: "Recognition can include the website, event materials, social media, and event participation depending on the partnership. Custom arrangements are discussed directly so expectations are clear.",
	},
];
export default async function SponsorPage() {
	const levels = (await getProducts())
		.filter((item) => item.category === "Sponsorships" && item.slug !== "custom-sponsor")
		.sort((a, b) => a.price - b.price);
	return (
		<>
			<JsonLd data={[
				breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Sponsorships", path: "/sponsorships" }]),
				faqSchema(sponsorFaqs),
			]} />
			<section className="page-hero sponsor-hero">
				<div className="container">
					<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Sponsorships" }]} />
					<p className="eyebrow">Empower our heroes through nature</p>
					<h1 className="display">Put your organization behind a fully funded outdoor experience.</h1>
					<p>
						Support the travel, lodging, meals, gear, field access, and shared time behind outdoor programs for
						previously deployed Veterans and Gold Star families.
					</p>
					<Link className="button orange" href="#tiers">
						Explore sponsorships
					</Link>
				</div>
			</section>
			<section className="section" id="tiers">
				<div className="container">
					<p className="eyebrow">Sponsorship tiers</p>
					<h2 className="display section-title">Choose your impact.</h2>
					<div className="sponsor-grid">
						{levels.map((level) => {
							const details = tierDetails[level.slug] ?? customTier;
							return (
								<article key={level.slug}>
									<p className="eyebrow">{level.shortName}</p>
									<h2 className="display">${level.price.toLocaleString()}+</h2>
									<strong>{details.tagline}</strong>
									{details.benefits.map((benefit) => (
										<span key={benefit}>
											<Check size={17} />
											{benefit}
										</span>
									))}
									<Link className="button" href={`/product/${level.slug}`}>
										Become a sponsor
									</Link>
								</article>
							);
						})}
					</div>
				</div>
			</section>
			<section className="sponsor-proof">
				<div className="container">
					<div>
						<p className="eyebrow">What sponsorship funds</p>
						<h2 className="display">Travel. Gear. Meals. Time together.</h2>
					</div>
					<p>
						Every level helps cover the practical details behind fully funded hunts, fishing trips, horseback camps,
						hikes, and community events.
					</p>
					<Link className="button orange" href="/contact">
						Build a custom partnership
					</Link>
				</div>
			</section>
			<section className="section">
				<div className="container">
					<p className="eyebrow">With gratitude</p>
					<h2 className="display section-title">2025 Sponsors</h2>
					<div className="sponsor-logos">
						{sponsorLogos.map((sponsor) => (
							<figure key={sponsor.image}>
								<Image src={sponsor.image} alt={sponsor.name} fill sizes="(max-width: 600px) 50vw, 20vw" />
							</figure>
						))}
					</div>
				</div>
			</section>
			<section className="section sponsor-events-section">
				<div className="container">
					<p className="eyebrow">Annual sponsorship opportunities</p>
					<h2 className="display section-title">There is always a mission to fund.</h2>
					<p className="prose sponsor-events-intro">
						Our core experiences return each year, with new opportunities added as hosts and funding allow. Sponsor the next cycle of a cause that fits your organization.
					</p>
					<SponsorOpportunities />
				</div>
			</section>
			<section className="section faq-section">
				<div className="container">
					<p className="eyebrow">Partnership questions</p>
					<h2 className="display section-title">Build support around real program needs.</h2>
					<div className="faq-grid">
						{sponsorFaqs.map((faq, index) => (
						<article key={faq.question}>
							<span className="faq-index">{String(index + 1).padStart(2, "0")}</span>
							<h3>{faq.question}</h3>
							<p>{faq.answer}</p>
						</article>
					))}
					</div>
				</div>
			</section>
			<section className="giving-band">
				<div className="container">
					<div>
						<p className="eyebrow">Get involved today</p>
						<h2 className="display">Your support changes lives.</h2>
					</div>
					<p>
						Your support helps make carefully hosted outdoor experiences available to Veterans and Gold Star families.
						Choose a sponsorship level or contact the team to build a partnership around a specific need.
					</p>
					<Link className="button orange" href="/product/custom-sponsor">
						Become a sponsor
					</Link>
					<div className="giving-band-video">
						<iframe
							src="https://www.youtube-nocookie.com/embed/lDsib0mkSAM"
							title="Healing through Horses - Veteran's Outdoor Therapy"
							width="1280"
							height="720"
							loading="lazy"
							referrerPolicy="strict-origin-when-cross-origin"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowFullScreen
						/>
					</div>
				</div>
			</section>
		</>
	);
}
