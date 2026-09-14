type EdgeVariant = keyof typeof PATHS;

// Soft irregular curves rather than a jagged polyline: the edge should read as a torn or brushed
// boundary, which is smooth at the small scale and uneven only across the width.
const PATHS = {
	a: "M0,60 L0,21.6 C30.0,23.2 120.0,30.7 180,31.4 C240.0,32.1 300.0,25.5 360,25.8 C420.0,26.1 480.0,31.9 540,33.3 C600.0,34.7 660.0,36.9 720,34.0 C780.0,31.1 840.0,19.4 900,16.1 C960.0,12.8 1020.0,10.3 1080,14.4 C1140.0,18.5 1200.0,39.5 1260,40.8 C1320.0,42.1 1410.0,25.4 1440,22.3 L1440,60 Z",
	b: "M0,60 L0,24.8 C36.7,25.3 146.7,25.6 220,27.6 C293.3,29.6 366.7,37.4 440,37.0 C513.3,36.6 586.7,26.9 660,25.1 C733.3,23.3 806.7,25.7 880,26.2 C953.3,26.7 1026.7,29.7 1100,28.3 C1173.3,26.9 1263.3,18.1 1320,17.8 C1376.7,17.5 1420.0,24.9 1440,26.3 L1440,60 Z",
} as const;

/**
 * An edge painted in the colour of the neighbouring section, overlapping the join so one section
 * appears to tear over the other. Put it at the foot of a section, or `flip` it onto the top.
 */
export function SectionEdge({ color, variant = "a", flip = false }: { color: string; variant?: EdgeVariant; flip?: boolean }) {
	return (
		<svg
			className={flip ? "section-edge section-edge-top" : "section-edge"}
			viewBox="0 0 1440 60"
			preserveAspectRatio="none"
			aria-hidden="true"
			focusable="false"
		>
			<path d={PATHS[variant]} fill={color} />
		</svg>
	);
}
