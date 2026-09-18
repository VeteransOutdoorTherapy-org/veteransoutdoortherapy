"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Logo = { name: string; image: string };

/**
 * A slowly turning globe of sponsor logos.
 *
 * Built on CSS 3D transforms and one requestAnimationFrame loop rather than a
 * WebGL library: thirty-odd tiles do not justify shipping a renderer, and plain
 * transforms stay crisp, keep the logos as real <img> elements for search and
 * for screen readers, and cost nothing when the loop is not running.
 *
 * Points are placed by the golden-angle spiral, which spreads them evenly over
 * the sphere — a naive lat/long grid bunches them at the poles.
 */
export function SponsorGlobe({ logos }: { logos: readonly Logo[] }) {
	const stage = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const root = stage.current;
		if (!root) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

		const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-tile]"));
		// Until this point the markup is a plain centred grid, so the logos show
		// with JavaScript off and for anyone who asked for less motion. Toggling a
		// class is a DOM update, which is what an effect is for — no React state.
		root.classList.add("spinning");

		const count = nodes.length;
		const golden = Math.PI * (3 - Math.sqrt(5));
		// Where each tile sits on the unit sphere.
		const points = nodes.map((_, i) => {
			const y = 1 - (i / Math.max(count - 1, 1)) * 2;
			const ring = Math.sqrt(Math.max(1 - y * y, 0));
			const theta = golden * i;
			return { x: Math.cos(theta) * ring, y, z: Math.sin(theta) * ring };
		});

		const MAX_SCALE = 1.1;
		let radius = 0;
		const measure = () => {
			// A tile's centre can sit a full radius from the middle, so the radius has
			// to leave room for half a tile at its largest scale or the globe spills
			// out of the section and over whatever sits above and below it.
			const tile = nodes[0]?.getBoundingClientRect().width ?? 96;
			const half = Math.min(root.clientWidth, root.clientHeight) / 2;
			radius = Math.max(60, half - (tile * MAX_SCALE) / 2 - 8);
		};
		measure();
		const onResize = () => measure();
		window.addEventListener("resize", onResize);

		let yaw = 0;
		let pitch = -0.18;
		let spin = 0.0022;
		let dragging = false;
		let lastX = 0;
		let lastY = 0;
		let visible = true;
		let frame = 0;

		const draw = () => {
			const cosP = Math.cos(pitch);
			const sinP = Math.sin(pitch);
			const cosY = Math.cos(yaw);
			const sinY = Math.sin(yaw);
			for (let i = 0; i < count; i += 1) {
				const p = points[i];
				// Yaw about the vertical axis, then pitch about the horizontal one.
				const x1 = p.x * cosY - p.z * sinY;
				const z1 = p.x * sinY + p.z * cosY;
				const y2 = p.y * cosP - z1 * sinP;
				const z2 = p.y * sinP + z1 * cosP;
				// Tiles at the back are smaller and fainter, which reads as depth
				// without needing real perspective projection.
				const depth = (z2 + 1) / 2;
				const scale = MAX_SCALE - 0.55 + depth * 0.55;
				const node = nodes[i];
				node.style.transform = `translate3d(${(x1 * radius).toFixed(1)}px, ${(y2 * radius).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
				node.style.opacity = (0.3 + depth * 0.7).toFixed(3);
				node.style.zIndex = String(Math.round(depth * 100));
			}
			yaw += spin;
			frame = requestAnimationFrame(draw);
		};
		frame = requestAnimationFrame(draw);

		// A globe scrolled off screen should not keep the main thread busy.
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting === visible) return;
				visible = entry.isIntersecting;
				if (visible) frame = requestAnimationFrame(draw);
				else cancelAnimationFrame(frame);
			},
			{ threshold: 0.01 },
		);
		observer.observe(root);

		const down = (event: PointerEvent) => {
			dragging = true;
			lastX = event.clientX;
			lastY = event.clientY;
			root.setPointerCapture(event.pointerId);
		};
		const move = (event: PointerEvent) => {
			if (!dragging) return;
			yaw += (event.clientX - lastX) * 0.006;
			pitch = Math.max(-0.9, Math.min(0.9, pitch + (event.clientY - lastY) * 0.004));
			lastX = event.clientX;
			lastY = event.clientY;
		};
		const up = () => {
			dragging = false;
		};
		const slow = () => {
			spin = 0.0006;
		};
		const resume = () => {
			spin = 0.0022;
		};
		root.addEventListener("pointerdown", down);
		root.addEventListener("pointermove", move);
		root.addEventListener("pointerup", up);
		root.addEventListener("pointercancel", up);
		root.addEventListener("pointerenter", slow);
		root.addEventListener("pointerleave", resume);

		return () => {
			root.classList.remove("spinning");
			cancelAnimationFrame(frame);
			observer.disconnect();
			window.removeEventListener("resize", onResize);
			root.removeEventListener("pointerdown", down);
			root.removeEventListener("pointermove", move);
			root.removeEventListener("pointerup", up);
			root.removeEventListener("pointercancel", up);
			root.removeEventListener("pointerenter", slow);
			root.removeEventListener("pointerleave", resume);
		};
	}, []);

	return (
		<div className="sponsor-globe" ref={stage}>
			<ul>
				{logos.map((logo) => (
					<li data-tile key={logo.image}>
						<Image src={logo.image} alt={logo.name} width={232} height={232} />
					</li>
				))}
			</ul>
		</div>
	);
}
