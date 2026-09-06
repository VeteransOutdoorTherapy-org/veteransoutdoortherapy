import { Binoculars, Fish, Footprints, Trees } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { MissionFilm } from "@/components/mission-film";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
	title: "Outdoor Programs for Veterans and Gold Star Families",
	description:
		"Explore fully funded hunting, fishing, horseback riding, hiking, and conservation experiences for previously deployed Veterans and Gold Star families.",
	path: "/programs",
});

const programs = [
	{
		icon: Fish,
		title: "Fishing",
		copy: "Time on the water creates a steady setting for conversation, reflection, and connection with others who understand military service and loss.",
		href: "/field-stories/white-river-fly-fishing-2026",
	},
	{
		icon: Binoculars,
		title: "Veteran hunting",
		copy: "Supported turkey, antelope, and other ethical hunting experiences combine skilled hosts, shared purpose, conservation, and time in the field.",
		href: "/programs/veteran-hunting",
	},
	{
		icon: Footprints,
		title: "Horseback riding and hiking",
		copy: "Trails and ranch experiences offer movement, new perspective, and unhurried time with a community built around mutual respect.",
		href: "/field-stories/coulter-lake-female-veteran-horseback-adventure-2026",
	},
	{
		icon: Trees,
		title: "Conservation",
		copy: "Service-oriented outdoor days care for natural places while giving participants and partners a practical way to work side by side.",
	},
];

const faqs = [
	{
		question: "Who can apply for an outdoor program?",
		answer:
			"Veteran's Outdoor Therapy invites previously deployed Veterans and Gold Star family members to apply. The team reviews applications for each experience and follows up about eligibility, availability, and fit.",
	},
	{
		question: "What costs are covered for selected participants?",
		answer:
			"Selected participants attend at no cost. Depending on the experience, program support may include core travel, lodging, meals, gear, and activity expenses. Event-specific details are confirmed before the trip.",
	},
	{
		question: "Do applicants need outdoor experience?",
		answer:
			"Experience requirements vary by activity. Applicants can describe their background, accessibility needs, and questions in the application so the team can discuss the right opportunity and preparation.",
	},
	{
		question: "Can an outfitter, landowner, guide, or volunteer help?",
		answer:
			"Yes. Hosts and volunteers can offer land access, outdoor expertise, equipment, event support, transportation, or fundraising help. The involvement application is the best place to begin the conversation.",
	},
];

export default function ProgramsPage() {
	return (
		<>
			<JsonLd data={[breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Programs", path: "/programs" }]), faqSchema(faqs)]} />
			<section className="page-hero">
				<div className="container">
					<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Programs" }]} />
					<p className="eyebrow">Fully funded time in the field</p>
					<h1 className="display">Outdoor programs shaped around connection and the field.</h1>
					<p>
						Veteran&apos;s Outdoor Therapy creates hunting, fishing, horseback riding, hiking, and conservation
						experiences for previously deployed Veterans and Gold Star families.
					</p>
				</div>
			</section>
			<section className="section">
				<div className="container program-grid">
					{programs.map(({ icon: Icon, title, copy, href }) => (
						<article key={title}>
							<Icon />
							<h2 className="display">{title}</h2>
							<p>{copy}</p>
							{href && <Link className="text-link" href={href}>Explore {title}</Link>}
						</article>
					))}
				</div>
			</section>
			<MissionFilm />
			<section className="section faq-section">
				<div className="container">
					<p className="eyebrow">Program questions</p>
					<h2 className="display section-title">What to know before applying.</h2>
					<div className="faq-grid">
						{faqs.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}
					</div>
					<div className="hero-actions">
						<Link className="button orange" href="/application">Choose an application</Link>
						<Link className="text-link" href="/events">View upcoming experiences</Link>
					</div>
				</div>
			</section>
		</>
	);
}
