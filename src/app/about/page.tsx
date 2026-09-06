import Image from "next/image";
import Link from "next/link";
import { MissionFilm } from "@/components/mission-film";
import { mission } from "@/lib/data";
import { pageMetadata } from "@/lib/site";
export const metadata = pageMetadata({
	title: "About Veteran's Outdoor Therapy",
	description: "Meet the 501(c)(3) nonprofit creating outdoor experiences where previously deployed Veterans and Gold Star families can reconnect and build community.",
	path: "/about",
});
export default function AboutPage() {
	return (
		<>
			<section className="page-hero">
				<div className="container">
					<p className="eyebrow">Built for those who served</p>
					<h1 className="display">Our mission is built around service, nature, and shared experience.</h1>
				</div>
			</section>
			<section className="section">
				<div className="container story-grid">
					<div>
						<p className="eyebrow">Our mission</p>
						<h2 className="display section-title">Honor in motion.</h2>
						<p className="prose">{mission}</p>
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
					<div className="value-grid">
						<div>
							<b>01</b>
							<h3 className="display">Dignity</h3>
							<p>People are never reduced to a diagnosis, injury, or chapter of service.</p>
						</div>
						<div>
							<b>02</b>
							<h3 className="display">Camaraderie</h3>
							<p>Shared experience and honest connection are central to every outing.</p>
						</div>
						<div>
							<b>03</b>
							<h3 className="display">Access</h3>
							<p>Funding removes the practical barriers between participants and the outdoors.</p>
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
