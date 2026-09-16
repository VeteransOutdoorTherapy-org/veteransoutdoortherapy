import { ApplicationFormPage } from "@/components/application-form-page";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema, pageMetadata } from "@/lib/site";
export const metadata = pageMetadata({
	title: "Gold Star Family Member Outdoor Program Application",
	description: "Gold Star family members can apply for thoughtfully hosted outdoor experiences with Veteran's Outdoor Therapy.",
	path: "/gold-star-family-application",
	noIndex: true,
});
export default function GoldStarApplicationPage() {
	return (
		<><JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Gold Star family members", path: "/gold-star-families" }, { name: "Application", path: "/gold-star-family-application" }])} /><ApplicationFormPage
			eyebrow="For Gold Star family members"
			title="Connection, remembrance, and open air."
			copy="Tell us about your service member and how time outdoors could support you."
			type="gold-star-family-application"
		/></>
	);
}
