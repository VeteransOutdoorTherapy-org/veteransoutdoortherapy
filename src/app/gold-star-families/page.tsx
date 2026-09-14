import { Handshake, Mountains, Users } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/site";
import { HeroCollage } from "@/components/hero-collage";

export const metadata = pageMetadata({
	title: "Outdoor Support for Gold Star Families",
	description:
		"Veteran's Outdoor Therapy welcomes Gold Star families into thoughtfully hosted outdoor experiences centered on remembrance, connection, and time together.",
	path: "/gold-star-families",
});

const faqs = [
	{
		question: "Who should use the Gold Star family application?",
		answer:
			"Gold Star family members interested in an outdoor experience can submit the dedicated application. The team follows up directly to learn about the family, answer questions, and discuss available opportunities.",
	},
	{
		question: "What kinds of experiences may be available?",
		answer:
			"Programs may include fishing, hiking, horseback riding, hunting, conservation, and other hosted time outdoors. Availability changes with the event calendar, host capacity, and the needs of each group.",
	},
	{
		question: "What costs are covered?",
		answer:
			"Selected participants attend at no cost. Depending on the experience, support may include core travel, lodging, meals, gear, and activity expenses. Details are confirmed before participation.",
	},
	{
		question: "Can I ask questions before applying?",
		answer:
			"Yes. Families can contact Veteran's Outdoor Therapy before submitting an application to discuss participation, children or family considerations, accessibility needs, and privacy questions.",
	},
];

export default function GoldStarFamiliesPage() {
	return (
		<>
			<JsonLd data={[
				breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Gold Star families", path: "/gold-star-families" }]),
				faqSchema(faqs),
			]} />
			<section className="page-hero">
				<HeroCollage seed={4} />
				<div className="container">
					<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Gold Star families" }]} />
					<p className="eyebrow">Remembrance, connection, and open air</p>
					<h1 className="display">Outdoor experiences for Gold Star families.</h1>
					<p>
						Thoughtfully hosted time outside creates room for families to honor service, share experience, and connect
						with a community that respects the meaning of their loss.
					</p>
				</div>
			</section>
			<section className="section">
				<div className="container value-grid">
					<div><Mountains size={30} /><h2>Time outside</h2><p>Fishing, trails, ranch settings, and other outdoor activities provide a shared focus without asking families to tell their story publicly.</p></div>
					<div><Users size={30} /><h2>Thoughtful hosting</h2><p>The team works with families and hosts to discuss the specific experience, participation needs, and practical preparation.</p></div>
					<div><Handshake size={30} /><h2>Costs covered</h2><p>Selected families attend at no cost, with event-specific travel, lodging, meals, gear, and activity support confirmed in advance.</p></div>
				</div>
			</section>
			<section className="section faq-section">
				<div className="container">
					<p className="eyebrow">Family questions</p>
					<h2 className="display section-title">Start with a private conversation.</h2>
					<div className="faq-grid">
						{faqs.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}
					</div>
					<div className="hero-actions">
						<Link className="button orange" href="/gold-star-family-application">Apply as a Gold Star family member</Link>
						<Link className="text-link" href="/contact">Contact the team</Link>
					</div>
				</div>
			</section>
		</>
	);
}
