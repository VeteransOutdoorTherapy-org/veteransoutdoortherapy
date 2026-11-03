"use client";

import { CaretLeft, CaretRight, X } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useEffect, useRef } from "react";

export type LightboxImage = { src: string; alt: string; caption?: string };

/** The full-screen photo viewer shared by the gallery and the field stories. `index` null means closed. */
export function Lightbox({
	images,
	index,
	onChange,
}: {
	images: LightboxImage[];
	index: number | null;
	onChange: (index: number | null) => void;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	// Whatever opened the viewer gets focus back when it closes.
	const triggerRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (index !== null && !dialog.open) {
			triggerRef.current = document.activeElement as HTMLElement | null;
			dialog.showModal();
		}
		if (index === null && dialog.open) dialog.close();
	}, [index]);

	const showPrevious = () => onChange(index === null ? 0 : (index - 1 + images.length) % images.length);
	const showNext = () => onChange(index === null ? 0 : (index + 1) % images.length);

	useEffect(() => {
		if (index === null) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onChange(null);
			if (event.key === "ArrowLeft") onChange((index - 1 + images.length) % images.length);
			if (event.key === "ArrowRight") onChange((index + 1) % images.length);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [images.length, index, onChange]);

	return (
		<dialog
			className="gallery-lightbox"
			ref={dialogRef}
			onClose={() => {
				onChange(null);
				requestAnimationFrame(() => triggerRef.current?.focus());
			}}
			onCancel={(event) => {
				event.preventDefault();
				dialogRef.current?.close();
			}}
			onClick={(event) => {
				if (event.target === event.currentTarget) onChange(null);
			}}
			aria-label="Field gallery image viewer"
		>
			{index !== null && (
				<>
					<div className="gallery-lightbox-image">
						<Image src={images[index].src} alt={images[index].alt} fill priority sizes="95vw" />
					</div>
					<span className="gallery-lightbox-count">
						{index + 1} / {images.length}
					</span>
					{images[index].caption && <p className="gallery-lightbox-caption">{images[index].caption}</p>}
					<button className="gallery-lightbox-close" type="button" onClick={() => onChange(null)} title="Close image">
						<X size={24} />
						<span className="sr-only">Close image</span>
					</button>
					<button className="gallery-lightbox-previous" type="button" onClick={showPrevious} title="Previous image">
						<CaretLeft size={30} />
						<span className="sr-only">Previous image</span>
					</button>
					<button className="gallery-lightbox-next" type="button" onClick={showNext} title="Next image">
						<CaretRight size={30} />
						<span className="sr-only">Next image</span>
					</button>
				</>
			)}
		</dialog>
	);
}
