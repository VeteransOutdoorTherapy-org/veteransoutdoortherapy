import { ApplicationFormPage } from "@/components/application-form-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, pageMetadata } from "@/lib/site";
export const metadata = pageMetadata({
	title: "Veteran Outdoor Program Application",
	description: "Previously deployed Veterans can apply for upcoming hunting, fishing, horseback riding, hiking, camping, and conservation experiences.",
	path: "/veteran-application",
	noIndex: true,
});
export default function VeteranApplicationPage() {
	return (
		<><JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Applications", path: "/application" }, { name: "Veteran application", path: "/veteran-application" }])} /><ApplicationFormPage
			eyebrow="For Veterans"
			title="Your next chapter can start outside."
			copy="Tell us what brings you here and what kind of outdoor experience would be meaningful to you."
			type="veteran-application"
		/></>
	);
}
