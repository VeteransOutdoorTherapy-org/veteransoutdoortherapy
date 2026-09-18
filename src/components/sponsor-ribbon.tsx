"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Logo = { name: string; image: string };

/**
 * A marquee of sponsor logos that never stacks, however narrow the screen.
 *
 * The track holds the list twice and shifts by exactly half, so the seam never
 * shows. Order is shuffled after mount rather than during render: a server
 * shuffle would be frozen into the static HTML, and shuffling while rendering
 * would not match what the server sent.
 */
export function SponsorRibbon({ logos, seconds = 64 }: { logos: readonly Logo[]; seconds?: number }) {
	const track = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const node = track.current;
		if (!node) return;
		const lists = Array.from(node.querySelectorAll("ul"));
		if (!lists.length) return;

		// One order, applied to every copy, so the two halves stay identical and the
		// loop still closes. Fisher-Yates, so no logo is favoured.
		const order = logos.map((_, i) => i);
		for (let i = order.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[order[i], order[j]] = [order[j], order[i]];
		}
		for (const list of lists) {
			const items = Array.from(list.children);
			for (const index of order) list.appendChild(items[index]);
		}
	}, [logos]);

	return (
		<div className="sponsor-marquee">
			<div className="sponsor-marquee-track" ref={track} style={{ animationDuration: `${seconds}s` }}>
				{[0, 1].map((copy) => (
					<ul key={copy} aria-hidden={copy > 0}>
						{logos.map((logo) => (
							<li key={logo.image}>
								{/* Both copies are the same files, so eager costs only the decode —
								    and the second copy starts off-screen, where lazy would never
								    fire until it had already scrolled into view. */}
								<Image src={logo.image} alt={copy === 0 ? logo.name : ""} width={180} height={180} loading="eager" />
							</li>
						))}
					</ul>
				))}
			</div>
		</div>
	);
}
