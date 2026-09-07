/** US phone helpers: digits are what we store, the formatted string is what we show. */

/** Reduces any input — "+1 573-544-7788", "15735447788", "5735447788" — to its 10 stored digits. */
export function phoneDigits(value: string) {
	const digits = value.replace(/\D/g, "");
	const national = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
	return national.slice(0, 10);
}

/** Formats stored or pasted digits as (573) 544-7788, masking partial input as it is typed. */
export function formatPhone(value: string) {
	const digits = phoneDigits(value);
	if (digits.length <= 3) return digits;
	if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
	return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** A phone is acceptable when it is left blank or complete. */
export function isValidPhone(value: string) {
	const digits = phoneDigits(value);
	return digits.length === 0 || digits.length === 10;
}

/** Formats a stored number for people to read, leaving anything that is not a US number untouched. */
export function displayPhone(value: string) {
	const digits = value.replace(/\D/g, "");
	const isUsNumber = digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
	return isUsNumber ? formatPhone(value) : value;
}
