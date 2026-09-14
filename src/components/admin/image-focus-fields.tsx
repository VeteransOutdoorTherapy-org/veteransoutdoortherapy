import { IMAGE_POSITIONS, type ImagePosition } from "@/lib/data";

function positionLabel(position: string) {
	const spaced = position.replace("-", " ");
	return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * The pair of selects that decide which part of an image stays in frame when it is cropped.
 * Used by every admin form that owns an image, so the control behaves the same everywhere.
 */
export function ImageFocusFields({
	desktop,
	mobile,
	hint,
}: {
	desktop?: ImagePosition;
	mobile?: ImagePosition;
	hint?: string;
}) {
	return (
		<>
			<div className="form-row">
				<label>
					Image focus — desktop
					<select className="field" name="imagePosition" defaultValue={desktop || "center"}>
						{IMAGE_POSITIONS.map((position) => (
							<option key={position} value={position}>
								{positionLabel(position)}
							</option>
						))}
					</select>
				</label>
				<label>
					Image focus — mobile
					<select className="field" name="imagePositionMobile" defaultValue={mobile || desktop || "center"}>
						{IMAGE_POSITIONS.map((position) => (
							<option key={position} value={position}>
								{positionLabel(position)}
							</option>
						))}
					</select>
				</label>
			</div>
			<p className="admin-hint">
				{hint ?? "Picks the part of the photo that stays in frame when it is cropped — use Top or Top left when a face sits high in the photo. The mobile setting takes over at 900px wide and below."}
			</p>
		</>
	);
}
