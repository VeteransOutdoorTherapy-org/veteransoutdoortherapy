export function MissionFilm() {
	return (
		<section className="section mission-film">
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
