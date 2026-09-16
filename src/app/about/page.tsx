import { Binoculars, Campfire, Handshake, Mountains, Path, UsersThree } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { MissionFilm } from "@/components/mission-film";
import { missionLong } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/site";
import { HeroCollage } from "@/components/hero-collage";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SectionEdge } from "@/components/section-edge";
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
			<section className="values">
				<div className="container">
					<p className="eyebrow">Our compass</p>
					<h2 className="display section-title">What we hold to.</h2>
					<div className="value-grid">
						<div>
							<UsersThree size={30} />
							<h3 className="display">Camaraderie first</h3>
							<p>
								The company of people who have carried the same things. Most of what helps happens between the truck
								and the treeline, and none of it has to be arranged.
							</p>
						</div>
						<div>
							<Mountains size={30} />
							<h3 className="display">Nature does the therapy</h3>
							<p>
								Open country, hard effort, and long stretches of quiet. It is in our name because it is the whole
								idea &mdash; the outdoors reaches places a waiting room cannot.
							</p>
						</div>
						<div>
							<Binoculars size={30} />
							<h3 className="display">Hands busy, not sat down</h3>
							<p>
								Scouting a ridge, working a paddle, tending a horse, cooking for eight. Doing something together beats
								being asked how you are doing.
							</p>
						</div>
						<div>
							<Campfire size={30} />
							<h3 className="display">The fire is the meeting</h3>
							<p>
								Coffee before light and a meal after dark are not extras on the schedule. They are where the week
								actually happens.
							</p>
						</div>
						<div>
							<Handshake size={30} />
							<h3 className="display">Hosts who open their ground</h3>
							<p>
								Landowners, guides, and volunteers give their land, their time, and their know-how. Every trip exists
								because somebody offered something of their own.
							</p>
						</div>
						<div>
							<Path size={30} />
							<h3 className="display">It carries past the last day</h3>
							<p>
								A week outside is the beginning. What matters is who is still picking up the phone months after the
								trucks are unloaded.
							</p>
						</div>
					</div>
				</div>
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
