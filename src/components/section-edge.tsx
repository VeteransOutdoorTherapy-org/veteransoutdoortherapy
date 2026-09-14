type EdgeVariant = keyof typeof PATHS;

// Two hand-rolled torn edges so consecutive dividers do not repeat the same silhouette.
const PATHS = {
	a: "M0,48 L0,2.6 L0,2.6 L22,16.8 L36,27.1 L66,6.7 L80,16.7 L94,31.0 L124,10.8 L154,3.1 L184,5.3 L210,21.1 L232,10.6 L250,5.8 L272,20.0 L286,30.1 L312,4.9 L342,21.4 L364,17.1 L378,24.8 L392,20.1 L418,10.3 L432,24.7 L458,5.3 L476,12.8 L494,13.9 L520,23.0 L542,19.0 L556,7.9 L582,22.3 L600,13.2 L618,19.2 L632,14.0 L662,2.9 L676,8.2 L690,26.0 L704,1.6 L730,7.3 L752,31.9 L778,27.2 L800,14.5 L818,24.9 L848,24.1 L862,19.3 L880,11.8 L910,11.3 L928,21.7 L946,8.4 L960,21.4 L990,25.0 L1012,25.0 L1030,14.3 L1060,22.5 L1074,30.7 L1092,35.5 L1118,1.5 L1136,4.6 L1154,17.5 L1176,3.4 L1190,15.6 L1208,22.2 L1230,15.0 L1260,36.9 L1286,18.6 L1316,32.1 L1334,17.4 L1352,14.4 L1374,19.0 L1388,1.3 L1414,16.4 L1440,10.6 L1440,48 Z",
	b: "M0,48 L0,18.9 L0,18.9 L30,8.4 L60,7.3 L82,25.3 L104,4.5 L122,6.5 L136,3.2 L162,13.7 L192,22.3 L210,1.6 L228,3.1 L242,25.1 L272,14.6 L302,23.1 L316,14.3 L338,24.6 L360,20.2 L374,5.7 L400,32.1 L414,1.4 L440,2.9 L454,13.4 L480,17.7 L494,16.5 L512,1.8 L530,5.4 L560,7.0 L582,16.4 L604,18.1 L634,16.5 L652,7.4 L682,34.6 L704,11.3 L726,34.0 L752,2.3 L778,17.1 L800,1.5 L826,18.6 L856,31.2 L874,17.5 L888,29.5 L914,6.8 L940,16.7 L958,9.7 L976,3.5 L1002,1.4 L1032,10.2 L1046,28.7 L1064,6.3 L1094,9.1 L1120,5.9 L1134,1.7 L1148,10.0 L1174,9.8 L1192,2.8 L1218,24.5 L1236,21.0 L1250,5.6 L1280,2.1 L1306,10.8 L1324,3.8 L1338,18.1 L1364,6.4 L1382,35.1 L1396,4.0 L1422,9.0 L1440,14.9 L1440,48 Z",
} as const;

/**
 * A ragged edge painted in the colour of the section that follows, overlapping the join so the
 * two sections tear into each other instead of meeting on a straight line.
 */
export function SectionEdge({ color, variant = "a", flip = false }: { color: string; variant?: EdgeVariant; flip?: boolean }) {
	return (
		<svg
			className={flip ? "section-edge section-edge-top" : "section-edge"}
			viewBox="0 0 1440 48"
			preserveAspectRatio="none"
			aria-hidden="true"
			focusable="false"
		>
			<path d={PATHS[variant]} fill={color} />
		</svg>
	);
}
