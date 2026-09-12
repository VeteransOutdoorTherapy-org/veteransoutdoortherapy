import { Quote } from "lucide-react";

// Long quotes stretched their whole grid row, so they collapse to a fixed
// number of lines behind a native disclosure. The full text stays in the
// markup for search engines and for readers without CSS.
export const COLLAPSE_OVER_CHARS = 420;

// Testimonials arrive in sortOrder, which clumps the long ones together and
// leaves ragged gaps in the grid. Alternating long and short spreads them out
// without randomness, so the server and client always render the same order.
export function interleaveByLength<T extends { quote: string }>(items: T[]) {
	const short = items.filter((item) => item.quote.length <= COLLAPSE_OVER_CHARS);
	const long = items.filter((item) => item.quote.length > COLLAPSE_OVER_CHARS);
	const mixed: T[] = [];
	for (let index = 0; index < Math.max(short.length, long.length); index += 1) {
		if (short[index]) mixed.push(short[index]);
		if (long[index]) mixed.push(long[index]);
	}
	return mixed;
}

export function TestimonialQuote({ quote }: { quote: string }) {
	const body = (
		<div>
			<Quote size={48} className="quote-icon" aria-hidden="true" />
			<blockquote>
				<p>{quote}</p>
			</blockquote>
		</div>
	);

	if (quote.length <= COLLAPSE_OVER_CHARS) {
		return <div className="testimonial-quote">{body}</div>;
	}

	return (
		<details className="testimonial-quote testimonial-quote-collapsible">
			<summary aria-label="Show the rest of this testimonial" />
			{body}
		</details>
	);
}
