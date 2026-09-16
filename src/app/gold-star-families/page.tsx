import { Handshake, Mountains, Users } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/site";
import { HeroCollage } from "@/components/hero-collage";
import { SectionEdge } from "@/components/section-edge";

export const metadata = pageMetadata({
	title: "Outdoor Experiences for Gold Star Family Members",
	description:
		"Veteran's Outdoor Therapy hosts the spouses, parents, children, and siblings of fallen service members on hunting, fishing, and horseback experiences built around remembrance and connection.",
	path: "/gold-star-families",
});

const faqs = [
	{
		question: "Who should use the Gold Star application?",
		answer:
			"Any Gold Star family member: the spouse, parent, child, or sibling of a service member who died. You apply as an individual, and the team follows up with you directly to answer questions and talk through what is available.",
	},
	{
		question: "What kinds of experiences may be available?",
		answer:
			"Fishing, hiking, horseback riding, hunting, conservation, and other hosted time outdoors. Availability changes with the event calendar and with what each host can take on.",
	},
	{
		question: "What is arranged if I am selected?",
		answer:
			"Each experience is coordinated with its host ahead of time, including the activity, lodging, and meals. What the program carries varies by event, and the team confirms the details with you, including anything you are responsible for, before you take part.",
	},
	{
		question: "Can I ask questions before applying?",
		answer:
			"Yes. Contact Veteran's Outdoor Therapy before you submit anything, to talk through participation, accessibility needs, and how your information is handled.",
	},
];

export default function GoldStarFamiliesPage() {
	return (
		<>
			<JsonLd data={[
				breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Gold Star family members", path: "/gold-star-families" }]),
				faqSchema(faqs),
			]} />
			<section className="page-hero">
				<HeroCollage seed={4} />
				<div className="container">
					<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Gold Star family members" }]} />
					<p className="eyebrow">Remembrance, connection, and open air</p>
					<h1 className="display">Outdoor experiences for Gold Star family members.</h1>
					<p>
						Whether you are a spouse, a parent, a child, or a sibling, you apply as yourself rather than on behalf of a
						household, and the team works with you directly from there.
					</p>
				</div>
				<SectionEdge color="var(--paper)" variant="b" />
			</section>
			<section className="section">
				<div className="container value-grid">
					<div><Mountains size={30} /><h2>Time outside</h2><p>Fishing, trails, and ranch settings give the day a shared focus, with no expectation that you tell your story to anyone.</p></div>
					<div><Users size={30} /><h2>Hosted around you</h2><p>The team talks through the experience, what you need in order to take part, and how to prepare, with you and with the host.</p></div>
					<div><Handshake size={30} /><h2>Settled in advance</h2><p>The activity, lodging, and meals are coordinated with the host, and the details are confirmed with you before the event.</p></div>
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
