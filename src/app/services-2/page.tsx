import { permanentRedirect } from "next/navigation";

// Legacy WordPress path. It duplicated /programs with no metadata of its own, so it competed
// with the real page in search results.
export default function LegacyServicesPage() {
	permanentRedirect("/programs");
}
