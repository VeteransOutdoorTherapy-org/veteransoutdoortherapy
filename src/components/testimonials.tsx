import { Quotes, Star, User } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type { ReactNode } from "react";
import type { Testimonial } from "@/lib/data";
import { publicName } from "@/lib/names";

/**
 * The one testimonial design used across the site: upright, readable text at
 * body size, a quiet card, and the person's name beside an initial, in the
 * pattern of Tailwind UI's testimonial grids.
 */

// Past this length a quote clamps to a preview with a Read more toggle, so a
// rare very long one does not tower over its column. The full text is always
// in the markup.
const COLLAPSE_OVER_CHARS = 700;

// Testimonials arrive in sortOrder, which clumps the long ones together and
// leaves one masonry column much heavier than the others. Alternating longer
// and shorter quotes spreads them out without randomness, so the server and
// client always render the same order.
const MIXING_MEDIAN_CHARS = 400;

export function interleaveByLength<T extends { quote: string }>(items: T[]) {
	const short = items.filter((item) => item.quote.length <= MIXING_MEDIAN_CHARS);
	const long = items.filter((item) => item.quote.length > MIXING_MEDIAN_CHARS);
	const mixed: T[] = [];
	for (let index = 0; index < Math.max(short.length, long.length); index += 1) {
		if (short[index]) mixed.push(short[index]);
		if (long[index]) mixed.push(long[index]);
	}
	return mixed;
}

function QuoteText({ quote, id, className }: { quote: string; id: string; className: string }) {
	if (quote.length <= COLLAPSE_OVER_CHARS) return <blockquote className={`m-0 ${className}`}>{quote}</blockquote>;
	// A checkbox, not <details>: a closed <details> hides everything but its summary,
	// which would hide the preview along with the rest of the quote.
	const toggleId = `quote-toggle-${id}`;
	return (
		<div className="flex flex-col gap-3">
			<input id={toggleId} type="checkbox" className="peer sr-only" />
			<blockquote className={`m-0 line-clamp-9 peer-checked:line-clamp-none ${className}`}>{quote}</blockquote>
			<label
				htmlFor={toggleId}
				className="cursor-pointer self-start rounded text-xs font-bold tracking-wider text-(--orange) uppercase after:content-['Read_more'] peer-checked:after:content-['Read_less'] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-(--orange) hover:underline"
			/>
		</div>
	);
}

function Avatar({ name, size = "size-11" }: { name: string; size?: string }) {
	const anonymous = /^anonymous$/i.test(name);
	return (
		<span
			aria-hidden="true"
			className={`grid ${size} shrink-0 place-items-center rounded-full bg-(--forest) text-base font-semibold text-(--white) ring-4 ring-(--forest)/10`}
		>
			{anonymous ? <User size={20} weight="bold" /> : name.charAt(0).toUpperCase()}
		</span>
	);
}

function Byline({ testimonial, centered = false }: { testimonial: Testimonial; centered?: boolean }) {
	const name = publicName(testimonial.author);
	return (
		<figcaption className={`flex items-center gap-x-4 ${centered ? "justify-center" : ""}`}>
			<Avatar name={name} />
			<div className="min-w-0 text-left">
				<div className="font-semibold leading-6 text-(--ink)">{name}</div>
				<div className="text-sm leading-5 text-(--moss)">{testimonial.service}</div>
			</div>
		</figcaption>
	);
}

export function TestimonialCard({
	testimonial,
	showRating = false,
	showCategory = false,
}: {
	testimonial: Testimonial;
	showRating?: boolean;
	showCategory?: boolean;
}) {
	return (
		<figure className="m-0 flex flex-col gap-y-6 rounded-2xl bg-(--white) p-6 shadow-[0_1px_2px_rgba(23,32,25,0.05),0_12px_32px_-16px_rgba(23,32,25,0.25)] ring-1 ring-(--ink)/8 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(23,32,25,0.05),0_18px_40px_-16px_rgba(23,32,25,0.3)] sm:p-7">
			<div className="flex items-center justify-between gap-3">
				{showRating ? (
					<div className="flex gap-0.5 text-(--orange)" aria-label={`${testimonial.rating ?? 5} out of 5 stars`}>
						{[1, 2, 3, 4, 5].map((star) => (
							<Star key={star} size={16} weight={star <= (testimonial.rating ?? 5) ? "fill" : "regular"} />
						))}
					</div>
				) : (
					// Phosphor draws Quotes as the closing mark; rotated, it opens the quotation.
					<Quotes size={28} weight="fill" className="rotate-180 text-(--orange)" aria-hidden="true" />
				)}
				{showCategory && testimonial.category && (
					<span className="rounded-full bg-(--orange)/10 px-2.5 py-1 text-[0.7rem] font-bold tracking-wide text-(--orange) uppercase">
						{testimonial.category}
					</span>
				)}
			</div>
			<QuoteText quote={testimonial.quote} id={testimonial.slug} className="text-[0.975rem] leading-7 text-(--ink)/85" />
			{testimonial.image && (
				<div className="overflow-hidden rounded-xl">
					<Image
						src={testimonial.image}
						alt={testimonial.imageAlt || `${publicName(testimonial.author)}, ${testimonial.service}`}
						width={400}
						height={300}
						className="block max-h-64 w-full object-cover"
						style={{ objectPosition: testimonial.imagePosition?.replace("-", " ") ?? "center" }}
					/>
				</div>
			)}
			<div className="mt-auto border-t border-(--ink)/10 pt-5">
				<Byline testimonial={testimonial} />
			</div>
		</figure>
	);
}

/** A larger, centered quote to lead a page of testimonials. */
export function FeaturedTestimonial({ testimonial }: { testimonial: Testimonial }) {
	return (
		<figure className="m-0 mx-auto max-w-3xl rounded-3xl bg-(--white) px-6 py-10 text-center shadow-[0_1px_2px_rgba(23,32,25,0.05),0_24px_48px_-24px_rgba(23,32,25,0.3)] ring-1 ring-(--ink)/8 sm:px-12 sm:py-14">
			<Quotes size={40} weight="fill" className="mx-auto rotate-180 text-(--orange)" aria-hidden="true" />
			<QuoteText
				quote={testimonial.quote}
				id={`featured-${testimonial.slug}`}
				className="mt-6 text-lg leading-8 font-medium text-(--ink) sm:text-xl sm:leading-9"
			/>
			<div className="mt-8">
				<Byline testimonial={testimonial} centered />
			</div>
		</figure>
	);
}

/**
 * Masonry: each card keeps its own height and the next packs directly beneath
 * it, where a grid would stretch every card in a row to the tallest. Two
 * columns suit a narrow article column; three suit a full-width section.
 */
export function TestimonialGrid({ children, columns = 3 }: { children: ReactNode; columns?: 2 | 3 }) {
	const layout = columns === 3 ? "sm:columns-2 lg:columns-3" : "md:columns-2";
	return <div className={`columns-1 gap-6 ${layout} *:mb-6 *:break-inside-avoid`}>{children}</div>;
}
