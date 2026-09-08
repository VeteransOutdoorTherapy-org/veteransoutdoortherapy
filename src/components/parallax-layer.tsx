"use client";
import { useEffect, useRef } from "react";

const SCALE = 1.12;
const SHIFT_FACTOR = 0.15;

export function ParallaxLayer({ image, position = "center" }: { image: string; position?: string }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		const section = el?.parentElement;
		if (!el || !section) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 1024px)").matches) return;

		const maxShift = () => section.getBoundingClientRect().height * ((SCALE - 1) / 2) * 0.85;

		let ticking = false;
		const update = () => {
			ticking = false;
			const rect = section.getBoundingClientRect();
			const limit = maxShift();
			const offset = Math.max(-limit, Math.min(limit, rect.top * SHIFT_FACTOR));
			el.style.transform = `scale(${SCALE}) translate3d(0, ${offset}px, 0)`;
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
