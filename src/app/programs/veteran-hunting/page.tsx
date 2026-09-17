import { ArrowRight, Check, Compass, Quotes, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/site";
import { HeroCollage } from "@/components/hero-collage";
import { SectionEdge } from "@/components/section-edge";
import { getEvents, getPublishedTestimonials } from "@/lib/db";
import { publicName } from "@/lib/names";
import { imageFocusStyle } from "@/lib/data";

export const metadata = pageMetadata({
	title: "Veteran Hunting Trips and Outdoor Adventures",
	description:
		"Learn how previously deployed Veterans can apply for turkey, antelope, and other ethical hunting experiences with Veteran's Outdoor Therapy, hosted on private land across the country.",
	path: "/programs/veteran-hunting",
});

const faqs = [
	{
		question: "Who can apply for a Veteran hunting trip?",
		answer:
			"Previously deployed Veterans may submit the Veteran application. Each hunt has its own capacity, location, dates, licensing needs, and physical considerations, so selection is made for the specific experience.",
	},
	{
		question: "What does a hunt include?",
		answer:
			"Each hunt is built around its host and location, with field access, licensing, lodging, meals, and shared equipment arranged ahead of time. What the hunt carries varies by event, and the team confirms exactly what is included, and anything you are responsible for, before you travel.",
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

/** Hunts only, soonest first, with finished ones filling in behind the upcoming. */
/**
 * A few of the experiences we run, as examples of the kind of thing a Veteran
 * might be placed on. Nobody applies to a particular trip, so this is not an
 * availability list: hunts lead because this is the hunting page, and other
 * activities fill the row behind them.
 */
async function outdoorExperiences() {
	const published = (await getEvents()).filter((event) => event.published);
	const recent = [...published].sort((a, b) => b.endDate.localeCompare(a.endDate));
	const hunts = recent.filter((event) => /hunt/i.test(event.type));
	const rest = recent.filter((event) => !/hunt/i.test(event.type));
	// One card per experience: these repeat each year, and two editions of the
	// same trip side by side read as a duplicate.
	const seen = new Set<string>();
	return [...hunts, ...rest].filter((event) => !seen.has(event.title) && seen.add(event.title)).slice(0, 3);
}

export default async function VeteranHuntingPage() {
	const [experiences, testimonials] = await Promise.all([outdoorExperiences(), getPublishedTestimonials()]);
	// Short quotes only: these sit three across, so a long one would tower over its neighbours.
	const short = testimonials.filter((testimonial) => testimonial.quote.length <= 320);
	const voices = [
		...short.filter((testimonial) => /hunt/i.test(testimonial.category ?? "")),
		...short.filter((testimonial) => !/hunt/i.test(testimonial.category ?? "")),
	].slice(0, 3);
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
				<HeroCollage seed={6} />
				<div className="container">
					<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "Programs", href: "/programs" }, { label: "Veteran hunting" }]} />
					<p className="eyebrow">Purpose, preparation, and open country</p>
					<h1 className="display">Hunting experiences for Veterans, built around camaraderie.</h1>
					<p>
						Supported hunts bring previously deployed Veterans together with experienced hosts for ethical field
						experiences grounded in connection, conservation, and shared effort.
					</p>
				</div>
				<SectionEdge color="var(--paper)" variant="a" />
			</section>
			<section className="section has-edge">
				<div className="container value-grid">
					<div><Compass size={30} /><h2>A reason to work together</h2><p>Scouting, preparation, long days in the field, and meals at the end of them give a group something to do side by side.</p></div>
					<div><ShieldCheck size={30} /><h2>Ethics in the field</h2><p>Hosts set clear expectations on regulations, safety, equipment, and respect for the animal and the ground it lives on.</p></div>
					<div><Check size={30} /><h2>Settled before you travel</h2><p>Field access, licensing, lodging, and shared equipment are organized with the host and confirmed with you first.</p></div>
				</div>
				{voices.length > 0 && <SectionEdge color="#efece1" variant="b" />}
			</section>
			{voices.length > 0 && (
				<section className="voices-band has-edge">
					<div className="container">
						<div className="voices-head">
							<p className="eyebrow">Veterans who have hunted</p>
							<h2 className="display section-title">What they took from the field.</h2>
						</div>
						<div className="voices-grid">
							{voices.map((testimonial) => (
								<figure key={testimonial.slug}>
									<Quotes size={30} weight="fill" className="quote-icon" aria-hidden="true" />
									<blockquote>{testimonial.quote}</blockquote>
									<figcaption>
										{publicName(testimonial.author)}
										<span>{testimonial.service}</span>
									</figcaption>
								</figure>
							))}
						</div>
						<Link className="text-link" href="/testimonials">Read more testimonials <ArrowRight size={17} /></Link>
					</div>
					<SectionEdge color="#e4e6df" variant="a" />
				</section>
			)}
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
			{experiences.length > 0 && (
				<section className="section has-edge">
					<SectionEdge color="var(--paper)" variant="b" above />
					<div className="container">
						<p className="eyebrow">What these trips look like</p>
						<h2 className="display section-title">Apply for a place on an outdoor adventure.</h2>
						<div className="past-events-grid">
							{experiences.map((event) => (
								<article key={event.slug}>
									<div className="past-event-image" style={imageFocusStyle(event)}>
										<Image src={event.image} alt={event.title} fill sizes="(max-width: 700px) 100vw, 33vw" />
									</div>
									<p className="eyebrow">{event.type}</p>
									<h3 className="display">{event.title}</h3>
									<strong>{event.date}{event.location ? ` | ${event.location}` : ""}</strong>
									<p>{event.summary}</p>
									<div className="card-actions">
										<Link className="text-link" href={`/events/${event.slug}`}>
											View event details <ArrowRight size={17} />
										</Link>
									</div>
								</article>
							))}
						</div>
					</div>
				</section>
			)}
		</>
	);
}
