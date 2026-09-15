import { Handshake, Mountains, Users } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/site";
import { HeroCollage } from "@/components/hero-collage";
import { SectionEdge } from "@/components/section-edge";

export const metadata = pageMetadata({
	title: "Outdoor Support for Gold Star Families",
	description:
		"Veteran's Outdoor Therapy welcomes Gold Star family members — spouses, parents, children, and siblings of the fallen — into thoughtfully hosted outdoor experiences centered on remembrance and connection.",
	path: "/gold-star-families",
});

const faqs = [
	{
		question: "Who should use the Gold Star application?",
		answer:
			"Any Gold Star family member — the spouse, parent, child, or sibling of a service member who died — can submit the dedicated application as an individual. The team follows up directly to answer questions and discuss available opportunities.",
	},
	{
		question: "What kinds of experiences may be available?",
		answer:
			"Programs may include fishing, hiking, horseback riding, hunting, conservation, and other hosted time outdoors. Availability changes with the event calendar, host capacity, and the needs of each group.",
	},
	{
		question: "What is arranged for selected families?",
		answer:
			"Each experience is coordinated with its host ahead of time, including the activity, lodging, and meals. What the program carries varies by event, and the team confirms the details, including anything a family is responsible for, before participation.",
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
					<h1 className="display">Outdoor experiences for Gold Star family members.</h1>
					<p>
						Thoughtfully hosted time outside creates room for families to honor service, share experience, and connect
						with a community that respects the meaning of their loss.
					</p>
				</div>
				<SectionEdge color="var(--paper)" variant="b" />
			</section>
			<section className="section">
				<div className="container value-grid">
					<div><Mountains size={30} /><h2>Time outside</h2><p>Fishing, trails, ranch settings, and other outdoor activities provide a shared focus without asking anyone to tell their story publicly.</p></div>
					<div><Users size={30} /><h2>Thoughtful hosting</h2><p>The team works with each person and the host to discuss the specific experience, participation needs, and practical preparation.</p></div>
					<div><Handshake size={30} /><h2>Arranged in advance</h2><p>Hosting, lodging, meals, and activities are coordinated with the host, and the details are confirmed with each participant before the event.</p></div>
				</div>
			</section>
			<section className="section faq-section">
				<div className="container">
					<p className="eyebrow">Before you apply</p>
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
