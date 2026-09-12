/**
 * Participants, Veterans, and clients are credited by first name only. Staff
 * listed here keep their full name because they speak for the organization.
 */
const FULL_NAME_ALLOWED = new Set(["crystal masek"]);

export function publicName(author: string) {
	const trimmed = author.trim();
	if (FULL_NAME_ALLOWED.has(trimmed.toLowerCase())) return trimmed;
	return trimmed.split(/\s+/)[0];
}
