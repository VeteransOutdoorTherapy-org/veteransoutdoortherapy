import Image from "next/image";
import Link from "next/link";
import { MissionFilm } from "@/components/mission-film";
import { missionLong } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/site";
import { HeroCollage } from "@/components/hero-collage";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionEdge } from "@/components/section-edge";
const compass = [
	"Camaraderie",
	"Open country",
	"Hands busy",
	"Evenings around the fire",
	"People who open their land",
	"It outlasts the trip",
];

export const metadata = pageMetadata({
	title: "About Veteran's Outdoor Therapy",
	description: "Meet the 501(c)(3) nonprofit creating outdoor experiences where previously deployed Veterans and Gold Star families can reconnect and build community.",
	path: "/about",
});
export default function AboutPage() {
	return (
		<>
			<JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
			<section className="page-hero">
				<HeroCollage seed={1} />
				<div className="container">
					<Breadcrumbs light items={[{ label: "Home", href: "/" }, { label: "About" }]} />
					<p className="eyebrow">Built for those who served</p>
					<h1 className="display">Our mission is built around service, nature, and shared experience.</h1>
				</div>
				<SectionEdge color="var(--paper)" variant="a" />
			</section>
			<section className="section">
				<div className="container story-grid">
					<div>
						<p className="eyebrow">Our mission</p>
						<h2 className="display section-title">Honor in motion.</h2>
						<p className="prose">{missionLong}</p>
						<div className="hero-actions">
							<Link className="button orange" href="/application">
								Take the next step
							</Link>
							<Link className="text-link" href="/programs">Explore outdoor programs</Link>
						</div>
					</div>
					<div className="story-image">
						<Image
							src="/wp-content/uploads/2026/09/snagging/campfire-01.jpg"
							alt="Veterans gathering outdoors"
							fill
							sizes="(max-width: 800px) 100vw, 50vw"
						/>
					</div>
				</div>
			</section>
			<MissionFilm />
			<section className="compass-ribbon has-edge">
				<SectionEdge color="#e4e6df" variant="a" flip />
				<div className="container">
					<p className="eyebrow">Our compass</p>
					<ul>
						{compass.map((point) => (
							<li key={point}>{point}</li>
						))}
					</ul>
				</div>
				<SectionEdge color="#e4e6df" variant="b" />
			</section>
			<section className="section mission-film">
				<div className="container healing-grid">
					<div>
						<p className="eyebrow">New from the field</p>
						<h2 className="display section-title">Healing through horses.</h2>
						<p className="prose">
							See how time with horses, trusted hosts, and fellow Veterans creates room for connection beyond
							the noise of everyday life.
						</p>
					</div>
					<div className="healing-video">
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
