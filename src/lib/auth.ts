import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
const cookieName = "vot-admin";
const sessionToken = "vot-admin-session";
function matches(value: string, expected: string) {
	const left = Buffer.from(value);
	const right = Buffer.from(expected);
	return left.length === right.length && timingSafeEqual(left, right);
}
export async function login(username: string, password: string) {
	const providedUsername = username.trim();
	const providedPassword = password.trim();
	// Credentials come from the environment only. With none configured every login fails,
	// which is the safe failure: a built-in fallback is a published password.
	const credentials = [
		[process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD],
		[process.env.ADMIN_USERNAME_2, process.env.ADMIN_PASSWORD_2],
	].filter((entry): entry is [string, string] => Boolean(entry[0] && entry[1]));
	if (!credentials.length) return false;
	const valid = credentials.some(([expectedUsername, expectedPassword]) =>
		matches(providedUsername, expectedUsername.trim()) && matches(providedPassword, expectedPassword.trim()),
	);
	if (!valid) return false;

	(await cookies()).set(cookieName, sessionToken, {
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV === "production",
		maxAge: 28800,
		path: "/",
	});
	return true;
}
export async function isAdmin() {
	const token = (await cookies()).get(cookieName)?.value;
	return token === sessionToken;
}
export async function logout() {
	(await cookies()).delete(cookieName);
}
