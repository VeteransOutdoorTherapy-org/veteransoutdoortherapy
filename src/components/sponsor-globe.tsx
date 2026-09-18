"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Logo = { name: string; image: string };

/** Scale of the frontmost tile before any boost. */
const MAX_SCALE = 1.1;
/** How much bigger a hovered tile gets, a randomly featured one, and a clicked one. */
const HOVER_BOOST = 1.35;
const FEATURE_BOOST = 1.26;
const FOCUS_BOOST = 2.1;
/** How long each random feature holds before the spotlight moves on. */
const FEATURE_MS = 4200;
/** Pointer travel beyond this is a drag, not a click. */
const DRAG_SLOP = 6;

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

		let radius = 0;
		const measure = () => {
			// Fill the stage: the sphere is as wide as the shorter side allows, less
			// half a tile at its biggest so it cannot spill over the sections above
			// and below.
			const tile = nodes[0]?.getBoundingClientRect().width ?? 96;
			const half = Math.min(root.clientWidth, root.clientHeight) / 2;
			radius = Math.max(60, half - (tile * MAX_SCALE) / 2 - 10);
		};
		measure();
		const onResize = () => measure();
		window.addEventListener("resize", onResize);

		// Two rotations at unrelated rates. Yaw alone parades the same band of logos
		// through the front for ever and never brings the poles round, so pitch turns
		// as well — slowly, and at a rate that does not divide evenly into the yaw,
		// so every logo eventually passes through the middle.
		const BASE_YAW = 0.0021;
		const BASE_PITCH = 0.00058;
		let yaw = 0;
		let pitch = 0;
		let ease = 1; // 1 at full speed, lower while a logo is hovered
		let dragging = false;
		let travelled = 0;
		let lastX = 0;
		let lastY = 0;
		let dragYaw = 0; // carries the throw out of a drag
		let dragPitch = 0;
		let hovered = -1;
		let focused = -1;
		let aimYaw = 0;
		let aimPitch = 0;
		let visible = true;
		let frame = 0;

		// Smoothed per-tile boost, so a logo grows and shrinks rather than snapping.
		const boost = new Float64Array(count).fill(1);

		let featured: number[] = [];
		const pickFeatured = () => {
			// Uniform choice across every tile, excluding whatever is featured right
			// now: no logo is favoured, and none repeats back to back.
			const pool: number[] = [];
			for (let i = 0; i < count; i += 1) if (!featured.includes(i)) pool.push(i);
			const wanted = Math.random() < 0.45 ? 2 : 1;
			const next: number[] = [];
			for (let n = 0; n < wanted && pool.length; n += 1) {
				next.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
			}
			featured = next;
		};
		pickFeatured();
		const featureTimer = window.setInterval(pickFeatured, FEATURE_MS);

		/** Rotation that carries a point to the front of the sphere, facing the reader. */
		const aimAt = (index: number) => {
			const p = points[index];
			const ring = Math.hypot(p.x, p.z);
			aimYaw = Math.atan2(p.x, p.z);
			aimPitch = Math.atan2(p.y, ring);
			// Take the shortest way round rather than unwinding several turns.
			aimYaw += Math.round((yaw - aimYaw) / (Math.PI * 2)) * Math.PI * 2;
			aimPitch += Math.round((pitch - aimPitch) / (Math.PI * 2)) * Math.PI * 2;
		};

		const release = () => {
			focused = -1;
			root.classList.remove("focused");
		};

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

				// A clicked logo outranks a hover, which outranks a random feature.
				// Nothing is highlighted mid-drag: the drag is for turning the globe.
				const want =
					i === focused
						? FOCUS_BOOST
						: focused >= 0
							? 1
							: !dragging && i === hovered
								? HOVER_BOOST
								: featured.includes(i)
									? FEATURE_BOOST
									: 1;
				boost[i] += (want - boost[i]) * 0.12;

				const scale = (MAX_SCALE - 0.55 + depth * 0.55) * boost[i];
				const node = nodes[i];
				node.style.transform = `translate3d(${(x1 * radius).toFixed(1)}px, ${(y2 * radius).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
				const lit = i === focused || (focused < 0 && !dragging && i === hovered);
				// While one logo is focused the rest fall back so it reads as the subject.
				const dim = focused >= 0 && i !== focused ? 0.45 : 1;
				node.style.opacity = (lit ? 1 : (0.3 + depth * 0.7) * dim).toFixed(3);
				node.style.zIndex = String(lit ? 200 : Math.round(depth * 100));
			}

			if (focused >= 0) {
				// Glide the chosen logo to the centre and hold it there.
				yaw += (aimYaw - yaw) * 0.08;
				pitch += (aimPitch - pitch) * 0.08;
			} else if (dragging) {
				// Follow the pointer directly while held.
				yaw += dragYaw;
				pitch += dragPitch;
				dragYaw *= 0.7;
				dragPitch *= 0.7;
			} else {
				// Let the throw decay into the idle drift instead of stopping dead.
				yaw += BASE_YAW * ease + dragYaw;
				pitch += BASE_PITCH * ease + dragPitch;
				dragYaw *= 0.94;
				dragPitch *= 0.94;
			}
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
			travelled = 0;
			lastX = event.clientX;
			lastY = event.clientY;
			dragYaw = 0;
			dragPitch = 0;
			root.setPointerCapture(event.pointerId);
		};
		const move = (event: PointerEvent) => {
			if (!dragging) return;
			const dx = event.clientX - lastX;
			const dy = event.clientY - lastY;
			travelled += Math.abs(dx) + Math.abs(dy);
			// Feed the drag through the same momentum the idle drift uses, so the
			// globe tracks the mouse and keeps turning when it is let go.
			dragYaw = dx * 0.0075;
			dragPitch = dy * 0.0055;
			lastX = event.clientX;
			lastY = event.clientY;
		};
		const up = (event: PointerEvent) => {
			const wasDragging = dragging;
			dragging = false;
			if (!wasDragging || travelled > DRAG_SLOP) return;
			// A tap, not a drag: focus the logo under it, or let the current one go.
			const tile = (event.target as HTMLElement | null)?.closest("[data-tile]");
			const index = tile ? nodes.indexOf(tile as HTMLElement) : -1;
			if (index >= 0 && index !== focused) {
				focused = index;
				aimAt(index);
				root.classList.add("focused");
			} else {
				release();
			}
		};
		root.addEventListener("pointerdown", down);
		root.addEventListener("pointermove", move);
		root.addEventListener("pointerup", up);
		root.addEventListener("pointercancel", () => {
			dragging = false;
		});

		// Hovering a logo slows the globe and lifts that tile. Guarded on pointer
		// type so a touch tap does not leave a tile stuck enlarged.
		const enter = (event: PointerEvent) => {
			if (event.pointerType !== "mouse") return;
			hovered = nodes.indexOf(event.currentTarget as HTMLElement);
			ease = 0.12;
		};
		const leave = (event: PointerEvent) => {
			if (event.pointerType !== "mouse") return;
			hovered = -1;
			ease = 1;
		};
		nodes.forEach((node) => {
			node.addEventListener("pointerenter", enter);
			node.addEventListener("pointerleave", leave);
		});

		const escape = (event: KeyboardEvent) => {
			if (event.key === "Escape") release();
		};
		window.addEventListener("keydown", escape);

		return () => {
			root.classList.remove("spinning", "focused");
			cancelAnimationFrame(frame);
			window.clearInterval(featureTimer);
			observer.disconnect();
			window.removeEventListener("resize", onResize);
			window.removeEventListener("keydown", escape);
			root.removeEventListener("pointerdown", down);
			root.removeEventListener("pointermove", move);
			root.removeEventListener("pointerup", up);
			nodes.forEach((node) => {
				node.removeEventListener("pointerenter", enter);
				node.removeEventListener("pointerleave", leave);
			});
		};
	}, []);

	return (
		<div className="sponsor-globe" ref={stage}>
			<ul>
				{logos.map((logo) => (
					<li data-tile key={logo.image}>
						<Image src={logo.image} alt={logo.name} width={300} height={300} draggable={false} />
					</li>
				))}
			</ul>
		</div>
	);
}
