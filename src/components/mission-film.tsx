import { SectionEdge } from "./section-edge";

/**
 * `dark` flips the band to ink with painted edges; `above` and `below` take the
 * colour of the neighbouring sections, since an edge is painted in the colour of
 * the section it hands off to.
 */
export function MissionFilm({ dark = false, above = "var(--paper)", below = "var(--paper)" }: { dark?: boolean; above?: string; below?: string }) {
	return (
		<section className={dark ? "section mission-film dark has-edge" : "section mission-film"}>
			{dark && (
				<>
					<SectionEdge color={above} variant="a" flip />
					<SectionEdge color={below} variant="b" />
				</>
			)}
			<div className="container healing-grid">
				<div className="healing-video">
					<iframe
						src="https://www.youtube-nocookie.com/embed/yWHOErhxKQ4"
						title="Veteran's Outdoor Therapy mission film"
						width="1280"
						height="720"
						loading="lazy"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					/>
				</div>
				<div>
					<p className="eyebrow">Our mission on film</p>
					<h2 className="display section-title">Why the outdoors matter.</h2>
					<p className="prose">
						This film was produced for Veteran&apos;s Outdoor Therapy and captures the purpose that connects every hunt,
						fishing trip, horseback experience, event, volunteer, and mission partner.
					</p>
				</div>
			</div>
		</section>
	);
}
