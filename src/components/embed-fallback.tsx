import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";

/** The way out of an embedded form that fails to load, shown both above and below every embed. */
export function EmbedFallback({ href, label, position }: { href: string; label: string; position: "above" | "below" }) {
	return (
		<p className={`embed-fallback ${position}`}>
			<ArrowSquareOut size={17} aria-hidden="true" />
			<span>
				Having trouble with the embedded form?{" "}
				<a href={href} target="_blank" rel="noreferrer">
					{label}
				</a>
			</span>
		</p>
	);
}
