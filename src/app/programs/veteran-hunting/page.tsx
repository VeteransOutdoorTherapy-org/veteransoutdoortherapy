import { Check, Compass, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
	title: "Veteran Hunting Trips and Outdoor Adventures",
	description:
		"Learn how previously deployed Veterans can apply for fully funded turkey, antelope, and other ethical hunting experiences with Veteran's Outdoor Therapy.",
	path: "/programs/veteran-hunting",
});

const faqs = [
	{
		question: "Who can apply for a Veteran hunting trip?",
		answer:
			"Previously deployed Veterans may submit the Veteran application. Each hunt has its own capacity, location, dates, licensing needs, and physical considerations, so selection is made for the specific experience.",
	},
	{
		question: "What does a fully funded hunt include?",
		answer:
			"Selected participants attend at no cost. Support may include core travel, lodging, meals, field access, shared equipment, and activity expenses. The team confirms exactly what is included before each hunt.",
	},
	{
		question: "Do I need hunting experience or my own equipment?",
		answer:
			"Requirements differ by hunt. Use the application to share your experience, equipment access, licensing status, and support needs. The team and host can then explain preparation and whether the event is a good fit.",
	},
	{
		question: "How do hosts support ethical hunting and conservation?",
		answer:
			"Outfitters, guides, landowners, and volunteers help participants understand local rules, licensing, field safety, ethical harvest practices, and respect for the land and wildlife.",
	},
];

export default function VeteranHuntingPage() {
	return (
		<>
			<JsonLd data={[
				breadcrumbSchema([
					{ name: "Home", path: "/" },
					{ name: "Programs", path: "/programs" },
					{ name: "Veteran hunting", path: "/programs/veteran-hunting" },
				]),
				faqSchema(faqs),
			]} />
			<section className="page-hero">
				<div className="container">
					<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Programs", href: "/programs" }, { label: "Veteran hunting" }]} />
					<p className="eyebrow">Purpose, preparation, and open country</p>
					<h1 className="display">Hunting experiences for Veterans, built around camaraderie.</h1>
					<p>
						Supported hunts bring previously deployed Veterans together with experienced hosts for ethical field
						experiences grounded in connection, conservation, and shared effort.
					</p>
				</div>
			</section>
			<section className="section">
				<div className="container value-grid">
					<div><Compass /><h2>Shared purpose</h2><p>Scouting, preparation, time in the field, and shared meals give each group a natural reason to work and talk together.</p></div>
					<div><ShieldCheck /><h2>Responsible field practice</h2><p>Hosts set expectations around local regulations, safety, equipment, wildlife, and respect for the land.</p></div>
					<div><Check /><h2>Costs covered</h2><p>Selected participants attend at no cost, with event-specific travel, lodging, meals, gear, and activity details confirmed in advance.</p></div>
				</div>
			</section>
			<section className="section faq-section">
				<div className="container">
					<p className="eyebrow">Veteran hunting questions</p>
					<h2 className="display section-title">Prepare for the right experience.</h2>
					<div className="faq-grid">
						{faqs.map((faq, index) => (
						<article key={faq.question}>
							<span className="faq-index">{String(index + 1).padStart(2, "0")}</span>
							<h3>{faq.question}</h3>
							<p>{faq.answer}</p>
						</article>
					))}
					</div>
					<div className="hero-actions">
						<Link className="button orange" href="/veteran-application">Apply as a Veteran</Link>
						<Link className="text-link" href="/events">View upcoming hunts</Link>
						<Link className="text-link" href="/fundraising-application">Offer land or expertise</Link>
						<Link className="text-link" href="/field-stories">Read recent hunt recaps</Link>
					</div>
				</div>
			</section>
		</>
	);
}
