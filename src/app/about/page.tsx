import { Campfire, ClipboardText, Mountains, PawPrint, ShieldChevron, UsersThree } from "@phosphor-icons/react/dist/ssr";
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
							<ShieldChevron size={30} />
							<h3 className="display">Deployment is the door</h3>
							<p>
								This is for Veterans who deployed, and for the families of those who did not come home. Narrow on
								purpose: the whole thing works because everyone in the truck has something in common.
							</p>
						</div>
						<div>
							<Mountains size={30} />
							<h3 className="display">The outdoors does the work</h3>
							<p>
								No clinic, no folding chairs in a circle, nobody made to talk. Hard effort, long days, cold mornings,
								and the quiet that comes with them.
							</p>
						</div>
						<div>
							<Campfire size={30} />
							<h3 className="display">Nothing needs explaining</h3>
							<p>
								You go out with people who carry the same weight. What gets said around the fire stays at the fire,
								and what never gets said is fine too.
							</p>
						</div>
						<div>
							<PawPrint size={30} />
							<h3 className="display">Fair chase, or not at all</h3>
							<p>
								Every trip is held to local regulation, safe handling, and respect for the animal and the ground it
								lives on. A hunt that cannot be done right does not happen.
							</p>
						</div>
						<div>
							<ClipboardText size={30} />
							<h3 className="display">Straight answers first</h3>
							<p>
								Dates, terrain, physical demands, licensing, and what you are responsible for are settled before you
								commit &mdash; not discovered when you arrive.
							</p>
						</div>
						<div>
							<UsersThree size={30} />
							<h3 className="display">The trip is not the point</h3>
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
