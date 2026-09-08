"use client";
import { useEffect, useRef } from "react";

export function ParallaxLayer({ image, position = "center" }: { image: string; position?: string }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		const section = el?.parentElement;
		if (!el || !section) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 1024px)").matches) return;

		let ticking = false;
		const update = () => {
			ticking = false;
			const rect = section.getBoundingClientRect();
			el.style.transform = `translate3d(0, ${rect.top * 0.35}px, 0)`;
		};
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, []);

	return <div ref={ref} className="parallax-layer" style={{ backgroundImage: image, backgroundPosition: position }} />;
}
