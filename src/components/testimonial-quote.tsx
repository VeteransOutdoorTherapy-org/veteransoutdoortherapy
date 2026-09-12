import { Quote } from "lucide-react";

// Masonry lets a card run as tall as its quote needs, so only the rare outlier
// gets collapsed. Most testimonials run 220-820 characters and show in full;
// past this length a quote would tower over its column, so it clamps to a
// preview with a See more toggle. The full text is always in the markup.
export const COLLAPSE_OVER_CHARS = 900;

// Testimonials arrive in sortOrder, which clumps the long ones together and
// leaves one column much heavier than the others. Alternating longer and
// shorter quotes spreads them out without randomness, so the server and client
// always render the same order.
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

export function TestimonialQuote({ quote, id, iconSize = 48 }: { quote: string; id: string; iconSize?: number }) {
	const body = (
		<div className="testimonial-quote-body">
			<Quote size={iconSize} className="quote-icon" aria-hidden="true" />
			<blockquote>
				<p>{quote}</p>
			</blockquote>
		</div>
	);

	if (quote.length <= COLLAPSE_OVER_CHARS) {
		return <div className="testimonial-quote">{body}</div>;
	}

	// A checkbox, not <details>: a closed <details> hides every child except the
	// summary, which would hide the preview along with the rest of the quote.
	const toggleId = `quote-toggle-${id}`;
	return (
		<div className="testimonial-quote testimonial-quote-collapsible">
			<input className="quote-toggle" type="checkbox" id={toggleId} />
			{body}
			<label className="quote-toggle-label" htmlFor={toggleId} />
		</div>
	);
}
