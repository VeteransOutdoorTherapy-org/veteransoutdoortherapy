"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/data";

export function GalleryLightbox({ images }: { images: GalleryImage[] }) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;
		if (selectedIndex !== null && !dialog.open) dialog.showModal();
		if (selectedIndex === null) {
			if (dialog.open) dialog.close();
		}
	}, [selectedIndex]);

	useEffect(() => {
		if (selectedIndex === null) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setSelectedIndex(null);
			if (event.key === "ArrowLeft") {
				setSelectedIndex((current) => (current === null ? 0 : (current - 1 + images.length) % images.length));
			}
			if (event.key === "ArrowRight") {
				setSelectedIndex((current) => (current === null ? 0 : (current + 1) % images.length));
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [images.length, selectedIndex]);

	const showPrevious = () => {
		setSelectedIndex((current) => (current === null ? 0 : (current - 1 + images.length) % images.length));
	};
	const showNext = () => {
		setSelectedIndex((current) => (current === null ? 0 : (current + 1) % images.length));
	};

	return (
		<>
			<div className="gallery-grid">
				{images.map((image, index) => (
					<button
						className={`gallery-item${index % 5 === 0 ? " wide" : ""}`}
					key={image.id}
						type="button"
						onClick={(event) => {
							triggerRef.current = event.currentTarget;
							setSelectedIndex(index);
						}}
						aria-label={`Open ${image.alt}, photo ${index + 1} of ${images.length}`}
						title={image.caption || image.alt}
					>
						<Image
							src={image.src}
							alt={image.alt}
							fill
							sizes="(max-width: 700px) 100vw, 40vw"
						/>
					</button>
				))}
			</div>
			<dialog
				className="gallery-lightbox"
				ref={dialogRef}
				onClose={() => {
					setSelectedIndex(null);
					requestAnimationFrame(() => triggerRef.current?.focus());
				}}
				onCancel={(event) => {
					event.preventDefault();
					dialogRef.current?.close();
				}}
				onClick={(event) => {
					if (event.target === event.currentTarget) setSelectedIndex(null);
				}}
				aria-label="Field gallery image viewer"
			>
				{selectedIndex !== null && (
					<>
						<div className="gallery-lightbox-image">
							<Image
								src={images[selectedIndex].src}
								alt={images[selectedIndex].alt}
								fill
								priority
								sizes="95vw"
							/>
						</div>
						<span className="gallery-lightbox-count">
							{selectedIndex + 1} / {images.length}
						</span>
						{images[selectedIndex].caption && <p className="gallery-lightbox-caption">{images[selectedIndex].caption}</p>}
						<button className="gallery-lightbox-close" type="button" onClick={() => setSelectedIndex(null)} title="Close image">
							<X size={24} />
							<span className="sr-only">Close image</span>
						</button>
						<button className="gallery-lightbox-previous" type="button" onClick={showPrevious} title="Previous image">
							<ChevronLeft size={30} />
							<span className="sr-only">Previous image</span>
						</button>
						<button className="gallery-lightbox-next" type="button" onClick={showNext} title="Next image">
							<ChevronRight size={30} />
							<span className="sr-only">Next image</span>
						</button>
					</>
				)}
			</dialog>
		</>
	);
}
