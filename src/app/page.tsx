import { ArrowRight, Compass, Handshake, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { MissionFilm } from "@/components/mission-film";
import { SectionEdge } from "@/components/section-edge";
import { ProductCard } from "@/components/product-card";
import { contributionCopy, imageFocusStyle, mission } from "@/lib/data";
import { getEvents, getProducts } from "@/lib/db";
import { pageMetadata } from "@/lib/site";
import { sponsorLogos } from "@/lib/sponsors";

export const metadata = pageMetadata({
	title: "Veteran's Outdoor Therapy | Outdoor Experiences for Veterans and Gold Star Families",
	description: "Veteran's Outdoor Therapy creates hunting, fishing, horseback riding, and outdoor experiences for previously deployed Veterans and Gold Star families, built around healing and camaraderie outdoors.",
	path: "/",
});

const homepageSponsors = sponsorLogos.filter((sponsor) => sponsor.featured);

export default async function Home() {
	const [products, events] = await Promise.all([getProducts(), getEvents()]);
	const merchandise = products.filter((item) => item.category === "Merchandise" && item.featured);
	const today = new Date().toISOString().slice(0, 10);
	// Whatever is next on the calendar, including TBA placeholders, so this fills itself as events are added.
	const upcomingEvents = events
		.filter((event) => event.published && !event.over && event.endDate >= today)
		.sort((a, b) => a.startDate.localeCompare(b.startDate) || a.sortOrder - b.sortOrder)
		.slice(0, 3);
	return (
		<>
			<section className="hero has-edge">
				<div className="hero-shade" />
				<div className="container hero-content">
					<p className="eyebrow">Previously deployed Veterans · Gold Star families</p>
					<h1 className="display">Honoring Our Nation&apos;s Heroes with outdoor experiences</h1>
					<p>
						Hiking, horseback riding, fishing, and hunting — a blend of physical activity, camaraderie, and emotional
						healing for Soldiers who have been deployed, and for Gold Star families.
					</p>
					<div className="hero-actions">
						<Link className="button orange" href="/application">
							Find your adventure <ArrowRight size={18} />
						</Link>
						<Link className="button hero-secondary" href="/donate">
							Fund a trip
						</Link>
					</div>
				</div>
				<SectionEdge color="#efece1" />
			</section>
			<section className="mission-band">
				<div className="container mission-grid">
					<div className="mission-heading">
						<p className="eyebrow">Our mission</p>
						<h2 className="display">Service deserves more than thanks.</h2>
					</div>
					<p className="mission-copy">{mission}</p>
				</div>
			</section>
			<MissionFilm />
			<section className="section">
				<div className="container">
					<p className="eyebrow">In the field</p>
					<h2 className="display section-title">The next trail starts here.</h2>
					<div className="event-strip">
						{upcomingEvents.map((event, index) => (
							<Link className="event-card" href={`/events/${event.slug}`} key={event.slug} style={imageFocusStyle(event)}>
								<Image src={event.image} alt={`${event.type} at ${event.location}`} fill sizes="(max-width: 700px) 100vw, 33vw" />
								<div className="event-number">0{index + 1}</div>
								<div className="event-copy">
									<span>{event.date}</span>
									<h3 className="display">{event.title}</h3>
									<p>{event.type}</p>
								</div>
							</Link>
						))}
					</div>
					<div className="link-row">
						<div className="link-row-actions">
							<Link className="button secondary" href="/events">View all adventures</Link>
							<Link className="button secondary" href="/field-stories">Read stories from the field</Link>
						</div>
					</div>
				</div>
			</section>
			<section className="sponsor-badge-band" aria-labelledby="homepage-sponsors-title">
				<div className="container">
					<div className="sponsor-badge-heading">
						<h2 id="homepage-sponsors-title">Partners in the mission</h2>
						<Link className="text-link" href="/sponsorships">
							Partner with us <ArrowRight size={17} />
						</Link>
					</div>
					<div className="sponsor-badge-grid">
						{homepageSponsors.map((sponsor) => (
							<figure key={sponsor.image}>
								<Image src={sponsor.image} alt={sponsor.name} fill sizes="(max-width: 560px) 50vw, 17vw" />
							</figure>
						))}
					</div>
				</div>
			</section>
			<section className="impact">
				<div className="container impact-grid">
					<div>
						<p className="eyebrow">Why outdoors</p>
						<h2 className="display section-title">A different kind of support.</h2>
					</div>
					<div className="impact-points">
						<div>
							<Compass size={30} />
							<h3>Open country</h3>
							<p>Long days outside, hard effort, and quiet when quiet is the thing that helps.</p>
						</div>
						<div>
							<Handshake size={30} />
							<h3>People who get it</h3>
							<p>You go out with Veterans who carry the same thing, so nothing needs explaining.</p>
						</div>
						<div>
							<ShieldCheck size={30} />
							<h3>Sorted before you arrive</h3>
							<p>Hosts, field access, licensing, and lodging are arranged well ahead of the dates.</p>
						</div>
					</div>
				</div>
			</section>
			<section className="section field-film has-edge" aria-labelledby="field-film-title">
				<SectionEdge color="#dedfd6" variant="a" flip />
				<SectionEdge color="#f5f2e8" variant="b" />
				<div className="container">
					<div className="field-film-heading">
						<div>
							<p className="eyebrow">New from the field</p>
							<h2 className="display section-title" id="field-film-title">Healing through horses.</h2>
						</div>
						<div className="field-film-intro">
							<p>
								See how time with horses, trusted hosts, and fellow Veterans creates room for connection beyond
								the noise of everyday life.
							</p>
							<div className="field-film-actions">
								<Link className="button orange" href="/programs">Explore our programs</Link>
								<Link className="text-link" href="/sponsorships">
									Help fund the mission <ArrowRight size={17} />
								</Link>
							</div>
						</div>
					</div>
					<div className="field-film-video">
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
			<section className="section">
				<div className="container">
					<p className="eyebrow">Mission gear</p>
					<h2 className="display section-title">Wear your support.</h2>
					<p className="prose">Every order is a donation: it pays for lodging, meals, and gear in the field.</p>
					<div className="product-grid">
						{merchandise.map((product) => (
							<ProductCard key={product.slug} product={product} />
						))}
					</div>
				</div>
			</section>
			<section className="contribution">
				<div className="container contribution-grid">
					<div>
						<p className="eyebrow">Every contribution makes a difference</p>
						<h2 className="display section-title">Show our Veterans they are never alone.</h2>
					</div>
					<div>
						<p>{contributionCopy}</p>
						<div className="hero-actions">
							<Link className="button orange" href="/donate">
								Donate now
							</Link>
							<Link className="text-link" href="/sponsorships">
								Explore sponsorships <ArrowRight size={17} />
							</Link>
						</div>
					</div>
				</div>
			</section>
			<section className="quote has-edge">
				<SectionEdge color="#d4d9ce" variant="b" flip />
				<div className="container">
					<span>“</span>
					<blockquote>
						<p>
							This event meant the world to me! It gave me hope again in America and our country. It made me realize
							that I am not alone and there are other members who have been through what I have.
						</p>
						<p>
							The community involved in this event was the best. They lifted my spirits so much! It was emotional for me
							and very much needed.
						</p>
					</blockquote>
					<p>Derek · Army Purple Heart Recipient</p>
				</div>
			</section>
		</>
	);
}
