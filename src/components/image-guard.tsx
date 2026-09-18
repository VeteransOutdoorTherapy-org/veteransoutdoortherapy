"use client";

import { useEffect } from "react";

/**
 * Stops images being dragged to the desktop or saved from the context menu.
 *
 * Scoped to images on purpose: blocking the context menu across the whole page
 * would also take away "open link in new tab" and the browser's own controls,
 * which is a worse trade than the one being asked for. CSS handles the drag in
 * Blink and WebKit; the dragstart listener covers Firefox, which ignores
 * -webkit-user-drag.
 *
 * Worth knowing: this deters casual saving, it does not prevent it. The file is
 * still in the network tab and in the browser cache.
 */
export function ImageGuard() {
	useEffect(() => {
		const isImage = (target: EventTarget | null) => {
			const node = target as HTMLElement | null;
			return Boolean(node?.closest?.("img, picture"));
		};
		const stop = (event: Event) => {
			if (isImage(event.target)) event.preventDefault();
		};
		document.addEventListener("dragstart", stop);
		document.addEventListener("contextmenu", stop);
		return () => {
			document.removeEventListener("dragstart", stop);
			document.removeEventListener("contextmenu", stop);
		};
	}, []);

	return null;
}
