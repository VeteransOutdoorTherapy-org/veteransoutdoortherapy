"use client";
import { useEffect, useRef } from "react";

// The layer keeps the section's own box so background-size: cover crops exactly as it would
// without parallax; the scale is what buys room to travel. Overhang is (SCALE - 1) / 2 of the
// height on each edge, and the shift is clamped inside it so an edge can never show.
const SCALE = 1.26;
const SHIFT_FACTOR = 0.3;

export function ParallaxLayer({ image, position = "center" }: { image: string; position?: string }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		const section = el?.parentElement;
		if (!el || !section) return;
		// Checked on every frame rather than once at mount: a window resized past the breakpoint
		// after load would otherwise leave the layer frozen wherever it stopped.
		const disabled = window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 1024px)");

		const maxShift = () => section.getBoundingClientRect().height * ((SCALE - 1) / 2) * 0.9;

		let ticking = false;
		const update = () => {
			ticking = false;
			if (disabled.matches) {
				el.style.transform = "";
				return;
			}
			const rect = section.getBoundingClientRect();
			const limit = maxShift();
			const offset = Math.max(-limit, Math.min(limit, rect.top * SHIFT_FACTOR));
			el.style.transform = `translate3d(0, ${offset}px, 0) scale(${SCALE})`;
		};
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(update);
		};
		update();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		disabled.addEventListener("change", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
			disabled.removeEventListener("change", onScroll);
		};
	}, []);

	return <div ref={ref} className="parallax-layer" style={{ backgroundImage: image, backgroundPosition: position }} />;
}
