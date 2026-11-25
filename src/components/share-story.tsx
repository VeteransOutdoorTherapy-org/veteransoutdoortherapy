"use client";

import { CheckCircle, PencilSimpleLine, Star, WarningCircle, X } from "@phosphor-icons/react/dist/ssr";
import { type FormEvent, useRef, useState } from "react";
import { type EventOption, GENERAL_EVENT, SERVICE_BRANCHES } from "@/lib/testimonial-submission";

type Status = { tone: "pending" | "success" | "error"; text: string } | null;

/**
 * The Share your story button and its form, in a modal. A submission is saved as
 * an unpublished testimonial for the admin to review, and emailed to the team.
 */
export function ShareStory({
	events,
	defaultEvent = "",
	label = "Share your story",
	className = "button orange",
}: {
	events: EventOption[];
	defaultEvent?: string;
	label?: string;
	className?: string;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [rating, setRating] = useState(0);
	const [hovered, setHovered] = useState(0);
	const [status, setStatus] = useState<Status>(null);

	function open() {
		setStatus(null);
		dialogRef.current?.showModal();
	}

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		setStatus({ tone: "pending", text: "Sending…" });
		const response = await fetch("/api/testimonials", { method: "POST", body: new FormData(form) }).catch(() => null);
		if (response?.ok) {
			form.reset();
			setRating(0);
			setStatus({ tone: "success", text: "Thank you. Your story is with our team, and we read every one before it goes on the site." });
		} else {
			setStatus({ tone: "error", text: "We could not send this yet. Please try again, or email contact@veteransoutdoortherapy.org." });
		}
	}

	const shown = hovered || rating;
	return (
		<>
			<button type="button" className={className} onClick={open}>
				<PencilSimpleLine size={18} aria-hidden="true" /> {label}
			</button>
			<dialog
				ref={dialogRef}
				aria-labelledby="share-story-title"
				onClick={(event) => {
					if (event.target === event.currentTarget) dialogRef.current?.close();
				}}
				className="m-auto w-[min(640px,calc(100vw-24px))] text-left max-h-[calc(100dvh-24px)] overflow-y-auto rounded-3xl border-0 bg-(--paper) p-0 text-(--ink) shadow-[0_32px_64px_-24px_rgba(12,19,14,0.55)] backdrop:bg-(--ink)/60 backdrop:backdrop-blur-sm"
			>
				<div className="relative p-6 sm:p-10">
					<button
						type="button"
						onClick={() => dialogRef.current?.close()}
						className="absolute top-4 right-4 grid size-10 place-items-center rounded-full text-(--ink)/70 transition hover:bg-(--ink)/8 hover:text-(--ink)"
						aria-label="Close"
					>
						<X size={20} />
					</button>
					<p className="eyebrow">In your words</p>
					<h2 id="share-story-title" className="mt-1 text-2xl font-semibold text-(--ink) sm:text-3xl">
						Share your story
					</h2>

					{status?.tone === "success" ? (
						<div className="mt-8 flex flex-col items-start gap-6">
							<p className="m-0 flex items-start gap-3 text-base leading-7">
								<CheckCircle size={26} weight="fill" className="shrink-0 text-(--forest)" aria-hidden="true" />
								{status.text}
							</p>
							<button type="button" className="button secondary" onClick={() => dialogRef.current?.close()}>
								Close
							</button>
						</div>
					) : (
						<form className="intake-form share-story-form mt-6" onSubmit={submit}>
							<input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" hidden />
							<div className="form-row">
								<label>
									First name
									<input className="field" name="firstName" autoComplete="given-name" required />
								</label>
								<label>
									Last name
									<input className="field" name="lastName" autoComplete="family-name" required />
								</label>
							</div>
							<div className="form-row">
								<label>
									Email
									<input className="field" name="email" type="email" autoComplete="email" required />
								</label>
								<label>
									<span>
										Phone <span className="font-normal text-(--moss)">(optional)</span>
									</span>
									<input className="field" name="phone" type="tel" autoComplete="tel" />
								</label>
							</div>
							<div className="form-row">
								<label>
									Branch of service
									<select className="field" name="branch" required defaultValue="">
										<option value="" disabled>
											Choose one
										</option>
										{SERVICE_BRANCHES.map((branch) => (
											<option key={branch}>{branch}</option>
										))}
									</select>
								</label>
								<label>
									<span>
										Rank or honors <span className="font-normal text-(--moss)">(optional)</span>
									</span>
									<input className="field" name="honors" maxLength={120} placeholder="e.g. Purple Heart Recipient" />
								</label>
							</div>
							<label>
								Which event?
								<select className="field" name="event" required defaultValue={defaultEvent}>
									<option value="" disabled>
										Choose an event
									</option>
									{events.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
									<option value={GENERAL_EVENT}>Not a specific event</option>
								</select>
							</label>
							<fieldset className="m-0 border-0 p-0">
								<legend className="mb-2 font-bold">
									Your rating <span className="font-normal text-(--moss)">(optional)</span>
								</legend>
								<div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
									{[1, 2, 3, 4, 5].map((value) => (
										<label key={value} className="cursor-pointer" onMouseEnter={() => setHovered(value)}>
											<input
												type="radio"
												name="rating"
												value={value}
												checked={rating === value}
												onChange={() => setRating(value)}
												className="peer sr-only"
											/>
											<Star
												size={32}
												weight={value <= shown ? "fill" : "regular"}
												className="rounded text-(--orange) transition peer-focus-visible:outline-2 peer-focus-visible:outline-(--orange)"
												aria-hidden="true"
											/>
											<span className="sr-only">
												{value} star{value > 1 ? "s" : ""}
											</span>
										</label>
									))}
								</div>
							</fieldset>
							<label>
								Your story
								<textarea
									className="field"
									name="story"
									rows={6}
									minLength={20}
									maxLength={3000}
									required
									placeholder="What was the trip like, and what did you take home from it?"
								/>
							</label>
							<label className="consent">
								<input type="checkbox" name="consent" required /> Veteran&apos;s Outdoor Therapy may share my first name,
								service, and story on its website.
							</label>
							<div className="text-sm text-(--moss)">Your last name, email, and phone stay private.</div>
							<button className="button orange" type="submit" disabled={status?.tone === "pending"}>
								{status?.tone === "pending" ? "Sending…" : "Send my story"}
							</button>
							<div role="status" aria-live="polite">
								{status?.tone === "error" && (
									<p className="form-status error">
										<WarningCircle size={18} aria-hidden="true" />
										<span>{status.text}</span>
									</p>
								)}
							</div>
						</form>
					)}
				</div>
			</dialog>
		</>
	);
}
